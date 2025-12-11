# Data Sources Debug Guide

## How to Identify Data Sources

### Method 1: Browser Console Logs
When you access `/roadmap-experimental-v2`, open **DevTools (F12)** and go to **Console** tab.

You'll see logs like:
```
📊 DATA SOURCES FROM PERSONA:
  ✅ metadata: {roleLabel: "Backend Engineer", level: "mid", ...}
  ✅ hero: {title: "Your personalized roadmap...", skillsToLearn: 12, ...}
  ✅ skillMap: {radarAxes: [...], axes: [...]}
  ✅ skillsGap: {title: "Understand Where You Stand...", description: "..."}
  ✅ missingSkills: {highPriority: [...], mediumPriority: [...], lowPriority: [...]}
  ✅ companyInsights: ["high-growth", "unicorns", "service", "big-tech"]
  ✅ learningPath.phases: 3
  ✅ projects.projects: 3
```

### Method 2: Check Console for Loaded Persona
Look for messages:
```
✅ Loaded persona: tech_mid_backend_engineer
✅ Persona config transformed successfully
✅ Roadmap data built successfully
```

## Data Flow & Sources

### 1. Quiz Responses → Persona ID Mapping
```
Input (from quiz):
  - background: "tech"
  - yearsExperience: "2-5 years"
  - targetRole: "Backend Engineer"
  - currentSkills: ["Python", "System Design", ...]

↓ (getPersonaIdFromQuiz)

Output: "tech_mid_backend_engineer"

↓ (loadPersona)

Load: tech_mid_backend_engineer.json
```

### 2. Data Extracted from Persona JSON

#### Hero Section (FROM PERSONA)
- ✅ **Title**: `hero.title`
- ✅ **Skills to Learn**: `hero.skillsToLearn`
- ✅ **Estimated Effort**: `hero.stats.estimatedEffort`
- ✅ **Video URL**: `hero.videoUrl`

#### Skills Section (FROM PERSONA + QUIZ)
- ✅ **Skill Map (Radar)**: `skillMap.radarAxes` (from persona)
- ✅ **Skill Priorities**: `skillMap.skillPriorities` (from persona)
- ✅ **Filtered Skills**: User-selected skills filtered out (quiz input)
- ✅ **Thresholds**: `skillMap.thresholds` (from persona)

#### Companies Section (FROM PERSONA)
- ✅ **Company Types**: `companyInsights.high-growth`, `unicorns`, `service`, `big-tech`
- ✅ **Fit Analysis**: `companyInsights[type].fitAnalysis`
- ✅ **Why Feasible**: `companyInsights[type].whyFeasible`
- ✅ **What to Do**: `companyInsights[type].whatToDo`
- ✅ **Selection Rounds**: `companyInsights[type].rounds`

#### Learning Path Section (FROM PERSONA)
- ✅ **Phases**: `learningPath.phases` (array of phases)
- ✅ **Phase Title**: `phases[n].title`
- ✅ **Duration**: `phases[n].duration`
- ✅ **Learning Points**: `phases[n].learningPoints`
- ✅ **Video URL**: `phases[n].videoUrl`
- ✅ **Target**: `phases[n].target`
- ✅ **Why It Matters**: `phases[n].whyItMatters`

#### Projects Section (FROM PERSONA)
- ✅ **Project List**: `projects.projects` (array)
- ✅ **Project Title**: `projects.projects[n].title`
- ✅ **Tier**: `projects.projects[n].tier`
- ✅ **Estimated Time**: `projects.projects[n].estimatedTime`
- ✅ **Description**: `projects.projects[n].fullDescription`
- ✅ **Skills Learned**: `projects.projects[n].skillsYouLearn`
- ✅ **Implementation Steps**: `projects.projects[n].implementationSteps`

## Identifying Hardcoded Values

### ❌ Hardcoded (To Be Removed)
Look for these in the code:
```javascript
// Examples of hardcoded values that should be removed:
- Static text that doesn't come from persona
- Hardcoded arrays like: ['Python', 'JavaScript', 'Git']
- Fixed strings like: "Big-Tech Companies"
- Numbers that aren't from persona
```

### ✅ Persona-Driven (Keep These)
All data flowing through these variables:
- `personaConfig.metadata`
- `personaConfig.hero`
- `personaConfig.skillMap`
- `personaConfig.companyInsights`
- `personaConfig.learningPath`
- `personaConfig.projects`

## Debugging Checklist

When testing, verify in console:

- [ ] Persona loaded: `✅ Loaded persona: tech_mid_backend_engineer`
- [ ] Config transformed: `✅ Persona config transformed successfully`
- [ ] Metadata present: Check `metadata` object has `roleLabel`
- [ ] Hero data present: Check `hero` has `title`, `skillsToLearn`, `estimatedEffort`
- [ ] SkillMap data present: Check `skillMap.radarAxes` array has 5+ items
- [ ] Company insights present: Check `companyInsights` has 4 keys
- [ ] Learning path present: Check `learningPath.phases` has 3 phases
- [ ] Projects present: Check `projects.projects` has 3+ projects
- [ ] All sections show ✅ badges (if implemented)

## Missing Data Indicators

If you see:
- **"No projects available"** → `projects.projects` is empty or missing
- **"Configuration Error: Missing averageBaseline"** → `skillMap.thresholds` missing
- **"Unable to Load Roadmap"** → Persona JSON file not found or malformed
- **Console errors about missing properties** → Check persona JSON structure

## Next Steps

1. **Fix any missing data** by adding to persona JSON
2. **Add checkmark badges** to UI to visually indicate persona-driven sections
3. **Remove any remaining hardcoded values**
4. **Validate no fallbacks are being used** (check console for warnings)
5. **Create additional persona JSONs** for other role/level combinations
