import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ResultsMetricsProps {
  dragCoefficient: number;
  liftCoefficient: number;
  liftDragRatio: number;
  pressurePoints: number;
}

export default function ResultsMetrics({
  dragCoefficient,
  liftCoefficient,
  liftDragRatio,
  pressurePoints
}: ResultsMetricsProps) {
  // For demo purposes, let's assume these are the previous values
  const prevDragCoefficient = 0.328;
  const prevLiftCoefficient = 0.794;
  const prevLiftDragRatio = 2.42;
  const prevPressurePoints = 4;
  
  // Calculate percentage changes
  const dragPercentChange = ((dragCoefficient - prevDragCoefficient) / prevDragCoefficient) * 100;
  const liftPercentChange = ((liftCoefficient - prevLiftCoefficient) / prevLiftCoefficient) * 100;
  const liftDragRatioPercentChange = ((liftDragRatio - prevLiftDragRatio) / prevLiftDragRatio) * 100;
  const pressurePointsPercentChange = ((pressurePoints - prevPressurePoints) / prevPressurePoints) * 100;

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-3">KEY METRICS</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-dark-bg border-dark-border">
          <CardContent className="p-3">
            <div className="text-xs text-gray-400">Drag Coefficient</div>
            <div className="flex items-end justify-between mt-1">
              <div className="text-xl font-semibold text-white">{dragCoefficient.toFixed(3)}</div>
              <div className={`text-xs ${dragPercentChange > 0 ? 'text-red-400' : 'text-green-400'} flex items-center`}>
                {dragPercentChange > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(dragPercentChange).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-bg border-dark-border">
          <CardContent className="p-3">
            <div className="text-xs text-gray-400">Lift Coefficient</div>
            <div className="flex items-end justify-between mt-1">
              <div className="text-xl font-semibold text-white">{liftCoefficient.toFixed(3)}</div>
              <div className={`text-xs ${liftPercentChange > 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                {liftPercentChange > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(liftPercentChange).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-bg border-dark-border">
          <CardContent className="p-3">
            <div className="text-xs text-gray-400">Lift/Drag Ratio</div>
            <div className="flex items-end justify-between mt-1">
              <div className="text-xl font-semibold text-white">{liftDragRatio.toFixed(2)}</div>
              <div className={`text-xs ${liftDragRatioPercentChange > 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                {liftDragRatioPercentChange > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(liftDragRatioPercentChange).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dark-bg border-dark-border">
          <CardContent className="p-3">
            <div className="text-xs text-gray-400">Pressure Points</div>
            <div className="flex items-end justify-between mt-1">
              <div className="text-xl font-semibold text-white">{pressurePoints}</div>
              <div className={`text-xs ${pressurePointsPercentChange > 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                {pressurePointsPercentChange > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(pressurePointsPercentChange).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
