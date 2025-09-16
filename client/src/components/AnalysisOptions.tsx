import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AnalysisOptionsProps {
  options: {
    dragCoefficient: boolean;
    liftCoefficient: boolean;
    pressureDistribution: boolean;
    vorticityAnalysis: boolean;
    surfaceStreamlines: boolean;
  };
  setOptions: (options: {
    dragCoefficient: boolean;
    liftCoefficient: boolean;
    pressureDistribution: boolean;
    vorticityAnalysis: boolean;
    surfaceStreamlines: boolean;
  }) => void;
}

export default function AnalysisOptions({ options, setOptions }: AnalysisOptionsProps) {
  const handleCheckboxChange = (field: keyof typeof options) => {
    setOptions({
      ...options,
      [field]: !options[field]
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400">ANALYSIS OPTIONS</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="dragCoefficient" 
            checked={options.dragCoefficient}
            onCheckedChange={() => handleCheckboxChange('dragCoefficient')}
          />
          <Label htmlFor="dragCoefficient" className="text-sm text-gray-300">
            Drag Coefficient
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="liftCoefficient" 
            checked={options.liftCoefficient}
            onCheckedChange={() => handleCheckboxChange('liftCoefficient')}
          />
          <Label htmlFor="liftCoefficient" className="text-sm text-gray-300">
            Lift Coefficient
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="pressureDistribution" 
            checked={options.pressureDistribution}
            onCheckedChange={() => handleCheckboxChange('pressureDistribution')}
          />
          <Label htmlFor="pressureDistribution" className="text-sm text-gray-300">
            Pressure Distribution
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vorticityAnalysis" 
            checked={options.vorticityAnalysis}
            onCheckedChange={() => handleCheckboxChange('vorticityAnalysis')}
          />
          <Label htmlFor="vorticityAnalysis" className="text-sm text-gray-300">
            Vorticity Analysis
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="surfaceStreamlines" 
            checked={options.surfaceStreamlines}
            onCheckedChange={() => handleCheckboxChange('surfaceStreamlines')}
          />
          <Label htmlFor="surfaceStreamlines" className="text-sm text-gray-300">
            Surface Streamlines
          </Label>
        </div>
      </div>
    </div>
  );
}
