# Quiz to Persona Mapping - Complete Architecture

## Overview
This document maps every quiz question to how it flows through the system to generate personas and roadmaps.

---

## 1. QUIZ STRUCTURE & FLOW

### A. Initial Screen (All Users)
**Screen ID:** `background`
**Type:** Branching question determines entire flow

| Question | Variable | Type | Options |
|----------|----------|------|---------|
| What's your current background? | `background` | Button Grid | `'tech'` \| `'non-tech'` |

---

## 2. TECH PROFESSIONAL FLOW (4 Screens)

### Screen 1: Who Are You (Current Role + Experience)
**Screen ID:** `tech-who-are-you`

| Question | Variable | Type | Options & Values |
|----------|----------|------|---------|
| What's your current role in tech? | `currentRole` | Button Grid | `'swe-product'`, `'swe-service'`, `'devops'`, `'qa'` |
| How many years in tech industry? | `yearsOfExperience` | Radio Buttons | `'0-2'`, `'2-3'`, `'3-5'`, `'5-8'`, `'8+'` |

**Data Stored in Context:**
```javascript
quizResponses = {
  background: 'tech',
  currentRole: 'swe-product',
  yearsOfExperience: '3-5'
}
```

---

### Screen 2: Where You Want to Go (Goals + Target Role + Company)
**Screen ID:** `tech-goals`

| Question | Variable | Type | Options & Values |
|----------|----------|------|---------|
| Main career goal? | `primaryGoal` | Button Grid | `'better-company'`, `'level-up'`, `'higher-comp'`, `'switch-domain'`, `'upskilling'` |
| Which role excites you? | `targetRole` | Button Grid | `'Backend Engineer'`, `'Frontend Engineer'`, `'Full Stack Engineer'`, `'DevOps Engineer'`, `'Data Science Engineer'` |
| Target company type? | `targetCompanyType` | Button Grid | `'faang'`, `'unicorns'`, `'startups'`, `'service'` |

**Data Stored:**
```javascript
quizResponses = {
  ...previous,
  primaryGoal: 'level-up',
  targetRole: 'Backend Engineer',
  targetRoleLabel: 'Backend Engineer',  // Stored for display
  targetCompanyType: 'faang'
}
```

---

### Screen 3: Readiness Assessment (Problem Solving + System Design + Portfolio)
**Screen ID:** `tech-readiness`

| Question | Variable | Type | Options & Values |
|----------|----------|------|---------|
| Coding practice problems? | `problemSolving` | Radio Buttons | `'100+'`, `'51-100'`, `'11-50'`, `'0-10'` |
| System design comfort? | `systemDesign` | Radio Buttons | `'multiple'`, `'once'`, `'learning'`, `'not-yet'` |
| GitHub portfolio activity? | `portfolio` | Radio Buttons | `'active-5+'`, `'limited-1-5'`, `'inactive'`, `'none'` |

**Data Stored:**
```javascript
quizResponses = {
  ...previous,
  problemSolving: '51-100',
  systemDesign: 'learning',
  portfolio: 'limited-1-5'
}
```

**Used By:** `SkillMapNew.jsx` for calculating skill levels
- `problemSolving` → DSA level (Data Structures & Algorithms proficiency)
- `systemDesign` → System Design level
- `portfolio` → Projects level

---

### Screen 4: Skills Selection (Dynamic Based on Target Role)
**Screen ID:** `skills`

| Question | Variable | Type | Options |
|----------|----------|------|---------|
| Which [role] skills do you have? | `currentSkills` | Multi-Select Pills | Dynamic based on `targetRole` |

**Example for Backend Engineer:**
```javascript
currentSkills: [
  'Python',
  'Java',
  'SQL',
  'PostgreSQL',
  'System Design',
  'API Design'
]
```

**Used By:** `SkillMapNew.jsx` for calculating:
- Language Level (count of programming languages)
- Database Level (count of database skills)

---

## 3. NON-TECH / CAREER SWITCHER FLOW (3 Screens)

### Screen 1: Who Are You (Background + Experience + Steps Taken)
**Screen ID:** `nontech-who-are-you`

| Question | Variable | Type | Options & Values |
|----------|----------|------|---------|
| Professional background? | `currentBackground` | Button Grid | `'sales-marketing'`, `'operations'`, `'design'`, `'finance'`, `'other'` |
| Years of experience? | `yearsOfExperience` | Radio Buttons | `'0'`, `'0-2'`, `'2-3'`, `'3-5'`, `'5+'` |
| Steps taken toward tech? | `stepsTaken` | Button Grid | `'bootcamp'`, `'completed-course'`, `'built-projects'`, `'self-learning'`, `'just-exploring'` |

**Data Stored:**
```javascript
quizResponses = {
  background: 'non-tech',
  currentBackground: 'sales-marketing',
  yearsOfExperience: '3-5',
  stepsTaken: 'bootcamp'
}
```

---

### Screen 2: Goals + Readiness (Target Role + Company + Code Comfort)
**Screen ID:** `nontech-goals-readiness`

| Question | Variable | Type | Options & Values |
|----------|----------|------|---------|
| Tech role that excites you? | `targetRole` | Button Grid | `'Backend Engineer'`, `'Frontend Engineer'`, `'Full Stack Engineer'`, `'DevOps Engineer'`, `'Data Science Engineer'` |
| Target company type? | `targetCompanyType` | Button Grid | `'faang'`, `'unicorns'`, `'startups'`, `'service'` |
| Coding comfort level? | `codeComfort` | Radio Buttons | `'confident'`, `'learning'`, `'beginner'`, `'complete-beginner'` |

**Data Stored:**
```javascript
quizResponses = {
  ...previous,
  targetRole: 'Backend Engineer',
  targetRoleLabel: 'Backend Engineer',
  targetCompanyType: 'faang',
  codeComfort: 'learning'
}
```

**Used By:** `SkillMapNew.jsx` for calculating:
- `codeComfort` → DSA level (maps to proficiency levels)

---

### Screen 3: Skills Selection (Dynamic Based on Target Role)
**Screen ID:** `skills`

Same as Tech Flow - dynamic skill selection based on targetRole.

---

## 4. HOW QUIZ DATA MAPS TO PERSONAS

### Step 1: Decompose to Modular Components
**Function:** `decomposeToModularPersona()` in `RoadmapCompositionOrchestrator.js`

```javascript
Input: quizResponses {
  background: 'tech',
  targetRole: 'Backend Engineer',
  yearsOfExperience: '3-5',
  targetCompanyType: 'faang',
  ...
}

Output: {
  role: 'backend',           // normalizeRole('Backend Engineer')
  level: 'mid',              // determineLevel('3-5')
  userType: 'tech',          // determineUserType('tech', ...)
  companyType: 'bigtech'     // normalizeCompanyType('faang')
}
```

### Step 2: Role Normalization Mapping
**File:** `RoadmapCompositionOrchestrator.js` line 92-128

```
'Backend Engineer' → 'backend'
'Frontend Engineer' → 'frontend'
'Full Stack Engineer' → 'fullstack'
'DevOps Engineer' → 'devops'
'Data Science Engineer' → 'data'
```

### Step 3: Level Determination Mapping
**Based on:** `yearsOfExperience`

```
'0-2'  → 'junior'
'2-3'  → 'junior'
'3-5'  → 'mid'
'5-8'  → 'mid'
'8+'   → 'senior'
```

### Step 4: User Type Determination
**Based on:** `background`

```
background: 'tech'     → userType: 'tech'
background: 'non-tech' → userType: 'non-tech'
```

### Step 5: Company Type Normalization
**Based on:** `targetCompanyType`

```
'faang'    → 'bigtech'
'unicorns' → 'scaleup'
'startups' → 'startup'
'service'  → 'service'
```

---

## 5. PERSONA LOADING WORKFLOW

### Configuration Files Loaded
```
/frontend/src/configs/personas/
├── roles/
│   ├── backend.json
│   ├── frontend.json
│   ├── fullstack.json
│   ├── devops.json
│   └── data.json
├── levels/
│   ├── junior.json
│   ├── mid.json
│   └── senior.json
├── user-types/
│   ├── tech.json
│   └── non-tech.json
├── company-types/
│   ├── bigtech.json
│   ├── scaleup.json
│   ├── startup.json
│   └── service.json
└── _persona_list.json
```

### Deep Merge Priority
1. **Base:** user-type (tech/non-tech) - foundational differences
2. **Level:** junior/mid/senior - experience-based customizations
3. **Role:** backend/frontend/etc - role-specific content
4. **Company:** bigtech/scaleup/etc - company-type optimizations

---

## 6. DATA FLOW VISUALIZATION

```
┌──────────────────────────────────────────────────────────────┐
│                      QUIZ RESPONSES                          │
│  background, currentRole, yearsOfExperience, targetRole,    │
│  targetCompanyType, problemSolving, systemDesign, portfolio, │
│  codeComfort, currentSkills, ...                            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  UnifiedContext      │
                    │  (localStorage)      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  decomposeToModular  │
                    │  Persona()           │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────────────┐
                    │                             │
                    ▼                             ▼
          ┌─────────────────┐        ┌──────────────────────┐
          │  role: backend  │        │  level: mid          │
          │  userType: tech │        │  companyType: bigtech│
          └────────┬────────┘        └──────────┬───────────┘
                   │                             │
                   └──────────────┬──────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Load Modular Templates  │
                    │  (role.json, level.json, │
                    │   user-type.json, etc.)  │
                    └──────────────┬───────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │  Deep Merge with         │
                    │  Priority Order          │
                    └──────────────┬───────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │  Final Persona Config    │
                    │  (hero, skillMap,        │
                    │   phases, projects, etc.)│
                    └──────────────┬───────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │  Transform for Component │
                    │  Use (transformPersona   │
                    │   ForExperimental)       │
                    └──────────────┬───────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
   ┌──────────┐            ┌────────────┐          ┌─────────────┐
   │  Hero    │            │  Skill Map │          │ Skill Gap   │
   │Component │            │ Component  │          │ Component   │
   └──────────┘            └────────────┘          └─────────────┘
```

---

## 7. QUIZ RESPONSE VARIABLES SUMMARY

### Tech Professional Variables
```javascript
{
  background: 'tech',
  currentRole: 'swe-product' | 'swe-service' | 'devops' | 'qa',
  yearsOfExperience: '0-2' | '2-3' | '3-5' | '5-8' | '8+',
  primaryGoal: 'better-company' | 'level-up' | 'higher-comp' | 'switch-domain' | 'upskilling',
  targetRole: 'Backend Engineer' | 'Frontend Engineer' | 'Full Stack Engineer' | 'DevOps Engineer' | 'Data Science Engineer',
  targetRoleLabel: 'Backend Engineer' | ...,  // For display
  targetCompanyType: 'faang' | 'unicorns' | 'startups' | 'service',
  problemSolving: '100+' | '51-100' | '11-50' | '0-10',
  systemDesign: 'multiple' | 'once' | 'learning' | 'not-yet',
  portfolio: 'active-5+' | 'limited-1-5' | 'inactive' | 'none',
  currentSkills: ['Python', 'Java', 'SQL', ...] // Array of selected skills
}
```

### Non-Tech / Career Switcher Variables
```javascript
{
  background: 'non-tech',
  currentBackground: 'sales-marketing' | 'operations' | 'design' | 'finance' | 'other',
  yearsOfExperience: '0' | '0-2' | '2-3' | '3-5' | '5+',
  stepsTaken: 'bootcamp' | 'completed-course' | 'built-projects' | 'self-learning' | 'just-exploring',
  targetRole: 'Backend Engineer' | 'Frontend Engineer' | 'Full Stack Engineer' | 'DevOps Engineer' | 'Data Science Engineer',
  targetRoleLabel: 'Backend Engineer' | ...,  // For display
  targetCompanyType: 'faang' | 'unicorns' | 'startups' | 'service',
  codeComfort: 'confident' | 'learning' | 'beginner' | 'complete-beginner',
  currentSkills: ['Python', 'Java', 'SQL', ...] // Array of selected skills
}
```

---

## 8. KEY INSIGHT: Quiz Response → Persona Mapping

### The Magic: How Individual Quiz Answers Build Personas

#### Example Journey: Tech Pro wanting Backend at Big Tech

```
QUIZ ANSWER          MAPS TO              AFFECTS
─────────────────────────────────────────────────────────
background: 'tech'   → userType: 'tech'   → Load tech.json
                                           → Uses tech industry context

yearsOfExperience:   → level: 'mid'       → Load mid.json
'5-8'                                      → Mid-level challenges

targetRole:          → role: 'backend'    → Load backend.json
'Backend Engineer'                         → Backend-specific skills

targetCompanyType:   → companyType:       → Load bigtech.json
'faang'              'bigtech'            → FAANG interview prep

problemSolving:      → DSA skill level:   → SkillMapNew shows
'51-100'             65/100               → Gap analysis

portfolio:           → Projects level:    → Recommends portfolio
'limited-1-5'        50/100               → Building projects

currentSkills:       → Identifies gaps    → Lists missing skills:
['Python', 'SQL']    → Missing: System    → System Design
                       Design, Databases   → Advanced DB concepts
```

---

## 9. STORAGE MECHANISM

### Where Data is Stored

1. **Context (UnifiedContext)**
   - All quiz responses
   - Current skills
   - Generated roadmap
   - Evaluation results

2. **localStorage**
   - Key: `scalerCareerRoadmapState`
   - Value: JSON string with all context data
   - TTL: 24 hours (auto-cleared if stale)
   - SSR-safe: Only saves/loads on client-side

3. **URL/Router**
   - Redirects to `/roadmap-new` after quiz completion
   - Reads state from localStorage on load

---

## 10. NEXT STEPS: CONNECTING EXPERIMENTAL V2

**Current Status:**
- Experimental V2 loads `test_persona.json` directly
- Quiz is fully data-driven from real quiz responses
- Need to connect: Quiz Responses → Generated Personas → UI Components

**Implementation Path:**
1. ✅ Quiz collects responses in quizResponses object
2. ✅ Responses stored in UnifiedContext + localStorage
3. ⏳ On roadmap page load:
   - Read quizResponses from context
   - Call `decomposeToModularPersona(quizResponses)`
   - Load and merge persona JSONs
   - Pass merged persona to components
4. ✅ Components (Hero, SkillsSection, etc.) already data-driven

---

## 11. FILES TO REFERENCE

| File | Purpose |
|------|---------|
| `/src/components/quiz/QuizConfig.js` | All quiz questions, options, flow logic |
| `/src/components/quiz/QuizOrchestrator.js` | Quiz UI rendering, response handling |
| `/src/context/UnifiedContext.js` | Data storage, state management |
| `/src/utils/RoadmapCompositionOrchestrator.js` | Quiz → Persona mapping |
| `/src/configs/personas/` | Persona JSON templates |
| `/experimental/roadmap-experimental-v2/` | V2 UI components |

