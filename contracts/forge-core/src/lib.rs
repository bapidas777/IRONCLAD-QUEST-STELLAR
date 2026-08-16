#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Map, String, Symbol, Vec, symbol_short, token};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct QuizConfig {
    pub entry_fee: i128,
    pub reward: i128,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    QuizConfig(Symbol), // quiz_id -> QuizConfig
    QuizQuestions(Symbol), // quiz_id -> Map<u32, BytesN<32>>
    PlayerActive(Address), // player -> Symbol (quiz_id)
    HighScores, // Map<Address, u32>
    Leaderboard, // Vec<(Address, u32)>
}

#[contract]
pub struct ForgeContract;

#[contractimpl]
impl ForgeContract {
    pub fn init(env: Env, admin: Address, token: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Token, &token);
    }

    pub fn configure_quiz(
        env: Env,
        admin: Address,
        quiz_id: Symbol,
        entry_fee: i128,
        reward: i128,
        questions: Vec<(u32, BytesN<32>)>,
    ) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("not initialized");
        if admin != stored_admin {
            panic!("unauthorized");
        }

        let config = QuizConfig { entry_fee, reward };
        env.storage().instance().set(&DataKey::QuizConfig(quiz_id.clone()), &config);

        let mut q_map: Map<u32, BytesN<32>> = Map::new(&env);
        for item in questions.iter() {
            let (q_id, hash) = item;
            q_map.set(q_id, hash);
        }
        env.storage().instance().set(&DataKey::QuizQuestions(quiz_id), &q_map);
    }

    pub fn fund_treasury(env: Env, admin: Address, amount: i128) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("not initialized");
        if admin != stored_admin {
            panic!("unauthorized");
        }
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("not initialized");
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&admin, &env.current_contract_address(), &amount);
    }

    pub fn withdraw_treasury(env: Env, admin: Address, amount: i128) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("not initialized");
        if admin != stored_admin {
            panic!("unauthorized");
        }
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("not initialized");
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&env.current_contract_address(), &admin, &amount);
    }

    pub fn pay_entry_fee(env: Env, player: Address, quiz_id: Symbol) {
        player.require_auth();

        // 1. Fetch Quiz Config
        let config: QuizConfig = env
            .storage()
            .instance()
            .get(&DataKey::QuizConfig(quiz_id.clone()))
            .expect("quiz does not exist");

        // 2. Transfer entry fee to contract treasury
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("not initialized");
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&player, &env.current_contract_address(), &config.entry_fee);

        // 3. Mark player as active for this quiz
        env.storage().instance().set(&DataKey::PlayerActive(player.clone()), &quiz_id);

        env.events().publish((symbol_short!("enter"), player), config.entry_fee);
    }

    pub fn submit_batch(env: Env, solver: Address, answers: Vec<(u32, String)>) -> u32 {
        solver.require_auth();

        // 1. Verify player paid entry fee
        let active_quiz_id: Symbol = env
            .storage()
            .instance()
            .get(&DataKey::PlayerActive(solver.clone()))
            .expect("must pay entry fee first");

        // Clear active state to prevent re-submitting on same fee
        env.storage().instance().remove(&DataKey::PlayerActive(solver.clone()));

        // 2. Fetch quiz config and hashes
        let config: QuizConfig = env.storage().instance().get(&DataKey::QuizConfig(active_quiz_id.clone())).unwrap();
        let q_map: Map<u32, BytesN<32>> = env.storage().instance().get(&DataKey::QuizQuestions(active_quiz_id)).unwrap();

        // 3. Evaluate answers
        let mut correct = 0;
        for entry in answers.iter() {
            let (q_id, ans_string) = entry;
            if let Some(correct_hash) = q_map.get(q_id) {
                let ans_bytes = ans_string.to_xdr(&env);
                let hashed_ans = env.crypto().sha256(&ans_bytes);
                if hashed_ans == correct_hash {
                    correct += 1;
                    env.events().publish((symbol_short!("correct"), solver.clone()), q_id);
                }
            }
        }

        // 4. Payout if passed (for simplicity, perfect score required)
        if correct > 0 && correct == q_map.len() {
            let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("not init");
            let token_client = token::Client::new(&env, &token_addr);
            token_client.transfer(&env.current_contract_address(), &solver, &config.reward);
        }

        // 5. Update Leaderboard (Optimized Insertion)
        let mut high_scores: Map<Address, u32> = env.storage().persistent().get(&DataKey::HighScores).unwrap_or(Map::new(&env));
        let prev_high = high_scores.get(solver.clone()).unwrap_or(0);
        
        if correct > prev_high {
            high_scores.set(solver.clone(), correct);
            env.storage().persistent().set(&DataKey::HighScores, &high_scores);

            let mut leaderboard: Vec<(Address, u32)> = env.storage().instance().get(&DataKey::Leaderboard).unwrap_or(Vec::new(&env));
            
            // Remove previous score if exists
            let mut new_lb = Vec::new(&env);
            for entry in leaderboard.iter() {
                if entry.0 != solver {
                    new_lb.push_back(entry);
                }
            }
            
            // Insert sorted (descending)
            let mut inserted = false;
            let mut final_lb = Vec::new(&env);
            for entry in new_lb.iter() {
                if !inserted && correct > entry.1 {
                    final_lb.push_back((solver.clone(), correct));
                    inserted = true;
                }
                if final_lb.len() < 10 {
                    final_lb.push_back(entry);
                }
            }
            if !inserted && final_lb.len() < 10 {
                final_lb.push_back((solver.clone(), correct));
            }

            env.storage().instance().set(&DataKey::Leaderboard, &final_lb);
            env.events().publish((symbol_short!("leader"), solver), correct);
        }

        correct
    }
}

#[cfg(test)]
mod test;
