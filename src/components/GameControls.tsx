import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameControlsProps {
  score: {
    moves: number;
    matches: number;
    totalPairs: number;
    timeElapsed: number;
  };
  onNewGame: () => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  difficulty: 'easy' | 'medium' | 'hard';
  gameWon: boolean;
}

export function GameControls({ 
  score, 
  onNewGame, 
  onDifficultyChange, 
  difficulty, 
  gameWon 
}: GameControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === difficulty) {
      switch (diff) {
        case 'easy': return 'bg-green-500 text-white';
        case 'medium': return 'bg-yellow-500 text-white';
        case 'hard': return 'bg-red-500 text-white';
        default: return 'bg-gray-200';
      }
    }
    return 'bg-gray-200 hover:bg-gray-300';
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Memory Match
        </h1>
        <p className="text-muted-foreground">Find all the matching pairs!</p>
      </motion.div>

      {/* Score Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score.moves}</div>
            <div className="text-sm text-gray-600">Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {score.matches}/{score.totalPairs}
            </div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(score.timeElapsed)}
            </div>
            <div className="text-sm text-gray-600">Time</div>
          </div>
        </div>
      </Card>

      {/* Difficulty Buttons */}
      <div className="flex gap-2 justify-center">
        {(['easy', 'medium', 'hard'] as const).map((diff) => (
          <Button
            key={diff}
            variant="secondary"
            size="sm"
            className={getDifficultyColor(diff)}
            onClick={() => onDifficultyChange(diff)}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </Button>
        ))}
      </div>

      {/* New Game Button */}
      <div className="text-center">
        <Button 
          onClick={onNewGame}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-2 rounded-full"
        >
          New Game
        </Button>
      </div>

      {/* Win Message */}
      {gameWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl text-white"
        >
          <div className="text-2xl font-bold">🎉 Congratulations! 🎉</div>
          <div>You completed the game in {score.moves} moves!</div>
          <div>Time: {formatTime(score.timeElapsed)}</div>
        </motion.div>
      )}
    </div>
  );
}