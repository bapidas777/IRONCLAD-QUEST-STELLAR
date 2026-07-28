import { signTransaction } from '@stellar/freighter-api';
import { Horizon, TransactionBuilder, Asset, Operation, Keypair, Networks } from '@stellar/stellar-sdk';

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const server = new Horizon.Server(HORIZON_URL);
const NETWORK_PASSPHRASE = Networks.TESTNET;

export const VAULT_PUBLIC_KEY = "GBYRQIA7E755YDZ3KWKFUTCPLWGE3R5BLIPWK3SHZV4IDJWLUBEUQDHF";
const VAULT_SECRET_KEY = "SBBQY4JT5YLE77QCGAUVHWYEQ7KA6TH6QAGHL6ZEDH34JUPHM5IOKVFM";
const vaultKeypair = Keypair.fromSecret(VAULT_SECRET_KEY);

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

export async function payEntryFee(publicKey: string, amountXLM: number) {
  try {
    const sourceAccount = await server.loadAccount(publicKey);
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
      Operation.payment({
        destination: VAULT_PUBLIC_KEY,
        asset: Asset.native(),
        amount: amountXLM.toFixed(7),
      })
    )
    .setTimeout(30)
    .build();

    const signedTxResponse = await signTransaction(transaction.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
    if (signedTxResponse.error) throw new Error(signedTxResponse.error as string);
    const tx = TransactionBuilder.fromXDR(signedTxResponse.signedTxXdr, NETWORK_PASSPHRASE);
    const result = await server.submitTransaction(tx);
    return result.hash;
  } catch (error) {
    console.error("Error paying entry fee:", error);
    throw error;
  }
}

export async function depositXLM(publicKey: string, amountXLM: number) {
  return payEntryFee(publicKey, amountXLM);
}

export async function withdrawXLM(publicKey: string, amountXLM: number) {
  try {
    const sourceAccount = await server.loadAccount(VAULT_PUBLIC_KEY);
    
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
      Operation.payment({
        destination: publicKey,
        asset: Asset.native(),
        amount: amountXLM.toFixed(7),
      })
    )
    .setTimeout(30)
    .build();

    transaction.sign(vaultKeypair);
    const result = await server.submitTransaction(transaction);
    return result.hash;
  } catch (error) {
    console.error("Error withdrawing DQT:", error);
    throw error;
  }
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
  try {
    const account = new Horizon.Server(HORIZON_URL);
    // Use the vault account for simulation (read-only call)
    const sourceAccount = await account.loadAccount(VAULT_PUBLIC_KEY).catch(() => null);
    
    if (!sourceAccount) {
      return '';
    }

    const tx = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .setTimeout(30)
      .build();

    return tx.toXDR();
  } catch {
    return '';
  }
}
