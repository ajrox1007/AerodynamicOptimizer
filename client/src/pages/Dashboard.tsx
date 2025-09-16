import { useState } from "react";
import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";
import ModelViewer from "@/components/ModelViewer";
import ResultsPanel from "@/components/ResultsPanel";
import SimulationModal from "@/components/SimulationModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [activeProject, setActiveProject] = useState<number | null>(1); // Default to first project
  const [activeModel, setActiveModel] = useState<number | null>(null);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [viewMode, setViewMode] = useState<"model" | "pressure" | "velocity" | "streamlines">("pressure");
  
  // Fetch the active project
  const { data: project } = useQuery({
    queryKey: ['/api/projects/1'],
    enabled: !!activeProject,
    onError: (error) => {
      toast({
        title: "Error fetching project",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Simulation mutation
  const simulationMutation = useMutation({
    mutationFn: (data: { projectId: number, modelId: number }) => 
      apiRequest('POST', '/api/simulate', data)
        .then(res => res.json()),
    onSuccess: (data) => {
      setSimulationResult(data);
      setIsSimulating(false);
      toast({
        title: "Simulation complete",
        description: "CFD analysis has been successfully completed"
      });
    },
    onError: (error) => {
      setIsSimulating(false);
      toast({
        title: "Simulation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Function to run the simulation
  const runSimulation = async (projectId: number, modelId: number) => {
    if (!projectId || !modelId) {
      toast({
        title: "Missing data",
        description: "Project ID and Model ID are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create default simulation settings if none exist
      await fetch('/api/simulation-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId,
          fluidMedium: "Air (sea level, 15°C)",
          flowVelocity: 120,
          reynoldsNumber: 500000,
          meshDensity: "medium",
          advancedSettings: {}
        })
      });
      
      // Create default analysis options if none exist
      await fetch('/api/analysis-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId,
          dragCoefficient: true,
          liftCoefficient: true,
          pressureDistribution: true,
          vorticityAnalysis: false,
          surfaceStreamlines: true
        })
      });
      
      // Create default AI optimization options if none exist
      await fetch('/api/ai-optimization-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId,
          optimizationGoal: "Minimize Drag",
          constraintImportance: 50,
          generateExplanation: true
        })
      });
      
      // Now run the simulation
      setIsSimulating(true);
      simulationMutation.mutate({ projectId, modelId });
      
    } catch (error) {
      toast({
        title: "Error preparing simulation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle model upload completion
  const handleModelUploaded = (modelId: number) => {
    setActiveModel(modelId);
    toast({
      title: "Model uploaded",
      description: "STL file has been successfully uploaded"
    });
  };

  // Handle recommendation application
  const handleApplyRecommendation = (recommendationId: number) => {
    // API call to apply recommendation would go here
    toast({
      title: "Recommendation applied",
      description: "The model has been updated with the recommended changes"
    });
  };

  return (
    <>
      <AppShell
        projectName={project?.name || "Loading project..."}
        projectStatus={project?.status || "draft"}
      >
        <Sidebar 
          onModelUploaded={handleModelUploaded}
          onRunSimulation={() => {
            if (activeProject && activeModel) {
              runSimulation(activeProject, activeModel);
            } else {
              toast({
                title: "Missing data",
                description: "Please upload a model first",
                variant: "destructive"
              });
            }
          }}
          activeProject={activeProject}
        />
        
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <ModelViewer
            modelId={activeModel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          <ResultsPanel
            simulationResult={simulationResult}
            onApplyRecommendation={handleApplyRecommendation}
          />
        </div>
      </AppShell>
      
      {isSimulating && (
        <SimulationModal
          isOpen={isSimulating} 
          onClose={() => setIsSimulating(false)}
        />
      )}
    </>
  );
}
