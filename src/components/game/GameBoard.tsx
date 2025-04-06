
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface GameBoardProps {
  onGameEnd: (winner: string | null) => void;
  currentPlayer: 'X' | 'O';
  setCurrentPlayer: React.Dispatch<React.SetStateAction<'X' | 'O'>>;
}

const GameBoard = ({ onGameEnd, currentPlayer, setCurrentPlayer }: GameBoardProps) => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();
  
  // Check for a winner
  const checkWinner = (board: Array<string | null>): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    
    // Check for a draw
    if (board.every(cell => cell !== null)) {
      return 'DRAW';
    }
    
    return null;
  };
  
  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    
    // Show toast with a reasonable duration to avoid stacking
    toast({
      title: `Player ${nextPlayer}'s turn`,
      duration: 1000, // Shorter duration to avoid stacking
    });
  };
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setCurrentPlayer('X');
  };

  // Check for winner after each move
  useEffect(() => {
    const winner = checkWinner(board);
    if (winner && !gameOver) {
      setGameOver(true);
      if (winner === 'DRAW') {
        toast({
          title: "Game Over",
          description: "It's a draw!",
          duration: 3000,
        });
        onGameEnd(null);
      } else {
        toast({
          title: "Game Over",
          description: `Player ${winner} wins!`,
          variant: "default",
          className: winner === 'X' ? 'bg-primary' : 'bg-secondary',
          duration: 3000,
        });
        onGameEnd(winner);
      }
    }
  }, [board, onGameEnd, toast, gameOver]);

  return (
    <div className="my-8 w-full max-w-md mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className={`px-4 py-2 rounded ${currentPlayer === 'X' ? 'bg-primary text-white animate-glow' : 'bg-muted'}`}>
          Player X
        </div>
        <div className={`px-4 py-2 rounded ${currentPlayer === 'O' ? 'bg-secondary text-white animate-glow' : 'bg-muted'}`}>
          Player O
        </div>
      </div>
      
      <div className="game-board pixel-border p-3 bg-background">
        {board.map((cell, index) => (
          <div 
            key={index}
            className={`game-cell ${cell === 'X' ? 'game-x' : cell === 'O' ? 'game-o' : ''}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      
      <Button 
        onClick={resetGame} 
        className="mt-6 mx-auto block bg-accent hover:bg-accent/90"
      >
        Reset Game
      </Button>
    </div>
  );
};

export default GameBoard;
