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
}

#[cfg(test)]
mod test;
