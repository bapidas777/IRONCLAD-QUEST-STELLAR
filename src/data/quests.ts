export type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
};

export type Quest = {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estMins: number;
  description: string;
  entryFeeXLM: number;
  rewardXLM: number;
  rewardXP: number;
  questions: Question[];
};

export const quests: Quest[] = [
  {
    id: "trial-of-iron",
    title: "Trial of Iron",
    difficulty: "Beginner",
    estMins: 5,
    description: "Prove your basic knowledge of Web3, wallets, and the Stellar network.",
    entryFeeXLM: 5,
    rewardXLM: 10,
    rewardXP: 100,
    questions: [
      {
        id: 1,
        text: "What is a seed phrase (recovery phrase) used for?",
        options: ["To pay for gas fees", "To recover access to a wallet", "To encrypt a transaction", "To generate smart contracts"],
        correct: 1
      },
      {
        id: 2,
        text: "In the context of blockchain, what does 'decentralization' mean?",
        options: ["Control is distributed across a network", "A single central server controls data", "All tokens have zero value", "Wallets are offline only"],
        correct: 0
      },
      {
        id: 3,
        text: "What is the native cryptocurrency of the Stellar network?",
        options: ["Ether (ETH)", "Lumens (XLM)", "Bitcoin (BTC)", "Tether (USDT)"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-steel",
    title: "Trial of Steel",
    difficulty: "Intermediate",
    estMins: 10,
    description: "Test your knowledge on reentrancy attacks, integer overflows, and secure smart contract architecture.",
    entryFeeXLM: 15,
    rewardXLM: 35,
    rewardXP: 250,
    questions: [
      {
        id: 1,
        text: "In a standard ERC-721 implementation, which function is critical to prevent a contract from locking tokens indefinitely if the recipient cannot handle them?",
        options: ["transferFrom()", "safeTransferFrom()", "approve()", "setApprovalForAll()"],
        correct: 1
      },
      {
        id: 2,
        text: "Which of the following vulnerabilities occurs when a contract calls an external contract and the external contract calls back before the first invocation is finished?",
        options: ["Integer Overflow", "Front-running", "Reentrancy", "Timestamp Dependence"],
        correct: 2
      },
      {
        id: 3,
        text: "What is the primary purpose of the 'Checks-Effects-Interactions' pattern in Solidity?",
        options: ["To optimize gas costs", "To prevent Reentrancy attacks", "To upgrade smart contracts", "To encrypt private variables"],
        correct: 1
      },
      {
        id: 4,
        text: "When interacting with a Soroban smart contract, how are state changes authorized?",
        options: ["Multisig ONLY", "Implicitly by the contract", "Via Invoker Authorization Framework", "By providing the admin's private key"],
        correct: 2
      },
      {
        id: 5,
        text: "Which keyword in Rust (used in Soroban) ensures that a variable's value cannot be changed by default?",
        options: ["const", "let", "static", "readonly"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-obsidian",
    title: "Trial of Obsidian",
    difficulty: "Advanced",
    estMins: 15,
    description: "Face the ultimate test of advanced cryptography, zero-knowledge proofs, and Soroban WASM internals.",
    entryFeeXLM: 50,
    rewardXLM: 120,
    rewardXP: 500,
    questions: [
      {
        id: 1,
        text: "What is the size limit of a WASM contract deployed on the Stellar network?",
        options: ["32 KB", "64 KB", "256 KB", "1 MB"],
        correct: 1
      },
      {
        id: 2,
        text: "Which cryptographic primitive does Soroban use by default for ed25519 signature verification?",
        options: ["SHA-256", "Keccak-256", "ed25519_verify built-in", "ECDSA"],
        correct: 2
      },
      {
        id: 3,
        text: "How does Soroban handle contract data storage expiration?",
        options: ["Data never expires", "It uses a TTL (Time To Live) bumping mechanism", "Manual deletion by admin", "Automatically after 1 week"],
        correct: 1
      },
      {
        id: 4,
        text: "In Zero-Knowledge Proofs, what does 'Succinctness' refer to?",
        options: ["The proof is small and fast to verify", "The proof reveals zero knowledge", "The prover must know the secret", "The proof can only be used once"],
        correct: 0
      },
      {
        id: 5,
        text: "What is the maximum number of cross-contract calls allowed in a single Soroban transaction?",
        options: ["10", "Unlimited", "Configurable per network fee", "Hardcoded WASM limit"],
        correct: 2
      },
      {
        id: 6,
        text: "When upgrading a Soroban contract, what remains immutable?",
        options: ["The WASM hash", "The contract ID", "The stored data", "Both contract ID and stored data"],
        correct: 3
      },
      {
        id: 7,
        text: "What is the primary advantage of Rust's ownership model in smart contracts?",
        options: ["Faster compilation", "Memory safety without a garbage collector", "Built-in cryptography", "Automatic gas optimization"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-consensus",
    title: "Trial of Consensus",
    difficulty: "Intermediate",
    estMins: 8,
    description: "Test your understanding of blockchain consensus mechanisms, from PoW to FBA.",
    entryFeeXLM: 10,
    rewardXLM: 20,
    rewardXP: 150,
    questions: [
      {
        id: 1,
        text: "Which consensus mechanism does Bitcoin primarily use?",
        options: ["Proof of Stake", "Proof of Work", "Federated Byzantine Agreement", "Delegated Proof of Stake"],
        correct: 1
      },
      {
        id: 2,
        text: "What consensus protocol does the Stellar network use?",
        options: ["Proof of Work", "Proof of Stake", "Stellar Consensus Protocol (FBA)", "Proof of Authority"],
        correct: 2
      },
      {
        id: 3,
        text: "In Proof of Stake (PoS), how are validators typically chosen?",
        options: ["By solving complex mathematical puzzles", "Based on the amount of tokens they lock up (stake)", "By a central authority", "Randomly from all users"],
        correct: 1
      },
      {
        id: 4,
        text: "What problem does the Byzantine Generals Problem illustrate in distributed computing?",
        options: ["Data storage limits", "Reaching consensus in a network with potentially faulty or malicious nodes", "Network latency", "Smart contract vulnerabilities"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-ledgers",
    title: "Trial of the Ledger",
    difficulty: "Beginner",
    estMins: 5,
    description: "Dive into the fundamental concepts of distributed ledgers and transactions.",
    entryFeeXLM: 3,
    rewardXLM: 5,
    rewardXP: 50,
    questions: [
      {
        id: 1,
        text: "What is a 'block' in a blockchain?",
        options: ["A physical server", "A collection of transactions bundled together", "A smart contract", "A wallet address"],
        correct: 1
      },
      {
        id: 2,
        text: "Why are blockchains often described as 'immutable'?",
        options: ["They cannot be hacked", "Data once written cannot be altered or deleted easily", "They have infinite storage", "They only accept native tokens"],
        correct: 1
      },
      {
        id: 3,
        text: "What is a genesis block?",
        options: ["The first block in a blockchain", "A block containing smart contracts", "A block that got rejected", "The last block in a blockchain"],
        correct: 0
      }
    ]
  },
  {
    id: "trial-of-defi",
    title: "Trial of DeFi",
    difficulty: "Intermediate",
    estMins: 12,
    description: "Explore Decentralized Finance, Automated Market Makers, and liquidity pools.",
    entryFeeXLM: 20,
    rewardXLM: 45,
    rewardXP: 300,
    questions: [
      {
        id: 1,
        text: "What does AMM stand for in DeFi?",
        options: ["Automated Money Maker", "Algorithmic Market Maker", "Automated Market Maker", "Advanced Monetary Model"],
        correct: 2
      },
      {
        id: 2,
        text: "What is Impermanent Loss?",
        options: ["Losing your seed phrase", "A temporary loss of funds when providing liquidity compared to just holding the assets", "When a token's price drops to zero", "A hack of a liquidity pool"],
        correct: 1
      },
      {
        id: 3,
        text: "What is the primary function of a DEX?",
        options: ["To store passwords securely", "To facilitate peer-to-peer cryptocurrency trading without a centralized intermediary", "To mine new blocks", "To provide customer support for crypto"],
        correct: 1
      },
      {
        id: 4,
        text: "What is 'Yield Farming'?",
        options: ["Growing crops in the metaverse", "Staking or lending crypto assets in order to generate high returns or rewards", "Mining Bitcoin with ASIC miners", "Buying cheap NFTs to sell later"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-nfts",
    title: "Trial of NFTs",
    difficulty: "Beginner",
    estMins: 5,
    description: "Understand the basics of Non-Fungible Tokens and digital ownership.",
    entryFeeXLM: 5,
    rewardXLM: 12,
    rewardXP: 100,
    questions: [
      {
        id: 1,
        text: "What makes a token 'Non-Fungible'?",
        options: ["It can be divided into smaller pieces", "It is unique and cannot be replaced with something else identical", "It has a fixed price", "It can only be used to buy physical goods"],
        correct: 1
      },
      {
        id: 2,
        text: "Which Ethereum token standard is most commonly associated with NFTs?",
        options: ["ERC-20", "ERC-721", "ERC-1155", "ERC-777"],
        correct: 1
      },
      {
        id: 3,
        text: "Where is the actual image of an NFT usually stored?",
        options: ["Directly on the blockchain", "In a smart contract variable", "Off-chain (like IPFS or a central server) and linked via metadata", "In the user's local wallet storage"],
        correct: 2
      }
    ]
  },
  {
    id: "trial-of-sorcerer",
    title: "Trial of the Sorcerer",
    difficulty: "Advanced",
    estMins: 15,
    description: "Deep dive into Soroban smart contracts, Rust macros, and advanced state management.",
    entryFeeXLM: 60,
    rewardXLM: 150,
    rewardXP: 600,
    questions: [
      {
        id: 1,
        text: "In Soroban, which Rust macro is used to define a contract type?",
        options: ["#[soroban_contract]", "#[contract]", "#[derive(Contract)]", "#[contracttype]"],
        correct: 1
      },
      {
        id: 2,
        text: "What type of storage is best suited for data that multiple users share and modify in a Soroban contract?",
        options: ["Instance Storage", "Temporary Storage", "Persistent Storage", "Volatile Storage"],
        correct: 2
      },
      {
        id: 3,
        text: "How does a Soroban contract typically interact with native Stellar assets (like XLM)?",
        options: ["By directly modifying the ledger", "Using the built-in token contract interface", "By issuing a new ERC-20 token", "It is impossible for Soroban to interact with XLM"],
        correct: 1
      },
      {
        id: 4,
        text: "What is the environment variable used by a Soroban contract to interact with host functions?",
        options: ["Host", "Env", "Context", "System"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-horizon",
    title: "Trial of the Horizon",
    difficulty: "Intermediate",
    estMins: 10,
    description: "Test your knowledge of the Stellar Horizon API and ledger operations.",
    entryFeeXLM: 15,
    rewardXLM: 35,
    rewardXP: 250,
    questions: [
      {
        id: 1,
        text: "What is the primary role of Stellar Horizon?",
        options: ["It is the consensus algorithm", "It is the client-facing REST API for the Stellar network", "It is a smart contract language", "It is a hardware wallet"],
        correct: 1
      },
      {
        id: 2,
        text: "In Stellar, what is a 'Trustline'?",
        options: ["A line of code in a smart contract", "A cryptographic signature", "An explicit opt-in by an account to hold a specific asset issued by a specific account", "A decentralized exchange mechanism"],
        correct: 2
      },
      {
        id: 3,
        text: "What happens if a Stellar account drops below the base reserve requirement?",
        options: ["The account is deleted", "The account cannot execute operations that require fees or reserve increases", "The account is temporarily suspended", "The account is charged a penalty fee"],
        correct: 1
      },
      {
        id: 4,
        text: "Which operation is used to send XLM from one Stellar account to another?",
        options: ["Payment Operation", "Transfer Operation", "Send Operation", "Exchange Operation"],
        correct: 0
      }
    ]
  },
  {
    id: "trial-of-cryptography",
    title: "Trial of Cryptography",
    difficulty: "Advanced",
    estMins: 15,
    description: "Master the concepts of cryptographic hash functions and digital signatures.",
    entryFeeXLM: 40,
    rewardXLM: 90,
    rewardXP: 450,
    questions: [
      {
        id: 1,
        text: "What property of a cryptographic hash function ensures that finding two different inputs that produce the same output is computationally infeasible?",
        options: ["Pre-image resistance", "Second pre-image resistance", "Collision resistance", "Avalanche effect"],
        correct: 2
      },
      {
        id: 2,
        text: "In public-key cryptography, what is used to verify a digital signature?",
        options: ["The signer's private key", "The signer's public key", "A symmetric key", "The receiver's private key"],
        correct: 1
      },
      {
        id: 3,
        text: "Which of the following is NOT a characteristic of a secure hash function?",
        options: ["Deterministic", "Reversible", "Fixed output size", "Avalanche effect"],
        correct: 1
      },
      {
        id: 4,
        text: "What is a 'salt' in the context of hashing?",
        options: ["Random data added to the input of a hash function to defend against dictionary attacks", "A method to speed up the hashing process", "A type of cryptographic algorithm", "A vulnerability in SHA-256"],
        correct: 0
      }
    ]
  },
  {
    id: "trial-of-governance",
    title: "Trial of Governance",
    difficulty: "Intermediate",
    estMins: 8,
    description: "Understand Decentralized Autonomous Organizations (DAOs) and on-chain voting.",
    entryFeeXLM: 12,
    rewardXLM: 25,
    rewardXP: 200,
    questions: [
      {
        id: 1,
        text: "What does DAO stand for?",
        options: ["Decentralized Autonomous Organization", "Digital Asset Offering", "Distributed Anonymous Oracle", "Data Authentication Object"],
        correct: 0
      },
      {
        id: 2,
        text: "What is typically used to represent voting power in a DAO?",
        options: ["Fiat currency", "Governance tokens", "The number of active wallets", "Smart contract lines of code"],
        correct: 1
      },
      {
        id: 3,
        text: "What is 'Quadratic Voting'?",
        options: ["Voting where you get 4 votes per token", "A system where the cost of additional votes increases quadratically", "Voting restricted to four choices", "A voting system only used by miners"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-explorer",
    title: "Trial of the Explorer",
    difficulty: "Beginner",
    estMins: 5,
    description: "Learn how to read block explorers, transaction hashes, and the mempool.",
    entryFeeXLM: 2,
    rewardXLM: 4,
    rewardXP: 40,
    questions: [
      {
        id: 1,
        text: "What is a Block Explorer?",
        options: ["A tool to mine cryptocurrency", "A search engine to view blockchain data like transactions, blocks, and addresses", "A web browser for decentralized websites", "A type of cryptocurrency wallet"],
        correct: 1
      },
      {
        id: 2,
        text: "What is a transaction hash (txid)?",
        options: ["A password to authorize a transaction", "A unique string of characters identifying a specific transaction on the blockchain", "The fee paid to miners", "The balance of an account"],
        correct: 1
      },
      {
        id: 3,
        text: "What does the 'mempool' do?",
        options: ["Stores smart contracts", "Holds unconfirmed transactions waiting to be included in a block", "Generates new tokens", "Acts as a decentralized exchange"],
        correct: 1
      }
    ]
  },
  {
    id: "trial-of-bridges",
    title: "Trial of Cross-Chain",
    difficulty: "Advanced",
    estMins: 12,
    description: "Conquer the complexities of blockchain interoperability and token wrapping.",
    entryFeeXLM: 45,
    rewardXLM: 100,
    rewardXP: 480,
    questions: [
      {
        id: 1,
        text: "What is the primary function of a blockchain bridge?",
        options: ["To connect a blockchain to the regular internet", "To allow the transfer of tokens and data between two different blockchain networks", "To speed up transaction times on a single chain", "To upgrade a blockchain protocol"],
        correct: 1
      },
      {
        id: 2,
        text: "What does it mean to 'wrap' a token (e.g., wBTC)?",
        options: ["Encrypting the token so it cannot be stolen", "Creating a token on one blockchain that represents an equivalent asset on another blockchain (like Bitcoin on Ethereum)", "Staking a token in a liquidity pool", "Hiding the token in a privacy protocol"],
        correct: 1
      },
      {
        id: 3,
        text: "What is an Atomic Swap?",
        options: ["A catastrophic failure of a smart contract", "A smart contract technique that allows the exchange of cryptocurrencies across two different blockchains without a trusted third party", "A fast consensus mechanism", "A method to burn tokens instantly"],
        correct: 1
      }
    ]
  }
];
