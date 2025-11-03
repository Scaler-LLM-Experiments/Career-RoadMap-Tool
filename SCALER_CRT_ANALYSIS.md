# Scaler CRT Analysis & Implementation Guide

**Date:** October 23, 2025
**Purpose:** Understand and replicate Scaler CRT logic in Career Roadmap Tool

---

## 📋 Overview

The Scaler CRT (Career Roadmap Tool) is a **3-step wizard** that helps users discover their career path by:
1. Asking about their current role
2. Asking about their target role
3. Asking about their current skills
4. Generating a personalized roadmap with skill gaps and recommendations

---

## 🎯 Question Flow (3 Steps)

### **Step 1: Current Role**
- **UI:** Grid of role buttons (2 columns on mobile, auto-advances on click)
- **Options:**
  - Software Engineer, Frontend Developer, Backend Developer, Full Stack Developer
  - Data Scientist, Data Analyst, DevOps Engineer, Cloud Engineer
  - Machine Learning Engineer, AI Engineer, Product Manager, UI/UX Designer
  - Mobile Developer, QA Engineer, Other (with text input)
- **Data collected:** `currentRole` (string)

### **Step 2: Target Role**
- **UI:** Grid of role cards with descriptions (auto-advances on click)
- **Options:**
  - **Software Engineering** - "Build robust and scalable software applications"
  - **Data Science** - "Extract insights and build machine learning models"
  - **Data Analytics** - "Create business intelligence and data visualization solutions"
  - **DevOps & Cloud Computing** - "Manage reliable and scalable cloud infrastructure"
  - **Advanced AI & ML** - "Develop cutting-edge AI and machine learning systems"
- **Data collected:** `targetRole` (string)

### **Step 3: Current Skills**
- **UI:** Pill-style multi-select buttons (scrollable container)
- **Skills fetched from:** `/api/suggested-skills/:targetRole` endpoint
- **Features:**
  - Skills loaded dynamically based on target role
  - Shows count of selected skills
  - "None" option available at top
- **Data collected:** `currentSkills` (array of strings)

### **Submit Button**
- Text: "Get My Roadmap"
- Calls: `POST /api/analyze-skills` with all collected data
- Shows loading animation with match score calculation

---

## 🔧 Backend Logic & Algorithms

### **1. Skills Selection Logic**

```javascript
// Endpoint: GET /api/suggested-skills/:targetRole
// Returns: Priority skills (High + some Medium/Low)

// Algorithm:
1. Check if target role has explicit priorities
2. If YES: Return ALL skills from priority list
3. If NO: Return flattened skills from taxonomy
4. Add "None" option at the top
5. Return array of skill names
```

### **2. Match Score Calculation** ⭐

This is the **core algorithm** that powers the results:

```javascript
// Endpoint: POST /api/analyze-skills
// Input: { currentRole, targetRole, currentSkills, yearsExperience }

// STEP 1: Get target role skills
const explicitPriorities = getExplicitPriorities(targetRole);
let targetRoleSkills = [];

if (explicitPriorities exists) {
  targetRoleSkills = Object.keys(explicitPriorities); // All priority skills
} else {
  targetRoleSkills = flatten(skillTaxonomy[targetRole]); // Fallback
}

// STEP 2: Filter existing skills (only count relevant ones)
const existingSkills = currentSkills.filter(skill =>
  targetRoleSkills.includes(skill)
);

// STEP 3: Find missing skills
const missingSkills = targetRoleSkills.filter(skill =>
  !currentSkills.includes(skill)
);

// STEP 4: Calculate weighted match score
let weightedScore = 0;
let totalWeight = 0;

if (explicitPriorities exists) {
  // Weighted scoring based on priority
  existingSkills.forEach(skill => {
    const priority = explicitPriorities[skill] || 'Low';
    const weight = priority === 'High' ? 3
                 : priority === 'Medium' ? 2
                 : 1;
    weightedScore += weight;
  });

  targetRoleSkills.forEach(skill => {
    const priority = explicitPriorities[skill] || 'Low';
    const weight = priority === 'High' ? 3
                 : priority === 'Medium' ? 2
                 : 1;
    totalWeight += weight;
  });
} else {
  // Simple coverage for roles without priorities
  weightedScore = existingSkills.length;
  totalWeight = targetRoleSkills.length;
}

const skillCoverage = totalWeight > 0 ? (weightedScore / totalWeight) : 0;
const matchScore = Math.round(skillCoverage * 100);

// STEP 5: Prioritize skills
const prioritizedMissing = prioritizeSkills(missingSkills, targetRole);
const prioritizedExisting = prioritizeSkills(existingSkills, targetRole);

// STEP 6: Generate recommendations for top 5 missing skills
const topMissingSkills = prioritizedMissing.slice(0, 5);
const recommendations = await generateAIRecommendations(...);

// STEP 7: Return structured response
return {
  matchScore,
  existingSkills: prioritizedExisting.map(s => s.skill),
  missingSkills: prioritizedMissing.map(s => s.skill),
  prioritizedMissing,
  recommendations,
  targetRoleSkills: targetRoleSkills.length,
  skillCoverage: Math.round(skillCoverage * 100)
};
```

### **3. Skill Prioritization Algorithm**

```javascript
function prioritizeSkills(skills, targetRole) {
  const explicitPriorities = getExplicitPriorities(targetRole);

  return skills
    .map(skill => {
      const priority = explicitPriorities[skill] || 'Low';
      const priorityScore = priority === 'High' ? 5
                          : priority === 'Medium' ? 3
                          : 1;
      const reason = getPriorityReason(skill, priority);

      return { skill, priorityScore, reason, priority };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
```

**Priority Score Mapping:**
- **High Priority** → Score: 5 → Weight: 3
- **Medium Priority** → Score: 3 → Weight: 2
- **Low Priority** → Score: 1 → Weight: 1

### **4. Priority Definitions**

#### **Software Engineering**
- **High (9 skills):** Programming Languages, Data structures, Algorithms, OOP, Git, Debugging, Testing, Problem solving, Critical thinking
- **Medium (8 skills):** Databases, OS, Networking, CI, System design, Distributed systems, API design, Scripting
- **Low (13 skills):** Docker, Kubernetes, Cloud, Microservices, Caching, Load balancing, Math, Stats, Mobile, ML basics, Data eng, UI/UX

#### **DevOps & Cloud Computing**
- **High (9 skills):** Linux, Bash/Python scripting, Git, CI/CD, Docker, Cloud (AWS/Azure/GCP), Networking, Security, Monitoring/Logging
- **Medium (9 skills):** Kubernetes, Load balancing, HA design, Jenkins/GitLab, Troubleshooting, Agile, Serverless, Cloud DBs, Compliance
- **Low (7 skills):** Service mesh, Edge computing, Hybrid cloud, Multi-cloud, Advanced scripting, AI/ML ops, Quantum

#### **Advanced AI & ML**
- **High (10 skills):** NumPy, Pandas, Probability, Statistics, EDA, Visualization, Linear/Logistic regression, Evaluation metrics, scikit-learn
- **Medium (49 skills):** All ML/DL topics (CNNs, RNNs, Transformers, LLMs, RAG, MLOps, etc.)
- **Low (9 skills):** SageMaker, Docker, CI/CD for ML, Ethics, Advanced theory, DSA

---

## 📊 Results Page Structure

### **Skills Gap Tab**
- Match Score (circular progress)
- Existing Skills (with priority badges)
- Missing Skills (prioritized: High → Medium → Low)
- Top 5 Recommendations with:
  - Definition
  - Why it matters
  - Starter tasks
  - Difficulty level

### **Interview Prep Tab**
- Company cards filtered by target role
- Interview process breakdown
- Common interview questions
- Salary bands

### **Projects Tab**
- Tiered project recommendations (Beginner/Intermediate/Advanced)
- Skills required per project
- Estimated time
- Project rubric

---

## 🎨 UI/UX Design Patterns

### **Question Flow**
```
┌────────────────────────────────────────┐
│ Header: "Career Roadmap Tool"         │
│ Subtitle: "3 simple steps"            │
│ Social proof banner                    │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Progress Steps (1 → 2 → 3)            │
│ Visual indicators with icons           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Question Card (white bg, shadow)      │
│ Title: "What's your current role?"    │
│ Grid of options                        │
└────────────────────────────────────────┘

[Previous]                    [Next/Submit →]
```

### **Skills Selection UI**
```
Title: "Select your current skills"

┌────────────────────────────────────────┐
│ [Scrollable Container - max-h-96]     │
│                                        │
│ [Skill] [Skill] [Skill] [Skill]      │
│ [Skill] [Skill] [Skill]              │
│ [Skill] [Skill] [Skill] [Skill]      │
│                                        │
│ (Pills wrap, flex-wrap)                │
└────────────────────────────────────────┘

Selected 12 skills
```

### **Loading Animation**
- Circular progress with match score
- Animates from 0% to final score
- "Did you know?" tech fact
- Smooth transition to results page

---

## 🔄 Data Flow Diagram

```
User Input
    ↓
┌─────────────────────────────────────┐
│ Step 1: Current Role                │
│ → formData.currentRole              │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Step 2: Target Role                 │
│ → formData.targetRole               │
│ → Fetch skills for this role        │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Step 3: Current Skills              │
│ → formData.currentSkills[]          │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Submit → POST /api/analyze-skills   │
│ {                                   │
│   currentRole,                      │
│   targetRole,                       │
│   currentSkills,                    │
│   yearsExperience                   │
│ }                                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Backend Processing                  │
│ 1. Get target role skills           │
│ 2. Filter existing skills           │
│ 3. Find missing skills              │
│ 4. Calculate weighted match score   │
│ 5. Prioritize skills                │
│ 6. Generate recommendations         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Response                            │
│ {                                   │
│   matchScore: 75,                   │
│   existingSkills: [...],            │
│   missingSkills: [...],             │
│   prioritizedMissing: [...],        │
│   recommendations: [...]            │
│ }                                   │
└─────────────────────────────────────┘
    ↓
Results Page (Tabbed Interface)
```

---

## 💡 Key Takeaways for Implementation

### **1. Weighted Scoring is Critical**
The match score uses **weighted priorities**, not simple percentage:
- High priority skills count 3x more than low priority
- This ensures users are evaluated on what truly matters

### **2. Skills Must Be Role-Specific**
- Each target role has a curated priority list
- Skills shown in Step 3 come from this list
- Don't show generic skills—only relevant ones

### **3. Prioritization Drives Everything**
- Skills Gap section sorted by priority
- Recommendations focus on High priority gaps
- Interview prep and projects align with priorities

### **4. Auto-Advancement UX**
- Steps 1 & 2 auto-advance on selection (no "Next" click needed)
- Step 3 requires explicit "Get My Roadmap" button
- Smooth animations between steps

### **5. Loading Experience Matters**
- Animate match score from 0 → final
- Show interesting tech facts during loading
- 1-2 second delay before navigating to results

---

## 📁 Implementation Files to Create/Update

### **Frontend**

1. **`SkillsQuestion.js`** ✅ (Already exists, needs alignment fix)
   - Fix: Center-align question text
   - Fix: Better grid layout for skills

2. **Backend API Integration**
   - Create `/api/suggested-skills/:targetRole` endpoint
   - Create `/api/analyze-skills` endpoint with weighted scoring

3. **Results Page Components**
   - HeroSection with match score display
   - SkillsGapSection with prioritized lists
   - CompanyInsightsSection with tabs
   - ProjectsSection with tiered projects

### **Backend**

1. **`backend/roadmap_logic.py`** (New file)
   - Port `prioritizeSkills` function
   - Port `getExplicitPriorities` function
   - Port weighted match score calculation

2. **`backend/skills_analysis.py`** (New file)
   - Port skill taxonomy
   - Port explicit priorities for all roles
   - Implement skill filtering and matching

3. **`backend/main.py`** (Update)
   - Add `/api/suggested-skills/:targetRole` endpoint
   - Add `/api/analyze-skills` endpoint

---

## 🎯 Implementation Priority

### **Phase 1: Core Algorithm (Backend)**
1. ✅ Create priority definitions for all target roles
2. ✅ Implement weighted match score calculation
3. ✅ Implement skill prioritization algorithm
4. ✅ Create API endpoints

### **Phase 2: Question Flow (Frontend)**
1. ✅ Fix SkillsQuestion alignment
2. ✅ Implement skills fetching from API
3. ✅ Add loading animation with score
4. ✅ Handle form submission

### **Phase 3: Results Page**
1. ⬜ Build Skills Gap section with priority badges
2. ⬜ Build Company Insights section with tabs
3. ⬜ Build Projects section with tiers
4. ⬜ Add match score visualization

---

## 📊 Expected Output Format

```javascript
{
  matchScore: 75,
  existingSkills: [
    "Python",
    "Git",
    "Data structures"
  ],
  missingSkills: [
    "Algorithms",
    "System design",
    "Docker"
  ],
  prioritizedMissing: [
    {
      skill: "Algorithms",
      priorityScore: 5,
      priority: "High",
      reason: "Essential skill for this role"
    },
    {
      skill: "System design",
      priorityScore: 3,
      priority: "Medium",
      reason: "Important supporting skill"
    },
    {
      skill: "Docker",
      priorityScore: 1,
      priority: "Low",
      reason: "Nice-to-have skill"
    }
  ],
  recommendations: [
    {
      skill: "Algorithms",
      category: "Computer Science Fundamentals",
      definition: "...",
      whyItMatters: "...",
      starterTasks: [...],
      difficulty: "Intermediate"
    }
  ],
  targetRoleSkills: 30,
  skillCoverage: 75
}
```

---

**Status:** Analysis Complete ✅
**Next Steps:** Fix UI alignment → Implement backend logic → Build results page

