
import Navbar from "@/components/ui/navbar";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  username: string | null;
  onLogout: () => void;
}

const PageLayout = ({ children, username, onLogout }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username} onLogout={onLogout} />
      
      <main className="flex-1 container py-8">
        {children}
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

export default PageLayout;
