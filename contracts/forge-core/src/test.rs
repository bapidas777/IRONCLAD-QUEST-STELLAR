#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

#[test]
fn test_create_and_get_quiz() {
    let env = Env::default();
    let contract_id = env.register_contract(None, ForgeContract);
    let client = ForgeContractClient::new(&env, &contract_id);

    let mut questions = Vec::new(&env);
    questions.push_back((1, String::from_str(&env, "What is 2+2?"), String::from_str(&env, "4")));
    questions.push_back((2, String::from_str(&env, "What is the capital of France?"), String::from_str(&env, "Paris")));

    client.create_quiz_batch(&questions);

    assert_eq!(client.get_question(&1), String::from_str(&env, "What is 2+2?"));
    assert_eq!(client.get_question(&2), String::from_str(&env, "What is the capital of France?"));
    assert_eq!(client.get_question(&3), String::from_str(&env, ""));
}

#[test]
fn test_submit_batch() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, ForgeContract);
    let client = ForgeContractClient::new(&env, &contract_id);

    let mut questions = Vec::new(&env);
    questions.push_back((1, String::from_str(&env, "A"), String::from_str(&env, "A")));
    questions.push_back((2, String::from_str(&env, "B"), String::from_str(&env, "B")));
    client.create_quiz_batch(&questions);

    let player = Address::generate(&env);
    let mut answers = Vec::new(&env);
    answers.push_back((1, String::from_str(&env, "A")));
    answers.push_back((2, String::from_str(&env, "B")));

    let score = client.submit_batch(&player, &answers);
    assert_eq!(score, 2);

    let leaderboard = client.get_leaderboard();
    assert_eq!(leaderboard.len(), 1);
    
    let (top_player, top_score) = leaderboard.get(0).unwrap();
    assert_eq!(top_player, player);
    assert_eq!(top_score, 2);
}

#[test]
#[should_panic]
fn test_unauthorized_submit() {
    let env = Env::default();
    
    let contract_id = env.register_contract(None, ForgeContract);
    let client = ForgeContractClient::new(&env, &contract_id);

    let player = Address::generate(&env);
    let mut answers = Vec::new(&env);
    answers.push_back((1, String::from_str(&env, "A")));

    // This should panic because player didn't authorize
    client.submit_batch(&player, &answers);
}
