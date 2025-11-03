# Migration Guide - Context Unification & Next.js Architecture

**Date:** October 23, 2025
**Version:** 1.0.0

---

## Overview

This guide documents the migration from dual contexts (ProfileContext + RoadmapContext) to a unified context system, and clarifies the Next.js architecture used in the Career Roadmap Tool.

---

## 🎯 What Changed?

### Before (Old Architecture)

```
❌ Two separate contexts:
   - ProfileContext (from Free Profile Evaluator)
   - RoadmapContext (for Roadmap Tool)

❌ Two localStorage keys:
   - 'scalerProfileState'
   - 'scalerRoadmapState'

❌ Routing confusion:
   - CLAUDE.md mentioned React Router v6
   - Actually using Next.js pages/ directory
```

### After (New Architecture)

```
✅ Single unified context:
   - UnifiedContext.js

✅ Single localStorage key:
   - 'scalerCareerRoadmapState'

✅ Clear Next.js 13 routing:
   - pages/ directory with file-based routing
   - SSR-aware localStorage handling
```

---

## 🔄 Migration Steps for Developers

### Step 1: Update Context Imports

**Old Code:**
```javascript
// Using ProfileContext
import { useProfile } from '../context/ProfileContext';

// Using RoadmapContext
import { useRoadmap } from '../context/RoadmapContext';
```

**New Code (Option A - Recommended):**
```javascript
// Use UnifiedContext directly
import { useUnified } from '../context/UnifiedContext';

function MyComponent() {
  const {
    profileData,
    currentSkills,
    timeline,
    setCurrentSkills,
    setTimeline,
    loading,
    setLoading
  } = useUnified();
}
```

**New Code (Option B - Backward Compatible):**
```javascript
// Keep using old hook names (they're aliases now)
import { useProfile } from '../context/UnifiedContext';
// OR
import { useRoadmap } from '../context/UnifiedContext';

// Both give you access to the SAME unified state!
```

### Step 2: Update _app.js (Already Done ✅)

**Old:**
```javascript
import { ProfileProvider } from '../src/context/ProfileContext';

function MyApp({ Component, pageProps }) {
  return (
    <ProfileProvider>
      <Component {...pageProps} />
    </ProfileProvider>
  );
}
```

**New:**
```javascript
import { UnifiedProvider } from '../src/context/UnifiedContext';

function MyApp({ Component, pageProps }) {
  return (
    <UnifiedProvider>
      <Component {...pageProps} />
    </UnifiedProvider>
  );
}
```

### Step 3: Update Next.js Routing

**Old (incorrect reference in CLAUDE.md):**
```javascript
// ❌ This was mentioned but not actually used
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/quiz');
```

**New (correct Next.js routing):**
```javascript
// ✅ Use Next.js router
import { useRouter } from 'next/router';

function MyComponent() {
  const router = useRouter();

  // Navigate to pages
  router.push('/quiz');      // Goes to pages/quiz.js
  router.push('/roadmap');   // Goes to pages/roadmap.js
}
```

---

## 📦 State Structure Reference

### Complete State Shape

```javascript
{
  // ===== FROM PROFILE EVALUATOR =====
  profileData: {
    userName: string,
    userType: 'tech_professional' | 'career_switcher',
    currentRole: string,
    yearsExperience: string,
    targetRole: string,
    targetCompanyType: string,
    codingPractice: string,
    systemDesign: string,
    primaryGoal: string,
  },

  background: 'tech' | 'non-tech',

  quizResponses: {
    [questionKey]: answerValue,
    // Example: { currentRole: 'Software Engineer', ... }
  },

  goals: {
    requirementType: string[],
    targetCompany: string,
    topicOfInterest: string[]
  },

  evaluationResults: {
    profile_strength_score: number,
    profile_strength_notes: string,
    badges: object[],
    // ... more evaluation data
  },

  // ===== ROADMAP-SPECIFIC DATA =====
  currentSkills: string[],
  // Example: ['Python', 'Git', 'SQL', 'React']

  timeline: string,
  // Example: '6-9 months', '9-12 months', '12-18 months'

  roadmap: {
    userName: string,
    targetRole: string,
    timeline: string,
    phases: Phase[],
    matchScore: number,
    currentSkills: Skill[],
    missingSkills: {
      highPriority: Skill[],
      mediumPriority: Skill[],
      lowPriority: Skill[]
    },
    targetCompanies: Company[],
    recommendedProjects: Project[]
  },

  // ===== UI STATE =====
  loading: boolean,
  error: string | null
}
```

### Available Methods

```javascript
// Profile Evaluator methods
setBackground(background)
setQuizResponse(question, answer)
clearQuizResponses()
setGoals(goals)
setEvaluationResults(results)

// Roadmap methods
setProfileData(data)
setCurrentSkills(skills)
setTimeline(timeline)
setRoadmap(roadmap)

// UI state methods
setLoading(boolean)
setError(string | null)

// Reset methods
resetAll()              // Clears everything
resetRoadmapOnly()      // Clears only roadmap data
resetProfile()          // Alias for resetAll()
resetRoadmap()          // Alias for resetRoadmapOnly()
```

---

## 🗺️ Next.js Routing Structure

### Pages & Routes

```
pages/
├── _app.js          → Wraps all pages with UnifiedProvider
├── _document.js     → Next.js document customization
├── index.js         → / (Landing page)
├── quiz.js          → /quiz (Questions flow)
├── roadmap.js       → /roadmap (Roadmap results)
└── results.js       → /results (Profile evaluation results)
```

### Navigation Examples

```javascript
import { useRouter } from 'next/router';

function Navigation() {
  const router = useRouter();

  // Navigate to different pages
  const goToLanding = () => router.push('/');
  const goToQuiz = () => router.push('/quiz');
  const goToRoadmap = () => router.push('/roadmap');
  const goToResults = () => router.push('/results');

  // Check current page
  const isOnQuiz = router.pathname === '/quiz';
  const isOnRoadmap = router.pathname === '/roadmap';
}
```

---

## ⚠️ Breaking Changes (None!)

### Good News: Zero Breaking Changes ✅

- All existing components continue to work
- `useProfile()` and `useRoadmap()` are backward-compatible aliases
- No component updates required immediately
- Old context files are marked DEPRECATED but not removed

### Recommended Updates (Non-Breaking)

1. **Gradually migrate to `useUnified()`** for new components
2. **Use Next.js `useRouter`** instead of React Router references
3. **Update localStorage key name** if directly accessing storage (rare)

---

## 🔍 Common Migration Scenarios

### Scenario 1: Component Using ProfileContext

**Before:**
```javascript
import { useProfile } from '../context/ProfileContext';

function MyComponent() {
  const { quizResponses, setQuizResponse } = useProfile();
  // ... rest of component
}
```

**After (No changes required!):**
```javascript
// Same code, but import from UnifiedContext
import { useProfile } from '../context/UnifiedContext';

function MyComponent() {
  const { quizResponses, setQuizResponse } = useProfile();
  // ... rest of component
}
```

### Scenario 2: Component Using RoadmapContext

**Before:**
```javascript
import { useRoadmap } from '../../context/RoadmapContext';

function SkillsQuestion() {
  const { currentSkills, setCurrentSkills } = useRoadmap();
  // ... rest of component
}
```

**After (No changes required!):**
```javascript
// Same code, but import from UnifiedContext
import { useRoadmap } from '../../context/UnifiedContext';

function SkillsQuestion() {
  const { currentSkills, setCurrentSkills } = useRoadmap();
  // ... rest of component
}
```

### Scenario 3: New Component Needing Both Profile & Roadmap Data

**Before (would have needed both contexts):**
```javascript
import { useProfile } from '../context/ProfileContext';
import { useRoadmap } from '../context/RoadmapContext';

function NewComponent() {
  const { profileData } = useProfile();
  const { currentSkills } = useRoadmap();
  // Issue: Two separate contexts!
}
```

**After (single context with all data):**
```javascript
import { useUnified } from '../context/UnifiedContext';

function NewComponent() {
  const { profileData, currentSkills } = useUnified();
  // ✅ Single context, all data available!
}
```

---

## 🧪 Testing Your Components

### Quick Test Checklist

1. ✅ Does your component still import context?
   - Update import path to `UnifiedContext.js`
   - Keep using `useProfile()` or `useRoadmap()` if preferred

2. ✅ Does your component navigate between pages?
   - Replace React Router with Next.js `useRouter`
   - Use `router.push()` instead of `navigate()`

3. ✅ Does your component access localStorage directly?
   - Update key from `scalerProfileState` or `scalerRoadmapState`
   - To: `scalerCareerRoadmapState`

4. ✅ Does your component check loading/error states?
   - `loading` and `error` now available in unified context
   - Access via `useUnified()`, `useProfile()`, or `useRoadmap()`

---

## 📚 Additional Resources

### Updated Files

- ✅ `frontend/src/context/UnifiedContext.js` - New unified context
- ✅ `frontend/pages/_app.js` - Updated to use UnifiedProvider
- ✅ `CLAUDE.md` - Updated architecture documentation
- ✅ `MIGRATION_GUIDE.md` - This file

### Deprecated Files (Do NOT Delete - For Reference)

- ⚠️ `frontend/src/context/ProfileContext.js` - OLD, use UnifiedContext
- ⚠️ `frontend/src/context/RoadmapContext.js` - OLD, use UnifiedContext
- ⚠️ `frontend/src/context/RoadmapContext_original.js` - Backup

---

## 🆘 Need Help?

### Common Issues & Solutions

**Issue:** Component can't find `useProfile` or `useRoadmap`
**Solution:** Update import path:
```javascript
// Change from:
import { useProfile } from '../context/ProfileContext';
// To:
import { useProfile } from '../context/UnifiedContext';
```

**Issue:** localStorage data not persisting
**Solution:** UnifiedContext uses a new key. Old data won't auto-migrate.
```javascript
// To manually migrate (if needed):
const oldProfile = JSON.parse(localStorage.getItem('scalerProfileState'));
const oldRoadmap = JSON.parse(localStorage.getItem('scalerRoadmapState'));
// Merge and save to 'scalerCareerRoadmapState'
```

**Issue:** Navigation not working
**Solution:** Use Next.js router:
```javascript
import { useRouter } from 'next/router';
const router = useRouter();
router.push('/path');
```

---

## ✅ Summary

### What You Need to Do

1. **Update imports:** Change context imports to `UnifiedContext.js`
2. **Use Next.js routing:** Replace React Router with `useRouter`
3. **Test your components:** Verify everything still works
4. **Optional:** Gradually adopt `useUnified()` for new code

### What's Already Done

- ✅ UnifiedContext created and tested
- ✅ _app.js updated with UnifiedProvider
- ✅ CLAUDE.md updated with correct architecture
- ✅ Backward compatibility maintained

### Zero Breaking Changes!

Your existing code continues to work without any immediate changes required. The migration is designed to be gradual and non-disruptive.

---

**Questions or Issues?** Refer to CLAUDE.md or check the code comments in UnifiedContext.js.

**Happy Coding! 🚀**
