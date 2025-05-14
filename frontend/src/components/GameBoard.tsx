
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, Circle } from "lucide-react";

type Player = "X" | "O" | null;
type GameResult = Player | "draw";
type BoardState = (Player)[];

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

interface GameBoardProps {
  onGameEnd: (winner: GameResult) => void;
}

export default function GameBoard({ onGameEnd }: GameBoardProps) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<GameResult>(null);
  const [gameOver, setGameOver] = useState(false);
  const { toast } = useToast();

  // Fix the infinite loop bug by only calling onGameEnd once when the winner is determined
  useEffect(() => {
    if (winner && !gameOver) {
      setGameOver(true);
      onGameEnd(winner);
      toast({
        title: `Game Over!`,
        description: winner === "draw" ? "It's a draw!" : `Player ${winner} wins!`,
        duration: 5000,
      });
    }
  }, [winner, onGameEnd, toast, gameOver]);

  const checkWinner = (boardState: BoardState): GameResult => {
    // Check for winning combinations
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a];
      }
    }

    // Check for draw
    if (boardState.every((cell) => cell !== null)) {
      return "draw";
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    setGameOver(false);
  };

  const renderCell = (index: number) => {
    return (
      <div
        key={index}
        className={`game-cell h-24 w-24 ${board[index]?.toLowerCase()}`}
        onClick={() => handleClick(index)}
      >
        {board[index] === "X" && <X className="h-12 w-12 text-gaming-secondary" />}
        {board[index] === "O" && <Circle className="h-12 w-12 text-gaming-accent" />}
      </div>
    );
  };

  return (
    <div className="game-board max-w-md w-full mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Current Player: 
          <span className={currentPlayer === "X" ? "text-gaming-secondary ml-2" : "text-gaming-accent ml-2"}>
            {currentPlayer}
          </span>
        </p>
        <Button onClick={resetGame} variant="outline" size="sm">
          Reset
        </Button>
      </div>

      <div className="board-grid bg-muted/50 backdrop-blur-sm p-2 shadow-md rounded-xl">
        {Array(9)
          .fill(null)
          .map((_, index) => renderCell(index))}
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          {winner === "draw" ? (
            <p className="text-xl font-bold">It's a draw!</p>
          ) : (
            <p className="text-xl font-bold">
              Player{" "}
              <span className={winner === "X" ? "text-gaming-secondary" : "text-gaming-accent"}>
                {winner}
              </span>{" "}
              wins!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
