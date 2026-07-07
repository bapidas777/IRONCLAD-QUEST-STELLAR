<div align="center">
  
# ༒︎ Ironclad Quest ༒︎ Stellar

**A Cinematic Web3 Quiz Experience forged on the Stellar Network using Soroban.**

[![CI/CD Status](https://github.com/bapidas777/IRONCLAD-QUEST-STELLAR/actions/workflows/ironclad-workflow.yml/badge.svg)](https://github.com/bapidas777/IRONCLAD-QUEST-STELLAR/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Network-Stellar_Testnet-black)](https://stellar.org/)
[![Soroban](https://img.shields.io/badge/Smart_Contracts-Soroban-orange)](https://soroban.stellar.org/)

![Hero Dashboard](./demo-img/hero-dashboard.png)

*An entirely distinct Web3 quiz experience featuring a heavy metallic aesthetic, dark cinematic shading, and secure on-chain validation of quiz scores.*

</div>

---

## 📌 Submission Details & Quick Links

*   **🌐 Live Production Link**: [https://ironclad-quest-stellar.vercel.app/](https://ironclad-quest-stellar.vercel.app/)
*   **📹 Demo Video Presentation**: [https://youtu.be/VrlM1uB7XBk](https://youtu.be/VrlM1uB7XBk)
*   **💻 GitHub Repository**: [https://github.com/bapidas777/IRONCLAD-QUEST-STELLAR](https://github.com/bapidas777/IRONCLAD-QUEST-STELLAR)

---

## 📖 The Vision: Problem & Solution

### The Problem
Web3 onboarding and education platforms often suffer from a lack of true engagement:
1. **Zero Stakes**: Traditional quizzes have no real consequences, leading to low completion rates.
2. **Missing Rewards**: Users spend time learning about ecosystems without any tangible, immediate financial upside.
3. **Poor UX/UI**: Many decentralized applications feel clunky, unpolished, and lack the immersive gamification found in traditional Web2 games.

### The Solution: Ironclad Quest ༒︎ Stellar
We solve this by introducing a high-stakes, hyper-gamified learning environment:
- **Pay-to-Play Mechanics**: Users pay a small XLM entry fee via Freighter to attempt a Trial, raising the stakes.
- **On-Chain Treasury Rewards**: Passing a quiz instantly unlocks higher XLM rewards deposited directly into the user's in-app treasury, which can be withdrawn on-chain.
- **Verifiable Leaderboards**: High scores are validated and sorted mathematically by a Soroban Smart Contract, ensuring the Top 10 rankings cannot be manipulated.
- **Cinematic Polish**: Immersive WebGL shaders, fluid Framer Motion animations, and responsive mobile design create a premium Web3 gaming experience.

---

## 🏆 Orange Belt Requirements Mapping

| Requirement | Implementation |
|-------------|----------------|
| **Advanced Soroban Smart Contracts** | Implemented custom persistent storage for Question states, High Scores, and a complex on-chain descending bubble-sort algorithm for the Leaderboard. |
| **Inter-contract communication** | The `forge-core` contract auto-invokes the native Stellar Asset Contract to seamlessly handle the transfer of XLM when entry fees are paid natively via the `pay_entry_fee` function. |
| **Real-time events** | The smart contract emits Soroban events for `enter` (paying fees), `correct` (answering questions), and `leader` (breaking into the high scores). These are polled by the frontend. |
| **Production transaction UI** | Fully optimized UX for fetching data, paying entry fees, submitting batches, and confirming transactions. Responsive layouts for both Desktop and Mobile viewports. |
| **StellarWalletsKit integration** | Implemented multi-wallet (Freighter) connectivity using the `@creit.tech/stellar-wallets-kit` bridging capabilities. |
| **Feature-based architecture** | Strictly separated Vite React frontend, `components/`, `data/`, global `context/`, and `lib/` for XDR and contract wrappers. |

---

## 📸 Interface Showcase

### Desktop Experience

<details open>
<summary><b>Global Leaderboard (Hall of Heroes)</b></summary>
<br>

![Desktop Leaderboard](./demo-img/leaderboard.png)
</details>

<details open>
<summary><b>Wallet & Transaction History</b></summary>
<br>

![Desktop Wallet](./demo-img/wallet.png)
</details>

### Mobile Responsiveness
*Our dark forge aesthetic seamlessly adapts to any mobile device.*

<div style="display: flex; gap: 10px;">
  <img src="./demo-img/mobile-ui-1.png" alt="Mobile Dashboard" width="48%">
  <img src="./demo-img/mobile-ui-2.png" alt="Mobile Quizzes" width="48%">
</div>

---

## 🛡️ Smart Contract Architecture & Validation

### Deployed Contracts & Credentials
*   **Forge Core Contract ID**: `CASYXS2TY4HMNTQQ53R5AKNJCMR3LCDLLQBAV4TTR6U4JELZM24J6VC4`
*   **Stellar Network**: Testnet
*   **Example Transaction Hash**: `1055f381cc487cae37e70d6c3627dadf9da00c0337180a185127d5b1ee7c30b9`
*   **Testnet Explorer Link (Forge Core)**: [Stellar Expert - Forge Core](https://stellar.expert/explorer/testnet/contract/CASYXS2TY4HMNTQQ53R5AKNJCMR3LCDLLQBAV4TTR6U4JELZM24J6VC4)
*   **Testnet Explorer Link (Tx Hash)**: [Stellar Expert - Transaction 1055f3...](https://stellar.expert/explorer/testnet/tx/1055f381cc487cae37e70d6c3627dadf9da00c0337180a185127d5b1ee7c30b9)

### Smart Contract Flow
```mermaid
sequenceDiagram
    participant Player
    participant ForgeContract
    participant StellarToken
    
    Player->>ForgeContract: pay_entry_fee(amount, token)
    ForgeContract->>StellarToken: transfer(player -> contract)
    StellarToken-->>ForgeContract: XLM Transferred
    ForgeContract-->>Player: Emits "enter" Event
    
    Player->>ForgeContract: submit_batch(answers)
    ForgeContract->>ForgeContract: Validate against QUZS Map
    ForgeContract-->>Player: Emits "correct" Event(s)
    
    ForgeContract->>ForgeContract: Update HIGH_SCORES Map
    ForgeContract->>ForgeContract: Bubble Sort LEADERBOARD
    ForgeContract-->>Player: Emits "leader" Event (if top 10)
```

![Verification on Stellar Expert](./demo-img/verification-on-stellar-expert.png)

### Verified Test Suite
Running tests inside `contracts/forge-core` successfully executes all edge cases and Soroban lifecycle validations perfectly:

![Smart Contract Test Passed](./demo-img/passed-test.png)

---

## ⚙️ Professional CI/CD Pipeline
Our GitHub Actions workflow automatically builds the Vite React frontend, compiles the Rust contracts to WebAssembly, and runs cargo tests upon pushing commits to the main repository.

![CI/CD Pipeline Running Successfully](./demo-img/CI-CD.png)

---

## 🛠️ Technology Stack
*   **Frontend**: React + Vite + TypeScript + Tailwind CSS + Framer Motion
*   **Contracts**: Rust (Soroban SDK `20.0.1`)
*   **Stellar Integration**: `@creit.tech/stellar-wallets-kit`, `@stellar/freighter-api`
*   **Testing**: Cargo test for Rust contracts

---

## 📁 Project Structure
The repository is structured as a monorepo, cleanly separating the Rust smart contracts from the React frontend application:

```text
DecentralizedQuizApp-2.0/
├── .github/workflows/       # GitHub Actions CI/CD pipelines
├── contracts/               # Soroban Smart Contracts (Rust)
│   └── forge-core/          # Core logic for entry fees, validation, and leaderboard
├── frontend/                # React + Vite Web Application
│   ├── src/
│   │   ├── assets/          # Static assets and images
│   │   ├── components/      # Reusable React components (UI & layout)
│   │   ├── context/         # Global Context providers (Wallet state)
│   │   ├── data/            # Static data mapping and configurations
│   │   └── lib/             # Soroban integration and utility functions
│   └── package.json         # Frontend dependencies and scripts
├── demo-img/                # Architecture diagrams and UI screenshots
└── scripts/                 # Deployment and setup bash scripts
```

---

## 💻 Local Installation & Getting Started

### 📋 Prerequisites
*   Node.js 20+
*   Cargo + Rust Toolchain (with `wasm32-unknown-unknown` target)
*   Soroban CLI
*   Freighter Wallet extension installed

### 🛠️ Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/bapidas777/IRONCLAD-QUEST-STELLAR.git
   cd IRONCLAD-QUEST-STELLAR
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Run the Smart Contract Tests**:
   ```bash
   cd contracts/forge-core
   cargo test
   ```

5. **Deploy the Smart Contract**:
   Configure your Soroban CLI with a funded Testnet identity, then run:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

---

<div align="center">
  <b>Developed with ⚔️ by Bapi Das</b><br>
  <a href="https://github.com/bapidas777">GitHub Profile</a>
</div>
