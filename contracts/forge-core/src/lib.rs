#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, Map, String, Symbol, Vec, symbol_short, token};

const QUESTIONS_KEY: Symbol = symbol_short!("QUZS");
const HIGH_SCORES_KEY: Symbol = symbol_short!("HISCR");
const LEADERBOARD_KEY: Symbol = symbol_short!("LDBRD");

#[contract]
pub struct ForgeContract;

#[contractimpl]
impl ForgeContract {
    pub fn pay_entry_fee(env: Env, player: Address, token_address: Address, amount: i128) {
        player.require_auth();

        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&player, &env.current_contract_address(), &amount);
        
        env.events().publish((symbol_short!("enter"), player), amount);
    }

    pub fn create_quiz_batch(env: Env, items: Vec<(u32, String, String)>) {
        let mut questions: Map<u32, (String, String)> = env.storage().instance().get(&QUESTIONS_KEY).unwrap_or(Map::new(&env));

        for item in items.iter() {
            let (id, q, a) = item;
            questions.set(id, (q, a));
        }

        env.storage().instance().set(&QUESTIONS_KEY, &questions);
    }

    pub fn get_question(env: Env, id: u32) -> String {
        let questions: Map<u32, (String, String)> = env.storage().instance().get(&QUESTIONS_KEY).unwrap_or(Map::new(&env));
        if let Some((q, _)) = questions.get(id) {
            q
        } else {
            String::from_str(&env, "")
        }
    }

    pub fn get_leaderboard(env: Env) -> Vec<(Address, u32)> {
        env.storage().instance().get(&LEADERBOARD_KEY).unwrap_or(Vec::new(&env))
    }

    pub fn submit_batch(env: Env, solver: Address, answers: Vec<(u32, String)>) -> u32 {
        solver.require_auth();

        let questions: Map<u32, (String, String)> = env.storage().instance().get(&QUESTIONS_KEY).unwrap_or(Map::new(&env));
        let mut correct = 0;

        for entry in answers.iter() {
            let (id, ans) = entry;
            if let Some((_, correct_ans)) = questions.get(id) {
                if ans == correct_ans {
                    correct += 1;
                    env.events().publish((symbol_short!("correct"), solver.clone()), id);
                }
            }
        }

        let mut high_scores: Map<Address, u32> = env.storage().persistent().get(&HIGH_SCORES_KEY).unwrap_or(Map::new(&env));
        let prev_high = high_scores.get(solver.clone()).unwrap_or(0);
        
        if correct > prev_high {
            high_scores.set(solver.clone(), correct);
            env.storage().persistent().set(&HIGH_SCORES_KEY, &high_scores);

            let leaderboard: Vec<(Address, u32)> = env.storage().instance().get(&LEADERBOARD_KEY).unwrap_or(Vec::new(&env));
            
            let mut new_leaderboard = Vec::new(&env);
            let mut found = false;
            
            for entry in leaderboard.iter() {
                let (addr, score) = entry;
                if addr == solver {
                    new_leaderboard.push_back((addr, correct));
                    found = true;
                } else {
                    new_leaderboard.push_back((addr, score));
                }
            }
            if !found {
                new_leaderboard.push_back((solver.clone(), correct));
            }

            let len = new_leaderboard.len();
            for i in 0..len {
                for j in 0..(len - 1 - i) {
                    let (addr_a, score_a) = new_leaderboard.get(j).unwrap();
                    let (addr_b, score_b) = new_leaderboard.get(j + 1).unwrap();
                    if score_a < score_b {
                        new_leaderboard.set(j, (addr_b, score_b));
                        new_leaderboard.set(j + 1, (addr_a, score_a));
                    }
                }
            }

            while new_leaderboard.len() > 10 {
                new_leaderboard.pop_back();
            }

            env.storage().instance().set(&LEADERBOARD_KEY, &new_leaderboard);
            env.events().publish((symbol_short!("leader"), solver), correct);
        }

        correct
    }
}

#[cfg(test)]
mod test;
