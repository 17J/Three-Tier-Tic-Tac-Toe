
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";

const PlayerStats = () => {
  const { games, isLoading, fetchGames, user } = useGameContext();
  
  if (!user) return null;
  
  return (
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
  );
};

export default PlayerStats;
