# QUIZ DATA AUDIT - Complete Checklist

## PART 1: ALL QUIZ QUESTIONS & VARIABLES

### SCREEN 1: Background Selection (ALL USERS)
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| What's your current background? | `background` | button-grid | `tech` \| `non-tech` |

---

### SCREEN 2A: Tech Professional Path
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| What's your current role? | `currentRole` | button-grid | `swe-product`, `swe-service`, `devops`, `qa` |
| Years in tech? | `yearsOfExperience` | radio | `0-2`, `2-3`, `3-5`, `5-8`, `8+` |

### SCREEN 2B: Non-Tech Path
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| Current professional background? | `currentBackground` | button-grid | `sales-marketing`, `operations`, `design`, `finance`, `other` |
| Years of work experience? | `yearsOfExperience` | radio | `0`, `0-2`, `2-3`, `3-5`, `5+` |
| Steps toward tech career? | `stepsTaken` | button-grid | `bootcamp`, `completed-course`, `built-projects`, `self-learning`, `just-exploring` |

---

### SCREEN 3A: Tech Professional Goals
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| Main career goal? | `primaryGoal` | button-grid | `better-company`, `level-up`, `higher-comp`, `switch-domain`, `upskilling` |
| Target role? | `targetRole` | button-grid | `Backend Engineer`, `Frontend Engineer`, `Full Stack Engineer`, `DevOps Engineer`, `Data Science Engineer` |
| Target company type? | `targetCompanyType` | button-grid | `faang`, `unicorns`, `startups`, `service` |

### SCREEN 3B: Non-Tech Goals & Readiness
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| Target role? | `targetRole` | button-grid | `Backend Engineer`, `Frontend Engineer`, `Full Stack Engineer`, `DevOps Engineer`, `Data Science Engineer` |
| Target company type? | `targetCompanyType` | button-grid | `faang`, `unicorns`, `startups`, `service` |
| Coding comfort? | `codeComfort` | radio | `confident`, `learning`, `beginner`, `complete-beginner` |

---

### SCREEN 4: Tech Readiness Assessment (TECH ONLY)
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| Coding practice frequency? | `problemSolving` | radio | `100+`, `51-100`, `11-50`, `0-10` |
| System design comfort? | `systemDesign` | radio | `multiple`, `once`, `learning`, `not-yet` |
| GitHub activity? | `portfolio` | radio | `active-5+`, `limited-1-5`, `inactive`, `none` |

---

### SCREEN 5: Skills Selection (ALL USERS)
| Question | Variable Name | Type | Possible Values |
|----------|---------------|------|-----------------|
| Which skills do you have? | `currentSkills` | multi-select-pills | **Array of skill names** (see Skills Inventory below) |

---

## PART 2: SKILLS INVENTORY BY ROLE

### Backend Engineer Skills (13 Total)
```
1. Java
2. Spring Framework
3. SQL & Databases
4. System Design
5. Microservices
6. API Design (REST/GraphQL)
7. Docker & Containers
8. Message Queues (Kafka)
9. Caching (Redis)
10. Data Structures & Algorithms
11. Testing & Mocking
12. CI/CD & Deployment
13. Version Control (Git)
```

### Frontend Engineer Skills (12 Total)
```
1. JavaScript/TypeScript
2. React
3. HTML & CSS
4. Redux/State Management
5. Testing (Jest, React Testing Library)
6. Performance Optimization
7. Web APIs
8. Responsive Design
9. Build Tools (Webpack, Vite)
10. Git & Version Control
11. Figma & Design Tools
12. Browser DevTools & Debugging
```

### Full Stack Engineer Skills (15 Total)
```
1. JavaScript/TypeScript
2. React
3. Node.js
4. Express/Backend Framework
5. SQL & Databases
6. HTML & CSS
7. System Design
8. APIs (REST/GraphQL)
9. Authentication & Security
10. Docker & Containers
11. Testing
12. CI/CD
13. Git
14. Caching (Redis)
15. Web Performance
```

### DevOps Engineer Skills (12 Total)
```
1. Linux/Unix
2. Bash Scripting
3. Docker
4. Kubernetes
5. CI/CD (Jenkins, GitLab CI)
6. Infrastructure as Code (Terraform)
7. AWS/GCP/Azure
8. Networking Basics
9. Monitoring & Logging
10. Git
11. Python
12. Load Balancing
```

### Data Science Engineer Skills (12 Total)
```
1. Python Programming Mastery
2. SQL & Database Queries
3. Data Structures & Algorithms
4. Data Manipulation (Pandas/NumPy)
5. Statistical Analysis
6. Machine Learning Fundamentals
7. Data Visualization
8. Big Data Technologies (Spark)
9. ETL Pipelines & Data Engineering
10. Cloud Platforms (AWS/GCP)
11. Feature Engineering & Selection
12. Version Control & Git
```

---

## PART 3: DATA FLOW TO ORCHESTRATOR

### What Orchestrator EXPECTS to Receive

```javascript
// Input: matchingInput object
{
  userType: 'tech_professional' | 'career_switcher',
  yearsOfExperience: '0-2' | '2-3' | '3-5' | '5-8' | '8+' | '0' | '5+',
  targetRole: 'Backend Engineer' | 'Frontend Engineer' | 'Full Stack Engineer' | 'DevOps Engineer' | 'Data Science Engineer',
  requirementType: 'better-company' | 'level-up' | 'higher-comp' | 'switch-domain' | 'upskilling' | ...,
  targetCompanyType: 'bigtech' | 'scaleup' | 'startup' | 'service',

  // ⬅️ THIS IS THE CRITICAL ONE - MUST BE AN ARRAY OF SKILL STRINGS
  currentSkills: ['Python Programming Mastery', 'SQL & Database Queries', ...]
}
```

### Current Data Flow (As of latest fix)

```
Quiz Screen → QuizOrchestrator
    ↓
    Stores in UnifiedContext via setQuizResponse()
    ↓
User clicks "Generate Roadmap"
    ↓
router.push('/roadmap-experimental')
    ↓
RoadmapNewExperimental (index.jsx)
    ↓
Destructure: { quizResponses } = useUnified()
    ↓
Build matchingInput object with:
  - background → userType
  - yearsOfExperience → yearsOfExperience
  - targetRole → targetRole
  - primaryGoal → requirementType
  - targetCompanyType → targetCompanyType
  - currentSkills → currentSkills ✅ (FIXED)
    ↓
Call getPersonalizedRoadmapConfig(matchingInput)
    ↓
generatePersonalizedRoadmap(quizResponses, profileData)
    ↓
enrichRoadmapConfig(composed, quizResponses)
    Uses: quizResponses.currentSkills to calculate missing skills
```

---

## PART 4: VERIFICATION CHECKLIST

### ✅ Variables Being Captured
- [x] `background` - stored in quizResponses
- [x] `currentRole` / `currentBackground` - stored in quizResponses
- [x] `yearsOfExperience` - stored in quizResponses
- [x] `primaryGoal` - stored in quizResponses
- [x] `targetRole` - stored in quizResponses
- [x] `targetCompanyType` - stored in quizResponses
- [x] `problemSolving` - stored in quizResponses (tech only)
- [x] `systemDesign` - stored in quizResponses (tech only)
- [x] `portfolio` / `stepsTaken` - stored in quizResponses
- [x] `codeComfort` - stored in quizResponses (non-tech only)
- [x] `currentSkills` - stored in quizResponses as ARRAY

### ✅ Skills Being Offered
- [x] Backend Engineer - 13 skills offered
- [x] Frontend Engineer - 12 skills offered
- [x] Full Stack Engineer - 15 skills offered
- [x] DevOps Engineer - 12 skills offered
- [x] Data Science Engineer - 12 skills offered

### ✅ Data Flowing to Orchestrator
- [x] userType passed
- [x] yearsOfExperience passed
- [x] targetRole passed
- [x] requirementType passed
- [x] targetCompanyType passed
- [x] currentSkills passed ✅ (FIXED IN THIS SESSION)

---

## DEBUG LOGGING POINTS

To verify data is flowing correctly, open browser console and look for:

### When selecting skills:
```
Processed questions: [array showing currentSkills captured]
```

### When roadmap generates:
```
📋 Mapped Input for Orchestrator: {
  userType: '...',
  yearsOfExperience: '...',
  targetRole: '...',
  requirementType: '...',
  targetCompanyType: '...',
  currentSkills: [...] ✅ Should show your selected skills here
}
```

### During enrichment:
```
🔍 ENRICHMENT: Processing currentSkills
   Input quizResponses.currentSkills: [your skills array]
   currentSkills count: X ✅ Should be > 0 if you selected skills

✅ MATCH SCORE CALCULATED:
   Critical matches: X / Y ✅ Shows what matched
   Missing critical skills: [list] ✅ Shows what's missing
```

---

## ACTION ITEMS IF SOMETHING BREAKS

1. **If `currentSkills` is empty in console:**
   - Check if user actually selected skills (click happened)
   - Check if QuizOrchestrator.js line 806 is calling setQuizResponse correctly
   - Check UnifiedContext reducer has `SET_QUIZ_RESPONSE` handler

2. **If orchestrator doesn't receive currentSkills:**
   - Check index.jsx lines 77-103 are passing it in matchingInput
   - Verify currentSkills is in matchingInput object

3. **If enrichment doesn't calculate skills correctly:**
   - Check RoadmapCompositionOrchestrator.js enrichRoadmapConfig function
   - Verify skill names match exactly (case-sensitive!)
