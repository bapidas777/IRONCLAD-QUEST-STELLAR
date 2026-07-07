import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw, Wallet, ArrowUpRight, ArrowDownLeft, AlertCircle, ExternalLink } from 'lucide-react';
import { useGameState } from '../../context/GameState';
import { useState, useEffect } from 'react';
import { getTestnetBalance, withdrawXLM } from '../../lib/stellar';

export default function WalletDashboard({ publicKey }: { publicKey: string | null }) {
  const { balanceXLM, setRealBalance, logActivity, activities } = useGameState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [xlmBalance, setXlmBalance] = useState<string>('0');
  const [isFetchingXlm, setIsFetchingXlm] = useState(false);
  const [activeAction, setActiveAction] = useState<'none' | 'withdraw'>('none');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [txFilter, setTxFilter] = useState<'All' | 'In' | 'Out'>('All');

  useEffect(() => {
    if (publicKey) {
      setIsFetchingXlm(true);
      getTestnetBalance(publicKey).then((bal) => {
        setXlmBalance(bal);
        setIsFetchingXlm(false);
      }).catch(() => setIsFetchingXlm(false));
    }
  }, [publicKey]);



  const handleWithdraw = async () => {
    if (!publicKey) return;
    const amount = parseFloat(withdrawAmount);
    if (balanceXLM <= 0 || isNaN(amount) || amount <= 0 || amount > balanceXLM) {
      setErrorMsg("Invalid withdrawal amount.");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    
    setIsProcessing(true);
    try {
      const txHash = await withdrawXLM(publicKey, amount);
      
      logActivity({
        title: 'Withdrawn to Wallet',
        subtitle: `-${amount.toFixed(2)} XLM`,
        timeAgo: 'Just now',
        iconType: 'rank',
        txHash
      });
      
      setRealBalance(balanceXLM - amount);
      setWithdrawAmount('');
      setErrorMsg(`Successfully withdrawn ${amount.toFixed(2)} XLM!`);
      
      getTestnetBalance(publicKey).then((bal) => setXlmBalance(bal));
      setActiveAction('none');
    } catch (err) {
      console.error(err);
      setErrorMsg("Withdrawal failed on testnet.");
    } finally {
      setTimeout(() => setErrorMsg(null), 5000);
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const financialActivities = activities.filter(a => {
    if (!a.subtitle.includes('XLM')) return false;
    if (txFilter === 'All') return true;
    if (txFilter === 'In') return a.subtitle.includes('+');
    if (txFilter === 'Out') return a.subtitle.includes('-');
    return true;
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto flex flex-col gap-6 relative"
    >
      {errorMsg && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 bg-[#8B1E1E] text-white px-4 py-2 rounded shadow-lg border border-[#a82525] flex items-center gap-2 font-mono text-sm animate-pulse">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <Wallet className="text-forge-bloodLight" size={28} />
          <h2 className="text-2xl font-bold text-white font-cinematic">Wallet & Earnings</h2>
        </div>
        <p className="text-slate-400 text-xs font-mono max-w-sm">
          Earnings are held securely in the Ironclad Treasury and can be withdrawn to your connected wallet at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-forge-iron/20 border border-forge-iron rounded-xl p-8 relative overflow-hidden backdrop-blur-md">
          <Shield className="absolute -right-10 -bottom-10 text-forge-ironLight/10" size={160} />
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-slate-400 font-medium">In-App Earnings (XLM)</h3>
            {isProcessing && <RefreshCw size={16} className="text-forge-copperGlow animate-spin" />}
          </div>
          <div className="text-4xl font-bold text-forge-copperGlow mb-6">
            {publicKey ? `${balanceXLM.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} XLM` : 'Not Connected'}
          </div>
          
          <div className="flex justify-between items-center mb-2 pt-4 border-t border-forge-iron/30">
            <h3 className="text-slate-400 font-medium text-sm">Connected Wallet (XLM)</h3>
            {isFetchingXlm && <RefreshCw size={14} className="text-slate-400 animate-spin" />}
          </div>
          <div className="text-2xl font-bold text-white mb-6">
            {publicKey ? `${parseFloat(xlmBalance).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} XLM` : 'Not Connected'}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <AnimatePresence mode="wait">
              {activeAction === 'none' && (
                <motion.div 
                  key="buttons"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <button 
                    onClick={() => setActiveAction('withdraw')} 
                    disabled={!publicKey || isProcessing || balanceXLM <= 0}
                    className="w-full bg-transparent border border-forge-ironLight text-white py-3 rounded-lg font-bold hover:bg-forge-iron/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ArrowUpRight size={18} />
                    Withdraw Earnings
                  </button>
                </motion.div>
              )}

              {activeAction === 'withdraw' && (
                <motion.div 
                  key="withdraw-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex flex-col gap-3 bg-black/40 border border-forge-iron p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-mono text-slate-400 uppercase tracking-wider">Withdraw Amount</span>
                    <button onClick={() => setActiveAction('none')} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
                  </div>
                  <div className="flex items-center bg-forge-abyssal border border-forge-iron rounded px-3 py-2">
                    <input 
                      type="number" 
                      value={withdrawAmount} 
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="bg-transparent text-white outline-none w-full font-mono text-sm"
                      placeholder="Amount"
                      min="0.1"
                      max={balanceXLM}
                    />
                    <button 
                      onClick={() => setWithdrawAmount(balanceXLM.toString())}
                      className="text-forge-copperGlow text-[10px] font-bold mr-2 hover:text-white transition-colors border border-forge-copperGlow/30 px-2 py-0.5 rounded"
                    >
                      MAX
                    </button>
                    <span className="text-slate-500 font-mono text-xs">XLM</span>
                  </div>
                  <button 
                    onClick={handleWithdraw} 
                    disabled={!publicKey || isProcessing || balanceXLM <= 0 || !parseFloat(withdrawAmount) || parseFloat(withdrawAmount) > balanceXLM || parseFloat(withdrawAmount) <= 0}
                    className="w-full bg-transparent border border-forge-ironLight text-white py-3 rounded-lg font-bold hover:bg-forge-iron/50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <ArrowUpRight size={18} />}
                    Confirm Withdrawal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-forge-iron/20 border border-forge-iron rounded-xl p-6 backdrop-blur-md flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-forge-iron pb-4 mb-4">
            <h3 className="text-lg font-bold text-white">Earnings & Transactions</h3>
            <div className="flex gap-2">
              {['All', 'In', 'Out'].map(f => (
                <button 
                  key={f}
                  onClick={() => setTxFilter(f as any)}
                  className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                    txFilter === f 
                    ? 'bg-forge-iron border-forge-ironLight text-white' 
                    : 'border-forge-iron/50 text-slate-400 hover:text-white hover:border-forge-iron'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {financialActivities.length === 0 ? (
              <p className="text-slate-500 text-sm text-center mt-10">No recent transactions.</p>
            ) : financialActivities.map((activity, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={activity.id} 
                className="flex gap-4 items-start mb-6 last:mb-0"
              >
                <div className="w-10 h-10 rounded border border-forge-iron flex items-center justify-center shrink-0 bg-forge-abyssal/50">
                  {activity.subtitle.includes('+') ? (
                    <ArrowDownLeft size={16} className="text-emerald-400" />
                  ) : activity.subtitle.includes('-') ? (
                    <ArrowUpRight size={16} className="text-forge-bloodLight" />
                  ) : (
                    <Wallet size={16} className="text-forge-copperGlow" />
                  )}
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
                  <p className={`text-xs mt-1 font-mono ${activity.subtitle.includes('+') ? 'text-emerald-400' : activity.subtitle.includes('-') ? 'text-forge-bloodLight' : 'text-slate-400'}`}>
                    {activity.subtitle}
                  </p>
                </div>
                <span className="text-slate-500 text-xs font-mono whitespace-nowrap">{activity.timeAgo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
