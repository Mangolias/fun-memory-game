import { motion } from 'motion/react';
import { GameCard } from './GameCard';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameBoardProps {
  cards: Card[];
  onCardClick: (id: number) => void;
  disabled: boolean;
  gridSize: number;
}

export function GameBoard({ cards, onCardClick, disabled, gridSize }: GameBoardProps) {
  const getGridCols = () => {
    if (gridSize === 4) return 'grid-cols-4';
    if (gridSize === 6) return 'grid-cols-6';
    return 'grid-cols-4';
  };

  return (
    <motion.div 
      className={`grid ${getGridCols()} gap-3 max-w-lg mx-auto p-4`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {cards.map((card) => (
        <GameCard
          key={card.id}
          card={card}
          onCardClick={onCardClick}
          disabled={disabled}
        />
      ))}
    </motion.div>
  );
}