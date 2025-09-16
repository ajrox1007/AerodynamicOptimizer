import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  improvementPercentage: number;
  applied: boolean;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[] | null | undefined;
  onApplyRecommendation: (recommendationId: number) => void;
}

export default function AIRecommendations({ recommendations, onApplyRecommendation }: AIRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    // Demo data for when there are no recommendations
    const demoRecommendations = [
      {
        id: 1,
        title: "Nose Cone Refinement",
        description: "Increasing the nose cone length by 8.5% while decreasing its angle would reduce drag by approximately 12.3% with minimal impact on other parameters.",
        improvementPercentage: 12.3,
        applied: false
      },
      {
        id: 2,
        title: "Wing Trailing Edge",
        description: "Adding a 3.2mm fillet to the wing trailing edges would reduce vortex formation and improve lift-to-drag ratio by 5.8%.",
        improvementPercentage: 5.8,
        applied: false
      },
      {
        id: 3,
        title: "Surface Smoothing",
        description: "Detected 3 surface irregularities causing turbulence. Automatic smoothing would reduce drag by 3.5% without altering the overall shape.",
        improvementPercentage: 3.5,
        applied: false
      }
    ];
    
    recommendations = demoRecommendations;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">AI RECOMMENDATIONS</h3>
        <Badge variant="secondary" className="bg-blue-900 text-blue-300">
          {recommendations.length} Suggestions
        </Badge>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="bg-dark-bg border-dark-border">
            <CardContent className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Lightbulb className="text-primary mr-2 h-5 w-5" />
                  <h4 className="font-medium text-sm">{recommendation.title}</h4>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-primary/20 text-primary border-none hover:bg-primary/30 px-2 py-1 h-auto text-xs"
                  onClick={() => onApplyRecommendation(recommendation.id)}
                  disabled={recommendation.applied}
                >
                  {recommendation.applied ? "Applied" : "Apply"}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">{recommendation.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
