import { useState } from "react";
import { Fan, Menu, Settings, RotateCcw, Grid3X3, Axis3d, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface AppShellProps {
  children: React.ReactNode;
  projectName: string;
  projectStatus: string;
}

export default function AppShell({ children, projectName, projectStatus }: AppShellProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Fan className="text-primary text-3xl" />
          <h1 className="text-xl font-semibold text-white">AeroDynamiX</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-white font-medium">Dashboard</a>
          <a href="#" className="text-gray-400 hover:text-white">Projects</a>
          <a href="#" className="text-gray-400 hover:text-white">Documentation</a>
          <a href="#" className="text-gray-400 hover:text-white">Support</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button className="bg-primary hover:bg-blue-600 text-white flex items-center">
            <span className="mr-1 text-sm">+</span>
            New Project
          </Button>
          <Avatar className="w-8 h-8 bg-gray-700">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {children}
      </main>
      
      {/* Status Bar */}
      <div className="border-t border-dark-border bg-dark-surface px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>Vertices: 12,458</div>
          <div>Faces: 24,136</div>
          <div>Solver: OpenFOAM v2105</div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>Mesh Quality: 98.2%</div>
          <div>Last Updated: 2 min ago</div>
          <div className="flex items-center text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
            Ready
          </div>
        </div>
      </div>
    </div>
  );
}
