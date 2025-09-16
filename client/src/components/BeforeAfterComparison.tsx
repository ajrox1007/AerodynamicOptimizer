import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface BeforeAfterComparisonProps {
  originalModelId: number | null;
  simulationResult: any | null;
}

export default function BeforeAfterComparison({ originalModelId, simulationResult }: BeforeAfterComparisonProps) {
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);
  
  // Query to fetch optimized model if available
  const { data: optimizedModels } = useQuery({
    queryKey: [`/api/projects/${simulationResult?.projectId}/models`],
    enabled: !!simulationResult?.projectId,
  });
  
  const optimizedModel = optimizedModels?.find((model: any) => 
    model.isOptimized && model.originalModelId === originalModelId
  );

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-3">VISUALIZATION COMPARISON</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-400 mb-1 text-center">Original Model</div>
            <Card className="bg-dark-bg border-dark-border overflow-hidden h-32">
              <CardContent className="p-0 h-full">
                {originalModelId ? (
                  <div className="w-full h-full flex items-center justify-center bg-dark-bg">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-700"
                    >
                      <path
                        d="M100 30L150 120H50L100 30Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M70 90L130 90L130 120L70 120L70 90Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    No model
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-1 text-center">Optimized Model</div>
            <Card className="bg-dark-bg border-dark-border overflow-hidden h-32">
              <CardContent className="p-0 h-full">
                {optimizedModel ? (
                  <div className="w-full h-full flex items-center justify-center bg-dark-bg">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary"
                    >
                      <path
                        d="M100 20L160 120H40L100 20Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M70 90L130 90L130 120L70 120L70 90Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                    Not optimized yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full border-dark-border hover:bg-dark-bg transition-colors"
          onClick={() => setShowDetailedComparison(true)}
          disabled={!optimizedModel}
        >
          View Detailed Comparison
        </Button>
        
        {showDetailedComparison && (
          <div className="mt-3 p-3 bg-dark-bg rounded-lg border border-dark-border">
            <h4 className="text-sm font-medium mb-2">Aerodynamic Improvements</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 12.3% reduction in overall drag coefficient</li>
              <li>• 8.5% improvement in lift-to-drag ratio</li>
              <li>• Reduced turbulence at trailing edges</li>
              <li>• More uniform pressure distribution</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
