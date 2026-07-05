import { ShieldAlert, Pickaxe, Coins, Sword } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-cinematic text-white tracking-widest uppercase text-shadow-glow">
          The Legend of the Forge
        </h1>
        <p className="text-slate-400 font-mono text-sm max-w-2xl mx-auto uppercase tracking-wide">
          A Cinematic Web3 Quiz Experience Built on the Stellar Network
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* What is this app? */}
        <div className="bg-forge-iron/10 border border-forge-iron p-6 md:p-8 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sword size={64} />
          </div>
          <h2 className="text-2xl font-cinematic text-forge-bloodLight mb-4 flex items-center gap-3">
            <Pickaxe className="text-forge-ironLight" />
            What is Ironclad Quest?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Web3 education is often boring, with zero stakes and poor UX. <strong className="text-white">Ironclad Quest</strong> changes that by introducing a hyper-gamified, cinematic learning environment. It is a "Pay-to-Play, Play-to-Earn" educational arena where users pay a small entry fee in XLM to test their Web3 knowledge.
          </p>
        </div>

        {/* The Reward Process */}
        <div className="bg-forge-iron/10 border border-forge-iron p-6 md:p-8 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Coins size={64} />
          </div>
          <h2 className="text-2xl font-cinematic text-forge-copperGlow mb-4 flex items-center gap-3">
            <Coins className="text-forge-ironLight" />
            The Reward System
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Knowledge is wealth. Here is how the treasury flows:
          </p>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-forge-bloodLight font-bold">1.</span>
              <span><strong>The Entry Fee:</strong> You pay a small XLM fee (e.g., 5 XLM) to attempt a Trial. This fee goes directly into the smart contract's prize pool.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-forge-bloodLight font-bold">2.</span>
              <span><strong>The Trial:</strong> Answer all questions correctly to survive the Trial.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-forge-bloodLight font-bold">3.</span>
              <span><strong>The Payout:</strong> Surviving unlocks a larger bounty (e.g., 10 XLM) automatically distributed back to your wallet by the contract.</span>
            </li>
          </ul>
        </div>

        {/* Hackproof System */}
        <div className="bg-forge-iron/10 border border-forge-iron p-6 md:p-8 rounded-lg relative overflow-hidden group md:col-span-2">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <ShieldAlert size={120} />
          </div>
          <h2 className="text-2xl font-cinematic text-emerald-500 mb-4 flex items-center gap-3">
            <ShieldAlert className="text-emerald-500" />
            A Hackproof Arena
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">
            In traditional Web2 quizzes, malicious users can inspect the network tab, reverse-engineer API responses, or inject scripts to perfectly answer questions and farm rewards. 
            <br/><br/>
            <strong>Ironclad Quest is mathematically secured by Stellar's Soroban Smart Contracts.</strong>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 p-4 rounded border border-forge-iron/50">
              <h3 className="font-bold text-white mb-2 font-mono text-sm">On-Chain Validation</h3>
              <p className="text-xs text-slate-400">Scores are calculated and verified directly inside the Rust smart contract, not on the client side.</p>
            </div>
            <div className="bg-black/40 p-4 rounded border border-forge-iron/50">
              <h3 className="font-bold text-white mb-2 font-mono text-sm">Blind Submissions</h3>
              <p className="text-xs text-slate-400">The correct answers are never sent to your browser. You submit an array of choices to the blockchain, and it returns your grade.</p>
            </div>
            <div className="bg-black/40 p-4 rounded border border-forge-iron/50">
              <h3 className="font-bold text-white mb-2 font-mono text-sm">Immutable Leaderboards</h3>
              <p className="text-xs text-slate-400">Rankings are sorted mathematically using on-chain bubble sort algorithms. The Top 10 cannot be manipulated by database injections.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
