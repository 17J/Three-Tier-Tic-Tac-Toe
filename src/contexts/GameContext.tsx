
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GameRecord } from "@/components/game/GameHistory";
import { useToast } from "@/components/ui/use-toast";

// Mock API functions
const mockSaveGame = async (winner: string | null, player1: string, player2: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: Math.floor(Math.random() * 1000),
    date: new Date().toISOString(),
    winner,
    player1,
    player2,
  };
};

const mockGetGames = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockGames;
};

// Mock data
const mockGames: GameRecord[] = [
  {
    id: 1,
    date: new Date().toISOString(),
    winner: "player1",
    player1: "player1",
    player2: "CPU",
  },
];

type GameContextType = {
  games: GameRecord[];
  isLoading: boolean;
  fetchGames: () => Promise<void>;
  currentPlayer: 'X' | 'O';
  setCurrentPlayer: React.Dispatch<React.SetStateAction<'X' | 'O'>>;
  opponent: string;
  setOpponent: React.Dispatch<React.SetStateAction<string>>;
  handleGameEnd: (winner: string | null) => Promise<void>;
  user: { id: number; username: string } | null;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children, user }: { children: ReactNode, user: { id: number; username: string } | null }) => {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [opponent, setOpponent] = useState<string>("CPU");
  const { toast } = useToast();

  // Fetch game history when user logs in
  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const fetchGames = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const gameHistory = await mockGetGames();
      setGames(gameHistory);
    } catch (error) {
      toast({
        title: "Failed to load game history",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameEnd = async (winner: string | null) => {
    if (!user) return;
    
    try {
      const player1 = user.username;
      const player2 = opponent;
      
      const winnerName = winner === 'X' 
        ? player1  // User is always X in this simple version
        : winner === 'O' 
          ? player2
          : null;
      
      const newGame = await mockSaveGame(winnerName, player1, player2);
      setGames(prev => [newGame, ...prev]);
      
    } catch (error) {
      toast({
        title: "Failed to save game",
        description: "The game result might not be recorded",
        variant: "destructive",
      });
    }
  };

  return (
    <GameContext.Provider value={{ 
      games, 
      isLoading, 
      fetchGames, 
      currentPlayer, 
      setCurrentPlayer, 
      opponent, 
      setOpponent,
      handleGameEnd,
      user
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
