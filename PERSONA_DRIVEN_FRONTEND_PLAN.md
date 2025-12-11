# Persona-Driven Frontend Implementation Plan

## Overview
Make all 5 key roadmap sections fully data-driven from persona configuration templates. Currently, sections have partial integration with hardcoded fallbacks. This plan ensures 100% data-driven rendering with proper fallbacks.

---

## Current State Analysis

### 1. Hero Component (`src/components/roadmap-new/Hero.jsx`)
**Current State:**
- ✅ Attempts to use config title
- ❌ Stats calculation is manual (counting missing skills)
- ❌ Video URL placeholder not implemented

**What Needs to Change:**
1. Use `config.hero.greeting` and `config.hero.title` for heading
2. Use `config.hero.stats.skillsToLearn.total` for skill count
3. Use `config.hero.stats.estimatedEffort.value` for effort
4. Embed video from `config.hero.videoUrl`
5. Add `config.hero.videoNotes` as subtitle

### 2. SkillsSection (`experimental/roadmap-new-phase-2/sections/SkillsSection.jsx`)
**Current State:**
- ✅ Already loading config skillsGap data
- ✅ Mapping config skills to UI format
- ⚠️ Using config.skillsGap but structure might be inconsistent

**What Needs to Change:**
1. Ensure config.skillsGap.sections matches expected structure
2. Use section titles/descriptions from config
3. Render skill table purely from config data
4. No skill database fallback needed (config is source of truth)

### 3. CompaniesSection (`experimental/roadmap-new-phase-2/sections/CompaniesSection.jsx`)
**Current State:**
- ❌ Has large hardcoded COMPANY_TYPES object
- ❌ Not using config data at all
- ❌ Interview rounds are hardcoded

**What Needs to Change:**
1. Load all data from `config.companiesInsight.tabs`
2. Each tab should have:
   - `name`: "High Growth Startups" | "Scaled Startups" | "Big Tech Companies" | "Service & Enterprise Companies"
   - `key`: "startup" | "scaleup" | "bigtech" | "service"
   - `description`: Company type description
   - `emphasis`: Array of emphasis points
   - `interviewFocus`: Array of interview focus areas
3. Fit analysis sections should be data-driven
4. Interview rounds should come from config.interviewPrep

### 4. LearningPathSection (`experimental/roadmap-new-phase-2/sections/LearningPathSection.jsx`)
**Current State:**
- ⚠️ Trying to use `config.learningPath.phases`
- ❌ Expected structure: config has `phasesStructure`, not `phases`
- ❌ Not rendering phase content from config

**What Needs to Change:**
1. Fix key mapping: `config.learningPath.phasesStructure` → phases
2. Render phase content from config data:
   - Phase name, duration, focus
   - Topics from `topics[]` array
   - Resources from `resources[]` array
   - Video from `videoPlaceholder`
3. Use section title/description from config.learningPath

### 5. ProjectsSection (`experimental/roadmap-new-phase-2/sections/ProjectsSection.jsx`)
**Current State:**
- ❌ Looking for `config.projects.projects` (wrong key)
- ❌ Persona config uses `recommendedProjects` key
- ❌ Project structure doesn't match config structure

**What Needs to Change:**
1. Fix key mapping: `config.recommendedProjects.projectTiers` → projects
2. Each project tier should have:
   - `tierName`: "Beginner" | "Intermediate" | "Advanced"
   - `projects[]`: Array of projects with:
     - `name`: Project name
     - `description`: What the project does
     - `techStack`: Technologies used
     - `keyFeatures`: Main features to implement
     - `implementationSteps`: Array of steps
     - `expectedOutcomes`: What you'll learn
3. Render implementation steps properly from config

---

## Implementation Checklist

### Phase 1: Hero Section Fix
- [ ] Read config.hero.greeting, title, description
- [ ] Display stats from config.hero.stats (not calculated)
- [ ] Embed video from config.hero.videoUrl
- [ ] Add videoNotes below video

### Phase 2: Skills Section Enhancement
- [ ] Verify skillsGap section structure matches config
- [ ] Ensure no hardcoded fallbacks for priority levels
- [ ] Render skill table from config.skillsGap.sections
- [ ] Use section titles from config

### Phase 3: Companies Section Overhaul
- [ ] Remove hardcoded COMPANY_TYPES object
- [ ] Load tabs from config.companiesInsight.tabs
- [ ] Render fit analysis from config
- [ ] Link interview rounds to config.interviewPrep
- [ ] Each tab should display all 4 company types

### Phase 4: Learning Path Section Fix
- [ ] Fix key mapping: phasesStructure → phases
- [ ] Render phases from config.learningPath.phasesStructure
- [ ] Display topics, resources, videos from config
- [ ] Add phase metadata (duration, focus) from config

### Phase 5: Projects Section Refactor
- [ ] Fix key mapping: recommendedProjects.projectTiers
- [ ] Remove projectStepsData.json dependency
- [ ] Render projects from config
- [ ] Display implementation steps from config
- [ ] Show tech stack and key features from config

---

## Config Structure Reference

### Hero Section
```json
{
  "hero": {
    "greeting": "Hey {userName}! 👋",
    "title": "Your personalized roadmap to become a {targetRole} is ready!",
    "description": "Based on your experience and goals...",
    "stats": {
      "skillsToLearn": { "total": 12, "description": "critical skills..." },
      "estimatedEffort": { "value": "{hoursPerWeek}", "unit": "hrs/week" },
      "timeline": "{estimatedTimeline}"
    },
    "videoUrl": "PLACEHOLDER_FOUNDER_VIDEO",
    "videoNotes": "Get personal insights..."
  }
}
```

### Skills Section
```json
{
  "skillsGap": {
    "title": "Understand Where You Stand...",
    "description": "See what you already know...",
    "sections": {
      "currentSkills": { "title": "...", "description": "..." },
      "highPriority": { "title": "...", "description": "...", "priority": "critical" },
      "mediumPriority": { "title": "...", "description": "...", "priority": "high" },
      "lowPriority": { "title": "...", "description": "...", "priority": "medium" }
    }
  }
}
```

### Companies Section
```json
{
  "companiesInsight": {
    "title": "Target Companies & Interview Process",
    "description": "...",
    "tabs": [
      {
        "name": "High Growth Startups",
        "key": "startup",
        "description": "...",
        "emphasis": ["quality", "delivery", "process"],
        "interviewFocus": ["Practical problem-solving", "Communication"]
      },
      // ... 3 more company types
    ]
  }
}
```

### Learning Path Section
```json
{
  "learningPath": {
    "title": "Your Personalized Learning Path",
    "description": "...",
    "phasesStructure": [
      {
        "phaseNumber": 1,
        "phaseName": "JavaScript & Frontend Fundamentals",
        "duration": "4-6 weeks",
        "focus": "Master JavaScript and core browser concepts",
        "videoPlaceholder": "PLACEHOLDER_PHASE1_VIDEO",
        "topics": ["Topic 1", "Topic 2", ...],
        "resources": [
          { "name": "...", "url": "...", "type": "docs|course|tutorial" }
        ]
      }
    ]
  }
}
```

### Projects Section
```json
{
  "recommendedProjects": {
    "title": "Project Ideas to Crack Your Role",
    "description": "...",
    "projectTiers": [
      {
        "tierName": "Beginner",
        "projects": [
          {
            "name": "Project Name",
            "description": "What the project does",
            "techStack": ["Tech1", "Tech2"],
            "keyFeatures": ["Feature 1", "Feature 2"],
            "implementationSteps": [
              "Step 1",
              "Step 2"
            ],
            "expectedOutcomes": ["Outcome 1", "Outcome 2"]
          }
        ]
      }
    ]
  }
}
```

---

## Files to Modify

1. `src/components/roadmap-new/Hero.jsx` - Hero section enhancement
2. `experimental/roadmap-new-phase-2/sections/SkillsSection.jsx` - Minor fixes
3. `experimental/roadmap-new-phase-2/sections/CompaniesSection.jsx` - Major refactor
4. `experimental/roadmap-new-phase-2/sections/LearningPathSection.jsx` - Key mapping fix
5. `experimental/roadmap-new-phase-2/sections/ProjectsSection.jsx` - Major refactor

---

## Testing Strategy

After implementing each section:
1. Complete the quiz with all questions answered
2. Verify persona config loads (check console logs)
3. Verify section renders correct config data (not fallbacks)
4. Check mobile responsiveness
5. Verify all dynamic data from config (names, counts, descriptions)

---

## Success Criteria

- ✅ Hero section shows actual stats from config (not calculated)
- ✅ Skills section renders from config skillsGap
- ✅ Companies section shows all 4 company types from config tabs
- ✅ Learning path renders phases from config.phasesStructure
- ✅ Projects section renders from config.recommendedProjects
- ✅ No hardcoded fallback data visible
- ✅ All persona files (5 roles) render correctly
- ✅ All sections are responsive on mobile/tablet/desktop

