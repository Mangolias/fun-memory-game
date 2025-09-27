import { motion } from 'motion/react';

interface GameCardProps {
  card: {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
  };
  onCardClick: (id: number) => void;
  disabled: boolean;
}

export function GameCard({ card, onCardClick, disabled }: GameCardProps) {
  return (
    <motion.div
      className="relative w-full aspect-square cursor-pointer"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => !disabled && !card.isFlipped && !card.isMatched && onCardClick(card.id)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg backface-hidden"
          style={{ transform: 'rotateY(0deg)' }}
        >
          <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
            <span className="text-white">?</span>
          </div>
        </div>
        
        {/* Card Front */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-xl flex items-center justify-center shadow-lg backface-hidden ${
            card.isMatched 
              ? 'bg-gradient-to-br from-green-400 to-emerald-400' 
              : 'bg-gradient-to-br from-yellow-400 to-orange-400'
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-4xl">{card.emoji}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}