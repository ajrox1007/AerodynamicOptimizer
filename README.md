# Aerodynamic Optimizer

A web application for 3D aerodynamic analysis and optimization using CFD (Computational Fluid Dynamics) simulations powered by AI recommendations.

![Uploading Screenshot 2025-09-16 at 11.08.44 AM.png…]()


## 🚀 Features

### Core Functionality
- **STL File Upload**: Drag-and-drop interface for 3D model uploads (up to 100MB)
- **3D Model Visualization**: Interactive Three.js-powered 3D viewer with orbit controls
- **CFD Simulation**: OpenFOAM-based computational fluid dynamics analysis
- **AI-Powered Optimization**: OpenAI GPT-4 integration for intelligent aerodynamic recommendations
- **Real-time Results**: Interactive visualization of pressure maps, velocity fields, and streamlines

### Advanced Features
- **Multi-view Analysis**: Switch between model view, pressure visualization, velocity fields, and streamlines
- **Customizable Simulation Settings**: Configure fluid medium, velocity, pressure, and boundary conditions
- **AI Optimization Goals**: 
  - Minimize Drag
  - Maximize Lift
  - Optimize Lift/Drag Ratio
  - Reduce Turbulence
- **Smart Recommendations**: AI-generated suggestions with estimated improvement percentages
- **Before/After Comparison**: Visual comparison of original vs. optimized models
- **Project Management**: Organize multiple aerodynamic projects

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics and STL model rendering
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible UI primitives
- **TanStack Query** - Data fetching and state management
- **Wouter** - Lightweight client-side routing
- **Framer Motion** - Smooth animations
- **Vite** - Fast development and build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Multer** - File upload handling
- **OpenAI API** - AI-powered optimization recommendations

### Database & Storage
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** (via Neon) - Production database
- **In-memory storage** - Development fallback
- **File system** - STL file storage

### CFD & 3D Processing
- **OpenFOAM** - Computational fluid dynamics simulation
- **STL Parser** - 3D model analysis and processing
- **Custom Navier-Stokes Solver** - Simplified CFD calculations

## 📋 Prerequisites

- **Node.js** 20.x or later
- **npm** or **yarn**
- **OpenFOAM** (for advanced CFD simulations)
- **OpenAI API Key** (for AI recommendations)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AerodynamicOptimizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_url_here
NODE_ENV=development
```

### 4. Database Setup
```bash
npm run db:push
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
AerodynamicOptimizer/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── ModelViewer.tsx
│   │   │   ├── FileUploader.tsx
│   │   │   ├── SimulationSettings.tsx
│   │   │   └── ...
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Application pages
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Node.js application
│   ├── lib/                # Server utilities
│   │   ├── openai.ts       # AI integration
│   │   ├── openFoam.ts     # CFD simulation
│   │   └── stlParser.ts    # 3D model processing
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   └── index.ts            # Server entry point
├── shared/                 # Shared TypeScript schemas
├── uploads/                # STL file storage
├── simulations/            # CFD simulation data
└── package.json
```

## 🎯 Usage Guide

### 1. Upload a 3D Model
- Click "Upload STL File" or drag-and-drop an STL file
- Supported format: STL (up to 100MB)
- The model will be automatically analyzed and displayed

### 2. Configure Simulation Settings
- **Fluid Medium**: Air, Water, or Custom
- **Velocity**: Flow speed and direction
- **Pressure**: Ambient pressure conditions
- **Boundary Conditions**: Inlet, outlet, and wall conditions

### 3. Set Analysis Options
- **Calculate Drag Coefficient**: Forces opposing motion
- **Calculate Lift Coefficient**: Forces perpendicular to flow
- **Pressure Distribution**: Surface pressure mapping
- **Velocity Field Analysis**: Flow velocity visualization

### 4. Configure AI Optimization
- **Optimization Goal**: Choose primary objective
- **Constraint Importance**: Balance between shape preservation and performance
- **Generate Explanation**: Get detailed AI reasoning

### 5. Run Simulation
- Click "Run Simulation" to start CFD analysis
- Monitor progress through the simulation modal
- View results in real-time as they become available

### 6. Analyze Results
- **Metrics Panel**: View drag, lift, and efficiency coefficients
- **3D Visualization**: Switch between pressure, velocity, and streamline views
- **AI Recommendations**: Review AI-generated optimization suggestions
- **Apply Changes**: Implement recommended modifications

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details

### Models
- `POST /api/models/upload` - Upload STL file
- `GET /api/models/:id` - Get model details
- `GET /api/stl/:modelId` - Download STL file

### Simulations
- `POST /api/simulate` - Run CFD simulation
- `GET /api/simulations/:id` - Get simulation results

### AI Recommendations
- `POST /api/recommendations` - Generate AI recommendations
- `POST /api/recommendations/:id/apply` - Apply recommendation

## 🎨 UI Components

The application uses a comprehensive design system based on shadcn/ui:

- **Navigation**: Responsive sidebar with collapsible sections
- **File Upload**: Drag-and-drop interface with progress tracking
- **3D Viewer**: Interactive model visualization with controls
- **Settings Panels**: Tabbed configuration interfaces
- **Results Display**: Charts, metrics, and recommendation cards
- **Dark Theme**: Professional dark UI optimized for technical work

## 🔬 CFD Implementation

### Simulation Pipeline
1. **STL Processing**: Parse and analyze 3D geometry
2. **Mesh Generation**: Create computational mesh
3. **Solver Setup**: Configure Navier-Stokes equations
4. **Boundary Conditions**: Apply flow conditions
5. **Iterative Solution**: Solve fluid dynamics equations
6. **Post-processing**: Extract coefficients and visualizations

### Supported Analysis
- **Drag Coefficient (Cd)**: Resistance to flow
- **Lift Coefficient (Cl)**: Perpendicular force generation
- **Lift-to-Drag Ratio**: Aerodynamic efficiency
- **Pressure Distribution**: Surface pressure mapping
- **Velocity Fields**: Flow velocity visualization
- **Streamlines**: Flow path visualization

## 🤖 AI Integration

### OpenAI GPT-4 Integration
- Analyzes CFD simulation results
- Considers optimization goals and constraints
- Generates specific, actionable recommendations
- Provides estimated improvement percentages
- Explains reasoning behind suggestions

### Optimization Strategies
- **Shape Modifications**: Surface geometry changes
- **Edge Treatments**: Smoothing and chamfering
- **Flow Attachments**: Add-on aerodynamic devices
- **Material Considerations**: Surface roughness optimization

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
NODE_ENV=production
OPENAI_API_KEY=your_production_api_key
DATABASE_URL=your_production_database_url
PORT=3000
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenFOAM** community for CFD simulation capabilities
- **Three.js** for 3D visualization
- **OpenAI** for AI-powered optimization
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the styling system

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the aerospace and automotive engineering community**
