# Architecture

## System Design
The application is a client-side image editor using React for the UI and Fabric.js for the canvas manipulation.

## Technology Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Canvas Engine | Fabric.js |
| UI Components | Shadcn UI |
| Styling | Tailwind CSS |
| Icons | Lucide React |

## Key Components
- **Index Page**: Main editor layout with sidebar, toolbar, and canvas.
- **Fabric Canvas**: Handles image rendering, object manipulation, and drawing.
- **History Manager**: Simple JSON-based undo/redo stack.

## Design Patterns
1. **Tool-based State**: Active tool determines canvas interaction mode (select vs drawing).
2. **Ref-based Canvas**: Using `useRef` to maintain the Fabric.js instance across renders.