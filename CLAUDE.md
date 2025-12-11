# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Career Roadmap Tool is a Next.js application that generates personalized career development roadmaps for tech professionals. It uses a **monolithic persona architecture** where complete, pre-generated persona JSON files are loaded based on user quiz responses.

**Tech Stack**: Next.js 13 (Pages Router), React 18, Tailwind CSS, Styled Components, Recharts, Radix UI

**Working Directory**: All development commands should be run from the `frontend/` directory. The project root contains documentation and configuration files.

---

## Development Commands

**All commands must be run from the `frontend/` directory.**

```bash
cd frontend

# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Persona JSON Validation

```bash
# Validate complete persona files
for file in frontend/public/personas/complete/*.json; do
  jq empty "$file" && echo "✅ $(basename $file) valid" || echo "❌ $(basename $file) invalid"
done

# Validate single file
jq empty frontend/public/personas/complete/mid_tech_backend.json
```

### Build & Cache Management

```bash
# Clean build artifacts
rm -rf frontend/.next

# Full clean rebuild
npm run build -- --debug
```

---

## Code Architecture

### 1. Monolithic Persona System

The app uses a **calculate → load → transform → process** pipeline:

```
User Quiz Input
    ↓
determinePersonaFile() [personaCalculator.js]
    ↓
Filename: {level}_{userType}_{role}.json
    ↓
loadPersonaFromQuiz() [personaLoader.js]
    ↓
Fetch from /public/personas/complete/
    ↓
transformPersonaForExperimental() [personaLoader.js]
    ↓
Parallel Processing:
  ├─ calculateAxisScores() [axisCalculator.js]
  │    └─ Determine weak axes
  ├─ filterSkillsByWeakAxes() [skillFilterByAxes.js]
  ├─ calculateFit() [fitCalculator.js]
  └─ generatePhases() [learningPathCalculator.js]
    ↓
Render Roadmap Sections:
  - Hero (title, effort estimate, video)
  - Skill Map (radar chart, skill recommendations)
  - Company Insights (fit analysis)
  - Learning Path (phased timeline)
  - Projects (portfolio builders)
```

### 2. Key Utility Files

[frontend/src/utils/](frontend/src/utils/):

| File | Purpose |
|------|---------|
| `personaCalculator.js` | Determines which persona file to load from quiz responses. Handles normalization of roles, levels, and user types. |
| `personaLoader.js` | Fetches and transforms persona JSON. Contains `loadPersonaFromQuiz()` and two transform functions: `transformPersonaForFrontend()` and `transformPersonaForExperimental()`. |
| `quizSkillLoader.js` | **Primary skill loader** - Loads skills from persona files for quiz. Auto-caches for performance. **Use this for all skill loading.** |
| `axisCalculator.js` | Calculates user's radar chart scores based on skill selection. Dynamically handles all axes defined in persona. Maps quiz bonus selections to axis scores via `skillMap.thresholds.quizMapping`. |
| `skillFilterByAxes.js` | Filters skill recommendations to show only skills for axes where user is weak (below threshold). |
| `fitCalculator.js` | Calculates company fit scores and prepares company insights data. Uses matrix-based fit levels: easy/doable/challenging/stretch based on current→target company transition. |
| `learningPathCalculator.js` | Processes learning path phases and timeline calculations. Dynamically generates phases based on skill coverage percentages from persona file. |
| `compositionHelpers.js` | Helper functions for composing and merging persona data structures. Deep merge utilities. |
| `skillDefinitions.js` | ⚠️ **DEPRECATED** - Do not use. Skills now loaded from persona files via `quizSkillLoader.js`. |
| `skillsData.js` | ⚠️ **DEPRECATED** - Do not use. Wrapper around skillDefinitions.js, replaced by `quizSkillLoader.js`. |

**Legacy Files (Do Not Use)**:
- `algorithmHelpers.js` - Old skill analysis
- `roleMapping.js` - Old role mappings
- `skillPriorities.js` - Old priority data
- `evaluationLogic.js` - Old evaluation logic

These files remain in the codebase but are not used by the current architecture.

### 3. Single Source of Truth: Persona Files

**IMPORTANT**: Persona JSON files are the **single source of truth** for all skill data, learning paths, and roadmap content.

#### How Skills Are Loaded

**Quiz Flow** (Skills are loaded at the skills selection screen):
1. User completes background, experience, and role selection questions
2. At skills screen, we have: `role`, `level` (from yearsOfExperience), `userType`
3. `quizSkillLoader.loadSkillsForQuiz(quizResponses)` determines and fetches the correct persona file
4. Skills are extracted from `skillMap.skillPriorities` and cached
5. Skills are displayed in the quiz with proper axis mappings

**Key Points**:
- Skills are **persona-specific** (different for entry vs mid vs senior)
- Each skill has: `name`, `priority` (high/medium/low), `axes` (which radar axes it contributes to)
- Skills are automatically cached for performance
- No hardcoded skill lists - everything comes from persona files

**Example**: `entry_tech_frontend.json` has basic skills like "HTML5", "CSS3", "JavaScript ES6+", while `senior_tech_frontend.json` includes advanced skills like "Micro Frontends", "Design Systems", etc.

**DO NOT** use `skillDefinitions.js` or `skillsData.js` - they are deprecated.

### 4. Persona File Structure

**Location**: `frontend/public/personas/complete/`

**Naming Convention**: `{level}_{userType}_{role}.json`
- **Levels**: `entry`, `mid`, `senior`
- **User Types**: `tech`, `nontech`
- **Roles**: `backend`, `frontend`, `fullstack`, `devops`, `data`

**Example Files**:
- `mid_tech_backend.json` - Mid-level tech professional → Backend
- `entry_nontech_frontend.json` - Entry-level non-tech → Frontend
- `senior_tech_devops.json` - Senior tech professional → DevOps

**30 total combinations** (3 levels × 2 user types × 5 roles)

### 4. Persona JSON Schema

Each persona file contains all data for the roadmap with zero runtime logic:

```json
{
  "meta": { "personaId", "roleLabel", "level", "userType" },
  "hero": { "title", "skillsToLearn", "estimatedEffort", "videoUrl" },
  "skillMap": {
    "radarAxes": [...],           // Radar chart axis definitions
    "radarAxesConfig": {...},     // Per-userType axis configs
    "skillPriorities": {          // Skills organized by priority
      "high": [...],
      "medium": [...],
      "low": [...]
    },
    "thresholds": {...}           // Axis score thresholds
  },
  "companyInsights": {...},       // Company type cards
  "learningPath": { "phases": [...] },
  "projects": [...]
}
```

See [PERSONA_JSON_SCHEMA.md](PERSONA_JSON_SCHEMA.md) for complete schema documentation.

### 5. State Management

[UnifiedContext.js](frontend/src/context/UnifiedContext.js) provides centralized state:

```javascript
import { useUnified } from '@/context/UnifiedContext';

const { profileData, currentSkills, setCurrentSkills, quizResponses } = useUnified();
```

**LocalStorage Persistence**:
- State auto-saves to `scalerCareerRoadmapState` in localStorage
- Cached state expires after 24 hours (automatic cleanup)
- SSR-aware: only runs in browser (`typeof window !== 'undefined'`)
- Includes `_timestamp` field to track state age

### 6. Page Structure

**Pages** ([frontend/pages/](frontend/pages/)):
- `index.js` → `/` - Landing/Quiz page
- `roadmap-experimental-v2.js` → `/roadmap-experimental-v2` - Main roadmap results (active)

**Experimental Components** ([frontend/experimental/](frontend/experimental/)):
- `roadmap-experimental-v2/` - Active roadmap sections (Hero, Skills, Learning Path, Companies, Projects)

### 7. Component Organization

[frontend/src/components/](frontend/src/components/):

- `quiz/` - Quiz flow components (QuizOrchestrator, QuizUI, question screens)
- `roadmap-new/` - Shared roadmap components (Hero, Navbar, CompanyTicker, ChatBubbleNew, etc.)
- `roadmap/` - Legacy roadmap components
- `ui/` - Radix UI + shadcn/ui reusable components

### 8. API Routes

[frontend/pages/api/](frontend/pages/api/):

- `config/template.js` - Provides persona template configuration
- `logo/[domain].js` - Fetches company logos dynamically
- `skills/[targetRole].js` - Returns skill data for a specific role

**Backend Integration**:
- Health check ping sent to `NEXT_PUBLIC_API_BASE_URL/health` on app load
- No errors logged for failed pings (silent failure)

---

## Quiz Response Normalization

The `personaCalculator.js` normalizes user inputs:

| Input | Normalizes To |
|-------|---------------|
| "Backend Engineer", "server engineer" | `backend` |
| "0-2", "junior", "fresher" | `entry` |
| "2-5", "mid", "intermediate" | `mid` |
| "5-8", "8+", "senior", "expert" | `senior` |
| "non-tech", "nontech" | `nontech` |

---

## Common Development Tasks

### Adding a New Persona

1. Create `frontend/public/personas/complete/{level}_{userType}_{role}.json`
2. Follow schema from existing persona files
3. Validate with `jq empty <file>`
4. Test by selecting matching options in quiz

### Adding a New Role

1. Create 6 persona files (3 levels × 2 user types)
2. Update role mapping in `normalizeRole()` in [personaCalculator.js](frontend/src/utils/personaCalculator.js)
3. Test with quiz selecting new role

### Styling

- Tailwind CSS for utility classes
- Styled Components for complex styling
- Icons from Phosphor React (`phosphor-react`) and Lucide React (`lucide-react`)
- Animations via Framer Motion (`framer-motion`)
- shadcn/ui components (Radix UI + Tailwind)

---

## Debugging

### Browser DevTools

```javascript
// View quiz state
JSON.parse(localStorage.getItem('scalerCareerRoadmapState'))

// Clear state and restart
localStorage.clear(); location.reload();
```

### Console Logs

Look for these in browser console:
- "🎯 Persona Calculator:" - Shows role/level/userType normalization
- "✅ Loaded persona:" - Confirms persona file loaded
- "🔄 transformPersonaForExperimental" - Shows data transformation

---

## Common Gotchas

1. **Stale localStorage**: Clear with `localStorage.clear()` when testing different personas
2. **Missing persona file**: Fallback loads `mid_tech_backend.json` - check console for errors
3. **JSON syntax errors**: Always validate with `jq empty` before testing
4. **New roles**: Must add to `normalizeRole()` mapping table or role won't be recognized
5. **Radar axes**: Each persona defines its own axes via `radarAxes` - ensure consistency across roles
6. **Next.js SSR**: LocalStorage operations need `typeof window !== 'undefined'` guards

---

## Path Aliases

```javascript
import { useUnified } from '@/context/UnifiedContext';
import { loadPersona } from '@/utils/personaLoader';
```

Available: `@/components/*`, `@/context/*`, `@/utils/*`, `@/configs/*`, `@/lib/*`

---

## Next.js Configuration

[frontend/next.config.js](frontend/next.config.js) includes:

- **Styled Components**: Compiler enabled for SSR support
- **Image domains**: `cdn.brandfetch.io`, `img.logo.dev`, `logo.clearbit.com` (for company/skill logos)
- **SVG imports**: Configured via `@svgr/webpack` to import SVGs as React components
- **Environment variables**: `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`)

## External Dependencies

- **Node.js**: 18.x required
- **jq**: Required for persona JSON validation

---

## Additional Documentation

Extensive documentation files in project root:

- [PERSONA_JSON_SCHEMA.md](PERSONA_JSON_SCHEMA.md) - Complete persona file schema and structure
- [QUIZ_TO_PERSONA_MAPPING.md](QUIZ_TO_PERSONA_MAPPING.md) - How quiz responses map to persona files
- [EXPERIMENTAL_V2_SETUP.md](EXPERIMENTAL_V2_SETUP.md) - Experimental roadmap version setup
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Detailed implementation reference

---

## Reference Files (Legacy)

The `frontend/public/personas/` folder contains legacy modular files (`roles/`, `levels/`, `user-types/`, `company-types/`) from the old decomposition architecture. These are **not used** - the app now loads only from `/public/personas/complete/`.
