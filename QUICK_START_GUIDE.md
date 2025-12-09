# Quick Start Guide - Modular Roadmap Composition

## 🚀 Running the Real Data Flow Test

### Option 1: Browser Console (Easiest)

1. Open your app in browser (localhost:3000 or similar)
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to Console tab
4. Paste this code:

```javascript
// Import the test function
import { testRealDataFlow } from '/src/utils/testRealDataFlow.js';

// Run the test
const result = await testRealDataFlow();

// View the result
console.log('Final Config:', result.config);
```

### Option 2: Node.js (Full Control)

Create a test file `test-flow.mjs`:

```javascript
import { testRealDataFlow, logSection } from './frontend/src/utils/testRealDataFlow.js';

async function runTest() {
  const result = await testRealDataFlow();

  if (result.success) {
    console.log('\n✅ TEST PASSED - Real data flowing through system!');

    // Inspect specific sections:
    console.log('\nHero Section:', result.config.hero);
    console.log('\nSkills Gap:', result.config.skillsGap);
    console.log('\nFirst Learning Phase:', result.config.learningPath.phases[0]);
  } else {
    console.error('❌ TEST FAILED:', result.error);
  }
}

runTest().catch(console.error);
```

Then run:
```bash
node test-flow.mjs
```

---

## 📋 What the Test Does

1. **Simulates Quiz Input**: Creates realistic user quiz responses
   - Years of experience, target role, skills, timeline
   - Problem-solving level, system design experience, portfolio status
   - Time availability per week

2. **Simulates Profile Data**: Creates Free Profile Evaluator data
   - User name, background, current role
   - Compensation, career goals
   - Additional context

3. **Validates Decomposition**: Checks persona is correctly decomposed
   - role, level, userType, companyType extracted

4. **Validates Composition**: Verifies templates are loaded and merged
   - Shows which files are loaded
   - Displays merge order

5. **Validates Output Data**: Checks all sections have real data
   - Hero section personalization
   - Skills gap with match score
   - Company insights with fit analysis
   - Learning path with customizations
   - Projects with correct tier recommendations

6. **Detects Customizations**: Shows which user-data overrides were applied
   - DSA phase additions
   - Timeline adjustments
   - Project tier recommendations
   - Company type emphasis

---

## 🔍 What to Look For in Output

### ✅ Success Indicators

```
✅ Quiz Responses Captured: 7 fields shown
✅ Profile Data Loaded: userName, company, goals displayed
✅ Decomposed to Modular Components: role, level, userType, companyType
✅ Templates Merged Successfully
✅ HERO SECTION: Has real greeting with name
✅ SKILLS GAP: Has match score calculated from current skills
✅ COMPANIES INSIGHT: Has 4 company types with fit scores
✅ LEARNING PATH: Has multiple phases with real topics
✅ PROJECTS: Has tier recommendations based on portfolio
✅ All USER-DATA CUSTOMIZATIONS Applied: 6+ customizations detected
```

### ❌ Red Flags (If Something's Wrong)

```
❌ Templates not loading
❌ Skill match score is 0%
❌ All phases are identical (no customization)
❌ Projects section empty
❌ No company types in insights
❌ Timeline not adjusted despite low timePerWeek
```

---

## 📊 Output Structure

The test outputs real data in this structure:

```
PHASE 1: INPUT DATA
  ✓ Quiz responses from user
  ✓ Profile data from evaluator

PHASE 2: PERSONA DECOMPOSITION
  ✓ role: backend
  ✓ level: mid
  ✓ userType: tech_professional
  ✓ companyType: scaleup

PHASE 3: TEMPLATE COMPOSITION
  Loads: roles/backend.json
  Loads: levels/mid.json
  Loads: user-types/tech_professional.json
  Loads: company-types/scaleup.json

PHASE 4: DATA VALIDATION
  ✓ HERO SECTION: Real greeting "Hello Sudhanva Acharya!"
  ✓ SKILLS GAP: Match score 72% (calculated)
  ✓ COMPANIES: 4 company types with fit analysis
  ✓ LEARNING PATH: 3-4 phases with real topics
  ✓ PROJECTS: Tier recommendations based on input
  ✓ CUSTOMIZATIONS: DSA added, timeline extended, etc.

PHASE 5: FINAL SUMMARY
  Roadmap for: Sudhanva Acharya
  Role: backend (mid level)
  Timeline: 6-9 months
  Skill Match: 72%

PHASE 6: DATA STRUCTURE VERIFICATION
  ✓ hero: 5 fields
  ✓ skillsGap: 8 fields
  ✓ companiesInsight: 4 company types
  ✓ learningPath: 3 phases
  ✓ projects: 3 tiers
  ✓ metadata: tracking info
```

---

## 🔧 Troubleshooting

### Templates Not Loading?
- Check files exist in `/frontend/src/configs/personas/`
- Verify file names match exactly (case-sensitive)
- Check browser Network tab for 404 errors

### Match Score = 0%?
- Check currentSkills array is not empty
- Verify skillsByPriority is in template
- Check skill matching logic in compositionHelpers.js

### No Customizations Applied?
- Check quiz response values are set
- Verify applyUserDataOverrides() is called
- Check console for debug logs

### Wrong Timeline?
- Check timePerWeek value in quiz
- Verify hero.stats.estimatedDuration exists
- Check timeline override logic for thresholds

---

## 🎯 Next Steps

### 1. Run the test
```javascript
await testRealDataFlow();
```

### 2. Inspect specific sections
```javascript
const result = await testRealDataFlow();
console.log('Hero:', result.config.hero);
console.log('Skills:', result.config.skillsGap);
console.log('Learning:', result.config.learningPath);
```

### 3. Test different scenarios
```javascript
import { testScenarioByName } from '/src/utils/testRoadmapComposition.js';
await testScenarioByName('Scenario 1: Early Career Switcher');
await testScenarioByName('Scenario 2: Mid-Level Backend');
```

### 4. Integrate into roadmap component
- Replace old `getPersonalizedRoadmapConfig()` with `generatePersonalizedRoadmap()`
- Pass config to rendering components
- Components render with real data

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `testRealDataFlow.js` | Mimics user input, validates data flow |
| `testRoadmapComposition.js` | Tests 5 real-world scenarios |
| `roadmapIntegration.js` | Main integration function |
| `roadmapComposition.js` | Composition engine |
| `compositionHelpers.js` | Merge, override, enrich logic |
| `personaMatching.js` | Persona decomposition |
| `IMPLEMENTATION_GUIDE.md` | Complete architecture documentation |

---

## 💡 Tips

1. **Check Console Logs**: Each function logs progress. Search for ✅ and ❌
2. **Inspect Config**: Use `console.log(JSON.stringify(config, null, 2))` for full view
3. **Test Scenarios**: Run different quiz combinations to see customizations
4. **Debug Decomposition**: Use `decomposeToModularPersona()` separately
5. **Validate Merging**: Check if templates are loading with `loadTemplate()`

---

## ✨ Success!

When you see this output:

```
🎉 REAL DATA FLOW TEST COMPLETE
✅ All sections have real data flowing through

FOR: Sudhanva Acharya
ROLE: backend (mid level)
TIMELINE: 6-9 months
SKILL MATCH: 72%
PHASES: 3
PROJECTS: tier1:2, tier2:3, tier3:3
```

**You know the system is working!** 🚀

All real user data is flowing through decomposition → composition → enrichment → final output.
