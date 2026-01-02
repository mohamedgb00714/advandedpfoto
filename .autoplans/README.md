# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

## Overview

This project is managed using [autoplans.dev](https://autoplans.dev) - an AI-powered development automation platform.

## `.autoplans/` Folder Structure

This folder serves as the **source of truth** for AI agents working on this project:

```
.autoplans/
├── README.md              # This file - project overview
├── architecture.md        # System architecture and design
├── tasks.md               # Current tasks and progress
├── autoplans-instructions.md  # Detailed agent instructions
└── tasks/                 # Individual task files (future use)
```

## For AI Agents

**Before starting ANY work:**

1. Read this entire folder for context
2. Check `tasks.md` for current priorities
3. Refer to `architecture.md` for system design
4. Follow patterns in `AGENTS.md` (project root)

**Available AutoPlans tools:**
- `autoplans_list_tasks` - Get tasks from cloud
- `autoplans_create_task` - Create new tasks  
- `autoplans_update_task` - Update task status
- `autoplans_sync_project_to_repo` - Sync changes back

## Documentation

- [Tasks](./tasks.md) - Current task list and progress
- [Architecture](./architecture.md) - System architecture and design decisions
- [Instructions](./autoplans-instructions.md) - Detailed agent guidelines

---

*This directory is automatically managed by autoplans.dev. Manual edits may be overwritten during sync.*
