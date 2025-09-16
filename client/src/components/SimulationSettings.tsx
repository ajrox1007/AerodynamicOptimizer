import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface SimulationSettingsProps {
  fluidMedium: string;
  setFluidMedium: (value: string) => void;
  flowVelocity: number;
  setFlowVelocity: (value: number) => void;
  reynoldsNumber: number;
  setReynoldsNumber: (value: number) => void;
  meshDensity: "low" | "medium" | "high";
  setMeshDensity: (value: "low" | "medium" | "high") => void;
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (value: boolean) => void;
}

export default function SimulationSettings({
  fluidMedium,
  setFluidMedium,
  flowVelocity,
  setFlowVelocity,
  reynoldsNumber,
  setReynoldsNumber,
  meshDensity,
  setMeshDensity,
  showAdvancedSettings,
  setShowAdvancedSettings
}: SimulationSettingsProps) {
  // Format the Reynolds number in scientific notation
  const formatReynoldsNumber = (value: number) => {
    const exponent = Math.floor(Math.log10(value));
    const mantissa = value / Math.pow(10, exponent);
    return `${mantissa.toFixed(1)} × 10${exponent.toString().sup()}`;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400">SIMULATION PARAMETERS</h3>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Fluid Medium</Label>
        <Select value={fluidMedium} onValueChange={setFluidMedium}>
          <SelectTrigger className="w-full bg-dark-bg border border-dark-border rounded-md">
            <SelectValue placeholder="Select fluid medium" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Air (sea level, 15°C)">Air (sea level, 15°C)</SelectItem>
            <SelectItem value="Air (high altitude, -20°C)">Air (high altitude, -20°C)</SelectItem>
            <SelectItem value="Water (20°C)">Water (20°C)</SelectItem>
            <SelectItem value="Custom...">Custom...</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Flow Velocity</Label>
        <div className="flex items-center space-x-2">
          <Slider 
            min={1} 
            max={1000} 
            step={1}
            value={[flowVelocity]} 
            onValueChange={values => setFlowVelocity(values[0])} 
            className="flex-1"
          />
          <div className="flex items-center space-x-1 w-24">
            <Input
              type="number"
              value={flowVelocity}
              onChange={e => setFlowVelocity(Number(e.target.value))}
              className="w-16 bg-dark-bg border border-dark-border rounded-md px-2 py-1 text-sm"
            />
            <span className="text-xs text-gray-400">m/s</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Reynolds Number</Label>
        <div className="flex items-center space-x-2">
          <Slider 
            min={1000} 
            max={10000000} 
            step={1000}
            value={[reynoldsNumber]} 
            onValueChange={values => setReynoldsNumber(values[0])} 
            className="flex-1"
          />
          <span className="text-xs text-gray-400 w-24">
            {formatReynoldsNumber(reynoldsNumber)}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm text-gray-300">Mesh Density</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant={meshDensity === "low" ? "default" : "outline"}
            className={meshDensity === "low" ? "bg-primary" : "border-dark-border"}
            onClick={() => setMeshDensity("low")}
          >
            Low
          </Button>
          <Button 
            variant={meshDensity === "medium" ? "default" : "outline"}
            className={meshDensity === "medium" ? "bg-primary" : "border-dark-border"}
            onClick={() => setMeshDensity("medium")}
          >
            Medium
          </Button>
          <Button 
            variant={meshDensity === "high" ? "default" : "outline"}
            className={meshDensity === "high" ? "bg-primary" : "border-dark-border"}
            onClick={() => setMeshDensity("high")}
          >
            High
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-sm text-gray-300">Advanced Settings</Label>
          <button 
            className="text-primary text-sm flex items-center"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            {showAdvancedSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        
        {showAdvancedSettings && (
          <div className="space-y-2 p-3 border border-dark-border rounded-md">
            <p className="text-xs text-gray-400">Advanced settings coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
