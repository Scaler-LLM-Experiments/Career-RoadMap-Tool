# Quiz Variables - Quick Reference Guide

## All Quiz Variables at a Glance

### Universal Variables (All Users)
```
background              → 'tech' | 'non-tech'
targetRole             → 'Backend Engineer' | 'Frontend Engineer' | 'Full Stack Engineer' | 'DevOps Engineer' | 'Data Science Engineer'
targetRoleLabel        → Display-friendly version of targetRole
targetCompanyType      → 'faang' | 'unicorns' | 'startups' | 'service'
currentSkills          → Array of selected skills: ['Python', 'Java', 'SQL', ...]
```

---

## Tech Professional Variables
```
currentRole            → 'swe-product' | 'swe-service' | 'devops' | 'qa'
yearsOfExperience      → '0-2' | '2-3' | '3-5' | '5-8' | '8+'
primaryGoal            → 'better-company' | 'level-up' | 'higher-comp' | 'switch-domain' | 'upskilling'
problemSolving         → '100+' | '51-100' | '11-50' | '0-10'
systemDesign           → 'multiple' | 'once' | 'learning' | 'not-yet'
portfolio              → 'active-5+' | 'limited-1-5' | 'inactive' | 'none'
```

---

## Non-Tech / Career Switcher Variables
```
currentBackground      → 'sales-marketing' | 'operations' | 'design' | 'finance' | 'other'
yearsOfExperience      → '0' | '0-2' | '2-3' | '3-5' | '5+'
stepsTaken             → 'bootcamp' | 'completed-course' | 'built-projects' | 'self-learning' | 'just-exploring'
codeComfort            → 'confident' | 'learning' | 'beginner' | 'complete-beginner'
```

---

## Storage Location
```
Context:               src/context/UnifiedContext.js → quizResponses object
localStorage Key:      'scalerCareerRoadmapState'
TTL:                   24 hours (auto-cleared if stale)
```

---

## How Each Variable is Used

### Quiz → Persona Mapping

| Variable | Maps To | Used For |
|----------|---------|----------|
| `targetRole` | `role` (backend, frontend, fullstack, devops, data) | Load persona JSON from `/configs/personas/roles/` |
| `yearsOfExperience` | `level` (junior, mid, senior) | Load persona JSON from `/configs/personas/levels/` |
| `background` | `userType` (tech, non-tech) | Load persona JSON from `/configs/personas/user-types/` |
| `targetCompanyType` | `companyType` (bigtech, scaleup, startup, service) | Load persona JSON from `/configs/personas/company-types/` |
| `problemSolving` | DSA skill level (0-100) | SkillMapNew component for skill gap visualization |
| `systemDesign` | System Design skill level (0-100) | SkillMapNew component for skill gap visualization |
| `portfolio` | Projects skill level (0-100) | SkillMapNew component for skill gap visualization |
| `codeComfort` | DSA skill level (for non-tech) | SkillMapNew component for skill gap visualization |
| `currentSkills` | Language & Database levels | SkillMapNew component for skill gap visualization |

---

## Skill Level Calculation Logic

### For Tech Professionals

**DSA (Data Structures & Algorithms)**
```
problemSolving: '100+'    → DSA: 85
problemSolving: '51-100'  → DSA: 65
problemSolving: '11-50'   → DSA: 40
problemSolving: '0-10'    → DSA: 15
```

**System Design**
```
systemDesign: 'multiple'  → System Design: 80
systemDesign: 'once'      → System Design: 55
systemDesign: 'learning'  → System Design: 30
systemDesign: 'not-yet'   → System Design: 10
```

**Projects**
```
portfolio: 'active-5+'    → Projects: 80
portfolio: 'limited-1-5'  → Projects: 50
portfolio: 'inactive'     → Projects: 25
portfolio: 'none'         → Projects: 10
```

**Language Proficiency** (based on `currentSkills` count)
```
Selected: ['Python', 'Java', 'Node.js']  → Language: 105 (capped at 100)
Selected: ['Python']                     → Language: 35
Selected: []                             → Language: 0
```

**Database Proficiency** (based on `currentSkills` count)
```
Selected: ['SQL', 'PostgreSQL', 'MongoDB']  → Database: 90 (capped at 100)
Selected: ['SQL']                           → Database: 30
Selected: []                                → Database: 0
```

---

### For Non-Tech / Career Switchers

**DSA (based on codeComfort)**
```
codeComfort: 'confident'           → DSA: 50
codeComfort: 'learning'            → DSA: 30
codeComfort: 'beginner'            → DSA: 15
codeComfort: 'complete-beginner'   → DSA: 5
```

Other skill calculations same as tech professionals.

---

## Average Baseline Comparison

### Tech Professional Baselines (What "average" tech pro knows)
```
DSA:            45/100
System Design:  35/100
Projects:       50/100
Language:       60/100
Database:       55/100
```

### Non-Tech Baseline (What "average" career switcher knows)
```
DSA:            20/100
System Design:  10/100
Projects:       25/100
Language:       30/100
Database:       20/100
```

---

## Quiz Flow Screens

### Tech Professional (4 Screens)

1. **Background Selection**
   - Variables: `background`

2. **Who Are You** (Current role + experience)
   - Variables: `currentRole`, `yearsOfExperience`

3. **Where You Want to Go** (Goals + target role + company)
   - Variables: `primaryGoal`, `targetRole`, `targetCompanyType`

4. **Readiness Assessment** (Problem solving + system design + portfolio)
   - Variables: `problemSolving`, `systemDesign`, `portfolio`

5. **Skills Selection** (Dynamic based on targetRole)
   - Variables: `currentSkills`

---

### Non-Tech / Career Switcher (4 Screens)

1. **Background Selection**
   - Variables: `background`

2. **Who Are You** (Background + experience + steps taken)
   - Variables: `currentBackground`, `yearsOfExperience`, `stepsTaken`

3. **Goals & Readiness** (Target role + company + code comfort)
   - Variables: `targetRole`, `targetCompanyType`, `codeComfort`

4. **Skills Selection** (Dynamic based on targetRole)
   - Variables: `currentSkills`

---

## Complete Variable Collection Example

### Tech Professional Backend Engineer at FAANG

```javascript
{
  // Background Selection
  background: 'tech',

  // Current State
  currentRole: 'swe-product',
  yearsOfExperience: '5-8',

  // Career Goals
  primaryGoal: 'level-up',
  targetRole: 'Backend Engineer',
  targetRoleLabel: 'Backend Engineer',
  targetCompanyType: 'faang',

  // Readiness Metrics
  problemSolving: '51-100',
  systemDesign: 'once',
  portfolio: 'limited-1-5',

  // Current Skills
  currentSkills: [
    'Python',
    'Java',
    'PostgreSQL',
    'API Design',
    'Docker'
  ]
}
```

**This Maps To:**
```
role: 'backend'           (from targetRole)
level: 'mid'              (from yearsOfExperience: '5-8')
userType: 'tech'          (from background: 'tech')
companyType: 'bigtech'    (from targetCompanyType: 'faang')
```

**Loads Personas From:**
- `/configs/personas/user-types/tech.json`
- `/configs/personas/levels/mid.json`
- `/configs/personas/roles/backend.json`
- `/configs/personas/company-types/bigtech.json`

**Calculates Skills:**
- DSA: 65 (from problemSolving: '51-100')
- System Design: 55 (from systemDesign: 'once')
- Projects: 50 (from portfolio: 'limited-1-5')
- Language: 70 (from currentSkills with 2 languages: Python, Java)
- Database: 30 (from currentSkills with 1 database: PostgreSQL)

**Identifies Gaps:**
- High: System Design, Microservices, Advanced Databases
- Medium: Kubernetes, gRPC, Performance Optimization
- Low: Testing Strategies, Documentation

---

## Key Points to Remember

1. **Variables are case-sensitive** - Store and compare exactly as shown
2. **Background determines quiz flow** - Either tech or non-tech path
3. **targetRole is dynamic** - Used to load correct persona JSON
4. **currentSkills is an array** - Multiple selections, used for calculations
5. **yearsOfExperience maps to level** - Determines experience-based customizations
6. **Quiz responses + Persona configs = Roadmap** - Complete data-driven flow
7. **Data persists for 24 hours** - Cached in localStorage with TTL check

