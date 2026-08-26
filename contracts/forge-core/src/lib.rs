#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Map, String, Symbol, Vec, symbol_short, token};
use soroban_sdk::xdr::ToXdr;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct QuizConfig {
    pub entry_fee: i128,
    pub reward: i128,
    pub reward_xp: u32,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PlayerProfile {
    pub xp: u32,
    pub quizzes_won: u32,
    pub streak: u32,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    QuizConfig(Symbol), // quiz_id -> QuizConfig
    QuizQuestions(Symbol), // quiz_id -> Map<u32, BytesN<32>>
    PlayerProfile(Address), // player -> PlayerProfile
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
        reward_xp: u32,
        questions: Vec<(u32, BytesN<32>)>,
    ) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).expect("not initialized");
        if admin != stored_admin {
            panic!("unauthorized");
        }

        let config = QuizConfig { entry_fee, reward, reward_xp };
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

    pub fn submit_quiz(env: Env, solver: Address, quiz_id: Symbol, answers: Vec<(u32, String)>) -> u32 {
        solver.require_auth();

        // 1. Fetch Quiz Config and Hashes
        let config: QuizConfig = env
            .storage()
            .instance()
            .get(&DataKey::QuizConfig(quiz_id.clone()))
            .expect("quiz does not exist");
        let q_map: Map<u32, BytesN<32>> = env.storage().instance().get(&DataKey::QuizQuestions(quiz_id)).unwrap();

        // 2. Transfer entry fee to contract treasury atomically
        let token_addr: Address = env.storage().instance().get(&DataKey::Token).expect("not initialized");
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&solver, &env.current_contract_address(), &config.entry_fee);
        
        env.events().publish((symbol_short!("enter"), solver.clone()), config.entry_fee);

        // 3. Evaluate answers
        let mut correct = 0;
        for entry in answers.iter() {
            let (q_id, ans_string) = entry;
            if let Some(correct_hash) = q_map.get(q_id) {
                let ans_bytes = ans_string.to_xdr(&env);
                let hashed_ans_hash = env.crypto().sha256(&ans_bytes);
                let hashed_ans: BytesN<32> = hashed_ans_hash.into();
                if hashed_ans == correct_hash {
                    correct += 1;
                    env.events().publish((symbol_short!("correct"), solver.clone()), q_id);
                }
            }
        }

        // 4. Fetch/Initialize Player Profile
        let mut profile: PlayerProfile = env.storage().persistent().get(&DataKey::PlayerProfile(solver.clone())).unwrap_or(PlayerProfile { xp: 0, quizzes_won: 0, streak: 0 });

        // 5. Payout and Profile Update if perfect score
        if correct > 0 && correct == q_map.len() {
            token_client.transfer(&env.current_contract_address(), &solver, &config.reward);
            profile.xp += config.reward_xp;
            profile.quizzes_won += 1;
            profile.streak += 1;
        } else {
            profile.streak = 0; // reset streak if they fail
        }

        // Save profile
        env.storage().persistent().set(&DataKey::PlayerProfile(solver.clone()), &profile);

        // 6. Update Leaderboard (Optimized Insertion) using XP instead of just correct answers
        let mut high_scores: Map<Address, u32> = env.storage().persistent().get(&DataKey::HighScores).unwrap_or(Map::new(&env));
        let prev_high = high_scores.get(solver.clone()).unwrap_or(0);
        
        if profile.xp > prev_high {
            high_scores.set(solver.clone(), profile.xp);
            env.storage().persistent().set(&DataKey::HighScores, &high_scores);

            let leaderboard: Vec<(Address, u32)> = env.storage().instance().get(&DataKey::Leaderboard).unwrap_or(Vec::new(&env));
            
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
                if !inserted && profile.xp > entry.1 {
                    final_lb.push_back((solver.clone(), profile.xp));
                    inserted = true;
                }
                if final_lb.len() < 10 {
                    final_lb.push_back(entry);
                }
            }
            if !inserted && final_lb.len() < 10 {
                final_lb.push_back((solver.clone(), profile.xp));
            }

            env.storage().instance().set(&DataKey::Leaderboard, &final_lb);
            env.events().publish((symbol_short!("leader"), solver.clone()), profile.xp);
        }

        correct
    }

    pub fn get_player_profile(env: Env, player: Address) -> PlayerProfile {
        env.storage().persistent().get(&DataKey::PlayerProfile(player)).unwrap_or(PlayerProfile { xp: 0, quizzes_won: 0, streak: 0 })
    }
}

#[cfg(test)]
mod test;
