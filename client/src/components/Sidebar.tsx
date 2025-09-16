import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Save } from "lucide-react";
import FileUploader from "./FileUploader";
import SimulationSettings from "./SimulationSettings";
import AnalysisOptions from "./AnalysisOptions";
import AIOptimizationOptions from "./AIOptimizationOptions";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  onModelUploaded: (modelId: number) => void;
  onRunSimulation: () => void;
  activeProject: number | null;
}

export default function Sidebar({ onModelUploaded, onRunSimulation, activeProject }: SidebarProps) {
  const { toast } = useToast();
  const [fluidMedium, setFluidMedium] = useState("Air (sea level, 15°C)");
  const [flowVelocity, setFlowVelocity] = useState(120);
  const [reynoldsNumber, setReynoldsNumber] = useState(500000);
  const [meshDensity, setMeshDensity] = useState<"low" | "medium" | "high">("medium");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const [analysisOptions, setAnalysisOptions] = useState({
    dragCoefficient: true,
    liftCoefficient: true,
    pressureDistribution: true,
    vorticityAnalysis: false,
    surfaceStreamlines: true
  });
  
  const [optimizationGoal, setOptimizationGoal] = useState("Minimize Drag");
  const [constraintImportance, setConstraintImportance] = useState(50);
  const [generateExplanation, setGenerateExplanation] = useState(true);
  
  // Save simulation settings to the server
  const saveSimulationSettings = async () => {
    if (!activeProject) {
      toast({
        title: "Error",
        description: "No active project selected",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Save simulation settings
      await fetch('/api/simulation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject,
          fluidMedium,
          flowVelocity,
          reynoldsNumber,
          meshDensity,
          advancedSettings: {}
        })
      });
      
      // Save analysis options
      await fetch('/api/analysis-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject,
          ...analysisOptions
        })
      });
      
      // Save AI optimization options
      await fetch('/api/ai-optimization-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject,
          optimizationGoal,
          constraintImportance,
          generateExplanation
        })
      });
      
      toast({
        title: "Settings saved",
        description: "Your simulation settings have been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <aside className="w-64 border-r border-dark-border bg-dark-surface flex-shrink-0 flex flex-col overflow-hidden hidden md:flex">
      <div className="p-4 border-b border-dark-border">
        <h2 className="font-semibold">Project Settings</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* File Upload Section */}
        <FileUploader 
          onModelUploaded={onModelUploaded} 
          projectId={activeProject} 
        />
        
        {/* Simulation Settings */}
        <SimulationSettings 
          fluidMedium={fluidMedium}
          setFluidMedium={setFluidMedium}
          flowVelocity={flowVelocity}
          setFlowVelocity={setFlowVelocity}
          reynoldsNumber={reynoldsNumber}
          setReynoldsNumber={setReynoldsNumber}
          meshDensity={meshDensity}
          setMeshDensity={setMeshDensity}
          showAdvancedSettings={showAdvancedSettings}
          setShowAdvancedSettings={setShowAdvancedSettings}
        />
        
        {/* Analysis Options */}
        <AnalysisOptions 
          options={analysisOptions}
          setOptions={setAnalysisOptions}
        />
        
        {/* AI Optimization */}
        <AIOptimizationOptions 
          optimizationGoal={optimizationGoal}
          setOptimizationGoal={setOptimizationGoal}
          constraintImportance={constraintImportance}
          setConstraintImportance={setConstraintImportance}
          generateExplanation={generateExplanation}
          setGenerateExplanation={setGenerateExplanation}
        />
      </div>
      
      <div className="p-4 border-t border-dark-border space-y-3">
        <Button 
          className="w-full bg-primary hover:bg-blue-600 text-white"
          onClick={onRunSimulation}
        >
          <Play className="mr-1 h-4 w-4" />
          Run Simulation
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-dark-border hover:border-gray-500 text-gray-300"
          onClick={saveSimulationSettings}
        >
          Save Settings
        </Button>
      </div>
    </aside>
  );
}
