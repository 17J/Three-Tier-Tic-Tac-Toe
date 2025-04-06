
import { useState, useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Navbar from "@/components/ui/navbar";
import GameBoard from "@/components/game/GameBoard";
import GameHistory from "@/components/game/GameHistory";
import { GameRecord } from "@/components/game/GameHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Mock data and service functions
// These would be replaced with actual API calls to Java backend
const mockUser = { id: 1, username: "player1" };
const mockGames: GameRecord[] = [
  {
    id: 1,
    date: new Date().toISOString(),
    winner: "player1",
    player1: "player1",
    player2: "CPU",
  },
];

// Mock API functions
const mockLogin = async (username: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (username === "player1" && password === "password") {
    return mockUser;
  }
  throw new Error("Invalid credentials");
};

const mockRegister = async (username: string, password: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (username === "player1") {
    throw new Error("Username already taken");
  }
  return { id: 2, username };
};

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

const Index = () => {
  const [view, setView] = useState<"login" | "register" | "game">("login");
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
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

  const handleLogin = async (username: string, password: string) => {
    try {
      const loggedInUser = await mockLogin(username, password);
      setUser(loggedInUser);
      setView("game");
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${loggedInUser.username}!`,
      });
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      const newUser = await mockRegister(username, password);
      setUser(newUser);
      setView("game");
      toast({
        title: "Registered successfully",
        description: `Welcome, ${newUser.username}!`,
      });
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    setView("login");
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
    <div className="min-h-screen flex flex-col">
      <Navbar username={user?.username || null} onLogout={handleLogout} />
      
      <main className="flex-1 container py-8">
        {!user ? (
          <div className="mt-8">
            {view === "login" ? (
              <LoginForm 
                onLogin={handleLogin} 
                onSwitchToRegister={() => setView("register")} 
              />
            ) : (
              <RegisterForm 
                onRegister={handleRegister} 
                onSwitchToLogin={() => setView("login")} 
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card className="mb-6 border-primary/50">
                <CardHeader>
                  <CardTitle className="text-center neon-glow">Tic-Tac-Toe</CardTitle>
                  <CardDescription className="text-center">
                    You are playing as X against {opponent}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GameBoard 
                    onGameEnd={handleGameEnd}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <GameHistory games={games} />
              
              <Card className="mt-6 border-accent/50">
                <CardHeader>
                  <CardTitle className="text-center text-accent">Player Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Games Played:</span>
                      <span className="font-bold">{games.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wins:</span>
                      <span className="font-bold text-primary">
                        {games.filter(g => g.winner === user.username).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Losses:</span>
                      <span className="font-bold text-secondary">
                        {games.filter(g => g.winner !== null && g.winner !== user.username).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Draws:</span>
                      <span className="font-bold">
                        {games.filter(g => g.winner === null).length}
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-secondary hover:bg-secondary/90"
                    onClick={fetchGames}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Refresh History"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
      
      <footer className="border-t border-border py-4 text-center text-muted-foreground">
        <p>Tic-Tac-Nexus Game © 2025</p>
        <p className="text-xs mt-1">
          Java backend with MySQL database | React frontend
        </p>
      </footer>
    </div>
  );
};

export default Index;
