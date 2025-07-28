# 🏗️ Unpuzzle Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js App Router] --> B[Feature Modules]
        B --> C[Shared Components]
        B --> D[Core Services]
    end
    
    subgraph "Feature Modules"
        E[Auth Module]
        F[Courses Module]
        G[Video Player Module]
        H[Annotations Module]
        I[AI Agents Module]
    end
    
    subgraph "State Management"
        J[Redux Toolkit]
        K[RTK Query]
        L[React Context]
        M[Local Storage]
    end
    
    subgraph "API Layer"
        N[Next.js API Routes]
        O[External APIs]
        P[WebSocket Server]
    end
    
    subgraph "Infrastructure"
        Q[Vercel/AWS]
        R[CDN]
        S[Database]
        T[Object Storage]
    end
    
    B --> E & F & G & H & I
    E & F & G & H & I --> J & K & L
    J & K --> N
    N --> O & S
    G --> P
    A --> Q
    Q --> R & T
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Router Layout                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │              │  │              │  │                    │   │
│  │   (auth)     │  │ (dashboard)  │  │    (learning)      │   │
│  │   Routes     │  │   Routes     │  │     Routes         │   │
│  │              │  │              │  │                    │   │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬──────────┘   │
│         │                  │                     │               │
│         └──────────────────┴─────────────────────┘               │
│                            │                                     │
│                     ┌──────▼───────┐                            │
│                     │              │                            │
│                     │   Features   │                            │
│                     │              │                            │
│                     └──────┬───────┘                            │
│                            │                                     │
│      ┌─────────────────────┼─────────────────────┐              │
│      │                     │                     │              │
│  ┌───▼────┐  ┌────────┐  ┌▼────────┐  ┌────────▼───┐          │
│  │ Auth   │  │Courses │  │ Video   │  │Annotations │          │
│  │Feature │  │Feature │  │ Player  │  │  Feature   │          │
│  └────────┘  └────────┘  └─────────┘  └────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as Custom Hook
    participant R as RTK Query
    participant A as API Route
    participant D as Database
    
    U->>C: User Action
    C->>H: Call Hook
    H->>R: Dispatch Query/Mutation
    R->>A: HTTP Request
    A->>D: Database Query
    D-->>A: Data Response
    A-->>R: JSON Response
    R-->>R: Cache Update
    R-->>H: Return Data
    H-->>C: Update UI
    C-->>U: Render Update
```

## Performance Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Performance Optimization                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Build Time                    Runtime                      │
│  ┌─────────────┐             ┌─────────────┐              │
│  │ Tree Shake  │             │ Lazy Load   │              │
│  │ Dead Code   │             │ Components  │              │
│  │ Elimination │             └─────────────┘              │
│  └─────────────┘                                          │
│                               ┌─────────────┐              │
│  ┌─────────────┐             │   React     │              │
│  │ Bundle      │             │   Memo &    │              │
│  │ Splitting   │             │  useCallback │              │
│  └─────────────┘             └─────────────┘              │
│                                                            │
│  ┌─────────────┐             ┌─────────────┐              │
│  │   Image     │             │   Request   │              │
│  │ Optimization│             │   Caching   │              │
│  └─────────────┘             └─────────────┘              │
│                                                            │
│  ┌─────────────┐             ┌─────────────┐              │
│  │    CSS      │             │  Virtualize │              │
│  │  Modules    │             │  Long Lists │              │
│  └─────────────┘             └─────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure Visualization

```
src/
├── 📁 app/                    [Next.js App Router]
│   ├── 📁 (auth)/            [Auth Layout Group]
│   ├── 📁 (dashboard)/       [Dashboard Layout Group]
│   └── 📁 (learning)/        [Learning Layout Group]
│
├── 📁 features/              [Feature-based Modules]
│   ├── 📁 auth/
│   │   ├── 📁 components/
│   │   ├── 📁 hooks/
│   │   ├── 📁 services/
│   │   ├── 📁 store/
│   │   └── 📁 types/
│   │
│   ├── 📁 courses/
│   │   └── [Same structure]
│   │
│   └── 📁 video-player/
│       └── [Same structure]
│
├── 📁 shared/                [Shared Resources]
│   ├── 📁 components/
│   │   ├── 📁 ui/           [Primitive Components]
│   │   ├── 📁 layouts/      [Layout Components]
│   │   └── 📁 feedback/     [Feedback Components]
│   │
│   ├── 📁 hooks/            [Shared Hooks]
│   ├── 📁 utils/            [Utilities]
│   └── 📁 types/            [Shared Types]
│
└── 📁 core/                 [Core Setup]
    ├── 📁 config/           [App Configuration]
    ├── 📁 providers/        [Context Providers]
    ├── 📁 store/            [Redux Store]
    └── 📁 lib/              [External Libraries]
```

## State Management Flow

```mermaid
graph LR
    subgraph "Component Layer"
        A[Component] --> B[useSelector/useQuery]
        A --> C[useDispatch/useMutation]
    end
    
    subgraph "Redux Store"
        D[Actions] --> E[Reducers]
        E --> F[State]
        G[RTK Query] --> F
    end
    
    subgraph "API Layer"
        H[API Endpoints]
        I[Cache Management]
    end
    
    B --> F
    C --> D
    G --> H
    H --> I
    I --> F
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend                          Backend                  │
│  ┌─────────────┐                  ┌─────────────┐         │
│  │   Clerk     │                  │    API      │         │
│  │   Auth      │◄────────────────►│   Routes    │         │
│  └─────────────┘                  └──────┬──────┘         │
│                                           │                 │
│  ┌─────────────┐                  ┌──────▼──────┐         │
│  │   Input     │                  │ Middleware   │         │
│  │ Validation  │                  │ Validation   │         │
│  └─────────────┘                  └──────┬──────┘         │
│                                           │                 │
│  ┌─────────────┐                  ┌──────▼──────┐         │
│  │   Content   │                  │    Rate      │         │
│  │  Security   │                  │  Limiting    │         │
│  │   Policy    │                  └──────┬──────┘         │
│  └─────────────┘                         │                 │
│                                   ┌──────▼──────┐         │
│                                   │   Database   │         │
│                                   │  Encryption  │         │
│                                   └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        A[Local Dev] --> B[Git Push]
    end
    
    subgraph "CI/CD Pipeline"
        B --> C[GitHub Actions]
        C --> D[Lint & Test]
        D --> E[Build]
        E --> F[Deploy]
    end
    
    subgraph "Infrastructure"
        F --> G[Vercel/AWS]
        G --> H[Edge Functions]
        G --> I[Static Assets]
        I --> J[CDN]
    end
    
    subgraph "Monitoring"
        G --> K[Sentry]
        G --> L[Analytics]
        G --> M[Logs]
    end
```

## Performance Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                 Performance Metrics Dashboard                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │    LCP      │  │    FID      │  │    CLS      │       │
│  │  < 2.5s     │  │  < 100ms    │  │  < 0.1      │       │
│  │    ✅       │  │     ✅      │  │     ✅      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Bundle    │  │   Memory    │  │    API      │       │
│  │   < 300KB   │  │   < 50MB    │  │  < 200ms    │       │
│  │     ✅      │  │     ✅      │  │     ✅      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Real-time Performance Graph          │      │
│  │    100 ┤                                         │      │
│  │     90 ┤        ╱╲    ╱╲                        │      │
│  │     80 ┤    ╱╲╱  ╲╱╲╱  ╲╱╲                    │      │
│  │     70 ┤╱╲╱╲            ╲╱╲╱╲╱               │      │
│  │     60 ┤                                       │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

This architecture ensures:
- **Scalability**: Modular design allows easy feature additions
- **Performance**: Optimized bundle sizes and runtime efficiency
- **Maintainability**: Clear separation of concerns
- **Type Safety**: Full TypeScript coverage
- **Testing**: Comprehensive test coverage
- **Security**: Multiple layers of protection
- **Monitoring**: Real-time performance tracking