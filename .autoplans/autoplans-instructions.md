# Copilot Instructions

This document provides guidance for AI coding agents working on this project.

---

## Project Overview

This is a React application built with modern web technologies for rapid development.

---

## Architecture and Key Patterns

### Component Structure
- Organize components by feature or domain
- Use TypeScript for type safety
- Follow React best practices and hooks patterns

### Styling
- Use Tailwind CSS utility classes
- Leverage Shadcn UI components for consistency
- Keep styles co-located with components

---

## Task Management with Autoplans

This project uses **autoplans.dev** for intelligent task management. AI agents can utilize the following tools:

### Available Autoplans Tools

When this project is linked to an AutoPlans.dev project, you have access to these MCP tools:

**Project Management:**
- `autoplans_list_projects` - List all projects
- `autoplans_create_project` - Create a new project
- `autoplans_get_project` - Get project details

**Task Management:**
- `autoplans_create_task` - Create a new task
- `autoplans_list_tasks` - List all tasks in a project
- `autoplans_get_task` - Get task details including subtasks
- `autoplans_update_task` - Update task properties
- `autoplans_delete_task` - Delete a task
- `autoplans_bulk_update_tasks` - Update multiple tasks
- `autoplans_bulk_create_tasks` - Create multiple tasks

**Repository Sync:**
- `autoplans_sync_project_to_repo` - Sync project files to repository
- `autoplans_initialize_autoplans_folder` - Initialize .autoplans folder
- `autoplans_generate_copilot_config` - Generate Copilot configuration

### Task Management Guidelines
1. **Check Tasks**: Use `autoplans_list_tasks` to view assigned tasks before starting work
2. **Create Tasks**: Use `autoplans_create_task` with appropriate type (coding/design/documentation/testing)
3. **Update Progress**: Update task status using `autoplans_update_task`
4. **Plan Features**: Break down large features into smaller tasks

### Project Linking

When AI agents create a new AutoPlans project or link this app to a project:
- The `autoplans-project-id` file will be created/updated automatically
- This file contains the project UUID needed for all MCP tool operations

---

## Development Workflows

### Build and Run
- **Install Dependencies**: `npm install` or `pnpm install`
- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`

---

*Last updated: {{TIMESTAMP}}*
*Managed by autoplans.dev*
