
import { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import NavBar from "@/components/NavBar";
import GameStats from "@/components/GameStats";
import { Button } from "@/components/ui/button";

type AuthView = "login" | "register";
type Player = "X" | "O" | null;
type GameResult = Player | "draw";

const Index = () => {
  const [user, setUser] = useState<{ email: string; username?: string } | null>(null);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [statsRefresh, setStatsRefresh] = useState(0);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleGameEnd = (winner: GameResult) => {
    // Save game stats to localStorage
    const savedStats = localStorage.getItem("gameStats");
    const stats = savedStats
      ? JSON.parse(savedStats)
      : { totalGames: 0, xWins: 0, oWins: 0, draws: 0 };
    
    stats.totalGames += 1;
    
    if (winner === "X") {
      stats.xWins += 1;
    } else if (winner === "O") {
      stats.oWins += 1;
    } else {
      stats.draws += 1;
    }
    
    localStorage.setItem("gameStats", JSON.stringify(stats));
    setStatsRefresh(prev => prev + 1);
  };

  const handleLogin = () => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <NavBar onLogout={handleLogout} user={user} />
      
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        {!user ? (
          <div className="w-full max-w-md px-4 py-8">
            {authView === "login" ? (
              <LoginForm 
                onSuccess={handleLogin} 
                onSwitchToRegister={() => setAuthView("register")}
              />
            ) : (
              <RegisterForm 
                onSuccess={handleLogin} 
                onSwitchToLogin={() => setAuthView("login")}
              />
            )}
          </div>
        ) : (
          <div className="w-full max-w-4xl px-4 py-8 flex flex-col items-center">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Tic-Tac-Toe
              </h2>
              <p className="text-muted-foreground">
                The classic game with a modern twist. Make your move!
              </p>
            </div>
            
            <GameBoard onGameEnd={handleGameEnd} />
            <GameStats refreshTrigger={statsRefresh} />
          </div>
        )}
      </main>
      
      <footer className="py-4 px-6 border-t border-border/40 bg-background/80 backdrop-blur-sm text-center text-sm text-muted-foreground">
        <p>© 2025 Gamerzo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
