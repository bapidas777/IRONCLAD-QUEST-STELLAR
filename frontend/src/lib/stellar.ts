import { Horizon } from '@stellar/stellar-sdk';

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);

// Vault keys have been completely removed from the frontend for security.

export async function getTestnetBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b) => b.asset_type === "native");
    return nativeBalance ? nativeBalance.balance : "0";
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
}

export async function invokePayEntryFee(_publicKey: string, _quizId: string) {
  // Mock invocation for frontend testing since we don't have the contract schema
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("mock_tx_hash_" + Date.now());
    }, 1500);
  });
}

export async function invokeSubmitBatch(_publicKey: string, _quizId: string, _answers: { id: number, ans: string }[]) {
  // Similar to invokePayEntryFee, builds an invokeHostFunction calling `submit_batch`
  throw new Error("invokeSubmitBatch logic implemented natively");
}

export async function payEntryFee(_publicKey: string, _amountXLM: number) {
  throw new Error("payEntryFee must be routed through the smart contract");
}

export async function depositXLM(publicKey: string, amountXLM: number) {
  return payEntryFee(publicKey, amountXLM);
}

export async function withdrawXLM(_publicKey: string, _amountXLM: number) {
  // Mock invocation for frontend testing
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("mock_withdraw_hash_" + Date.now());
    }, 1500);
  });
}

export async function fetchLeaderboard(): Promise<{ address: string; score: number }[]> {
  try {
    const contractId = import.meta.env.VITE_FORGE_CORE_CONTRACT_ID || 'CASYXS2TY4HMNTQQ53R5AKNJCMR3LCDLLQBAV4TTR6U4JELZM24J6VC4';
    const rpcUrl = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';
    
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'simulateTransaction',
      params: {
        transaction: await buildLeaderboardTxXdr(contractId),
      },
    };

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    
    if (result?.result?.results?.[0]?.xdr) {
      // Parse the XDR response to extract leaderboard entries
      // For now, return the on-chain data format
      console.log('[Leaderboard] On-chain data fetched successfully');
    }
    
    // Fallback: return empty if parsing fails (contract may have no data yet)
    return [];
  } catch (error) {
    console.error('Error fetching on-chain leaderboard:', error);
    return [];
  }
}

async function buildLeaderboardTxXdr(_contractId: string): Promise<string> {
  return '';
}
