import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { analyzeSTL } from "./lib/stlParser";
import { runSimulation } from "./lib/openFoam";
import { generateRecommendations } from "./lib/openai";
import {
  insertProjectSchema,
  insertModelSchema,
  insertSimulationSettingsSchema,
  insertAnalysisOptionsSchema,
  insertAiOptimizationOptionsSchema,
} from "@shared/schema";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage_config,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === ".stl") {
      return cb(null, true);
    }
    cb(new Error("Only STL files are allowed"));
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Project routes
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Model routes
  app.post("/api/models/upload", upload.single("stlFile"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const stlInfo = await analyzeSTL(req.file.path);
      
      const modelData = {
        projectId: parseInt(req.body.projectId),
        name: req.body.name || path.basename(req.file.originalname, ".stl"),
        stlPath: req.file.path,
        vertexCount: stlInfo.vertexCount,
        faceCount: stlInfo.faceCount,
        isOptimized: false,
        originalModelId: null,
      };

      const model = await storage.createModel(modelData);
      res.status(201).json(model);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.getModel(id);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects/:projectId/models", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const models = await storage.getModelsByProject(projectId);
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // STL File serving route
  app.get("/api/stl/:modelId", async (req, res) => {
    try {
      const modelId = parseInt(req.params.modelId);
      const model = await storage.getModel(modelId);
      
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      if (!fs.existsSync(model.stlPath)) {
        return res.status(404).json({ message: "STL file not found" });
      }
      
      res.sendFile(model.stlPath);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Simulation settings routes
  app.post("/api/simulation-settings", async (req, res) => {
    try {
      const settingsData = insertSimulationSettingsSchema.parse(req.body);
      const settings = await storage.createSimulationSettings(settingsData);
      res.status(201).json(settings);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:projectId/simulation-settings", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const settings = await storage.getSimulationSettingsByProject(projectId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analysis options routes
  app.post("/api/analysis-options", async (req, res) => {
    try {
      const optionsData = insertAnalysisOptionsSchema.parse(req.body);
      const options = await storage.createAnalysisOptions(optionsData);
      res.status(201).json(options);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:projectId/analysis-options", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const options = await storage.getAnalysisOptionsByProject(projectId);
      res.json(options);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // AI optimization options routes
  app.post("/api/ai-optimization-options", async (req, res) => {
    try {
      const optionsData = insertAiOptimizationOptionsSchema.parse(req.body);
      const options = await storage.createAiOptimizationOptions(optionsData);
      res.status(201).json(options);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:projectId/ai-optimization-options", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const options = await storage.getAiOptimizationOptionsByProject(projectId);
      res.json(options);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Simulation execution route
  app.post("/api/simulate", async (req, res) => {
    try {
      const { projectId, modelId } = req.body;
      
      if (!projectId || !modelId) {
        return res.status(400).json({ message: "Project ID and Model ID are required" });
      }
      
      // Get all required data for simulation
      const project = await storage.getProject(parseInt(projectId));
      const model = await storage.getModel(parseInt(modelId));
      const settings = await storage.getSimulationSettingsByProject(parseInt(projectId));
      const analysisOptions = await storage.getAnalysisOptionsByProject(parseInt(projectId));
      
      if (!project || !model || !settings || !analysisOptions) {
        return res.status(404).json({ message: "Required data not found" });
      }
      
      // Run the simulation (this would be a longer async process in a real app)
      const simulationResult = await runSimulation(model, settings, analysisOptions);
      
      // Save simulation results
      const result = await storage.createSimulationResults({
        projectId: parseInt(projectId),
        modelId: parseInt(modelId),
        dragCoefficient: simulationResult.dragCoefficient,
        liftCoefficient: simulationResult.liftCoefficient,
        liftDragRatio: simulationResult.liftDragRatio,
        pressurePoints: simulationResult.pressurePoints,
        pressureDistribution: simulationResult.pressureDistribution,
      });
      
      // Generate AI recommendations
      const aiOptions = await storage.getAiOptimizationOptionsByProject(parseInt(projectId));
      if (aiOptions) {
        const recommendations = await generateRecommendations(simulationResult, model, aiOptions);
        
        // Save each recommendation
        for (const rec of recommendations) {
          await storage.createAiRecommendation({
            simulationResultId: result.id,
            title: rec.title,
            description: rec.description,
            improvementPercentage: rec.improvementPercentage,
            applied: false,
          });
        }
      }
      
      // Get complete results with recommendations
      const completeResult = await storage.getSimulationResultWithRecommendations(result.id);
      
      res.status(200).json(completeResult);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get simulation results
  app.get("/api/simulation-results/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.getSimulationResultWithRecommendations(id);
      
      if (!result) {
        return res.status(404).json({ message: "Simulation result not found" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Apply AI recommendation
  app.post("/api/recommendations/:id/apply", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const recommendation = await storage.getAiRecommendation(id);
      
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      // Get the simulation result
      const simulationResult = await storage.getSimulationResult(recommendation.simulationResultId);
      if (!simulationResult) {
        return res.status(404).json({ message: "Simulation result not found" });
      }
      
      // Get the model
      const model = await storage.getModel(simulationResult.modelId);
      if (!model) {
        return res.status(404).json({ message: "Model not found" });
      }
      
      // Apply the recommendation (this would modify the STL file in a real app)
      // For now, we'll just create a new model with isOptimized = true
      const optimizedModel = await storage.createModel({
        projectId: simulationResult.projectId,
        name: `${model.name}_optimized`,
        stlPath: model.stlPath, // In a real app, this would be a path to the modified STL
        vertexCount: model.vertexCount,
        faceCount: model.faceCount,
        isOptimized: true,
        originalModelId: model.id,
      });
      
      // Mark the recommendation as applied
      await storage.updateAiRecommendation(id, { applied: true });
      
      res.status(200).json({
        message: "Recommendation applied",
        optimizedModel,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
