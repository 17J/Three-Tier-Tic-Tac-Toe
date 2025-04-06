
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import PageLayout from "@/components/layout/PageLayout";
import GameContainer from "@/components/game/GameContainer";
import { GameProvider } from "@/contexts/GameContext";
import { useToast } from "@/components/ui/use-toast";

// Mock data and service functions
// These would be replaced with actual API calls to Java backend
const mockUser = { id: 1, username: "player1" };

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

const Index = () => {
  const [view, setView] = useState<"login" | "register" | "game">("login");
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const { toast } = useToast();

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

  return (
    <PageLayout username={user?.username || null} onLogout={handleLogout}>
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
        <GameProvider user={user}>
          <GameContainer />
        </GameProvider>
      )}
    </PageLayout>
  );
};

export default Index;
