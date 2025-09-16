import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResultsMetrics from "./ResultsMetrics";
import PressureChart from "./PressureChart";
import AIRecommendations from "./AIRecommendations";
import BeforeAfterComparison from "./BeforeAfterComparison";

interface ResultsPanelProps {
  simulationResult: any | null;
  onApplyRecommendation: (recommendationId: number) => void;
}

export default function ResultsPanel({ simulationResult, onApplyRecommendation }: ResultsPanelProps) {
  const handleExport = () => {
    // This would export the results in a real app
    alert("Export functionality would be implemented here");
  };

  return (
    <div className="h-96 lg:h-auto lg:w-96 border-t lg:border-t-0 lg:border-l border-dark-border bg-dark-surface flex flex-col overflow-hidden">
      <div className="border-b border-dark-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-medium">Analysis Results</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            className="text-primary text-sm font-medium"
            onClick={handleExport}
            disabled={!simulationResult}
          >
            Export
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {simulationResult ? (
          <>
            <ResultsMetrics 
              dragCoefficient={simulationResult.dragCoefficient}
              liftCoefficient={simulationResult.liftCoefficient}
              liftDragRatio={simulationResult.liftDragRatio}
              pressurePoints={simulationResult.pressurePoints}
            />
            
            <PressureChart 
              pressureData={simulationResult.pressureDistribution}
            />
            
            <AIRecommendations 
              recommendations={simulationResult.recommendations}
              onApplyRecommendation={onApplyRecommendation}
            />
            
            <BeforeAfterComparison 
              originalModelId={simulationResult.modelId}
              simulationResult={simulationResult}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-gray-400 mb-2">No simulation results</div>
            <p className="text-sm text-gray-500 max-w-xs">
              Configure your simulation parameters and run a simulation to see results here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
