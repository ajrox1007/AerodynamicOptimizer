import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AIOptimizationOptionsProps {
  optimizationGoal: string;
  setOptimizationGoal: (value: string) => void;
  constraintImportance: number;
  setConstraintImportance: (value: number) => void;
  generateExplanation: boolean;
  setGenerateExplanation: (value: boolean) => void;
}

export default function AIOptimizationOptions({
  optimizationGoal,
  setOptimizationGoal,
  constraintImportance,
  setConstraintImportance,
  generateExplanation,
  setGenerateExplanation
}: AIOptimizationOptionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400">AI OPTIMIZATION</h3>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Optimization Goal</Label>
        <Select value={optimizationGoal} onValueChange={setOptimizationGoal}>
          <SelectTrigger className="w-full bg-dark-bg border border-dark-border rounded-md">
            <SelectValue placeholder="Select optimization goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Minimize Drag">Minimize Drag</SelectItem>
            <SelectItem value="Maximize Lift">Maximize Lift</SelectItem>
            <SelectItem value="Optimize Lift/Drag Ratio">Optimize Lift/Drag Ratio</SelectItem>
            <SelectItem value="Reduce Turbulence">Reduce Turbulence</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Constraint Importance</Label>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Original Shape</span>
              <span>Performance</span>
            </div>
            <Slider 
              min={0} 
              max={100} 
              value={[constraintImportance]} 
              onValueChange={values => setConstraintImportance(values[0])} 
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="generateExplanation" 
            checked={generateExplanation}
            onCheckedChange={(checked) => setGenerateExplanation(!!checked)}
          />
          <Label htmlFor="generateExplanation" className="text-sm text-gray-300">
            Generate Explanation
          </Label>
        </div>
      </div>
    </div>
  );
}
