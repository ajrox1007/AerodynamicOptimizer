/**
 * Client-side wrapper for the server's OpenAI functionality
 * This provides type safety and easy access to AI-powered features
 */

import { apiRequest } from "./queryClient";

/**
 * Interface for AI recommendation
 */
export interface AIRecommendation {
  id?: number;
  title: string;
  description: string;
  improvementPercentage: number;
  applied: boolean;
}

/**
 * Request recommendations for aerodynamic improvements
 * @param simulationResultId The ID of the simulation result
 * @returns Array of recommendations
 */
export async function fetchRecommendations(simulationResultId: number): Promise<AIRecommendation[]> {
  const response = await apiRequest(
    'GET',
    `/api/simulation-results/${simulationResultId}`,
    undefined
  );
  
  const data = await response.json();
  return data.recommendations || [];
}

/**
 * Apply a specific recommendation to the model
 * @param recommendationId The recommendation ID to apply
 * @returns The result of the operation, including the optimized model
 */
export async function applyRecommendation(recommendationId: number): Promise<{
  message: string;
  optimizedModel: any;
}> {
  const response = await apiRequest(
    'POST',
    `/api/recommendations/${recommendationId}/apply`,
    undefined
  );
  
  return await response.json();
}

/**
 * Request an AI-powered explanation of simulation results
 * @param simulationResultId The ID of the simulation result
 * @returns An explanation of the results
 */
export async function getResultsExplanation(simulationResultId: number): Promise<{
  explanation: string;
  keyFindings: string[];
}> {
  const response = await apiRequest(
    'GET',
    `/api/simulation-results/${simulationResultId}/explain`,
    undefined
  );
  
  return await response.json();
}
