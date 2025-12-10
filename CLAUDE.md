# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Career Roadmap Tool is a Next.js application that generates personalized career development roadmaps for tech professionals. It uses a modular persona-driven architecture where user inputs (role, experience level, background) are decomposed into modular components that are merged together to produce customized roadmap data.

**Tech Stack**: Next.js 13 (Pages Router), React 18, Tailwind CSS, Styled Components, Recharts, Radix UI

---

## Development Commands

### Frontend
```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production build locally
npm start

# Linting
npm run lint

# Validate persona JSON files (check for syntax errors)
cd frontend && node -c src/configs/personas/roles/*.json
```

**Prerequisites**: Node.js 18.x

### Backend (Reference Only)
Currently, the backend folder contains Python utility files for skill analysis that serve as reference. These are not deployed. Skill analysis runs entirely on the frontend.

---

## Code Architecture

### 1. Modular Persona System

The app uses a **decomposition → merge → enrich** pattern for building roadmaps:

```
User Quiz Input
    ↓
decomposeToModularPersona()
    ↓
(role, level, userType, companyType)
    ↓
Load modular templates from /src/configs/personas/
    ↓
deepMerge() - intelligently merges templates
    ↓
Enrich with calculated data (skills gap, timeline, etc)
    ↓
Final roadmap output
```

**Key File**: [frontend/src/utils/RoadmapCompositionOrchestrator.js](frontend/src/utils/RoadmapCompositionOrchestrator.js)

This file contains the orchestration logic with NO fallbacks or hardcoding - everything is data-driven.

### 2. Configuration Structure

All persona/role data is stored in modular JSON files at [frontend/src/configs/personas/](frontend/src/configs/personas/):

```
personas/
├── roles/                    # Target roles (backend, frontend, fullstack, devops, data)
│   ├── backend.json
│   ├── frontend.json
│   └── ...
├── levels/                   # Experience levels (junior, mid, senior)
│   └── *.json
├── user-types/              # Background types (tech_professional, career_switcher)
│   └── *.json
├── company-types/           # Company categories (startup, scaleup, bigtech)
│   └── *.json
└── _persona_list.json       # Registry of all available personas
```

**Important**: Each role JSON has a consistent structure with sections like:
- `skillMap` - skill definitions and categorization
- `phases` - learning phases with timeline
- `projects` - recommended projects
- `companies` - target companies

### 3. State Management

[UnifiedContext.js](frontend/src/context/UnifiedContext.js) provides centralized state for:
- Profile data (imported from Free Profile Evaluator)
- Quiz responses and user choices
- Current skills selection
- Generated roadmap
- UI state (loading, error)

**Usage**:
```javascript
import { useUnified } from '../context/UnifiedContext';

function MyComponent() {
  const { profileData, currentSkills, setCurrentSkills } = useUnified();
}
```

Backward-compatible hooks `useProfile()` and `useRoadmap()` are available but just aliases to `useUnified()`.

### 4. Page Structure

Key pages in [frontend/pages/](frontend/pages/):
- `index.js` → `/` - Landing/Quiz page (uses QuizPage component)
- `quiz.js` → `/quiz` - Quiz flow (deprecated, quiz moved to index)
- `roadmap-new.js` → `/roadmap-new` - Main roadmap results page
- `api/` - API routes for backend integration (currently unused, uses mock data)

**Important**: The app defaults to `/roadmap-new` after quiz completion. Other pages like `/roadmap` and `/roadmap-experimental` are reference implementations.

### 5. Component Organization

[frontend/src/components/](frontend/src/components/):
- `quiz/` - Quiz flow components (questions, orchestrator)
- `roadmap/` - Old roadmap implementation (reference)
- `roadmap-new/` - **ACTIVE** roadmap implementation
- `questions/` - Individual question components
- `common/` - Shared UI components (Header, Navigation, Sidebar)
- `ui/` - Radix UI + shadcn/ui components

### 6. Key Utilities

[frontend/src/utils/](frontend/src/utils/):
- **RoadmapCompositionOrchestrator.js** - Main orchestration logic (decompose → merge → enrich)
- **compositionHelpers.js** - Helper functions for template merging
- **personaMatching.js** - Logic to match user inputs to personas
- **skillMetadata.js** - Skill definitions and categorization
- **careerTopics.json** - Career phases data (shared with Scaler CRT)
- **videoConfig.js** - Video embeddings configuration

---

## Important Architecture Patterns

### No Fallbacks, No Mock Data
The `RoadmapCompositionOrchestrator` is designed with **NO fallbacks**:
- Every config file must exist if referenced
- Missing data throws clear errors (not silent failures)
- All data comes from actual config files, not hardcoded defaults

### Deep Merge Strategy
Templates are merged using `deepMerge()` which:
1. Recursively merges nested objects
2. Arrays are completely replaced (not merged)
3. Later values override earlier values
4. Preserves properties from target if source doesn't have them

**This matters**: When adding new role configs, ensure you don't accidentally delete nested properties from base templates.

### Quiz Response Normalization
User inputs go through normalization before persona matching:
- Role names are case-insensitive and support aliases (e.g., "Senior Backend Engineer" → "backend")
- Experience years are mapped to levels (0-2 → junior, 2-5 → mid, 5+ → senior)
- Background is normalized to "tech_professional" or "career_switcher"
- Company types are normalized to standardized keys

**Key File**: The `normalize*` functions in RoadmapCompositionOrchestrator.js contain the mapping tables.

---

## Common Development Tasks

### Adding a New Role
1. Create `frontend/src/configs/personas/roles/NEW_ROLE.json` with structure matching existing roles
2. Add entry to `frontend/src/configs/personas/_persona_list.json`
3. Update role mapping table in `normalizeRole()` in RoadmapCompositionOrchestrator.js
4. Test with quiz selecting new role

### Adding Skills to a Role
1. Edit the role's JSON file in `roles/`
2. Update `skillMap.available` array with new skills
3. Categorize in `skillMap.categories` if needed
4. Update `skillMap.thresholds` if defining custom priorities

### Debugging Roadmap Generation
The orchestrator logs extensively. Check browser console for:
- "Decomposing to modular persona..." - Shows role/level/userType/company
- "Loading modular templates..." - Which config files were loaded
- "Merging templates with priority..." - Order of merges
- "Enriching roadmap with calculated data..." - Final enrichment steps

Enable debug logging by adding to RoadmapCompositionOrchestrator:
```javascript
const DEBUG = true; // Set to true for verbose logging
```

### Testing Persona Matching
The app stores quiz responses in localStorage as `scalerCareerRoadmapState`. To test different personas:
1. Open DevTools → Application → localStorage
2. Edit `scalerCareerRoadmapState` JSON to change `targetRole`, `yearsOfExperience`, `background`, etc
3. Refresh page to see how roadmap changes

### Styling Consistency
- Uses Tailwind CSS for utility classes + Styled Components for complex styling
- Colors defined in Tailwind config from Free Profile Evaluator design system
- Icons from Phosphor React (`phosphor-react` package)
- Some components use shadcn/ui (Radix UI wrapped with Tailwind)

### Validating Persona Configurations
After modifying persona JSON files, always validate:

1. **JSON Syntax** - Ensure no parsing errors:
   ```bash
   node -c frontend/src/configs/personas/roles/backend.json
   ```

2. **Required Fields** - Check against schema:
   - Each role file must have `metadata.role`, `metadata.roleLabel`, `metadata.skills[]`
   - Skills must include all required fields: `name`, `category`, `priority`, `description`
   - See [PERSONA_JSON_SCHEMA.md](PERSONA_JSON_SCHEMA.md) for complete requirements

3. **Test in Browser** - After changes:
   - Clear localStorage: `localStorage.clear()`
   - Run the quiz and select the modified role
   - Check browser console for composition errors or warnings
   - Verify all sections load correctly (hero, skillsGap, phases, etc.)

4. **Common Issues**:
   - Trailing commas in JSON arrays/objects
   - Missing required fields in skill definitions
   - Invalid priority values (must be: critical, high, medium, low)
   - Array vs object merge confusion in template merging

---

## Data Files to Know

### careerTopics.json
Large JSON file defining learning phases for each role. Structure:
```json
{
  "role_key": {
    "phases": [
      {
        "title": "Phase name",
        "duration": "timeframe",
        "skills": ["skill1", "skill2"],
        "topics": [...]
      }
    ]
  }
}
```

This is **shared with Scaler CRT** (Scaler's Career Roadmap Tool). Keep in sync if updating.

### Persona JSON Files
Each role file (backend.json, frontend.json, etc.) uses a **data-driven structure** where all content is configuration rather than code. Current structure:
```json
{
  "metadata": {
    "role": "backend",
    "roleLabel": "Backend Engineer",
    "description": "Role description",
    "skills": [                    // All skills for this role
      {
        "name": "Skill Name",
        "category": "backend",     // Categorization
        "priority": "critical",    // critical | high | medium | low
        "description": "Skill details"
      }
    ]
  },
  "hero": {...},                 // Landing section content
  "skillsGap": {...},            // Skill gap analysis section
  "phases": [...],               // Learning phases
  "projects": [...],             // Project recommendations
  "companies": [...],            // Target companies
  "timeline": {...}              // Timeline adjustments
}
```

**Important**: For the complete schema definition, see [PERSONA_JSON_SCHEMA.md](PERSONA_JSON_SCHEMA.md) which documents all sections and their exact structure.

---

## Common Gotchas

1. **Stale localStorage**: The app stores state for 24 hours. Old data may cause issues. Clear localStorage to reset.

2. **Missing Normalizations**: New role names must be added to the mapping table in `normalizeRole()`. Without this, the role won't be recognized.

3. **Array vs Object Merge**: In `deepMerge()`, arrays are replaced, not merged. If you want to extend skills from a base template, merge manually or restructure as objects.

4. **Next.js SSR**: LocalStorage operations are guarded with `typeof window !== 'undefined'` checks to prevent SSR errors.

5. **Video Embeds**: Videos are configured in [videoConfig.js](frontend/src/utils/videoConfig.js). YouTube IDs must be exact or embeds will break.

---

## File Organization Tips

- **Config files** (`/src/configs/`) should be JSON - easy to validate and version
- **Utility functions** (`/src/utils/`) should export pure functions with clear inputs/outputs
- **Components** (`/src/components/`) should use React hooks and avoid prop drilling (use context)
- **Styles** mixed between Tailwind utility classes (preferred) and Styled Components (for complex CSS)

---

## Deployment Notes

- **Frontend**: Deployed on Render, Railway, or similar Node.js hosting
- **Build**: `npm run build` creates `.next/` folder, `npm start` serves it
- **Environment**: Set `NEXT_PUBLIC_API_BASE_URL` if backend API is needed (currently unused, using mock data)
- **Node Version**: Must be 18.x (specified in package.json `engines`)

---

## Future Integration Points

Marked in code with `// FUTURE:` comments:
- Integration with Scaler.com API for real user profiles (currently accepts manual input)
- OpenAI API for AI chat feature (UI exists, integration pending)
- Progress tracking and persistence to backend
- PDF export functionality

The roadmap generation is fully data-driven from persona configuration files. To integrate with external APIs:
1. Fetch persona data instead of loading from static JSON files
2. Dynamically load configurations based on API responses
3. Maintain the same `deepMerge()` composition logic

---

## Project References

- **Free Profile Evaluator**: Design system reference (Plus Jakarta Sans font, color palette, UI patterns)
- **Scaler CRT**: Skill analysis algorithms and `careerTopics.json` data source
- [frontend/README.md](frontend/README.md): User-facing documentation and deployment instructions
- [PERSONA_JSON_SCHEMA.md](PERSONA_JSON_SCHEMA.md): Complete JSON structure specification for persona configurations
- [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md): Recent refactoring work (Dec 9, 2025) - persona cleanup and validation
- [MIGRATION_PROGRESS.md](frontend/MIGRATION_PROGRESS.md): Historical context on Next.js migration
