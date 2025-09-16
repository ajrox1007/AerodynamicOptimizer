/**
 * Server-side STL file parser
 * This module provides functions for parsing and analyzing STL files
 */

import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

/**
 * Interface for STL file information
 */
export interface STLInfo {
  vertexCount: number;
  faceCount: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
  surfaceArea: number;
  volume: number;
}

/**
 * Analyze an STL file and extract information
 * @param filePath Path to the STL file
 * @returns Promise resolving to STL information
 */
export async function analyzeSTL(filePath: string): Promise<STLInfo> {
  try {
    const buffer = await readFileAsync(filePath);
    
    // Check if it's an ASCII or binary STL
    const isAscii = isAsciiSTL(buffer);
    
    if (isAscii) {
      return parseAsciiSTL(buffer);
    } else {
      return parseBinarySTL(buffer);
    }
  } catch (error) {
    console.error('Error analyzing STL file:', error);
    throw new Error(`Failed to analyze STL file: ${error.message}`);
  }
}

/**
 * Determine if an STL file is ASCII or binary
 * @param buffer The file buffer
 * @returns true if ASCII, false if binary
 */
function isAsciiSTL(buffer: Buffer): boolean {
  // Read first 6 bytes and check if they spell "solid"
  const header = buffer.toString('utf8', 0, 6);
  return header.trim().toLowerCase() === "solid";
}

/**
 * Parse an ASCII STL file
 * @param buffer The file buffer
 * @returns STL information
 */
function parseAsciiSTL(buffer: Buffer): STLInfo {
  const content = buffer.toString('utf8');
  const lines = content.split('\n');
  
  // Find all vertex lines to determine triangle count
  const vertexLines = lines.filter(line => line.trim().startsWith('vertex'));
  const faceCount = vertexLines.length / 3;
  const vertexCount = faceCount * 3; // Each face has 3 vertices

  // Parse all vertices to calculate bounding box
  const vertices: [number, number, number][] = [];
  for (const line of vertexLines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 4) {
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      vertices.push([x, y, z]);
    }
  }

  // Calculate bounding box
  const boundingBox = calculateBoundingBox(vertices);
  
  // Estimate surface area and volume (simplified for demonstration)
  // In a real implementation, this would be calculated more accurately
  const surfaceArea = estimateSurfaceArea(faceCount);
  const volume = estimateVolume(boundingBox);

  return {
    vertexCount,
    faceCount,
    boundingBox,
    surfaceArea,
    volume,
  };
}

/**
 * Parse a binary STL file
 * @param buffer The file buffer
 * @returns STL information
 */
function parseBinarySTL(buffer: Buffer): STLInfo {
  // The number of triangles is stored at offset 80 as a 32-bit integer
  const faceCount = buffer.readUInt32LE(80);
  const vertexCount = faceCount * 3; // Each face has 3 vertices
  
  // Parse all vertices to calculate bounding box
  const vertices: [number, number, number][] = [];
  
  // Each triangle starts with a normal (3 floats) followed by 3 vertices (3 floats each),
  // and ends with a 2-byte attribute. Total size: 50 bytes per triangle.
  for (let i = 0; i < faceCount; i++) {
    const offset = 84 + (i * 50) + 12; // Skip header (84 bytes) and normal (12 bytes)
    
    for (let j = 0; j < 3; j++) {
      const vOffset = offset + (j * 12);
      const x = buffer.readFloatLE(vOffset);
      const y = buffer.readFloatLE(vOffset + 4);
      const z = buffer.readFloatLE(vOffset + 8);
      vertices.push([x, y, z]);
    }
  }

  // Calculate bounding box
  const boundingBox = calculateBoundingBox(vertices);
  
  // Estimate surface area and volume (simplified for demonstration)
  const surfaceArea = estimateSurfaceArea(faceCount);
  const volume = estimateVolume(boundingBox);

  return {
    vertexCount,
    faceCount,
    boundingBox,
    surfaceArea,
    volume,
  };
}

/**
 * Calculate the bounding box for a set of vertices
 * @param vertices Array of [x, y, z] vertices
 * @returns Bounding box with min and max points
 */
function calculateBoundingBox(vertices: [number, number, number][]): {
  min: [number, number, number];
  max: [number, number, number];
} {
  if (vertices.length === 0) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0],
    };
  }

  const min: [number, number, number] = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  ];
  const max: [number, number, number] = [
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (const [x, y, z] of vertices) {
    min[0] = Math.min(min[0], x);
    min[1] = Math.min(min[1], y);
    min[2] = Math.min(min[2], z);
    max[0] = Math.max(max[0], x);
    max[1] = Math.max(max[1], y);
    max[2] = Math.max(max[2], z);
  }

  return { min, max };
}

/**
 * Estimate the surface area based on face count
 * This is a very rough estimation for demonstration purposes
 * @param faceCount Number of triangular faces
 * @returns Estimated surface area
 */
function estimateSurfaceArea(faceCount: number): number {
  // In a real implementation, this would sum the areas of all triangles
  // Here, we just make a rough guess based on triangle count
  return faceCount * 0.01;
}

/**
 * Estimate the volume based on bounding box
 * This is a very rough estimation for demonstration purposes
 * @param boundingBox The bounding box of the model
 * @returns Estimated volume
 */
function estimateVolume(boundingBox: {
  min: [number, number, number];
  max: [number, number, number];
}): number {
  // In a real implementation, this would calculate the actual volume
  // Here, we just calculate the bounding box volume and apply a factor
  const width = boundingBox.max[0] - boundingBox.min[0];
  const height = boundingBox.max[1] - boundingBox.min[1];
  const depth = boundingBox.max[2] - boundingBox.min[2];
  
  // Multiply by 0.3 as a rough estimate of the ratio of model volume to bounding box volume
  return width * height * depth * 0.3;
}

/**
 * Check if an STL file is valid
 * @param filePath Path to the STL file
 * @returns True if the file is a valid STL
 */
export async function isValidSTL(filePath: string): Promise<boolean> {
  try {
    await analyzeSTL(filePath);
    return true;
  } catch (error) {
    return false;
  }
}
