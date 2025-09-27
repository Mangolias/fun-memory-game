import { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const EMOJI_SETS = [
  '😀', '😂', '🥰', '😎', '🤩', '😍', '🤯', '😜', '🥳', '😇',
  '🌟', '💫', '⭐', '🌈', '🎉', '🎊', '🎈', '🎁', '🎀', '💎',
  '🚀', '🎯', '🎨', '🎪', '🎭', '🎬', '🎮', '🎲', '🎸', '🎺'
];

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState({
    moves: 0,
    matches: 0,
    totalPairs: 0,
    timeElapsed: 0
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const getDifficultySettings = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return { pairs: 8, gridSize: 4 };
      case 'medium': return { pairs: 18, gridSize: 6 };
      case 'hard': return { pairs: 32, gridSize: 8 };
      default: return { pairs: 8, gridSize: 4 };
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = useCallback(() => {
    const { pairs, gridSize } = getDifficultySettings(difficulty);
    const selectedEmojis = shuffleArray(EMOJI_SETS).slice(0, pairs);
    const gameCards = shuffleArray([
      ...selectedEmojis.map((emoji, index) => ({
        id: index * 2,
        emoji,
        isFlipped: false,
        isMatched: false
      })),
      ...selectedEmojis.map((emoji, index) => ({
        id: index * 2 + 1,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
    ]);

    setCards(gameCards);
    setFlippedCards([]);
    setScore({
      moves: 0,
      matches: 0,
      totalPairs: pairs,
      timeElapsed: 0
    });
    setGameStarted(false);
    setGameWon(false);
    setDisabled(false);
  }, [difficulty]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (flippedCards.length === 2) return;

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setDisabled(true);
      setScore(prev => ({ ...prev, moves: prev.moves + 1 }));

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          setScore(prev => ({ ...prev, matches: prev.matches + 1 }));
          setFlippedCards([]);
          setDisabled(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const handleNewGame = () => {
    initializeGame();
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setScore(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameWon]);

  // Check for game completion
  useEffect(() => {
    if (score.matches === score.totalPairs && score.totalPairs > 0) {
      setGameWon(true);
      setGameStarted(false);
    }
  }, [score.matches, score.totalPairs]);

  // Initialize game on difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const { gridSize } = getDifficultySettings(difficulty);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <GameControls
          score={score}
          onNewGame={handleNewGame}
          onDifficultyChange={handleDifficultyChange}
          difficulty={difficulty}
          gameWon={gameWon}
        />
        
        <GameBoard
          cards={cards}
          onCardClick={handleCardClick}
          disabled={disabled}
          gridSize={gridSize}
        />
      </div>
    </div>
  );
}