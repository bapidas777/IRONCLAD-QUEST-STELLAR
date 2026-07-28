import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X } from 'lucide-react';

const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeWzeFKqGbhXxEJKxSbZOAO67hSfxxzzhbUm4uMyuDL5w7mEg/viewform';

export default function FeedbackButton({ hide = false }: { hide?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (hide) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 md:right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111111] border border-forge-iron rounded-xl p-5 shadow-2xl w-72 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-sm font-cinematic tracking-wider">
                Share Feedback
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-slate-400 text-xs font-mono mb-4 leading-relaxed">
              Your feedback forges a better arena. Help us improve Ironclad Quest by sharing your experience.
            </p>

            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-forge-blood hover:bg-forge-bloodLight text-white py-2.5 rounded-lg font-bold text-sm tracking-wider uppercase transition-colors shadow-forge-blood"
            >
              Open Feedback Form ↗
            </a>

            <p className="text-slate-600 text-[10px] font-mono mt-3 text-center">
              Takes less than 1 minute
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isExpanded
            ? 'bg-forge-iron border border-forge-ironLight'
            : 'bg-forge-blood hover:bg-forge-bloodLight border border-forge-blood'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {!isExpanded && (
          <motion.div
            className="absolute inset-0 rounded-full bg-forge-blood/40"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="relative z-10">
          {isExpanded ? (
            <X size={22} className="text-white" />
          ) : (
            <MessageSquarePlus size={22} className="text-white" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
