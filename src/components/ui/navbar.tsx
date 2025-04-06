
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  username: string | null;
  onLogout: () => void;
}

const Navbar = ({ username, onLogout }: NavbarProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <nav className="border-b border-border py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-pixel text-primary">TIC-TAC-NEXUS</h1>
      </div>
      
      {username ? (
        <div className="flex items-center space-x-4">
          <p className="text-muted-foreground">
            Welcome, <span className="text-secondary font-semibold">{username}</span>
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground">Please log in to play</p>
      )}
    </nav>
  );
};

export default Navbar;
