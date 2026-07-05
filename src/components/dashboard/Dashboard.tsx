import { motion } from 'framer-motion';
import { useGameState } from '../../context/GameState';
import { Shield, Flame, CheckCircle, Swords, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { payEntryFee } from '../../lib/stellar';
import { useState } from 'react';
import { quests } from '../../data/quests';

export default function Dashboard({ publicKey, onStartQuest }: { publicKey: string | null, onStartQuest: (id: string) => void }) {
  const { xp, rank, streak, activities, quizzesPlayed, quizzesWon, logActivity } = useGameState();
  const [payingQuestId, setPayingQuestId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredQuests = quests.filter(q => difficultyFilter === 'All' || q.difficulty === difficultyFilter);


  const handleStartQuest = async (questId: string, feeXLM: number) => {
    if (!publicKey) {
      setErrorMsg("Connect your wallet first!");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }


    setPayingQuestId(questId);
    try {
      // Send real transaction for entry fee via Freighter
      const txHash = await payEntryFee(publicKey, feeXLM);
      logActivity({
        title: 'Entry Fee Paid',
        subtitle: `-${feeXLM} XLM`,
        timeAgo: 'Just now',
        iconType: 'sword',
        txHash
      });
      onStartQuest(questId);
    } catch (error) {
      console.error(error);
      setErrorMsg("Transaction failed or rejected.");
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setPayingQuestId(null);
    }
  };



  // Determine progress to next rank
  const getNextRankTarget = (currentXp: number) => {
    if (currentXp < 200) return { name: 'Silver I', target: 200 };
    if (currentXp < 450) return { name: 'Gold II', target: 450 };
    if (currentXp < 750) return { name: 'Gold I', target: 750 };
    return { name: 'Platinum I', target: 1000 };
  };

  const nextRank = getNextRankTarget(xp);
  const progressPercent = Math.min(100, (xp / nextRank.target) * 100);
  const winRate = quizzesPlayed > 0 ? ((quizzesWon / quizzesPlayed) * 100).toFixed(1) : '0.0';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto relative"
    >
      {errorMsg && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 bg-[#8B1E1E] text-white px-4 py-2 rounded shadow-lg border border-[#a82525] flex items-center gap-2 font-mono text-sm animate-pulse">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}
      
      {/* Current Rank Card */}
      <motion.div variants={itemVariants} className="bg-forge-iron/20 border border-forge-iron rounded-xl p-6 relative overflow-hidden backdrop-blur-md hover:border-forge-ironLight transition-colors">
        <h3 className="text-xl font-bold text-white mb-6">Current Rank</h3>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Circular Progress */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#2D3748" strokeWidth="8" />
              <motion.circle 
                cx="64" cy="64" r="56" fill="transparent" 
                stroke="#E53E3E" strokeWidth="8" 
                strokeDasharray="351.8" 
                initial={{ strokeDashoffset: 351.8 }}
                animate={{ strokeDashoffset: 351.8 - (351.8 * progressPercent / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-bold text-white z-10">{rank}</span>
          </div>
          <p className="mt-6 text-sm text-slate-400 font-mono tracking-wider">{xp} XP to {nextRank.name}</p>
        </div>
      </motion.div>

      {/* Daily Streak Card */}
      <motion.div variants={itemVariants} className="bg-forge-iron/20 border border-forge-iron rounded-xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md group hover:border-forge-blood/50 transition-colors">
        {/* Ember Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-forge-blood/10 to-transparent opacity-50 z-0" />
        <motion.div 
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-forge-blood/20 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-slate-400 font-medium tracking-widest text-sm mb-1 uppercase">Daily Streak</h3>
            <p className="text-xs text-forge-bloodLight font-mono mb-4">
              {streak > 0 ? "The forge is hot!" : "Ignite the forge."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-5xl font-bold text-white font-cinematic text-shadow-blood">{streak}</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-300">Days</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Consecutive</span>
            </div>
            
            <div className="ml-auto relative mt-[-10px]">
              {/* Hyper-realistic fire assembly */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center w-16 h-16"
              >
                 {/* Outer Glow */}
                 <div className="absolute inset-0 bg-orange-600/20 rounded-full blur-xl" />
                 {/* Middle Flame */}
                 <Flame size={56} strokeWidth={0} fill="url(#fire-gradient)" className="absolute z-10 drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]" />
                 {/* Core Flame */}
                 <Flame size={24} strokeWidth={0} fill="#FFF" className="absolute z-20 top-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] opacity-90" />
                 
                 <svg width="0" height="0">
                  <defs>
                    <linearGradient id="fire-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#8B0000" />
                      <stop offset="40%" stopColor="#FF4500" />
                      <stop offset="80%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFFFF0" />
                    </linearGradient>
                  </defs>
                 </svg>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">This Week</span>
              <span className="text-xs text-forge-copperGlow font-mono">{streak % 7}/7</span>
            </div>
            <div className="flex gap-1 justify-between w-full">
              {[...Array(7)].map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < (streak % 7) ? 'bg-gradient-to-r from-forge-blood to-forge-copper shadow-[0_0_8px_rgba(229,62,62,0.8)]' : 'bg-forge-iron/40'}`} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>


      {/* Combat Stats Card */}
      <motion.div variants={itemVariants} className="bg-forge-iron/20 border border-forge-iron rounded-xl p-6 relative overflow-hidden backdrop-blur-md hover:border-forge-ironLight transition-colors">
        <h3 className="text-xl font-bold text-white mb-6">Combat Stats</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-forge-iron/50 pb-3">
            <span className="text-slate-400 text-sm">Quizzes Survived</span>
            <span className="text-white font-bold font-mono text-lg">{quizzesPlayed}</span>
          </div>
          <div className="flex justify-between items-center border-b border-forge-iron/50 pb-3">
            <span className="text-slate-400 text-sm">Win Rate</span>
            <span className="text-forge-copperGlow font-bold font-mono text-lg">{winRate}%</span>
          </div>
          <div className="flex justify-between items-center pb-1">
            <span className="text-slate-400 text-sm">Victories</span>
            <span className="text-forge-bloodLight font-bold font-mono text-lg">{quizzesWon}</span>
          </div>
        </div>
      </motion.div>

      {/* Available Trials */}
      <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 flex flex-col gap-4 bg-forge-iron/10 p-4 rounded-xl border border-forge-iron/30 h-[500px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 px-2">
          <h3 className="text-xl font-bold text-white">Available Trials</h3>
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
              <button 
                key={f}
                onClick={() => setDifficultyFilter(f as any)}
                className={`px-3 py-1 text-xs font-mono rounded border transition-colors whitespace-nowrap ${
                  difficultyFilter === f 
                  ? 'bg-forge-iron border-forge-ironLight text-white' 
                  : 'border-forge-iron/50 text-slate-400 hover:text-white hover:border-forge-iron'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1 pb-4">
          {filteredQuests.map(quest => (
            <div key={quest.id} className="bg-forge-iron/20 border border-forge-iron rounded-xl overflow-hidden backdrop-blur-md flex flex-col sm:flex-row items-center justify-between p-4 group hover:border-forge-ironLight transition-colors shrink-0">
              
              <div className="flex-1 mb-4 sm:mb-0 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 border text-xs font-bold tracking-widest rounded ${
                    quest.difficulty === 'Beginner' ? 'border-slate-400 text-slate-400 bg-slate-400/10' :
                    quest.difficulty === 'Intermediate' ? 'border-forge-blood text-forge-blood bg-forge-blood/10' :
                    'border-forge-copper text-forge-copper bg-forge-copper/10'
                  }`}>
                    {quest.difficulty.toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-sm font-mono">Est. {quest.estMins} mins</span>
                </div>
                <h4 className="text-lg font-bold text-white">{quest.title}</h4>
                <p className="text-slate-400 text-sm">{quest.description}</p>
              </div>

              <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto shrink-0 sm:pl-6 sm:border-l border-forge-iron/50">
                <div className="flex gap-4 text-sm font-mono">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs">REWARD</span>
                    <span className="text-forge-copperGlow font-bold">+{quest.rewardXLM} XLM</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-xs">XP</span>
                    <span className="text-white font-bold">+{quest.rewardXP} XP</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleStartQuest(quest.id, quest.entryFeeXLM)}
                  disabled={payingQuestId === quest.id}
                  className="w-full sm:w-auto bg-forge-blood hover:bg-forge-bloodLight text-white px-6 py-2 rounded shadow-forge-blood transition-all transform active:scale-95 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                >
                  {payingQuestId === quest.id ? (
                    <><RefreshCw size={16} className="animate-spin" /> Approving...</>
                  ) : (
                    <>Play ({quest.entryFeeXLM} XLM)</>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity Card */}
      <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-1 bg-forge-iron/20 border border-forge-iron rounded-xl p-6 backdrop-blur-md flex flex-col h-[500px]">
        <h3 className="text-xl font-bold text-white border-b border-forge-iron pb-4 mb-4 shrink-0">Recent Activity</h3>
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 flex-1 pb-4">
          {activities.length === 0 ? (
            <p className="text-slate-500 text-sm text-center">No recent activity.</p>
          ) : activities.map((activity, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={activity.id} 
              className="flex gap-4 items-start shrink-0"
            >
              <div className="w-10 h-10 rounded border border-forge-iron flex items-center justify-center shrink-0 bg-forge-abyssal/50">
                {activity.iconType === 'sword' && <Swords size={16} className="text-forge-bloodLight" />}
                {activity.iconType === 'rank' && <Shield size={16} className="text-forge-copperGlow" />}
                {activity.iconType === 'quest' && <CheckCircle size={16} className="text-slate-300" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-white text-sm font-medium">{activity.title}</h4>
                  {activity.txHash && (
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-forge-copperGlow hover:text-white transition-colors"
                      title="View on Stellar Expert"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <p className="text-slate-400 text-xs mt-1 font-mono">{activity.subtitle}</p>
              </div>
              <span className="text-slate-500 text-xs font-mono whitespace-nowrap">{activity.timeAgo}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
