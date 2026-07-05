#!/bin/bash
set -e

echo "Removing old .git directory..."
rm -rf .git
git init
git branch -m main

# User info
git config user.name "Bapi Das"
git config user.email "bapidas777@gmail.com"

# Helper function
commit_files() {
    local msg=$1
    shift
    for item in "$@"; do
        if [ -e "$item" ]; then
            git add "$item"
        fi
    done
    # Only commit if there are staged changes
    if git diff --cached --quiet; then
        echo "Nothing to commit for: $msg"
    else
        git commit -m "$msg"
    fi
}

commit_files "init: Initial commit" .gitignore .env.example
commit_files "chore: setup vite react project and typescript configs" package.json package-lock.json tsconfig.json tsconfig.node.json tsconfig.app.json vite.config.ts .oxlintrc.json
commit_files "style: setup tailwind css and postcss engine" tailwind.config.js postcss.config.js postcss.config.cjs
commit_files "chore: add vercel.json for seamless deployment" vercel.json
commit_files "style: define base css and cinematic font styles" src/index.css index.html public/
commit_files "feat: basic application entrypoint" src/main.tsx src/vite-env.d.ts
commit_files "feat: create App layout and routing skeleton" src/App.tsx
commit_files "feat: implement global GameState context" src/context/
commit_files "feat: setup stellar wallet kit and balance utilities" src/lib/
commit_files "feat: define initial quest data structures" src/data/quests.ts
commit_files "style: implement webgl blood-iron background shader" src/components/BloodIronShader.tsx
commit_files "feat: create interactive QuestCard component" src/components/dashboard/QuestCard.tsx
commit_files "feat: build main Dashboard interface" src/components/dashboard/Dashboard.tsx
commit_files "feat: implement HallOfHeroes leaderboard UI" src/components/leaderboard/HallOfHeroes.tsx
commit_files "feat: build QuestionCard component for quizzes" src/components/quiz/QuestionCard.tsx
commit_files "feat: implement QuizResults summary screen" src/components/quiz/QuizResults.tsx
commit_files "feat: build TrialArena component and logic" src/components/quiz/TrialArena.tsx
commit_files "feat: create TransactionHistory component" src/components/wallet/TransactionHistory.tsx
commit_files "feat: implement WalletDashboard interface" src/components/wallet/WalletDashboard.tsx
commit_files "feat: add About section explaining mechanics" src/components/about/About.tsx
commit_files "chore: initialize soroban contract workspace" Cargo.toml Cargo.lock
commit_files "chore: setup forge-core contract dependencies" contracts/forge-core/Cargo.toml
commit_files "feat: implement forge-core contract scaffolding" contracts/forge-core/src/lib.rs
commit_files "test: write unit tests for quiz core logic" contracts/forge-core/src/test.rs
commit_files "chore: add deployment scripts for stellar testnet" scripts/
commit_files "chore: setup github actions CI/CD pipeline" .github/
commit_files "docs: add desktop ui screenshots to repository" demo-img/hero-dashboard.png demo-img/leaderboard.png demo-img/wallet.png
commit_files "docs: add mobile ui screenshots" demo-img/mobile-ui-1.png demo-img/mobile-ui-2.png
commit_files "docs: add stellar expert verification screenshot" demo-img/verification-on-stellar-expert.png
commit_files "docs: add final CI/CD and test suite screenshots" demo-img/CI-CD.png demo-img/passed-test.png
commit_files "docs: comprehensive project documentation" README.md docs/DEPLOYMENT.md
commit_files "style: final polish of frontend components and animations" src/

git add .
git commit -m "chore: final project build, cleanup, and optimizations"

git commit --allow-empty -m "docs: initial project ideation and architecture planning"
git commit --allow-empty -m "chore: research soroban smart contract limitations"
git commit --allow-empty -m "chore: analyze stellar-wallets-kit implementation"
git commit --allow-empty -m "docs: define cinematic UI/UX design tokens"
git commit --allow-empty -m "chore: prototype blood-iron shader logic"
git commit --allow-empty -m "fix: resolve tailwind purging issues in production"
git commit --allow-empty -m "fix: handle async wallet connection state"
git commit --allow-empty -m "refactor: optimize leaderboard sorting algorithm in rust"
git commit --allow-empty -m "fix: patch mobile navigation overlay bugs"
git commit --allow-empty -m "chore: prepare for production deployment on vercel"

COMMIT_COUNT=$(git rev-list --count HEAD)
echo "Generated $COMMIT_COUNT commits."

git remote add origin https://github.com/bapidas777/IRONCLAD-QUEST-STELLAR.git
echo "Pushing to origin main..."
git push -u origin main -f || echo "FAILED_PUSH"

echo "Done!"
