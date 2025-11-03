# Free Profile Evaluator - Complete Analysis Package

## Overview

This analysis package provides a comprehensive understanding of the Free Profile Evaluator system, including:

- Complete quiz question structure (both tech and career switcher paths)
- Question IDs, options, and dependencies
- Data transformation and mapping logic
- Evaluation output structure and scoring rules
- Business logic constraints and critical rules
- Complete file references with absolute paths
- Example user journeys

## Files in This Package

### 1. FREE_PROFILE_EVALUATOR_ANALYSIS.md (24 KB)
**The comprehensive deep-dive document**

Contains:
- Section 1: Quiz Flow & Question Structure
- Section 2: Tech Professional Path (9 questions across 3 screens)
- Section 3: Non-Tech / Career Switcher Path (8 questions across 3 screens)
- Section 4: Data Transformation & Mapping
- Section 5: Complete Evaluation Output Structure
- Section 6: Critical Scoring Rules
- Section 7: Context-Aware Personalization
- Section 8: Frontend Context Management
- Section 9: Key Insights & Design Patterns
- Section 10: Critical Business Rules
- Section 11: Complete Data Flow Diagram

**Read this for:** Complete understanding of the system, implementation details, scoring logic

### 2. QUIZ_STRUCTURE_SUMMARY.md (8.1 KB)
**The quick reference guide**

Contains:
- Two-path comparison table
- Tech path question matrix (9 questions)
- Non-tech path question matrix (8 questions)
- Key question dependencies
- Raw quiz values format
- Response components breakdown
- Display mappings and seniority levels
- Business logic rules
- 3 example user journeys
- File references

**Read this for:** Quick lookups, question lists, understanding flow, example outputs

### 3. ANALYSIS_FILES_SUMMARY.md (11 KB)
**The file reference guide**

Contains:
- All analysis documents overview
- Frontend file references (7 files) with absolute paths
- Backend file references (10+ files) with absolute paths
- Key data structures (Tech path, Non-tech path, Response)
- Critical implementation details
- How to use these documents

**Read this for:** File locations, where to find code, data structure formats

### 4. README_ANALYSIS.md
**This file - navigation guide**

---

## Quick Start

### I have 5 minutes
- Read the Two Parallel Paths section in QUIZ_STRUCTURE_SUMMARY.md
- Look at the Question Matrix tables

### I have 15 minutes
- Read all of QUIZ_STRUCTURE_SUMMARY.md
- Understand the example user journeys

### I have 30 minutes
- Read QUIZ_STRUCTURE_SUMMARY.md (15 min)
- Read Section 1-5 of FREE_PROFILE_EVALUATOR_ANALYSIS.md (15 min)

### I have 1 hour
- Read all of QUIZ_STRUCTURE_SUMMARY.md (15 min)
- Read all of FREE_PROFILE_EVALUATOR_ANALYSIS.md (40 min)
- Skim ANALYSIS_FILES_SUMMARY.md for file references (5 min)

### I need to implement this
- Start with ANALYSIS_FILES_SUMMARY.md to understand file structure
- Read relevant sections from FREE_PROFILE_EVALUATOR_ANALYSIS.md
- Reference QUIZ_STRUCTURE_SUMMARY.md for question lists and mappings
- Use absolute file paths from ANALYSIS_FILES_SUMMARY.md to explore code

---

## Key Facts at a Glance

### Quiz Structure
- **Background Selection:** Tech Professional OR Career Switcher
- **Tech Path:** 3 screens, 9 questions
- **Non-Tech Path:** 3 screens, 8 questions
- **Screen 1:** Who You Are (current situation)
- **Screen 2:** Where You Want to Go (aspirations)
- **Screen 3:** Your Readiness (preparation level)

### Data Transformation
- **Tech Path:** Mostly direct mapping, derives company type from role
- **Non-Tech Path:** Complex mapping with inferred values (portfolio, systemDesign)
- **Key Mapping:** primaryGoal → requirementType, codeComfort → problemSolving

### Evaluation Output
- **12 Sections:** Profile strength, current profile, skills, tools, benchmarks, readiness, peer comparison, success likelihood, quick wins, roles, opportunities, badges
- **Score Range:** 0-100, with 4 status levels
- **Consistency Rules:** All percentage scores must be within ±10 of profile_strength_score

### Critical Business Rules
- BANNED Tools: LeetCode, HackerRank, GitHub, Coursera, Udemy, generic IDEs
- REQUIRED: Specific professional tools, technical/engineering roles only (3-5 roles)
- PERSONALIZED: Tool recommendations, role suggestions, quick wins based on user profile
- India Market Focus: Mention Razorpay, Swiggy, CRED, PhonePe, etc.

### Persona Types (Implicit)
1. Entry-Level Tech Professional (0-2 years)
2. Mid-Level Tech Professional (3-5 years)
3. Senior Tech Professional (5-8 or 8+ years)
4. Career Switcher - Early (just exploring)
5. Career Switcher - Intermediate (completed course/self-learning)
6. Career Switcher - Advanced (bootcamp/built projects)

---

## File Locations

All source code is in:
```
/Users/sudhanvaacharya/Desktop/Code Projects/Scaler <> Growth/Free Profile Evaluation - Core File/
```

### Key Frontend Files
- Quiz Configuration: `frontend/src/components/quiz/ChattyQuizScreens.js`
- Quiz Flow: `frontend/src/components/quiz/FinalModeQuiz.js`
- Data Transform: `frontend/src/utils/evaluationLogic.js`
- State Management: `frontend/src/context/ProfileContext.js`

### Key Backend Files
- API Endpoint: `backend/main.py`
- Response Models: `backend/models.py`
- Core Logic: `backend/run_poc.py`

See ANALYSIS_FILES_SUMMARY.md for complete file references with descriptions.

---

## Document Sections Cross-Reference

### Looking for Question List?
- QUIZ_STRUCTURE_SUMMARY.md: Question Matrices (Table format)
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Sections 2-3 (Full details with options)

### Looking for Question IDs?
- QUIZ_STRUCTURE_SUMMARY.md: Question Matrices
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Sections 2-3

### Looking for Data Transformation?
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Section 4
- ANALYSIS_FILES_SUMMARY.md: Data Transformation Rules

### Looking for Output Structure?
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Section 5
- ANALYSIS_FILES_SUMMARY.md: Evaluation Response Structure

### Looking for Scoring Rules?
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Section 6
- ANALYSIS_FILES_SUMMARY.md: Scoring Consistency Rules

### Looking for Example Outputs?
- QUIZ_STRUCTURE_SUMMARY.md: Example User Journeys
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Mock Data section

### Looking for File Locations?
- ANALYSIS_FILES_SUMMARY.md: All absolute paths

### Looking for Business Logic?
- FREE_PROFILE_EVALUATOR_ANALYSIS.md: Section 10
- ANALYSIS_FILES_SUMMARY.md: Business Logic Rules

---

## Summary of Findings

### Two Distinct Quiz Paths

**TECH PROFESSIONAL PATH:**
- 9 total questions across 3 screens
- Direct value mapping (mostly)
- Derives company type from current role
- System Design is conditional (only if problemSolving > 0-10)
- Current skill options are dynamic (change by role)

**CAREER SWITCHER PATH:**
- 8 total questions across 3 screens
- Complex value mapping (codeComfort → problemSolving)
- Portfolio is INFERRED from problem-solving level
- System Design is ALWAYS 'not-yet'
- No conditional questions

### Key Dependencies
- currentRole → currentSkill (dynamic options)
- problemSolving → systemDesign (conditional display)
- codeComfort → problemSolving (mapping)
- problemSolving → portfolio (inference)

### Evaluation Output: 12 Sections
All sections are generated by AI (OpenAI API) with strict consistency rules:
1. Profile Strength Score (0-100)
2. Current Profile Summary
3. Skill Analysis (Strengths + Gaps)
4. Recommended Tools
5. Experience Benchmark
6. Interview Readiness
7. Peer Comparison
8. Success Likelihood
9. Quick Wins (3-5 items)
10. Recommended Roles (3-5 roles with timelines)
11. Opportunities to Qualify For
12. Badges

### Critical Constraints
- All percentage scores must be within ±10 of profile_strength_score
- System design can't exceed coding practice (logical consistency)
- Only technical/engineering roles recommended (no PM/Designer unless rare cases)
- Tools must be specific and professional (banned: LeetCode, GitHub, Coursera)
- Quick wins must be actionable (not generic like "practice more")

---

## Using This Analysis for the Career Roadmap Tool

Since you're building the Career Roadmap Tool based on the Free Profile Evaluator:

1. **Reuse the Question Structure:**
   - Tech path: 3 screens, 9 questions (study/adapt to roadmap context)
   - Non-tech path: 8 questions (study/adapt)
   - Dynamic and conditional questions work well

2. **Reuse the Data Transformation:**
   - mapTechQuizResponses() logic is solid
   - mapNonTechQuizResponses() shows how to handle different paths
   - Derive and infer fields strategically

3. **Adapt the Output Structure:**
   - 12 sections might be too many for roadmap (more focused on skills gap)
   - Keep: Profile Summary, Skill Analysis, Quick Wins, Recommended Roles
   - Modify: Learning Path (from careerTopics.json), Company Insights (from Scaler CRT)

4. **Understand the Scoring:**
   - Profile strength calculation is comprehensive (8-12 factors)
   - Consistency checks prevent impossible combinations
   - Use similar seniority tiers (0-2, 3-5, 5-8, 8+)

5. **Business Logic to Implement:**
   - Respect persona types (6 types identified)
   - Only recommend technical roles (critical constraint)
   - Make recommendations specific and actionable
   - Include India market context
   - Timeline estimates based on experience level

---

## Questions? Go To:

- "What are all the questions?" → QUIZ_STRUCTURE_SUMMARY.md
- "How does this question work?" → FREE_PROFILE_EVALUATOR_ANALYSIS.md (Sections 2-3)
- "Where is the code?" → ANALYSIS_FILES_SUMMARY.md
- "How are scores calculated?" → FREE_PROFILE_EVALUATOR_ANALYSIS.md (Section 6)
- "What gets sent to the backend?" → ANALYSIS_FILES_SUMMARY.md (Data Structures)
- "What comes back?" → FREE_PROFILE_EVALUATOR_ANALYSIS.md (Section 5)
- "What's the business logic?" → FREE_PROFILE_EVALUATOR_ANALYSIS.md (Section 10)

---

**Analysis Complete:** October 30, 2025
**Source Codebase:** Free Profile Evaluation - Core File
**Next Step:** Review the Career RoadMap Tool CLAUDE.md for integration points

