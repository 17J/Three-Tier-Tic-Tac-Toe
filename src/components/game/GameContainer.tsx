
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GameBoard from "@/components/game/GameBoard";
import GameHistory from "@/components/game/GameHistory";
import PlayerStats from "@/components/game/PlayerStats";
import { useGameContext } from "@/contexts/GameContext";

const GameContainer = () => {
  const { games, currentPlayer, setCurrentPlayer, opponent, handleGameEnd } = useGameContext();
  
  return (
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
        <PlayerStats />
      </div>
    </div>
  );
};

export default GameContainer;
