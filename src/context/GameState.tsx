import React, { createContext, useContext, useState, useEffect } from 'react';

export type Activity = {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  iconType: 'sword' | 'rank' | 'quest';
  txHash?: string;
};

interface GameStateContextType {
  xp: number;
  rank: string;
  streak: number;
  balanceXLM: number;
  activities: Activity[];
  quizzesPlayed: number;
  quizzesWon: number;
  updateBalance: (amount: number) => void;
  setRealBalance: (amount: number) => void;
  logActivity: (activity: Omit<Activity, 'id'>) => void;
  addXP: (xp: number) => void;
  recordQuizResult: (passed: boolean) => void;
  publicKey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new Error('useGameState must be used within GameStateProvider');
  return context;
};

const calculateRank = (xp: number) => {
  if (xp >= 1000) return 'Platinum I';
  if (xp >= 750) return 'Gold I';
  if (xp >= 450) return 'Gold II';
  if (xp >= 200) return 'Silver I';
  return 'Bronze I';
};

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(() => localStorage.getItem('forge_wallet'));
  
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [balanceXLM, setBalanceXLM] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [quizzesPlayed, setQuizzesPlayed] = useState(0);
  const [quizzesWon, setQuizzesWon] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to load user-specific data when publicKey changes
  useEffect(() => {
    if (publicKey) {
      setXp(parseInt(localStorage.getItem(`forge_xp_${publicKey}`) || '0'));
      setStreak(parseInt(localStorage.getItem(`forge_streak_${publicKey}`) || '0'));
      setBalanceXLM(parseFloat(localStorage.getItem(`forge_balance_${publicKey}`) || '0'));
      setQuizzesPlayed(parseInt(localStorage.getItem(`forge_played_${publicKey}`) || '0'));
      setQuizzesWon(parseInt(localStorage.getItem(`forge_won_${publicKey}`) || '0'));
      setLastActiveDate(localStorage.getItem(`forge_lastactive_${publicKey}`));
      
      const savedActivities = localStorage.getItem(`forge_activities_${publicKey}`);
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities));
      } else {
        setActivities([]);
      }
      setIsLoaded(true);
    } else {
      // Reset state if disconnected
      setXp(0);
      setStreak(0);
      setBalanceXLM(0);
      setActivities([]);
      setQuizzesPlayed(0);
      setQuizzesWon(0);
      setLastActiveDate(null);
      setIsLoaded(false);
    }
  }, [publicKey]);
  


  useEffect(() => {
    if (publicKey && isLoaded) {
      localStorage.setItem(`forge_xp_${publicKey}`, xp.toString());
      localStorage.setItem(`forge_balance_${publicKey}`, balanceXLM.toString());
      localStorage.setItem(`forge_activities_${publicKey}`, JSON.stringify(activities));
      localStorage.setItem(`forge_streak_${publicKey}`, streak.toString());
      localStorage.setItem(`forge_played_${publicKey}`, quizzesPlayed.toString());
      localStorage.setItem(`forge_won_${publicKey}`, quizzesWon.toString());
      if (lastActiveDate) localStorage.setItem(`forge_lastactive_${publicKey}`, lastActiveDate);
    }
  }, [xp, balanceXLM, activities, streak, quizzesPlayed, quizzesWon, lastActiveDate, publicKey, isLoaded]);

  const connectWallet = async () => {
    try {
      // Lazy load to avoid circular deps if needed, but App.tsx handles init
      const { StellarWalletsKit } = await import('@creit.tech/stellar-wallets-kit');
      const { address } = await StellarWalletsKit.fetchAddress();
      setPublicKey(address);
      localStorage.setItem('forge_wallet', address);
    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    localStorage.removeItem('forge_wallet');
  };

  const addXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const updateBalance = (amount: number) => {
    setBalanceXLM(prev => prev + amount);
  };

  const setRealBalance = (amount: number) => {
    setBalanceXLM(amount);
  };

  const logActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = { ...activity, id: Date.now().toString() };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50

    // Streak logic
    const today = new Date().toDateString();
    if (lastActiveDate) {
      const last = new Date(lastActiveDate);
      const now = new Date(today);
      const diffTime = Math.abs(now.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        setStreak(prev => prev + 1); // Next day, increment
      } else if (diffDays > 1) {
        setStreak(1); // Missed a day, reset to 1
      }
      // If diffDays === 0, same day, do nothing to streak
    } else {
      setStreak(1); // First activity ever
    }
    setLastActiveDate(today);
  };

  const recordQuizResult = (passed: boolean) => {
    setQuizzesPlayed(prev => prev + 1);
    if (passed) setQuizzesWon(prev => prev + 1);
  };

  return (
    <GameStateContext.Provider value={{
      xp,
      rank: calculateRank(xp),
      streak,
      balanceXLM,
      activities,
      quizzesPlayed,
      quizzesWon,
      addXP,
      updateBalance,
      setRealBalance,
      logActivity,
      recordQuizResult,
      publicKey,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </GameStateContext.Provider>
  );
};
