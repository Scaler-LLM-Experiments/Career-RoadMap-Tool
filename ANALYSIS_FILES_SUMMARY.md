# Free Profile Evaluator - Analysis & File References

## Documents Created

All analysis documents have been saved to:
```
/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/
```

### Files Generated

1. **FREE_PROFILE_EVALUATOR_ANALYSIS.md** - Comprehensive 450+ line analysis
   - Complete quiz structure (both tech and non-tech paths)
   - Question definitions with all options
   - Data transformation logic
   - Evaluation output structure
   - Scoring rules and consistency checks
   - Business logic and critical rules
   - Complete data flow diagrams

2. **QUIZ_STRUCTURE_SUMMARY.md** - Quick reference guide
   - Two-path comparison (Tech vs Career Switcher)
   - Question matrix tables
   - Dependencies and conditional logic
   - Example user journeys
   - Display mappings and seniority levels

3. **ANALYSIS_FILES_SUMMARY.md** - This file with absolute paths

---

## Source Code References

### Frontend Files

#### Quiz Configuration
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/components/quiz/ChattyQuizScreens.js`
- **Contains:** TECH_QUIZ_SCREENS and NON_TECH_QUIZ_SCREENS definitions
- **Key Exports:**
  - TECH_QUIZ_SCREENS (3 screens with 3 questions each)
  - NON_TECH_QUIZ_SCREENS (3 screens with 2-3 questions each)
  - Question IDs, options, conditional logic, chat responses

#### Quiz Flow
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/components/quiz/FinalModeQuiz.js`
- **Contains:** Main quiz orchestration component
- **Key Logic:**
  - Background selection (Step 0)
  - Dynamic quiz screen rendering
  - Next/Previous navigation
  - Answer validation with canProceed()
  - Label field storage for display

#### Quiz Page Wrapper
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/components/QuizPage.js`
- **Contains:** Router wrapper for quiz
- **Redirects to results if evaluation already exists

#### Evaluation Logic & Data Transformation
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/utils/evaluationLogic.js`
- **Contains:**
  - `mapTechQuizResponses()` - Transform tech path data
  - `mapNonTechQuizResponses()` - Transform non-tech path data
  - `deriveCurrentCompany()` - Derive company type from role
  - `inferPortfolio()` - Infer portfolio from problem-solving level
  - `deriveNonTechProblemSolving()` - Map codeComfort to problemSolving
  - `buildEvaluationPayload()` - Build final payload
  - `evaluateProfile()` - Make API call to backend

#### State Management
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/context/ProfileContext.js`
- **Contains:**
  - ProfileProvider component
  - profileReducer with action types
  - useProfile() hook
  - localStorage persistence
  - State structure:
    - background: 'tech' | 'non-tech'
    - quizResponses: {[questionId]: answer}
    - goals: {requirementType, targetCompany, topicOfInterest}
    - evaluationResults: full response object
    - isLoading: boolean

#### Results Page
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/components/ResultsPage.js`
- **Contains:**
  - Results page layout
  - Loading state with progress bar
  - Error handling
  - Display of evaluation results using card components

#### Mock Data (Testing)
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/frontend/src/utils/mockEvaluationData.js`
- **Contains:**
  - mockEvaluationResults - Tech professional mock data
  - mockEvaluationResultsNonTech - Career switcher mock data
  - Sample output structure for 12 result sections

---

### Backend Files

#### API Endpoint & Request Handling
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/backend/main.py`
- **Contains:**
  - FastAPI app setup
  - QuizResponses model (request validation)
  - Goals model
  - EvaluationRequest model
  - POST /evaluate endpoint
  - CORS configuration
  - Health check endpoint

#### Response Models & Data Structures
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/backend/models.py`
- **Contains:**
  - ProfileEvaluation model
  - FullProfileEvaluationResponse
  - Nested models:
    - CurrentProfileSummary
    - SkillAnalysis
    - ExperienceBenchmark
    - InterviewReadiness
    - PeerComparison
    - SuccessLikelihood
    - QuickWin
    - RecommendedRole
  - Enums: ProfileStrengthStatus, ExperienceLevel, etc.
  - Status thresholds (85=Excellent, 70=Good, 50=Average)

#### Core Evaluation Logic
- **File:** `/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/backend/run_poc.py`
- **Contains:**
  - `call_openai_structured()` - Main evaluation orchestration
  - System instructions with critical business rules
  - Consistency checks and contradiction detection
  - Score range rules
  - Tool recommendation guidelines
  - Quick wins generation logic
  - Role recommendation logic (3-5 roles with timelines)
  - India market context
  - OpenAI API integration with structured output
  - Redis caching support

#### Support Modules
- **Files:**
  - `scoring_logic.py` - Profile strength score calculation
  - `timeline_logic.py` - Career timeline estimation
  - `quick_wins_logic.py` - Quick win generation
  - `job_descriptions.py` - Job opportunity matching
  - `tools_logic.py` - Tool recommendations
  - `profile_notes_logic.py` - Profile notes generation
  - `current_profile_summary.py` - Current profile summary generation
  - `label_mappings.py` - Field label mappings
  - `peer_comparison_logic.py` - Peer comparison metrics

---

## Key Data Structures

### Quiz Response Format (Tech Path)
```javascript
{
  "background": "tech",
  "quizResponses": {
    // Screen 1: Who You Are
    "currentRole": "swe-product|swe-service|devops|qa-support",
    "experience": "0-2|2-3|3-5|5-8|8+",
    "currentSkill": "backend|frontend|fullstack|system-design|...",
    
    // Screen 2: Where You Want to Go
    "primaryGoal": "product-company|level-up|higher-comp|switch-domain|upskilling",
    "targetRole": "senior-backend|senior-fullstack|backend-sde|fullstack-sde|data-ml|tech-lead",
    "targetCompany": "faang|unicorns|startups|better-service|evaluating",
    
    // Screen 3: Your Readiness
    "problemSolving": "0-10|11-50|51-100|100+",
    "systemDesign": "multiple|once|learning|not-yet",
    "portfolio": "active-5+|limited-1-5|inactive|none",
    
    // Display-only fields (labels)
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

### Quiz Response Format (Non-Tech Path)
```javascript
{
  "background": "non-tech",
  "quizResponses": {
    // Screen 1: Who You Are
    "currentBackground": "sales-marketing|operations|design|finance|other",
    "experience": "0|0-2|2-3|3-5|5+",
    "stepsTaken": "completed-course|self-learning|built-projects|just-exploring|bootcamp",
    
    // Screen 2: Where You Want to Go
    "targetRole": "backend|fullstack|data-ml|frontend|not-sure",
    "motivation": "salary|interest|stability|flexibility|dissatisfied",
    "targetCompany": "any-tech|product|service|faang-longterm|not-sure",
    
    // Screen 3: Your Readiness
    "codeComfort": "confident|learning|beginner|complete-beginner",
    "timePerWeek": "10+|6-10|3-5|0-2"
  },
  "goals": {
    "requirementType": [],
    "targetCompany": "Any tech company for experience",
    "topicOfInterest": []
  }
}
```

### Evaluation Response Structure
```javascript
{
  "profile_evaluation": {
    // 12 main sections
    "profile_strength_score": 72,
    "profile_strength_status": "Good",
    "profile_strength_notes": "...",
    
    "current_profile": {
      "summary": "...",
      "key_stats": [...]
    },
    
    "skill_analysis": {
      "strengths": [...],
      "areas_to_develop": [...]
    },
    
    "recommended_tools": [...],
    "experience_benchmark": {...},
    "interview_readiness": {...},
    "peer_comparison": {...},
    "success_likelihood": {...},
    
    "quick_wins": [...],  // 3-5 items
    "opportunities_you_qualify_for": [...],
    "recommended_roles_based_on_interests": [...],  // 3-5 roles
    "badges": [...]
  }
}
```

---

## Critical Implementation Details

### Conditional Question Logic
```javascript
// System Design only shown if problemSolving != '0-10'
{
  id: 'systemDesign',
  question: "How comfortable are you with system design?",
  conditional: true,
  showIf: (responses) => responses.problemSolving !== '0-10',
  options: [...]
}
```

### Dynamic Options Logic
```javascript
// currentSkill options change based on currentRole
{
  id: 'currentSkill',
  question: "Where are you currently investing most time?",
  dynamicOptions: true,
  optionsByRole: {
    'swe-product': [...],
    'swe-service': [...],
    'devops': [...],
    'qa-support': [...]
  }
}
```

### Data Transformation Rules
```javascript
// Tech Path - Direct Mapping
primaryGoal → requirementType (must map string)
currentRole → currentCompany (must derive company type)

// Non-Tech Path - Complex Mapping
currentBackground → currentRole (field rename + value remap)
codeComfort → problemSolving (value mapping)
motivation → requirementType (field rename + value remap)
portfolio → INFERRED from problemSolving level
systemDesign → ALWAYS 'not-yet'
```

### Scoring Consistency Rules
```
If profile_strength_score = X:
  technical_interview_percent must be: X ± 10
  hr_behavioral_percent must be: X ± 10
  peer_comparison.percentile must be: X ± 5
  success_likelihood.score_percent must be: X ± 10
  
Logic: Success cannot exceed profile strength!
```

### Business Logic Rules
```
NEVER recommend:
  - LeetCode, HackerRank, GitHub, Coursera, Udemy
  - PM, Designer, or Manager roles (unless IC→Management progression)
  - Generic advice ("practice more coding")

ALWAYS include:
  - Specific, professional tools relevant to role
  - Technical/Engineering-only roles (3-5 recommendations)
  - Timelines with monthly milestones
  - India market context and salary ranges
  - Acknowledgment of strengths before gaps
  - Actionable quick wins (not generic advice)
```

---

## How to Use These Documents

1. **For Understanding the System:**
   - Start with `QUIZ_STRUCTURE_SUMMARY.md` (5-minute overview)
   - Then read `FREE_PROFILE_EVALUATOR_ANALYSIS.md` (deep dive)

2. **For Building the Career Roadmap Tool:**
   - Reference the question IDs and transformation logic
   - Copy the evaluation output structure
   - Adapt the seniority/timeline mappings to your needs
   - Understand the business logic constraints

3. **For Debugging:**
   - Check the quiz response format in both paths
   - Verify data transformation in evaluationLogic.js
   - Trace the backend response structure in models.py
   - Review consistency rules in run_poc.py

4. **For Implementation:**
   - Use the exact question IDs and values (case-sensitive!)
   - Follow the transformation patterns exactly
   - Implement all consistency checks
   - Respect the business logic constraints (no banned tools/roles)

