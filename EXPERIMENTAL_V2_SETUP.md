# Experimental-V2 Setup - Persona-Driven Architecture

## Overview
Successfully implemented a clean, persona-driven architecture where:
- **Frontend**: Only UI components (experimental-v2 folder)
- **Data**: 100% driven by persona JSON files
- **No Backend**: Data loading done via JSON, no orchestration logic

## What's Been Created

### 1. Persona JSON Files
- **Location**: `frontend/src/configs/personas/personas/`
- **Example**: `tech_mid_backend.json` (567 lines, fully populated)
- **Structure**: Meta, Hero, SkillMap, CompanyInsights, LearningPath, Projects

### 2. Persona Loader Utilities
- **Location**: `frontend/src/utils/personaLoader.js`
- **Functions**:
  - `loadPersona(personaId)` - Loads persona JSON dynamically
  - `transformPersonaForExperimental(persona, userSelectedSkills)` - Transforms to experimental component format
  - `getPersonaIdFromQuiz(quizResponses)` - Maps quiz responses to persona ID

### 3. Experimental-V2 Component
- **Location**: `frontend/experimental/roadmap-experimental-v2/`
- **Files**:
  - `index.jsx` - Main component (loads persona JSON based on quiz responses)
  - `sections/SkillsSection.jsx`
  - `sections/CompaniesSection.jsx`
  - `sections/LearningPathSection.jsx`
  - `sections/ProjectsSection.jsx`
  - Other UI components

### 4. Page Route
- **Route**: `http://localhost:3000/roadmap-experimental-v2`
- **File**: `frontend/pages/roadmap-experimental-v2.js`

## How It Works

### Data Flow
```
1. User completes quiz → Quiz responses stored in UnifiedContext
2. Navigate to /roadmap-experimental-v2
3. Component loads quiz responses from context
4. Gets persona ID: getPersonaIdFromQuiz(quizResponses)
   → e.g., "tech_mid_backend"
5. Loads persona JSON: loadPersona("tech_mid_backend")
6. Transforms data: transformPersonaForExperimental(persona, selectedSkills)
7. Renders UI with persona data
```

### Example Persona ID Mapping
```
Input: { background: "tech", yearsExperience: "2-5 years", targetRole: "Backend Engineer" }
Output: "tech_mid_backend"

Pattern: {userType}_{level}_{role}
- userType: "tech" or "non_tech"
- level: "junior" (0-2) | "mid" (2-5) | "senior" (5-10) | "lead" (10+)
- role: normalized target role (e.g., "backend", "frontend", "fullstack")
```

## Testing Steps

### Step 1: Start Dev Server
```bash
cd frontend
npm run dev
```
Server should be running at `http://localhost:3000`

### Step 2: Complete Quiz
1. Navigate to `http://localhost:3000/quiz`
2. Fill in quiz questions:
   - Background: "tech" or "non-tech"
   - Years of Experience: "2-5 years" (for mid-level)
   - Target Role: "Backend Engineer" (matches our JSON)
   - Current Skills: Select some skills
3. Submit quiz

### Step 3: View Experimental-V2 Roadmap
1. After quiz completion, navigate to `http://localhost:3000/roadmap-experimental-v2`
2. Component will:
   - Load quiz responses from context
   - Generate persona ID: "tech_mid_backend"
   - Load the persona JSON file
   - Transform and display all sections:
     - Hero section with video
     - Skills section with skill map and priority table
     - Companies section with fit analysis
     - Learning path with phases
     - Projects section with implementation steps

## Data Validation

### Persona JSON Structure
```json
{
  "meta": {
    "personaId": "tech_mid_backend",
    "roleLabel": "Backend Engineer",
    "level": "mid",
    "userType": "tech"
  },
  "hero": {
    "title": "...",
    "skillsToLearn": 12,
    "estimatedEffort": { "value": "12-15", "unit": "hrs/week" },
    "videoUrl": "..."
  },
  "skillMap": {
    "axes": [...],
    "skillPriorities": { "high": [...], "medium": [...], "low": [...] }
  },
  "companyInsights": {
    "high-growth": {...},
    "unicorns": {...},
    "service": {...},
    "big-tech": {...}
  },
  "learningPath": {
    "phases": [...]
  },
  "projects": [...]
}
```

## Files to Create Next

For full functionality, create additional persona JSONs:
- `tech_junior_backend.json` (0-2 years experience)
- `tech_senior_backend.json` (5-10 years experience)
- `tech_junior_frontend.json`
- `tech_mid_frontend.json`
- `tech_senior_frontend.json`
- `tech_junior_fullstack.json`
- `tech_mid_fullstack.json`
- `tech_senior_fullstack.json`
- Similar for non-tech personas

## Cleanup (After V2 Testing)

Once experimental-v2 is validated and working:
1. Delete `/frontend/pages/roadmap-new.js` (old version)
2. Delete `/frontend/pages/roadmap-persona.js` (test version)
3. Delete `/frontend/experimental/roadmap-new-phase-2` (old experimental)
4. Delete all utility files that were used for orchestration
5. Keep only experimental-v2 as the production roadmap

## Status
- ✅ Persona JSON created and populated
- ✅ Persona loader utilities created
- ✅ Experimental-V2 component wired to JSON
- ✅ Page route configured
- ⏳ Ready for testing
- 🔮 Cleanup pending after V2 validation
