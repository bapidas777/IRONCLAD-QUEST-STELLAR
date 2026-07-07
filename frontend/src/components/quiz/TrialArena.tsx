import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Timer, Shield, Server, XCircle as XIcon } from 'lucide-react';
import { useGameState } from '../../context/GameState';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { quests } from '../../data/quests';

export default function TrialArena({ questId, onComplete, onGoToWallet }: { questId: string, onComplete: () => void, onGoToWallet?: () => void }) {
  const { addXP, updateBalance, logActivity, recordQuizResult } = useGameState();
  const { width, height } = useWindowSize();
  
  const quest = quests.find(q => q.id === questId) || quests[1];
  const questionBank = quest.questions;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quest.estMins * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [isWin, setIsWin] = useState(false); // To trigger confetti

  const currentQuestion = questionBank[currentIndex];

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };


  const handleConfirm = () => {
    if (selectedOpt === null) return;
    
    const newAnswers = [...userAnswers, selectedOpt];
    setUserAnswers(newAnswers);
    setSelectedOpt(null);

    if (currentIndex < questionBank.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      evaluateQuiz(newAnswers);
    }
  };

  const evaluateQuiz = (finalAnswers: number[]) => {
    setIsEvaluating(true);
    setTimeout(() => {
      let finalScore = 0;
      finalAnswers.forEach((ans, i) => {
        if (ans === questionBank[i].correct) finalScore++;
      });
      setScore(finalScore);
      setIsEvaluating(false);
      finishQuiz(finalScore);
    }, 2000);
  };

  const finishQuiz = (finalScore = score) => {
    setIsFinished(true);
    
    const passThreshold = Math.ceil(questionBank.length * 0.6); // 60% to pass
    const passed = finalScore >= passThreshold;
    setIsWin(passed);
    
    recordQuizResult(passed);
    
    if (passed) {
      addXP(quest.rewardXP);
      updateBalance(quest.rewardXLM);
      logActivity({
        title: `Passed: ${quest.title}`,
        subtitle: `Score: ${finalScore}/${questionBank.length} • +${quest.rewardXP} XP • +${quest.rewardXLM} XLM`,
        timeAgo: 'Just now',
        iconType: 'quest'
      });
    } else {
      logActivity({
        title: `Failed: ${quest.title}`,
        subtitle: `Score: ${finalScore}/${questionBank.length}. Try again.`,
        timeAgo: 'Just now',
        iconType: 'sword'
      });
    }
  };



  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto p-4 md:p-0 relative">
      
      {isWin && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={width} height={height} colors={['#cd7f32', '#e53e3e', '#718096', '#ffffff']} recycle={false} numberOfPieces={500} />
        </div>
      )}

      <div className="w-full lg:w-80 flex flex-col gap-4 lg:gap-6 shrink-0 z-20">
        <div className="bg-forge-iron/20 border border-forge-iron rounded-lg p-4 lg:p-6 backdrop-blur-md flex flex-col sm:flex-row lg:flex-col justify-between items-center lg:items-stretch gap-4">
          <div className="w-full sm:w-auto lg:w-full flex-1">
            <h4 className="text-forge-copperGlow font-mono text-[10px] lg:text-xs tracking-widest mb-1 lg:mb-2 uppercase hidden lg:block">Current Trial</h4>
            <h2 className="text-lg lg:text-2xl font-bold text-white mb-2 lg:mb-6">{quest.title}</h2>
            
            <div className="flex justify-between text-[10px] lg:text-xs font-mono text-slate-400 mb-1 lg:mb-2">
              <span>Question {currentIndex + 1} of {questionBank.length}</span>
              <span className="text-forge-copperGlow">{isFinished || isEvaluating ? 100 : Math.round(((currentIndex) / questionBank.length) * 100)}%</span>
            </div>
            <div className="w-full bg-forge-iron/30 h-1.5 lg:h-2 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-forge-copperGlow shadow-forge-copper"
                initial={{ width: 0 }}
                animate={{ width: `${isFinished || isEvaluating ? 100 : ((currentIndex) / questionBank.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <h4 className="text-slate-500 font-mono text-xs tracking-widest mb-4 uppercase">Live Analytics</h4>
          </div>
          
          <div className="flex sm:flex-col lg:flex-col gap-4 sm:gap-2 lg:gap-4 w-full sm:w-48 lg:w-full shrink-0">
            <div className="flex-1 flex justify-between items-center lg:pb-4 lg:border-b border-forge-iron/50 bg-[#1a1a1a] sm:bg-transparent rounded p-2 sm:p-0">
              <div className="flex items-center gap-2 text-slate-300">
                <Trophy size={14} className="text-forge-copper lg:w-4 lg:h-4" />
                <span className="text-xs lg:text-sm hidden lg:inline">Questions Answered</span>
              </div>
              <span className="text-sm lg:text-xl font-bold text-forge-bloodLight">{userAnswers.length}/{questionBank.length}</span>
            </div>
            
            <div className="flex-1 flex justify-between items-center lg:pb-4 lg:border-b border-forge-iron/50 bg-[#1a1a1a] sm:bg-transparent rounded p-2 sm:p-0">
              <div className="flex items-center gap-2 text-slate-300">
                <Timer size={14} className="text-forge-blood lg:w-4 lg:h-4" />
                <span className="text-xs lg:text-sm hidden lg:inline">Time Remaining</span>
              </div>
              <span className={`font-mono text-sm lg:text-base text-slate-300 ${timeRemaining < 60 ? 'text-forge-blood animate-pulse' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col bg-forge-iron/20 border border-forge-iron rounded-lg overflow-hidden backdrop-blur-md h-48 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-forge-abyssal to-transparent z-10" />
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Shield size={64} />
          </div>
          <div className="absolute bottom-4 left-4 z-20">
            <span className="text-[10px] font-mono tracking-widest text-white uppercase">Difficulty: {quest.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#111111] border-2 border-[#1a1a1a] rounded-xl relative flex flex-col p-6 lg:p-16 shadow-2xl overflow-hidden min-h-[600px] z-10">
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-forge-blood" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-forge-blood" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-forge-blood" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-forge-blood" />

        <AnimatePresence mode="wait">
          {isFinished ? (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              {isWin ? (
                <Trophy size={64} className="text-forge-copperGlow mb-6 drop-shadow-[0_0_15px_rgba(205,127,50,0.5)] animate-bounce" />
              ) : (
                <XIcon size={64} className="text-forge-blood mb-6 opacity-50" />
              )}
              
              <h2 className="text-4xl font-cinematic text-white tracking-widest mb-2">
                {isWin ? 'TRIAL PASSED' : 'TRIAL FAILED'}
              </h2>
              <p className="text-slate-400 mb-8 max-w-md">
                {isWin ? `You have conquered the ${quest.title} and claimed your rewards.` : `The furnace was too hot. Return when you are stronger.`}
              </p>
              
              <div className="flex gap-8 mb-12 flex-wrap justify-center">
                <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg min-w-[120px]">
                  <div className="text-xs font-mono text-slate-500 mb-1">SCORE</div>
                  <div className="text-2xl font-bold text-white">{score} <span className="text-slate-600 text-lg">/ {questionBank.length}</span></div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-cinematic font-bold text-white mb-4">
                  {isWin ? "Audit Passed" : "Audit Failed"}
                </h2>
                <p className="text-slate-400 font-mono text-sm mb-10 max-w-md mx-auto">
                  {isWin 
                    ? `Flawless execution. Your rewards have been added to your In-App Balance.` 
                    : "The contract remains vulnerable. Your entry fee was sacrificed to the Vault."}
                </p>

                {isWin ? (
                  <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                    <button 
                      onClick={onGoToWallet ? onGoToWallet : onComplete}
                      className="w-full bg-[#185e35] hover:bg-[#1f7a45] text-white font-mono text-sm tracking-widest uppercase transition-colors px-6 py-4 flex items-center justify-center gap-2 border border-[#2d8f56]"
                    >
                      Claim & Go To Wallet
                    </button>
                    <button 
                      onClick={onComplete}
                      className="w-full bg-transparent hover:bg-forge-iron/20 text-white font-mono text-sm tracking-widest uppercase transition-colors px-6 py-4 flex items-center justify-center gap-2 border border-forge-iron"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={onComplete}
                    className="w-full max-w-xs mx-auto bg-transparent hover:bg-forge-iron/20 text-white font-mono text-sm tracking-widest uppercase transition-colors px-6 py-4 flex items-center justify-center gap-2 border border-forge-iron"
                  >
                    Return to Dashboard
                  </button>
                )}
              </div>
            </motion.div>
          ) : isEvaluating ? (
            <motion.div 
              key="evaluating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 rounded-full border-4 border-forge-iron flex items-center justify-center mb-6">
                <Server className="text-forge-ironLight animate-pulse" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 animate-pulse">Evaluating Audit Logs</h2>
              <p className="text-slate-400 font-mono mb-12">Simulating on-chain grading process...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="text-center mb-6 lg:mb-12">
                <span className="text-forge-blood font-mono text-[10px] lg:text-xs tracking-[0.3em] uppercase mb-2 lg:mb-4 block">Challenge {String(currentIndex + 1).padStart(2, '0')}</span>
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                  {currentQuestion.text}
                </h1>
              </div>

              <div className="flex flex-col gap-3 lg:gap-4 max-w-3xl mx-auto w-full flex-1">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  return (
                    <button 
                      key={i}
                      onClick={() => setSelectedOpt(i)}
                      className={`flex items-center gap-3 lg:gap-6 p-3 lg:p-4 rounded bg-[#1a1a1a] border transition-all duration-300 text-left ${isSelected ? 'border-forge-bloodLight shadow-[0_0_15px_rgba(229,62,62,0.3)]' : 'border-[#2a2a2a] hover:border-[#444]'}`}
                    >
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 shrink-0 rounded flex items-center justify-center font-mono text-xs lg:text-sm font-bold transition-colors ${isSelected ? 'bg-forge-blood/20 text-forge-bloodLight border border-forge-bloodLight' : 'bg-black text-slate-400 border border-[#333]'}`}>
                        {['A', 'B', 'C', 'D'][i]}
                      </div>
                      <span className={`text-sm lg:text-lg font-mono ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleConfirm}
                  disabled={selectedOpt === null}
                  className={`px-6 py-4 bg-[#8B1E1E] hover:bg-[#a82525] text-white font-mono text-sm tracking-widest uppercase transition-all flex items-center gap-2 ${selectedOpt === null ? 'opacity-50 cursor-not-allowed grayscale' : 'shadow-[0_0_20px_rgba(139,30,30,0.5)]'}`}
                >
                  Confirm Selection ⚡
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
