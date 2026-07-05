import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../context/GameState';
import { User, Crown, TrendingDown, TrendingUp, Minus } from 'lucide-react';

type Hero = {
  address: string;
  name: string;
  score: number;
  avatarUrl?: string;
  trend?: 'up' | 'down' | 'flat';
  trendVal?: number;
  isCurrentUser?: boolean;
};

const dummyHeroes: Hero[] = [
  { address: 'GDDW...8812', name: 'The_Architect', score: 12850, avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtPuDtHwdH96RrGQCGMxFoEUjbC1tu4rboKyfL0niOKMRvEXI854cByumi7D1yRBQxp0SgVv161q8hCVJt-qVpBqhShwjTqVeDlW1kAzX0eiasXWlDeb2yoS42b4lKwa4GrGCiD-EvDVZm7RIXVWxij165kwQJ0AFiXLW1cJwLj4NPNUFdOn2NJB3-aq7bkHtPZyiq2bqBMNYa-wFxzVG55e8fXtEGaA5HM4Ma9weqWWywCko7gd6j4g' },
  { address: 'GBAJ...3K19', name: 'Ser_Quizalot', score: 9420, avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiMWt3ssuVaHbdh09CWpxWivfomLJa0RtKh4BHlkXk43uo-sTXsCOAiTXtIB2Fpur_SFVMv7bRJ69nM9xqKjbT0N9dXkE0uSUUoLfkic4LcQB5eYRfYLWg-_93o0SV2WvfMvwrHOPN105iuIoIRcFRPk7dcrzuoRQWEoUWSz5QQiVkK7ARrb6xHdWYX3NEeudtWjGRjedvB7tV9p4CFqD8OOLrY7bKJyL2PiZpTAw5eKWAaBHuY7Bz-g' },
  { address: 'GBQQ...1M90', name: 'IronMind_99', score: 8100, avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Z1DvhQ35bzoTibqg2vteNt0HWsWFfLS3GN7th_VGLFZ816TR8SYItdIx4StUNzgu8HT47D0p_zCeAX-n9TAvLWta1knVwPDfjbIyRbtJk3--3JfC4ak_viSgJ6azmoTUE7lNuJaV4oTcKkrJY2PFSOnOMtNOn2AjyyAGk4RzPD6TY92RnZ_gYI9_nE8pPhVLI8thOfxfwlY74OGkGo47tXWxcjOOpqvsiWiQZlWVKsIJS_U6Us3-tQ' },
  { address: 'GCPF...L4QQ', name: 'VoidWalker', score: 7890, trend: 'down', trendVal: 2 },
  { address: 'GD8A...Z919', name: 'RogueNode', score: 3410, trend: 'flat', trendVal: 0 },
  { address: 'RDND...9911', name: 'RandomDev', score: 90, trend: 'flat', trendVal: 0 },
  { address: 'GXYZ...2233', name: 'CryptoNoob', score: 45, trend: 'down', trendVal: 1 },
];

export default function HallOfHeroes() {
  const { publicKey, xp } = useGameState();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const allHeroes = useMemo(() => {
    const list = [...dummyHeroes];
    if (publicKey) {
      list.push({
        address: publicKey,
        name: `You (${publicKey.slice(0, 4)}...${publicKey.slice(-4)})`,
        score: xp,
        trend: 'up',
        trendVal: 1,
        isCurrentUser: true
      });
    }
    return list.sort((a, b) => b.score - a.score);
  }, [publicKey, xp]);

  const first = allHeroes[0];
  const second = allHeroes[1];
  const third = allHeroes[2];
  const rest = allHeroes.slice(3);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col pt-8 pb-32">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-cinematic font-bold text-white tracking-tight mb-2 uppercase drop-shadow-[0_4px_12px_rgba(153,27,27,0.5)]">
          Global Ranking
        </h2>
        <p className="text-slate-400 font-mono text-sm md:text-base">Forged in the fires of knowledge.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full flex flex-col gap-12 mt-8"
      >
        {/* Podium Section */}
        <div className="flex items-end justify-center gap-2 md:gap-4 h-64 md:h-72 px-4 mt-8">
          {/* Rank 2 */}
          <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 relative z-10">
            <div className="mb-4 text-center w-full">
              {second?.avatarUrl ? (
                <img className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-400 object-cover mb-2 mx-auto" src={second.avatarUrl} alt="Rank 2 Avatar" />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-slate-400 bg-forge-iron flex items-center justify-center mb-2 mx-auto"><User className="text-slate-400" /></div>
              )}
              <span className="font-mono text-xs md:text-sm text-slate-200 block truncate w-full px-1">{second?.name}</span>
              <span className="font-mono text-[10px] md:text-xs text-slate-400">{second?.score.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-32 md:h-40 bg-forge-iron/40 border border-forge-iron border-t-[3px] border-t-slate-400 flex justify-center items-start pt-4 relative overflow-hidden rounded-t shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-400/10 to-transparent"></div>
              <span className="font-cinematic text-3xl text-slate-400 relative z-10 drop-shadow-md">2</span>
            </div>
          </motion.div>

          {/* Rank 1 */}
          <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 relative z-20 -translate-y-4 md:-translate-y-8">
            <div className="mb-4 text-center w-full">
              <div className="relative inline-block">
                {first?.avatarUrl ? (
                  <img className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-forge-copperGlow object-cover mx-auto shadow-[0_0_15px_rgba(205,127,50,0.4)]" src={first.avatarUrl} alt="Rank 1 Avatar" />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-forge-copperGlow bg-forge-iron flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(205,127,50,0.4)]"><User className="text-forge-copperGlow" /></div>
                )}
                <Crown className="absolute -top-4 -right-3 text-forge-copperGlow drop-shadow-[0_0_8px_rgba(205,127,50,0.8)]" size={28} />
              </div>
              <span className="font-mono text-sm md:text-base text-forge-copperGlow block truncate w-full px-1 mt-2 font-bold">{first?.name}</span>
              <span className="font-mono text-xs md:text-sm text-slate-300">{first?.score.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-40 md:h-52 bg-forge-iron/50 border border-forge-iron border-t-[3px] border-t-forge-copperGlow flex justify-center items-start pt-4 relative overflow-hidden rounded-t shadow-[inset_0_4px_30px_rgba(205,127,50,0.15)] backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-b from-forge-copperGlow/15 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-forge-copperGlow shadow-[0_0_10px_rgba(205,127,50,0.8)] blur-[2px]"></div>
              <span className="font-cinematic text-5xl text-forge-copperGlow relative z-10 drop-shadow-lg">1</span>
            </div>
          </motion.div>

          {/* Rank 3 */}
          <motion.div variants={itemVariants} className="flex flex-col items-center w-1/3 relative z-10">
            <div className="mb-4 text-center w-full">
              {third?.avatarUrl ? (
                <img className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-forge-rust object-cover mb-2 mx-auto" src={third.avatarUrl} alt="Rank 3 Avatar" />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-forge-rust bg-forge-iron flex items-center justify-center mb-2 mx-auto"><User className="text-forge-rust" /></div>
              )}
              <span className="font-mono text-xs md:text-sm text-slate-200 block truncate w-full px-1">{third?.name}</span>
              <span className="font-mono text-[10px] md:text-xs text-slate-400">{third?.score.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-24 md:h-32 bg-forge-iron/40 border border-forge-iron border-t-[3px] border-t-forge-rust flex justify-center items-start pt-4 relative overflow-hidden rounded-t shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-b from-forge-rust/10 to-transparent"></div>
              <span className="font-cinematic text-3xl text-forge-rust relative z-10 drop-shadow-md">3</span>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard List */}
        <motion.div variants={itemVariants} className="bg-forge-abyssal border border-forge-iron rounded overflow-hidden shadow-2xl relative">
          <div className="h-1 w-full bg-forge-copperGlow"></div>
          <div className="flex flex-col">
            {rest.map((hero, index) => {
              const rank = index + 4;
              
              if (hero.isCurrentUser) {
                return (
                  <div key={hero.address} className="flex items-center justify-between p-4 bg-[#1a1111] border-l-4 border-l-forge-bloodLight relative shadow-[0_0_15px_rgba(153,27,27,0.2)] my-1 border-y border-[#1f1f1f]">
                    <div className="absolute inset-0 bg-gradient-to-r from-forge-bloodLight/10 to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-4 relative z-10">
                      <span className="font-mono text-sm text-forge-bloodLight w-8 text-center font-bold">{rank}</span>
                      <div className="w-10 h-10 rounded-full bg-forge-iron/30 flex items-center justify-center border border-forge-bloodLight overflow-hidden">
                        <User className="text-forge-bloodLight" size={20} />
                      </div>
                      <span className="font-mono text-sm text-white font-bold">{hero.name}</span>
                    </div>
                    <div className="text-right relative z-10">
                      <span className="font-mono text-sm text-forge-bloodLight block font-bold">{hero.score.toLocaleString()} XP</span>
                      {hero.trend === 'up' && <span className="font-mono text-[10px] text-forge-copperGlow flex items-center justify-end"><TrendingUp size={12} className="mr-1"/> {hero.trendVal}</span>}
                    </div>
                  </div>
                );
              }

              return (
                <div key={hero.address} className="flex items-center justify-between p-4 border-b border-[#1f1f1f] hover:bg-forge-iron/20 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-slate-500 w-8 text-center group-hover:text-forge-copperGlow transition-colors">{rank}</span>
                    <div className="w-10 h-10 rounded-full bg-forge-iron/30 flex items-center justify-center border border-forge-iron overflow-hidden">
                      <User className="text-slate-500" size={20} />
                    </div>
                    <span className="font-mono text-sm text-slate-200">{hero.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm text-slate-200 block">{hero.score.toLocaleString()} XP</span>
                    {hero.trend === 'down' && <span className="font-mono text-[10px] text-forge-bloodLight flex items-center justify-end"><TrendingDown size={12} className="mr-1"/> {hero.trendVal}</span>}
                    {hero.trend === 'up' && <span className="font-mono text-[10px] text-emerald-400 flex items-center justify-end"><TrendingUp size={12} className="mr-1"/> {hero.trendVal}</span>}
                    {hero.trend === 'flat' && <span className="font-mono text-[10px] text-slate-500 flex items-center justify-end"><Minus size={12} className="mr-1"/> {hero.trendVal}</span>}
                  </div>
                </div>
              );
            })}

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
