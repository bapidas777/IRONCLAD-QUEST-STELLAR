import { useState, useEffect } from 'react';
import { StellarWalletsKit, Networks } from '@creit.tech/stellar-wallets-kit';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { RabetModule } from '@creit.tech/stellar-wallets-kit/modules/rabet';
import { Swords, Medal, Wallet, Info } from 'lucide-react';
import { GameStateProvider, useGameState } from './context/GameState';
import BloodIronShader from './components/BloodIronShader';
import Dashboard from './components/dashboard/Dashboard';
import TrialArena from './components/quiz/TrialArena';
import HallOfHeroes from './components/leaderboard/HallOfHeroes';
import WalletDashboard from './components/wallet/WalletDashboard';
import About from './components/about/About';
import { getTestnetBalance } from './lib/stellar';

let isKitInitialized = false;

function AppContent() {
  const { publicKey, connectWallet, disconnectWallet } = useGameState();
  const [activeTab, setActiveTab] = useState<'play' | 'rank' | 'wallet' | 'profile' | 'about'>('play');
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [walletXLM, setWalletXLM] = useState<string>('0');
  
  useEffect(() => {
    if (!isKitInitialized) {
      StellarWalletsKit.init({ 
        modules: [
          new FreighterModule(),
          new AlbedoModule(),
          new xBullModule(),
          new RabetModule()
        ] 
      });
      StellarWalletsKit.setNetwork(Networks.TESTNET);
      isKitInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (publicKey) {
      getTestnetBalance(publicKey).then(setWalletXLM).catch(console.error);
    } else {
      setWalletXLM('0');
    }
  }, [publicKey]);



  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-3)}`;

  return (
    <div className="relative min-h-screen flex flex-col bg-forge-abyssal">
      <BloodIronShader className="fixed inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen" />

      <header className="z-20 w-full bg-forge-abyssal/90 border-b border-forge-iron backdrop-blur-md sticky top-0 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-forge-bloodLight font-bold tracking-widest text-xl font-cinematic">IRONCLAD QUEST</span>
            <span className="text-white font-bold tracking-widest text-xl font-cinematic flex items-center gap-2">
              <svg width="14" height="24" viewBox="0 0 24 48" className="animate-sword-shine mx-1">
                <path d="M12 0 L15 8 L15 36 L12 40 L9 36 L9 8 Z" fill="#e2e8f0" />
                <path d="M12 0 L9 8 L9 36 L12 40 Z" fill="#94a3b8" />
                <path d="M4 36 L20 36 L20 40 L15 40 L15 44 L9 44 L9 40 L4 40 Z" fill="#475569" />
                <circle cx="12" cy="46" r="2" fill="#94a3b8" />
              </svg> 
              STELLAR
            </span>
          </div>
          
          <nav className="flex gap-8 items-center h-full">
            <button onClick={() => {setActiveTab('play'); setActiveQuestId(null)}} className={`h-full px-4 border-b-2 transition-colors ${activeTab === 'play' && !activeQuestId ? 'border-forge-bloodLight text-forge-bloodLight' : 'border-transparent text-slate-400 hover:text-white'}`}>Dashboard</button>
            <button onClick={() => {setActiveTab('rank'); setActiveQuestId(null)}} className={`h-full px-4 border-b-2 transition-colors ${activeTab === 'rank' ? 'border-forge-bloodLight text-forge-bloodLight' : 'border-transparent text-slate-400 hover:text-white'}`}>Leaderboard</button>
            <button onClick={() => {setActiveTab('wallet'); setActiveQuestId(null)}} className={`h-full px-4 border-b-2 transition-colors ${activeTab === 'wallet' ? 'border-forge-bloodLight text-forge-bloodLight' : 'border-transparent text-slate-400 hover:text-white'}`}>Wallet</button>
            <button onClick={() => {setActiveTab('about'); setActiveQuestId(null)}} className={`h-full px-4 border-b-2 transition-colors ${activeTab === 'about' ? 'border-forge-bloodLight text-forge-bloodLight' : 'border-transparent text-slate-400 hover:text-white'}`}>About</button>
            
            {publicKey && (
              <div className="flex items-center text-sm font-mono gap-2 mr-2 px-4 py-1.5 border border-forge-iron/50 rounded bg-forge-iron/20">
                <span className="text-forge-copperGlow font-bold">{parseFloat(walletXLM).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} XLM</span>
              </div>
            )}

            {publicKey ? (
              <button onClick={disconnectWallet} title="Click to disconnect" className="px-4 py-1.5 border border-forge-iron rounded bg-forge-ironLight text-sm font-mono text-slate-300 hover:border-forge-blood hover:text-forge-blood transition-colors cursor-pointer">
                {formatAddress(publicKey)}
              </button>
            ) : (
              <button onClick={connectWallet} className="px-4 py-1.5 border border-forge-bloodLight text-forge-bloodLight rounded text-sm font-bold hover:bg-forge-bloodLight hover:text-white transition-colors">
                Connect Wallet
              </button>
            )}
          </nav>
        </div>
      </header>

      <header className="fixed top-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-md border-b border-forge-iron/50 z-50 flex items-center justify-between px-3 lg:px-8 md:hidden">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-forge-bloodLight font-bold tracking-widest text-xs sm:text-sm font-cinematic">IRONCLAD</span>
          <span className="text-white font-bold tracking-widest text-xs sm:text-sm font-cinematic flex items-center gap-1">
            <svg width="8" height="14" viewBox="0 0 24 48" className="animate-sword-shine mx-0.5">
              <path d="M12 0 L15 8 L15 36 L12 40 L9 36 L9 8 Z" fill="#e2e8f0" />
              <path d="M12 0 L9 8 L9 36 L12 40 Z" fill="#94a3b8" />
              <path d="M4 36 L20 36 L20 40 L15 40 L15 44 L9 44 L9 40 L4 40 Z" fill="#475569" />
              <circle cx="12" cy="46" r="2" fill="#94a3b8" />
            </svg> 
            STELLAR
          </span>
        </div>
        {publicKey ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-forge-copperGlow font-bold text-[9px] sm:text-[10px] font-mono bg-forge-iron/20 px-1.5 py-1 rounded border border-forge-iron/50 whitespace-nowrap">
              {parseFloat(walletXLM).toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 1})} XLM
            </span>
            <button onClick={disconnectWallet} title="Click to disconnect" className="px-1.5 py-1 border border-forge-iron rounded bg-forge-ironLight text-[9px] sm:text-[10px] font-mono text-slate-300 hover:border-forge-blood transition-colors cursor-pointer truncate max-w-[60px] sm:max-w-[80px]">
              {formatAddress(publicKey)}
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="text-[10px] sm:text-xs text-forge-bloodLight font-bold border border-forge-bloodLight px-2 py-1 rounded whitespace-nowrap shrink-0">
            Connect
          </button>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-32 md:pb-24 relative z-10 pt-28">
        {activeQuestId ? (
          <TrialArena 
            questId={activeQuestId} 
            onComplete={() => setActiveQuestId(null)} 
            onGoToWallet={() => {
              setActiveQuestId(null);
              setActiveTab('wallet');
            }}
          />
        ) : (
          <>
            {activeTab === 'play' && <Dashboard publicKey={publicKey} onStartQuest={(id) => setActiveQuestId(id)} />}
            {activeTab === 'rank' && <HallOfHeroes />}
            {activeTab === 'wallet' && <WalletDashboard publicKey={publicKey} />}
            {activeTab === 'about' && <About />}
            {activeTab === 'profile' && <div className="p-6 text-center text-slate-400">Profile features coming soon...</div>}
          </>
        )}
      </main>

      <footer className="z-20 w-full bg-forge-abyssal/90 border-t border-forge-iron backdrop-blur-md hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-70">
            <span className="text-forge-bloodLight font-bold tracking-widest text-sm font-cinematic">IRONCLAD QUEST</span>
            <span className="text-white font-bold tracking-widest text-sm font-cinematic flex items-center gap-1.5">
              <svg width="10" height="18" viewBox="0 0 24 48" className="animate-sword-shine mx-0.5">
                <path d="M12 0 L15 8 L15 36 L12 40 L9 36 L9 8 Z" fill="#e2e8f0" />
                <path d="M12 0 L9 8 L9 36 L12 40 Z" fill="#94a3b8" />
                <path d="M4 36 L20 36 L20 40 L15 40 L15 44 L9 44 L9 40 L4 40 Z" fill="#475569" />
                <circle cx="12" cy="46" r="2" fill="#94a3b8" />
              </svg>
              STELLAR
            </span>
            <span className="text-slate-500 font-mono text-xs ml-2">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white font-mono text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-white font-mono text-xs transition-colors">Privacy Policy</a>
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300 font-mono text-xs">Stellar Testnet</span>
            </div>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-forge-iron/50 z-50 flex items-center justify-evenly pb-safe h-20 px-2">
        <button onClick={() => {setActiveTab('play'); setActiveQuestId(null)}} className={`flex flex-col items-center p-2 px-4 rounded-xl transition-colors ${activeTab === 'play' && !activeQuestId ? 'bg-forge-blood text-white' : 'text-slate-400'}`}>
          <Swords size={20} />
          <span className="text-[10px] mt-1 font-medium">Play</span>
        </button>
        <button onClick={() => {setActiveTab('rank'); setActiveQuestId(null)}} className={`flex flex-col items-center p-2 px-4 rounded-xl transition-colors ${activeTab === 'rank' ? 'bg-forge-blood text-white' : 'text-slate-400'}`}>
          <Medal size={20} />
          <span className="text-[10px] mt-1 font-medium">Rank</span>
        </button>
        <button onClick={() => {setActiveTab('wallet'); setActiveQuestId(null)}} className={`flex flex-col items-center p-2 px-4 rounded-xl transition-colors ${activeTab === 'wallet' ? 'bg-forge-blood text-white' : 'text-slate-400'}`}>
          <Wallet size={20} />
          <span className="text-[10px] mt-1 font-medium">Wallet</span>
        </button>
        <button onClick={() => {setActiveTab('about'); setActiveQuestId(null)}} className={`flex flex-col items-center p-2 px-4 rounded-xl transition-colors ${activeTab === 'about' ? 'bg-forge-blood text-white' : 'text-slate-400'}`}>
          <Info size={20} />
          <span className="text-[10px] mt-1 font-medium">About</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <AppContent />
    </GameStateProvider>
  );
}
