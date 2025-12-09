# Modular Roadmap Composition - Implementation Guide

## Overview

This document describes the new **Modular Roadmap Composition Architecture** that replaces the monolithic persona file approach with intelligent template merging and user-data-driven customization.

### What Changed?

**Old Approach:**
- 16 monolithic persona files (tech_entry_backend.json, tech_mid_backend.json, etc.)
- Each file contained complete roadmap configuration
- Heavy duplication of content across personas
- Company type tweaks applied via if_companyType fields
- Limited personalization based on quiz responses

**New Approach:**
- 20 modular template files across 4 dimensions:
  - **Roles** (backend, frontend, fullstack) - 3 files
  - **Levels** (entry, mid, senior) - 3 files
  - **User Types** (tech_professional, career_switcher) - 2 files
  - **Company Types** (startup, scaleup, bigtech, service) - 4 files
- Intelligent deep merging with clear priority order
- User data drives customization (problem-solving ability, system design experience, portfolio, time availability)
- Full hyper-personalization enabled

### Benefits

1. **No Duplication**: Backend fundamentals defined once in roles/backend.json, reused by all entry/mid/senior levels
2. **Easy Maintenance**: Update role skills once, applies to all level combinations
3. **Flexible Composition**: 120+ possible persona combinations from 12 templates
4. **User-Driven**: Quiz answers directly customize the roadmap
5. **Scalable**: Easy to add new roles or company types

---

## Architecture

### Directory Structure

```
frontend/src/configs/personas/
├── roles/
│   ├── backend.json       # Backend Engineer base skills, companies, projects
│   ├── frontend.json      # Frontend Engineer base skills, companies, projects
│   └── fullstack.json     # Full Stack Engineer hybrid approach
├── levels/
│   ├── entry.json         # 0-3 years: Foundation → Building → Polish
│   ├── mid.json           # 3-7 years: Advanced Concepts → Specialization → Mastery
│   └── senior.json        # 7+ years: Architecture → Leadership → Thought Leadership
├── user-types/
│   ├── tech_professional.json      # Tech background: accelerated, deep focus
│   └── career_switcher.json        # Non-tech background: comprehensive, from scratch
├── company-types/
│   ├── startup.json       # Speed-focused, rapid iteration, MVP-first
│   ├── scaleup.json       # Scale-focused, reliability, growth
│   ├── bigtech.json       # Algorithm-heavy, structured, large-scale
│   └── service.json       # Delivery-focused, client-centric, pragmatic
└── personaMatching.json   # Master persona definitions (16 personas with matching criteria)
```

### Composition Order (Priority)

Templates merge in this order - later ones override earlier ones:

```
1. Role template (backend.json, frontend.json, etc.)
   ↓ MERGE
2. Level template (entry.json, mid.json, senior.json)
   ↓ MERGE
3. User Type template (tech_professional.json, career_switcher.json)
   ↓ MERGE
4. Company Type template (startup.json, scaleup.json, bigtech.json, service.json)
   ↓ APPLY OVERRIDES
5. User Data Overrides (from quiz responses)
   ↓ ENRICH
6. Calculate values (skill gap, fit analysis, timeline)
   ↓ FINAL
Personalized Roadmap Config
```

### Example: Entry-Level Backend Engineer at Startup

```
roles/backend.json
├── skillsGap: [System Design, Databases, Languages, Projects, DSA]
├── companiesInsight: [startup, scaleup, service, bigtech analysis]
└── projects: [tier1: todo-api, blog-api | tier2: ecommerce | tier3: distributed chat]

+ levels/entry.json
├── hero: "land your first backend engineer role"
├── learningPath: 3 phases [Foundation → BuildingBlocks → Polish]
└── estimatedDuration: "3-6 months"

+ user-types/tech_professional.json
├── startingTier: "tier1" (might override to tier2 if experienced)
└── timelineContext: "25% compressed"

+ company-types/startup.json
├── learningPathTweaks: emphasis=[mvp_first, rapid_iterations]
├── skipTopics: [advanced_consistency, enterprise_patterns]
└── estimatedTimeline: multiplier=0.9x (10% faster)

+ User Data Overrides:
├── problemSolving=0-10: ADD DSA phase, extend timeline
├── portfolio=none: START with tier1 projects
├── timePerWeek=5: EXTEND timeline 40%
└── systemDesign=learning: MOVE system design to phase 2

= FINAL CONFIG:
├── hero: Customized greeting, stats, video
├── skillsGap: Radar with values, match score
├── learningPath: 4 phases (DSA added + 3 from level)
├── companiesInsight: Startup analysis prominent
├── projects: tier1 focus with extended timeline
└── metadata: All customizations tracked
```

---

## Core Functions

### 1. decomposeToModularPersona()

**Location:** `frontend/src/utils/personaMatching.js`

Converts a quiz response into modular components.

```javascript
import { decomposeToModularPersona } from '@/utils/personaMatching';

// Usage 1: From quiz responses
const modularPersona = decomposeToModularPersona({
  userType: 'tech_professional',
  yearsOfExperience: '3-5',
  targetRole: 'Backend Engineer',
  targetCompanyType: 'Scaled Startup'
});

// Result:
// {
//   role: 'backend',
//   level: 'mid',
//   userType: 'tech_professional',
//   companyType: 'scaleup'
// }

// Usage 2: From persona ID
const modularPersona = decomposeToModularPersona('tech_mid_backend');

// Result: Same as above
```

**Returns:**
```javascript
{
  role: string,           // 'backend' | 'frontend' | 'fullstack' | 'data' | ...
  level: string,          // 'entry' | 'mid' | 'senior'
  userType: string,       // 'tech_professional' | 'career_switcher'
  companyType: string     // 'startup' | 'scaleup' | 'bigtech' | 'service' | null
}
```

### 2. composeRoadmapConfig()

**Location:** `frontend/src/utils/roadmapComposition.js`

Merges templates and creates final config.

```javascript
import { composeRoadmapConfig } from '@/utils/roadmapComposition';

const config = await composeRoadmapConfig(
  {
    role: 'backend',
    level: 'mid',
    userType: 'tech_professional',
    companyType: 'scaleup'
  },
  {
    currentSkills: ['Python', 'SQL', 'Docker'],
    timeline: '6-9 months',
    problemSolving: 45,
    systemDesign: 'learning',
    portfolio: 'limited-1-5',
    timePerWeek: 12
  },
  {
    userName: 'Sudhanva Acharya',
    targetRole: 'Backend Engineer',
    yearsExperience: '3-5'
  }
);

// Result: Complete personalized roadmap config
```

**What it does:**
1. Loads role/level/userType/companyType templates
2. Deep merges them in priority order
3. Applies user-data overrides (problem-solving, system design, portfolio, etc.)
4. Enriches with calculations (skill gap, fit analysis, timelines)
5. Returns ready-to-render config

### 3. applyUserDataOverrides()

**Location:** `frontend/src/utils/compositionHelpers.js`

Customizes roadmap based on quiz answers.

**Problem Solving Override (0-100 scale):**
- 0-10: ADD DSA fundamentals phase, extend timeline
- 11-50: Emphasize DSA in phase 1
- 51-100: Skip basic DSA, assume strong foundation

**System Design Override:**
- 'not-yet': Move system design to phase 2-3
- 'learning': Keep in phase 2, intermediate level
- 'once': Emphasis on system design phase 2, advanced
- 'multiple': Move to phase 1, expert level

**Portfolio Override:**
- 'none': Start with tier1 (simple projects)
- 'inactive': Rebuild portfolio from tier1
- 'limited-1-5': Mix tier1 and tier2
- 'active-5+': Start with tier2-tier3 (advanced)

**Time Per Week Override:**
- 5-10 hrs/week: Extend timeline 40%
- 10-20 hrs/week: Standard timeline
- 20+ hrs/week: Compress timeline 20%

### 4. enrichRoadmapConfig()

**Location:** `frontend/src/utils/compositionHelpers.js`

Calculates and adds values to final config.

```javascript
Calculates:
- Skill gap match score (weighted by priority)
- Radar axis values
- Company fit analysis (adjusted by experience)
- Learning path total weeks
- Project timeline estimates
- Completion status tracking
```

### 5. generatePersonalizedRoadmap()

**Location:** `frontend/src/utils/roadmapIntegration.js`

**Main integration function** - ties everything together.

```javascript
import { generatePersonalizedRoadmap } from '@/utils/roadmapIntegration';

const config = await generatePersonalizedRoadmap(
  quizResponses,    // From Career Roadmap Tool quiz
  profileData       // From Free Profile Evaluator
);

// Returns complete personalized roadmap config ready to render
```

---

## Data Flow

### Quiz Response Path

```
User completes Career Roadmap Tool quiz
↓
QuizOrchestrator stores in UnifiedContext.quizResponses:
  - userType, yearsOfExperience, targetRole
  - currentSkills[], timeline
  - problemSolving (0-100)
  - systemDesign ('not-yet' | 'learning' | 'once' | 'multiple')
  - portfolio ('none' | 'inactive' | 'limited-1-5' | 'active-5+')
  - timePerWeek (5-50 hours)
  - targetCompanyType
↓
roadmap-experimental page mounts
↓
Call generatePersonalizedRoadmap(quizResponses, profileData)
  ↓ decomposeToModularPersona(quizResponses)
  ↓ → { role, level, userType, companyType }
  ↓ composeRoadmapConfig(modularPersona, quizResponses, profileData)
    ↓ Load 4 template files
    ↓ Deep merge in order
    ↓ Apply user-data overrides
    ↓ Enrich with calculations
  ↓ → Complete config
↓
Return config to roadmap-experimental component
↓
Component renders 6 sections:
  - Hero (greeting, stats, video)
  - Skills Gap (radar, match score)
  - Company Insights (4 tabs with fit analysis)
  - Learning Path (3 phases with customized topics)
  - Projects (tier1/2/3 with starting recommendation)
  - Interview Prep (company-specific rounds)
```

---

## Using in Components

### Example: Update roadmap-experimental

```javascript
// frontend/experimental/roadmap-new-phase-2/index.jsx

import { generatePersonalizedRoadmap } from '../../src/utils/roadmapIntegration';
import { useUnified } from '../../src/context/UnifiedContext';

const RoadmapNewExperimental = () => {
  const { quizResponses, profileData } = useUnified();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const personaConfig = await generatePersonalizedRoadmap(
          quizResponses,
          profileData
        );
        setConfig(personaConfig);
      } catch (error) {
        console.error('Failed to generate roadmap:', error);
      }
    };

    if (quizResponses && profileData) {
      loadConfig();
    }
  }, [quizResponses, profileData]);

  // Now use config in rendering
  return (
    <>
      <Hero data={config?.hero} />
      <SkillsSection data={config?.skillsGap} />
      <CompaniesSection data={config?.companiesInsight} />
      <LearningPathSection data={config?.learningPath} />
      <ProjectsSection data={config?.projects} />
    </>
  );
};
```

---

## Key Customization Points

### When does each customization apply?

| Override | Trigger | Effect |
|----------|---------|--------|
| **DSA Phase** | problemSolving ≤ 10 | +1 phase at beginning, extend timeline |
| **System Design Order** | systemDesign variation | Move from phase 2-3 to phase 1, adjust level |
| **Project Starting Tier** | portfolio level | Start tier1/tier2/tier3 based on history |
| **Timeline Stretch** | timePerWeek < 10 | Extend 40% (e.g., 3-6mo → 5-9mo) |
| **Timeline Compress** | timePerWeek > 20 | Compress 20% (e.g., 6-9mo → 4-7mo) |
| **Skill Baseline** | currentSkills[] | Boost radar baseline for known skills |
| **Company Focus** | targetCompanyType | Load company-type tweaks |
| **Learning Emphasis** | companyType tweaks | Modify phase emphasis/skip/accelerate topics |

---

## Testing the System

### Manual Testing

```javascript
// In browser console or test file

import { decomposeToModularPersona } from '@/utils/personaMatching';
import { composeRoadmapConfig } from '@/utils/roadmapComposition';
import { generatePersonalizedRoadmap } from '@/utils/roadmapIntegration';

// Test 1: Decomposition
const persona = decomposeToModularPersona({
  userType: 'career_switcher',
  yearsOfExperience: '0-2',
  targetRole: 'Frontend Engineer',
  targetCompanyType: 'Startup'
});
console.log(persona);
// Expected: { role: 'frontend', level: 'entry', userType: 'career_switcher', companyType: 'startup' }

// Test 2: Full Composition
const config = await generatePersonalizedRoadmap(
  {
    currentSkills: ['JavaScript', 'HTML'],
    timeline: '9-12 months',
    problemSolving: 25,
    systemDesign: 'not-yet',
    portfolio: 'none',
    timePerWeek: 8,
    userType: 'career_switcher',
    yearsOfExperience: '0-2',
    targetRole: 'Frontend Engineer',
    targetCompanyType: 'Startup'
  },
  {
    userName: 'Test User',
    targetRole: 'Frontend Engineer',
    yearsExperience: '0-2'
  }
);
console.log(config);
// Expected: Complete config with DSA phase, extended timeline, tier1 projects
```

---

## Performance Considerations

1. **Template Caching**: `composeRoadmapConfigWithCache()` caches composed configs
2. **Async Loading**: Templates load in parallel via Promise.all()
3. **No Large Monolithic Files**: Each template ~10-20KB, faster loads
4. **Lazy Loading**: Templates only loaded when needed

---

## Future Enhancements

1. **Database Personas**: Store persona definitions in database instead of JSON
2. **Dynamic Template Loading**: Load templates based on user data progressively
3. **A/B Testing**: Test different template combinations
4. **Personalization History**: Track what customizations work best
5. **ML-Based Composition**: Use ML to suggest best template combinations
6. **Real-Time Updates**: Update templates without redeploying

---

## Troubleshooting

### Issue: Config not loading
- Check browser console for errors
- Verify template files exist in `/frontend/src/configs/personas/`
- Check that `decomposeToModularPersona()` returns valid role/level/userType
- Verify template file names match exactly

### Issue: Customizations not applying
- Check that quiz response fields are populated
- Verify `applyUserDataOverrides()` is being called
- Check console logs for override messages
- Verify template files have correct structure

### Issue: Wrong data in sections
- Check which section is showing wrong data
- Trace back through composition steps
- Verify enrichment functions are calculating correctly
- Check component is using correct field from config

---

## Summary

The modular composition architecture enables:
- ✅ 120+ persona combinations from 20 template files
- ✅ Full hyper-personalization based on quiz answers
- ✅ Easy maintenance and updates
- ✅ Scalable design for future roles/company types
- ✅ Clear, composable structure

Each piece is independent, testable, and maintainable!
