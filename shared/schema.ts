import { pgTable, text, serial, integer, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// CFD Projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").references(() => users.id),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
  status: text("status").notNull().default("draft"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Models
export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  name: text("name").notNull(),
  stlPath: text("stl_path").notNull(),
  vertexCount: integer("vertex_count"),
  faceCount: integer("face_count"),
  isOptimized: boolean("is_optimized").default(false),
  originalModelId: integer("original_model_id").references(() => models.id),
});

export const insertModelSchema = createInsertSchema(models).omit({
  id: true,
});

export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = typeof models.$inferSelect;

// Simulation Settings
export const simulationSettings = pgTable("simulation_settings", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  fluidMedium: text("fluid_medium").notNull().default("air"),
  flowVelocity: real("flow_velocity").notNull().default(120),
  reynoldsNumber: real("reynolds_number").notNull().default(500000),
  meshDensity: text("mesh_density").notNull().default("medium"),
  advancedSettings: jsonb("advanced_settings"),
});

export const insertSimulationSettingsSchema = createInsertSchema(simulationSettings).omit({
  id: true,
});

export type InsertSimulationSettings = z.infer<typeof insertSimulationSettingsSchema>;
export type SimulationSettings = typeof simulationSettings.$inferSelect;

// Analysis Options
export const analysisOptions = pgTable("analysis_options", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  dragCoefficient: boolean("drag_coefficient").default(true),
  liftCoefficient: boolean("lift_coefficient").default(true),
  pressureDistribution: boolean("pressure_distribution").default(true),
  vorticityAnalysis: boolean("vorticity_analysis").default(false),
  surfaceStreamlines: boolean("surface_streamlines").default(true),
});

export const insertAnalysisOptionsSchema = createInsertSchema(analysisOptions).omit({
  id: true,
});

export type InsertAnalysisOptions = z.infer<typeof insertAnalysisOptionsSchema>;
export type AnalysisOptions = typeof analysisOptions.$inferSelect;

// AI Optimization Options
export const aiOptimizationOptions = pgTable("ai_optimization_options", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  optimizationGoal: text("optimization_goal").notNull().default("Minimize Drag"),
  constraintImportance: integer("constraint_importance").notNull().default(50),
  generateExplanation: boolean("generate_explanation").default(true),
});

export const insertAiOptimizationOptionsSchema = createInsertSchema(aiOptimizationOptions).omit({
  id: true,
});

export type InsertAiOptimizationOptions = z.infer<typeof insertAiOptimizationOptionsSchema>;
export type AiOptimizationOptions = typeof aiOptimizationOptions.$inferSelect;

// Simulation Results
export const simulationResults = pgTable("simulation_results", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  modelId: integer("model_id").references(() => models.id),
  dragCoefficient: real("drag_coefficient"),
  liftCoefficient: real("lift_coefficient"),
  liftDragRatio: real("lift_drag_ratio"),
  pressurePoints: integer("pressure_points"),
  pressureDistribution: jsonb("pressure_distribution"),
  completedAt: text("completed_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const insertSimulationResultsSchema = createInsertSchema(simulationResults).omit({
  id: true,
  completedAt: true,
});

export type InsertSimulationResults = z.infer<typeof insertSimulationResultsSchema>;
export type SimulationResults = typeof simulationResults.$inferSelect;

// AI Recommendations
export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  simulationResultId: integer("simulation_result_id").references(() => simulationResults.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  improvementPercentage: real("improvement_percentage"),
  applied: boolean("applied").default(false),
});

export const insertAiRecommendationsSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
});

export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationsSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
