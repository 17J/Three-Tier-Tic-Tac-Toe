
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NavBarProps {
  onLogout: () => void;
  user: { email: string; username?: string } | null;
}

export default function NavBar({ onLogout, user }: NavBarProps) {
  const { toast } = useToast();
  
  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-primary glow-text">
          Gamerzo
          <span className="text-gaming-neon dark:animate-pulse-neon">.</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <p className="text-sm text-muted-foreground hidden md:block">
            Hello, <span className="font-medium text-foreground">{user.username || user.email}</span>
          </p>
        )}
        <ThemeToggle />
        {user && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </nav>
  );
}
