# Free Profile Evaluator - Quiz Structure Summary

## Quick Reference Guide

### Two Parallel Paths

```
USER ARRIVES
    |
    └─> Select Background
        ├─ TECH PROFESSIONAL
        │   └─ 3 Screens × 3 Questions = 9 Total Questions
        │       ├─ Who You Are (Current Skills)
        │       ├─ Where You Want to Go (Target Role)
        │       └─ Your Readiness (Interview Prep Status)
        │
        └─ CAREER SWITCHER
            └─ 3 Screens × 2-3 Questions = 8 Total Questions
                ├─ Who You Are (Background & Experience)
                ├─ Where You Want to Go (Target Role & Motivation)
                └─ Your Readiness (Coding Comfort & Time)
```

---

## TECH PATH - Question Matrix

| Screen | Question | ID | Type | Values | Conditional |
|--------|----------|-----|------|--------|-------------|
| 1 | Current Role | `currentRole` | Select | swe-product, swe-service, devops, qa-support | No |
| 1 | Years Experience | `experience` | Select | 0-2, 2-3, 3-5, 5-8, 8+ | No |
| 1 | Current Skill Focus | `currentSkill` | Select* | 4 options/role | YES: depends on `currentRole` |
| 2 | Primary Goal | `primaryGoal` | Select | 5 options | No |
| 2 | Target Role | `targetRole` | Select | 6 options | No |
| 2 | Target Company | `targetCompany` | Select | 5 options | No |
| 3 | Coding Practice | `problemSolving` | Select | 0-10, 11-50, 51-100, 100+ | No |
| 3 | System Design | `systemDesign` | Select | multiple, once, learning, not-yet | YES: if problemSolving != '0-10' |
| 3 | GitHub Activity | `portfolio` | Select | active-5+, limited-1-5, inactive, none | No |

**MAPPED TO BACKEND:**
- `primaryGoal` → `requirementType`
- `currentRole` → `currentCompany` (derived)
- All others → direct mapping

---

## NON-TECH PATH - Question Matrix

| Screen | Question | ID | Type | Values | Conditional |
|--------|----------|-----|------|--------|-------------|
| 1 | Background | `currentBackground` | Select | 5 options | No |
| 1 | Experience | `experience` | Select | 0, 0-2, 2-3, 3-5, 5+ | No |
| 1 | Progress Toward Tech | `stepsTaken` | Select | 5 options | No |
| 2 | Target Role | `targetRole` | Select | 5 options (includes "not-sure") | No |
| 2 | Motivation | `motivation` | Select | 5 options | No |
| 2 | Target Company | `targetCompany` | Select | 5 options | No |
| 3 | Coding Comfort | `codeComfort` | Select | 4 options | No |
| 3 | Weekly Time | `timePerWeek` | Select | 4 options | No |

**TRANSFORMATIONS:**
- `currentBackground` → `currentRole` (remapped)
- `motivation` → `requirementType`
- `codeComfort` → `problemSolving` (mapped: confident→51-100, learning→11-50, etc)
- `portfolio` → INFERRED from problemSolving
- `systemDesign` → always 'not-yet'

---

## Key Question Dependencies

### TECH PATH
```
┌─ currentRole
│   └─> currentSkill options (4 different sets)
│
├─ problemSolving
│   └─> systemDesign (only shown if problemSolving ≠ '0-10')
│
└─ (No other dependencies)
```

### NON-TECH PATH
```
└─ No direct dependencies
   (All questions shown to all users)
```

---

## What Gets Sent to Backend

### Raw Quiz Values
```json
{
  "background": "tech",
  "quizResponses": {
    "currentRole": "swe-product",
    "experience": "3-5",
    "currentSkill": "backend",
    "primaryGoal": "level-up",
    "targetRole": "senior-backend",
    "targetCompany": "unicorns",
    "problemSolving": "51-100",
    "systemDesign": "once",
    "portfolio": "limited-1-5",
    "currentRoleLabel": "Software Engineer - Product Company",
    "targetRoleLabel": "Senior Backend Engineer",
    "targetCompanyLabel": "Product Unicorns/Scaleups"
  },
  "goals": {
    "requirementType": [],
    "targetCompany": "Product Unicorns/Scaleups",
    "topicOfInterest": []
  }
}
```

---

## What Comes Back from Backend

### Output Components

1. **Profile Strength** (1-100 score + label + notes)
2. **Current Profile Summary** (conversational + key stats)
3. **Skill Analysis** (strengths + gaps)
4. **Recommended Tools** (specific, professional tools)
5. **Experience Benchmark** (your years vs target role years)
6. **Interview Readiness** (technical + HR percentages)
7. **Peer Comparison** (percentile vs similar profiles)
8. **Success Likelihood** (score + timeline estimate)
9. **Quick Wins** (3-5 specific actions)
10. **Recommended Roles** (3-5 roles with timelines)
11. **Opportunities to Qualify For** (current market options)
12. **Badges** (achievement labels)

---

## Display Mappings

### Primary Goal -> Requirement Type
| Frontend Value | Backend Value |
|----------------|--------------|
| product-company | product-switch |
| level-up | promotion |
| higher-comp | salary-increase |
| switch-domain | domain-switch |
| upskilling | upskilling |

### Target Company Personalization
| Selected | Used In Recommendations |
|----------|-------------------------|
| faang | "FAANG interview prep" |
| unicorns | "Product company culture" |
| startups | "High growth, fast learning" |
| better-service | "Service company progression" |
| evaluating | Derived from other signals |

### Seniority Mapping
| Experience | Recommended Level |
|------------|------------------|
| 0-2 years | SDE-1 / Junior |
| 2-3 years | SDE-1 / Early Senior |
| 3-5 years | SDE-2 / Senior |
| 5-8 years | SDE-3 / Staff |
| 8+ years | Principal / Lead |

---

## Critical Business Logic

### What's NEVER Shown
- Generic recommendations like "Practice more problems"
- PM, Designer, or Manager roles (unless from IC progression)
- Tools like LeetCode, GitHub, Coursera, VS Code

### What's ALWAYS Shown
- Specific action items with clear outcomes
- Technical/Engineering-focused paths
- India market context and salary ranges
- Timeline estimates (realistic for skill level)

### What's PERSONALIZED
- Tool recommendations (based on target role)
- Role suggestions (based on experience + interests)
- Quick wins (based on current gaps)
- Success timeline (based on experience + preparation)

---

## Example User Journeys

### Journey 1: Entry-Level SWE → Senior Backend

**Quiz Responses:**
- background: tech
- experience: 2-3 years
- currentRole: swe-product
- currentSkill: frontend
- primaryGoal: level-up
- targetRole: senior-backend
- targetCompany: unicorns
- problemSolving: 51-100
- systemDesign: learning
- portfolio: limited-1-5

**Expected Output:**
- Profile Score: ~65-70 (mid-level)
- Gap: System design knowledge
- Timeline: 6-9 months to senior backend
- Quick Wins: SD course, backend project, mock interviews
- Roles: Senior Backend, Full-Stack, Tech Lead

---

### Journey 2: Career Switcher → First Tech Role

**Quiz Responses:**
- background: non-tech
- currentBackground: sales-marketing
- experience: 3-5 years
- stepsTaken: completed-course
- targetRole: fullstack
- motivation: interest
- targetCompany: any-tech
- codeComfort: learning
- timePerWeek: 6-10

**Expected Output:**
- Profile Score: ~50-55 (developing)
- Gap: Practical project experience
- Timeline: 9-12 months to junior fullstack
- Quick Wins: Build 2-3 projects, contribute to open source
- Roles: Junior Frontend/Backend, QA Engineer (alternative)

---

### Journey 3: Experienced Senior → Leadership Track

**Quiz Responses:**
- background: tech
- experience: 8+
- currentRole: swe-product
- currentSkill: system-design
- primaryGoal: level-up
- targetRole: tech-lead
- targetCompany: faang
- problemSolving: 100+
- systemDesign: multiple
- portfolio: active-5+

**Expected Output:**
- Profile Score: ~85-90 (excellent)
- Gap: Leadership skills, large-scale systems
- Timeline: 3-6 months to senior/lead role
- Quick Wins: Lead architectural discussions, mentor juniors
- Roles: Tech Lead, Staff Engineer, Architect, Engineering Manager

---

## File References

### Frontend Files
- `/frontend/src/components/quiz/ChattyQuizScreens.js` - Question definitions
- `/frontend/src/utils/evaluationLogic.js` - Data transformation
- `/frontend/src/context/ProfileContext.js` - State management
- `/frontend/src/components/QuizPage.js` - Quiz flow orchestration

### Backend Files
- `/backend/main.py` - API endpoint
- `/backend/models.py` - Response data structures
- `/backend/run_poc.py` - Core evaluation logic
- `/backend/scoring_logic.py` - Score calculation

