
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface GameRecord {
  id: number;
  date: string;
  winner: string | null;
  player1: string;
  player2: string;
}

interface GameHistoryProps {
  games: GameRecord[];
}

const GameHistory = ({ games }: GameHistoryProps) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto border border-muted">
      <CardHeader>
        <CardTitle className="text-center text-xl">Game History</CardTitle>
      </CardHeader>
      <CardContent>
        {games.length === 0 ? (
          <p className="text-center text-muted-foreground">No games played yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{formatDate(game.date)}</TableCell>
                  <TableCell>{game.player1} vs {game.player2}</TableCell>
                  <TableCell>
                    {game.winner === null 
                      ? <span className="text-muted-foreground">Draw</span>
                      : game.winner === game.player1 
                        ? <span className="text-primary">{game.player1} won</span>
                        : <span className="text-secondary">{game.player2} won</span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistory;
