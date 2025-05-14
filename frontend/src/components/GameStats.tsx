
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameStatsProps {
  refreshTrigger: number;
}

interface Stats {
  totalGames: number;
  xWins: number;
  oWins: number;
  draws: number;
}

export default function GameStats({ refreshTrigger }: GameStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    xWins: 0,
    oWins: 0,
    draws: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we're retrieving from localStorage
    const savedStats = localStorage.getItem("gameStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, [refreshTrigger]);

  return (
    <Card className="w-full max-w-md mx-auto mt-6 border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Game Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-background/40 rounded-lg">
            <span className="text-2xl font-bold">{stats.totalGames}</span>
            <span className="text-sm text-muted-foreground">Total Games</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gaming-secondary/10 rounded-lg">
            <span className="text-2xl font-bold text-gaming-secondary">{stats.xWins}</span>
            <span className="text-sm text-muted-foreground">X Wins</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gaming-accent/10 rounded-lg">
            <span className="text-2xl font-bold text-gaming-accent">{stats.oWins}</span>
            <span className="text-sm text-muted-foreground">O Wins</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-background/40 rounded-lg">
            <span className="text-2xl font-bold">{stats.draws}</span>
            <span className="text-sm text-muted-foreground">Draws</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
