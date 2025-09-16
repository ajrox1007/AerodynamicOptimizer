import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimulationModal({ isOpen, onClose }: SimulationModalProps) {
  const [meshProgress, setMeshProgress] = useState(0);
  const [cfdProgress, setCfdProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  
  const [meshStatus, setMeshStatus] = useState<"waiting" | "running" | "complete">("waiting");
  const [cfdStatus, setCfdStatus] = useState<"waiting" | "running" | "complete">("waiting");
  const [aiStatus, setAiStatus] = useState<"waiting" | "running" | "complete">("waiting");
  const [optimizationStatus, setOptimizationStatus] = useState<"waiting" | "running" | "complete">("waiting");
  
  // Simulate progress updates for demo purposes
  useEffect(() => {
    if (!isOpen) return;
    
    // Mesh generation
    setMeshStatus("running");
    const meshInterval = setInterval(() => {
      setMeshProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(meshInterval);
          setMeshStatus("complete");
          setCfdStatus("running");
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);
    
    // CFD simulation
    setTimeout(() => {
      const cfdInterval = setInterval(() => {
        setMeshProgress(100);
        setMeshStatus("complete");
        setCfdStatus("running");
        
        setRemainingProgress(cfdInterval, setAiStatus, setCfdStatus, setAiProgress, setCfdProgress, "cfd");
      }, 500);
    }, 2000);
    
    // AI analysis
    setTimeout(() => {
      const aiInterval = setInterval(() => {
        setCfdProgress(100);
        setCfdStatus("complete");
        setAiStatus("running");
        
        setRemainingProgress(aiInterval, setOptimizationStatus, setAiStatus, setOptimizationProgress, setAiProgress, "ai");
      }, 500);
    }, 6000);
    
    // Optimization generation
    setTimeout(() => {
      const optimizationInterval = setInterval(() => {
        setAiProgress(100);
        setAiStatus("complete");
        setOptimizationStatus("running");
        
        setOptimizationProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(optimizationInterval);
            setOptimizationStatus("complete");
            return 100;
          }
          return prevProgress + 5;
        });
      }, 300);
    }, 8000);
    
    return () => {
      clearInterval(meshInterval);
    };
  }, [isOpen]);
  
  const setRemainingProgress = (
    interval: ReturnType<typeof setInterval>,
    nextStatusSetter: (status: "waiting" | "running" | "complete") => void,
    currentStatusSetter: (status: "waiting" | "running" | "complete") => void,
    nextProgressSetter: (value: React.SetStateAction<number>) => void, 
    currentProgressSetter: (value: React.SetStateAction<number>) => void,
    type: string
  ) => {
    currentProgressSetter(prevProgress => {
      if (prevProgress >= 100) {
        clearInterval(interval);
        currentStatusSetter("complete");
        nextStatusSetter("running");
        return 100;
      }
      
      // Different simulation steps have different progress speeds
      const increment = type === "cfd" ? 2 : 8;
      return prevProgress + increment;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-surface border-dark-border sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Simulation in Progress</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Preparing Mesh</span>
              <span className={meshStatus === "complete" ? "text-green-400" : ""}>
                {meshStatus === "complete" ? "Complete" : `${meshProgress}%`}
              </span>
            </div>
            <Progress 
              value={meshProgress} 
              className={`h-2 ${meshStatus === "complete" ? "bg-green-500" : ""}`} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running CFD Simulation</span>
              <span className={cfdStatus === "complete" ? "text-green-400" : cfdStatus === "waiting" ? "text-gray-400" : ""}>
                {cfdStatus === "complete" ? "Complete" : cfdStatus === "waiting" ? "Waiting" : `${cfdProgress}%`}
              </span>
            </div>
            <Progress 
              value={cfdProgress} 
              className={`h-2 ${cfdStatus === "complete" ? "bg-green-500" : ""}`} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Analysis</span>
              <span className={aiStatus === "complete" ? "text-green-400" : aiStatus === "waiting" ? "text-gray-400" : ""}>
                {aiStatus === "complete" ? "Complete" : aiStatus === "waiting" ? "Waiting" : `${aiProgress}%`}
              </span>
            </div>
            <Progress 
              value={aiProgress} 
              className={`h-2 ${aiStatus === "complete" ? "bg-green-500" : ""}`} 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Generating Optimizations</span>
              <span className={optimizationStatus === "complete" ? "text-green-400" : optimizationStatus === "waiting" ? "text-gray-400" : ""}>
                {optimizationStatus === "complete" ? "Complete" : optimizationStatus === "waiting" ? "Waiting" : `${optimizationProgress}%`}
              </span>
            </div>
            <Progress 
              value={optimizationProgress} 
              className={`h-2 ${optimizationStatus === "complete" ? "bg-green-500" : ""}`} 
            />
          </div>
          
          <Alert className="bg-dark-bg border-dark-border">
            <Info className="h-4 w-4 text-gray-400" />
            <AlertDescription className="text-sm">
              Complex simulations may take 5-15 minutes depending on model size and selected parameters.
              <Button variant="link" className="text-primary text-sm p-0 h-auto ml-1">
                Learn more about CFD performance
              </Button>
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 bg-dark-bg border-dark-border hover:bg-dark-border"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-blue-600"
            >
              Run in Background
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
