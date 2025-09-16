import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { PenTool, Rotate3d, ZoomIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ModelViewerProps {
  modelId: number | null;
  viewMode: "model" | "pressure" | "velocity" | "streamlines";
  onViewModeChange: (mode: "model" | "pressure" | "velocity" | "streamlines") => void;
}

export default function ModelViewer({ modelId, viewMode, onViewModeChange }: ModelViewerProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Mesh | null>(null);
  
  const [activeControl, setActiveControl] = useState<"pan" | "rotate" | "zoom">("rotate");
  
  // Fetch model data if modelId is available
  const { data: model } = useQuery({
    queryKey: [`/api/models/${modelId}`],
    enabled: !!modelId,
    onError: (error) => {
      toast({
        title: "Error loading model",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // Load STL model when modelId changes
  useEffect(() => {
    if (!modelId || !sceneRef.current) return;
    
    // Remove previous model if exists
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Load new model
    const loader = new STLLoader();
    
    loader.load(
      `/api/stl/${modelId}`,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({
          color: 0xf5f5f5,
          specular: 0x111111,
          shininess: 200
        });
        
        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Center the model
        geometry.computeBoundingBox();
        const boundingBox = geometry.boundingBox as THREE.Box3;
        const center = boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, -center.z);
        
        // Scale the model to fit the view
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        mesh.scale.set(scale, scale, scale);
        
        // Auto-correct orientation - assume front is longest dimension
        // For aircraft, we typically want to orient with nose pointing forward
        // and wings along the X axis
        if (size.z > size.y && size.x > size.y) {
          // This is likely an aircraft with wings spread along X axis
          // Rotate to align with standard aerodynamic orientation
          mesh.rotation.x = -Math.PI / 2; // Point nose forward
        }
        
        // Add the model to the scene
        if (sceneRef.current) {
          sceneRef.current.add(mesh);
          modelRef.current = mesh;
          
          // Add flow direction indicator
          const arrowHelper = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1), // direction
            new THREE.Vector3(0, 0, -5), // origin
            2, // length
            0x00ffff, // color
            0.5, // head length
            0.2  // head width
          );
          sceneRef.current.add(arrowHelper);
        }
        
        // Apply visualization based on viewMode
        applyVisualization(viewMode);
      },
      (xhr) => {
        // Progress
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        toast({
          title: "Error loading STL",
          description: error.message,
          variant: "destructive"
        });
      }
    );
  }, [modelId, toast]);
  
  // Apply visualization when viewMode changes
  useEffect(() => {
    applyVisualization(viewMode);
  }, [viewMode]);

  // Function to apply visualization based on viewMode
  const applyVisualization = (mode: "model" | "pressure" | "velocity" | "streamlines") => {
    if (!modelRef.current) return;
    
    // Reset material
    let material: THREE.Material;
    
    switch (mode) {
      case "model":
        material = new THREE.MeshPhongMaterial({
          color: 0xf5f5f5,
          specular: 0x111111,
          shininess: 200
        });
        break;
      case "pressure":
        // Pressure visualization with vertex colors
        material = new THREE.MeshPhongMaterial({
          vertexColors: true,
          specular: 0x111111,
          shininess: 100
        });
        
        // Apply vertex colors - this is a simplified example
        // In a real app, these colors would be calculated from CFD results
        if (modelRef.current.geometry instanceof THREE.BufferGeometry) {
          const geometry = modelRef.current.geometry;
          const positions = geometry.getAttribute('position');
          const colors = new Float32Array(positions.count * 3);
          
          for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            
            // Map y position to a color (simple gradient from red to blue)
            const normalizedY = (y + 1) / 2; // normalize to 0-1
            
            // Red to blue gradient
            colors[i * 3] = 1 - normalizedY; // R
            colors[i * 3 + 1] = 0.2; // G
            colors[i * 3 + 2] = normalizedY; // B
          }
          
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        }
        break;
      case "velocity":
        // Velocity visualization - another color scheme
        material = new THREE.MeshPhongMaterial({
          vertexColors: true,
          specular: 0x222222,
          shininess: 150
        });
        
        // Apply different vertex colors for velocity
        if (modelRef.current.geometry instanceof THREE.BufferGeometry) {
          const geometry = modelRef.current.geometry;
          const positions = geometry.getAttribute('position');
          const colors = new Float32Array(positions.count * 3);
          
          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            
            // Map x position to a color
            const normalizedX = (x + 1) / 2; // normalize to 0-1
            
            // Yellow to green gradient
            colors[i * 3] = normalizedX; // R
            colors[i * 3 + 1] = 1; // G
            colors[i * 3 + 2] = 0.2; // B
          }
          
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        }
        break;
      case "streamlines":
        // Streamline visualization - semi-transparent mesh with streamlines
        material = new THREE.MeshPhongMaterial({
          color: 0xdddddd,
          specular: 0x333333,
          shininess: 100,
          opacity: 0.7,
          transparent: true
        });
        
        // Add streamlines around the model
        if (modelRef.current && sceneRef.current) {
          // Remove existing streamlines if any
          const existingStreamlines = sceneRef.current.children.filter(
            child => child.name === 'streamline'
          );
          existingStreamlines.forEach(line => sceneRef.current?.remove(line));
          
          // Get model dimensions for generating streamlines
          const bbox = new THREE.Box3().setFromObject(modelRef.current);
          const size = bbox.getSize(new THREE.Vector3());
          const modelLength = Math.max(size.x, size.y, size.z);
          
          // Create streamlines - simplistic representation
          const streamlineCount = 15;
          const streamlineLength = modelLength * 2;
          const streamlineColor = 0x3b82f6; // Blue color for streamlines
          
          // Create streamlines around the model 
          for (let i = 0; i < streamlineCount; i++) {
            // Vary the starting positions
            const yPos = (i / streamlineCount) * size.y - size.y/2;
            const xPos = ((i % 5) / 5) * size.x - size.x/2;
            
            // Create curved path for streamline
            const curve = new THREE.CubicBezierCurve3(
              new THREE.Vector3(-modelLength, yPos, xPos), // Start before the model
              new THREE.Vector3(-modelLength/3, yPos + (Math.random()-0.5)*size.y/4, xPos + (Math.random()-0.5)*size.x/4), // Control point 1
              new THREE.Vector3(modelLength/3, yPos + (Math.random()-0.5)*size.y/3, xPos + (Math.random()-0.5)*size.x/3), // Control point 2
              new THREE.Vector3(modelLength, yPos, xPos) // End after the model
            );
            
            // Create streamline geometry
            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Create streamline material with varying opacity based on position
            const streamlineMaterial = new THREE.LineBasicMaterial({ 
              color: streamlineColor,
              linewidth: 1.5,
              opacity: 0.7,
              transparent: true
            });
            
            // Create the line
            const streamline = new THREE.Line(geometry, streamlineMaterial);
            streamline.name = 'streamline';
            sceneRef.current.add(streamline);
          }
        }
        break;
    }
    
    modelRef.current.material = material;
  };

  // Set control mode
  const setControlMode = (mode: "pan" | "rotate" | "zoom") => {
    if (!controlsRef.current) return;
    
    setActiveControl(mode);
    
    switch (mode) {
      case "pan":
        controlsRef.current.enablePan = true;
        controlsRef.current.enableRotate = false;
        controlsRef.current.enableZoom = false;
        break;
      case "rotate":
        controlsRef.current.enablePan = false;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enableZoom = false;
        break;
      case "zoom":
        controlsRef.current.enablePan = false;
        controlsRef.current.enableRotate = false;
        controlsRef.current.enableZoom = true;
        break;
    }
  };

  return (
    <div className="flex-1 relative" ref={containerRef}>
      {/* Pressure/Velocity color legend */}
      <div className="absolute right-4 bottom-4 bg-dark-surface/80 backdrop-blur-sm p-3 rounded-lg border border-dark-border">
        <div className="text-xs text-white font-medium mb-1">Pressure (Pa)</div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-32 bg-gradient-to-b from-red-500 via-yellow-500 to-blue-500 rounded"></div>
          <div className="flex flex-col justify-between h-32 text-xs text-gray-300">
            <div>+3000</div>
            <div>+1500</div>
            <div>0</div>
            <div>-1500</div>
            <div>-3000</div>
          </div>
        </div>
      </div>
      
      {/* Viewport Controls */}
      <div className="absolute left-4 bottom-4 bg-dark-surface/80 backdrop-blur-sm p-2 rounded-lg border border-dark-border">
        <div className="grid grid-cols-3 gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`p-1 ${activeControl === "pan" ? "bg-dark-bg" : ""}`}
                  onClick={() => setControlMode("pan")}
                >
                  <PenTool className="h-5 w-5 text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`p-1 ${activeControl === "rotate" ? "bg-dark-bg" : ""}`}
                  onClick={() => setControlMode("rotate")}
                >
                  <Rotate3d className="h-5 w-5 text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rotate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`p-1 ${activeControl === "zoom" ? "bg-dark-bg" : ""}`}
                  onClick={() => setControlMode("zoom")}
                >
                  <ZoomIn className="h-5 w-5 text-gray-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* View Modes */}
      <div className="absolute top-4 left-4 bg-dark-surface/80 backdrop-blur-sm rounded-lg border border-dark-border overflow-hidden">
        <div className="flex text-xs">
          <Button 
            variant="ghost" 
            className={`px-3 py-2 rounded-none ${viewMode === "model" ? "bg-primary text-white" : "hover:bg-dark-bg text-gray-300"}`}
            onClick={() => onViewModeChange("model")}
          >
            Model
          </Button>
          <Button 
            variant="ghost" 
            className={`px-3 py-2 rounded-none ${viewMode === "pressure" ? "bg-primary text-white" : "hover:bg-dark-bg text-gray-300"}`}
            onClick={() => onViewModeChange("pressure")}
          >
            Pressure
          </Button>
          <Button 
            variant="ghost" 
            className={`px-3 py-2 rounded-none ${viewMode === "velocity" ? "bg-primary text-white" : "hover:bg-dark-bg text-gray-300"}`}
            onClick={() => onViewModeChange("velocity")}
          >
            Velocity
          </Button>
          <Button 
            variant="ghost" 
            className={`px-3 py-2 rounded-none ${viewMode === "streamlines" ? "bg-primary text-white" : "hover:bg-dark-bg text-gray-300"}`}
            onClick={() => onViewModeChange("streamlines")}
          >
            Streamlines
          </Button>
        </div>
      </div>
      
      {/* Empty state when no model is loaded */}
      {!modelId && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-gray-400 mb-2">No model loaded</div>
          <p className="text-sm text-gray-500">Upload an STL file to visualize</p>
        </div>
      )}
    </div>
  );
}
