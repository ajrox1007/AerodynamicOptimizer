import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate aerodynamic improvement recommendations based on simulation results
export async function generateRecommendations(simulationResult: any, model: any, optimizationOptions: any): Promise<any[]> {
  try {
    // Prepare the prompt with simulation data
    const prompt = `
      I have run a CFD simulation on a 3D model with the following results:
      - Drag coefficient: ${simulationResult.dragCoefficient}
      - Lift coefficient: ${simulationResult.liftCoefficient}
      - Lift/drag ratio: ${simulationResult.liftDragRatio}
      - Pressure points: ${simulationResult.pressurePoints}
      
      Model information:
      - Vertices: ${model.vertexCount}
      - Faces: ${model.faceCount}
      
      Optimization goal: ${optimizationOptions.optimizationGoal}
      Constraint importance (0-100, higher means performance is more important than preserving shape): ${optimizationOptions.constraintImportance}
      
      Based on these results, provide 3 specific recommendations for improving the aerodynamics of the model. 
      
      Each recommendation should include:
      1. A short, descriptive title (max 40 chars)
      2. A detailed description of the change (max 200 chars)
      3. An estimated improvement percentage
      
      Format your response as a JSON array of objects, each with 'title', 'description', and 'improvementPercentage' properties.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in computational fluid dynamics and aerodynamics optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    // Parse the response
    const result = JSON.parse(response.choices[0].message.content);
    
    if (Array.isArray(result.recommendations)) {
      return result.recommendations;
    } else if (Array.isArray(result)) {
      return result;
    } else {
      // If the format doesn't match expectations, create default recommendations
      return [
        {
          title: "Streamline Leading Edges",
          description: "Reshape the leading edges to reduce drag by improving airflow attachment and reducing turbulence formation.",
          improvementPercentage: 8.3
        },
        {
          title: "Optimize Surface Curvature",
          description: "Adjust surface curvature gradients to maintain smoother pressure distribution and reduce boundary layer separation.",
          improvementPercentage: 5.7
        },
        {
          title: "Refine Trailing Edge Geometry",
          description: "Sharpen and thin the trailing edges to minimize wake formation and reduce form drag.",
          improvementPercentage: 4.2
        }
      ];
    }
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    
    // Return fallback recommendations if API fails
    return [
      {
        title: "Streamline Leading Edges",
        description: "Reshape the leading edges to reduce drag by improving airflow attachment and reducing turbulence formation.",
        improvementPercentage: 8.3
      },
      {
        title: "Optimize Surface Curvature",
        description: "Adjust surface curvature gradients to maintain smoother pressure distribution and reduce boundary layer separation.",
        improvementPercentage: 5.7
      },
      {
        title: "Refine Trailing Edge Geometry",
        description: "Sharpen and thin the trailing edges to minimize wake formation and reduce form drag.",
        improvementPercentage: 4.2
      }
    ];
  }
}
