import {
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  models, type Model, type InsertModel,
  simulationSettings, type SimulationSettings, type InsertSimulationSettings,
  analysisOptions, type AnalysisOptions, type InsertAnalysisOptions,
  aiOptimizationOptions, type AiOptimizationOptions, type InsertAiOptimizationOptions,
  simulationResults, type SimulationResults, type InsertSimulationResults,
  aiRecommendations, type AiRecommendation, type InsertAiRecommendation
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;

  // Model operations
  getModel(id: number): Promise<Model | undefined>;
  getModelsByProject(projectId: number): Promise<Model[]>;
  createModel(model: InsertModel): Promise<Model>;

  // Simulation Settings operations
  getSimulationSettings(id: number): Promise<SimulationSettings | undefined>;
  getSimulationSettingsByProject(projectId: number): Promise<SimulationSettings | undefined>;
  createSimulationSettings(settings: InsertSimulationSettings): Promise<SimulationSettings>;

  // Analysis Options operations
  getAnalysisOptions(id: number): Promise<AnalysisOptions | undefined>;
  getAnalysisOptionsByProject(projectId: number): Promise<AnalysisOptions | undefined>;
  createAnalysisOptions(options: InsertAnalysisOptions): Promise<AnalysisOptions>;

  // AI Optimization Options operations
  getAiOptimizationOptions(id: number): Promise<AiOptimizationOptions | undefined>;
  getAiOptimizationOptionsByProject(projectId: number): Promise<AiOptimizationOptions | undefined>;
  createAiOptimizationOptions(options: InsertAiOptimizationOptions): Promise<AiOptimizationOptions>;

  // Simulation Results operations
  getSimulationResult(id: number): Promise<SimulationResults | undefined>;
  getSimulationResultsByProject(projectId: number): Promise<SimulationResults[]>;
  createSimulationResults(results: InsertSimulationResults): Promise<SimulationResults>;
  getSimulationResultWithRecommendations(id: number): Promise<any>;

  // AI Recommendations operations
  getAiRecommendation(id: number): Promise<AiRecommendation | undefined>;
  getAiRecommendationsBySimulationResult(simulationResultId: number): Promise<AiRecommendation[]>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  updateAiRecommendation(id: number, data: Partial<AiRecommendation>): Promise<AiRecommendation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private models: Map<number, Model>;
  private simulationSettings: Map<number, SimulationSettings>;
  private analysisOptions: Map<number, AnalysisOptions>;
  private aiOptimizationOptions: Map<number, AiOptimizationOptions>;
  private simulationResults: Map<number, SimulationResults>;
  private aiRecommendations: Map<number, AiRecommendation>;

  currentUserId: number;
  currentProjectId: number;
  currentModelId: number;
  currentSimulationSettingsId: number;
  currentAnalysisOptionsId: number;
  currentAiOptimizationOptionsId: number;
  currentSimulationResultsId: number;
  currentAiRecommendationsId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.models = new Map();
    this.simulationSettings = new Map();
    this.analysisOptions = new Map();
    this.aiOptimizationOptions = new Map();
    this.simulationResults = new Map();
    this.aiRecommendations = new Map();

    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentModelId = 1;
    this.currentSimulationSettingsId = 1;
    this.currentAnalysisOptionsId = 1;
    this.currentAiOptimizationOptionsId = 1;
    this.currentSimulationResultsId = 1;
    this.currentAiRecommendationsId = 1;

    // Initialize with some sample data
    this.createProject({
      name: "Rocket Prototype v2.3",
      description: "Experimental rocket design with improved aerodynamics",
      userId: null,
      status: "draft"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date().toISOString();
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  // Model operations
  async getModel(id: number): Promise<Model | undefined> {
    return this.models.get(id);
  }

  async getModelsByProject(projectId: number): Promise<Model[]> {
    return Array.from(this.models.values())
      .filter(model => model.projectId === projectId);
  }

  async createModel(insertModel: InsertModel): Promise<Model> {
    const id = this.currentModelId++;
    const model: Model = { ...insertModel, id };
    this.models.set(id, model);
    return model;
  }

  // Simulation Settings operations
  async getSimulationSettings(id: number): Promise<SimulationSettings | undefined> {
    return this.simulationSettings.get(id);
  }

  async getSimulationSettingsByProject(projectId: number): Promise<SimulationSettings | undefined> {
    return Array.from(this.simulationSettings.values())
      .find(settings => settings.projectId === projectId);
  }

  async createSimulationSettings(insertSettings: InsertSimulationSettings): Promise<SimulationSettings> {
    const id = this.currentSimulationSettingsId++;
    const settings: SimulationSettings = { ...insertSettings, id };
    this.simulationSettings.set(id, settings);
    return settings;
  }

  // Analysis Options operations
  async getAnalysisOptions(id: number): Promise<AnalysisOptions | undefined> {
    return this.analysisOptions.get(id);
  }

  async getAnalysisOptionsByProject(projectId: number): Promise<AnalysisOptions | undefined> {
    return Array.from(this.analysisOptions.values())
      .find(options => options.projectId === projectId);
  }

  async createAnalysisOptions(insertOptions: InsertAnalysisOptions): Promise<AnalysisOptions> {
    const id = this.currentAnalysisOptionsId++;
    const options: AnalysisOptions = { ...insertOptions, id };
    this.analysisOptions.set(id, options);
    return options;
  }

  // AI Optimization Options operations
  async getAiOptimizationOptions(id: number): Promise<AiOptimizationOptions | undefined> {
    return this.aiOptimizationOptions.get(id);
  }

  async getAiOptimizationOptionsByProject(projectId: number): Promise<AiOptimizationOptions | undefined> {
    return Array.from(this.aiOptimizationOptions.values())
      .find(options => options.projectId === projectId);
  }

  async createAiOptimizationOptions(insertOptions: InsertAiOptimizationOptions): Promise<AiOptimizationOptions> {
    const id = this.currentAiOptimizationOptionsId++;
    const options: AiOptimizationOptions = { ...insertOptions, id };
    this.aiOptimizationOptions.set(id, options);
    return options;
  }

  // Simulation Results operations
  async getSimulationResult(id: number): Promise<SimulationResults | undefined> {
    return this.simulationResults.get(id);
  }

  async getSimulationResultsByProject(projectId: number): Promise<SimulationResults[]> {
    return Array.from(this.simulationResults.values())
      .filter(result => result.projectId === projectId);
  }

  async createSimulationResults(insertResults: InsertSimulationResults): Promise<SimulationResults> {
    const id = this.currentSimulationResultsId++;
    const now = new Date().toISOString();
    const results: SimulationResults = { 
      ...insertResults, 
      id,
      completedAt: now
    };
    this.simulationResults.set(id, results);
    return results;
  }

  async getSimulationResultWithRecommendations(id: number): Promise<any> {
    const result = this.simulationResults.get(id);
    if (!result) return undefined;

    const recommendations = Array.from(this.aiRecommendations.values())
      .filter(rec => rec.simulationResultId === id);

    return {
      ...result,
      recommendations
    };
  }

  // AI Recommendations operations
  async getAiRecommendation(id: number): Promise<AiRecommendation | undefined> {
    return this.aiRecommendations.get(id);
  }

  async getAiRecommendationsBySimulationResult(simulationResultId: number): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values())
      .filter(rec => rec.simulationResultId === simulationResultId);
  }

  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.currentAiRecommendationsId++;
    const recommendation: AiRecommendation = { ...insertRecommendation, id };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  async updateAiRecommendation(id: number, data: Partial<AiRecommendation>): Promise<AiRecommendation> {
    const recommendation = this.aiRecommendations.get(id);
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    const updatedRecommendation = { ...recommendation, ...data };
    this.aiRecommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
