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
}

#[cfg(test)]
mod test;
