/**
 * Client-side utilities for working with OpenFOAM simulations
 * This provides an interface to the server's OpenFOAM functionality
 */

import { apiRequest } from "./queryClient";
import { SimulationSettings, AnalysisOptions } from "./types";

/**
 * Interface for simulation parameters
 */
export interface SimulationParameters {
  projectId: number;
  modelId: number;
}

/**
 * Interface for simulation result
 */
export interface SimulationResult {
  id: number;
  projectId: number;
  modelId: number;
  dragCoefficient: number;
  liftCoefficient: number;
  liftDragRatio: number;
  pressurePoints: number;
  pressureDistribution: any;
  completedAt: string;
  recommendations?: any[];
}

/**
 * Start a CFD simulation with the given parameters
 * @param params The simulation parameters
 * @returns A promise that resolves with the simulation result when complete
 */
export async function runSimulation(
  params: SimulationParameters
): Promise<SimulationResult> {
  const response = await apiRequest("POST", "/api/simulate", params);
  return await response.json();
}

/**
 * Save simulation settings to the server
 * @param projectId The project ID
 * @param settings The simulation settings
 * @returns The saved settings
 */
export async function saveSimulationSettings(
  projectId: number,
  settings: SimulationSettings
): Promise<any> {
  const response = await apiRequest("POST", "/api/simulation-settings", {
    projectId,
    ...settings,
  });
  return await response.json();
}

/**
 * Save analysis options to the server
 * @param projectId The project ID
 * @param options The analysis options
 * @returns The saved options
 */
export async function saveAnalysisOptions(
  projectId: number,
  options: AnalysisOptions
): Promise<any> {
  const response = await apiRequest("POST", "/api/analysis-options", {
    projectId,
    ...options,
  });
  return await response.json();
}

/**
 * Save AI optimization options to the server
 * @param projectId The project ID
 * @param options The AI optimization options
 * @returns The saved options
 */
export async function saveAIOptimizationOptions(
  projectId: number,
  options: {
    optimizationGoal: string;
    constraintImportance: number;
    generateExplanation: boolean;
  }
): Promise<any> {
  const response = await apiRequest("POST", "/api/ai-optimization-options", {
    projectId,
    ...options,
  });
  return await response.json();
}

/**
 * Get the latest simulation result for a project
 * @param projectId The project ID
 * @returns The simulation result, or null if no simulation has been run
 */
export async function getLatestSimulationResult(
  projectId: number
): Promise<SimulationResult | null> {
  try {
    const response = await apiRequest(
      "GET",
      `/api/projects/${projectId}/simulation-results/latest`,
      undefined
    );
    return await response.json();
  } catch (error) {
    // If no simulation has been run, return null
    return null;
  }
}

/**
 * Create a new project
 * @param name The project name
 * @param description The project description
 * @returns The created project
 */
export async function createProject(
  name: string,
  description?: string
): Promise<any> {
  const response = await apiRequest("POST", "/api/projects", {
    name,
    description,
    userId: null,
    status: "draft",
  });
  return await response.json();
}
