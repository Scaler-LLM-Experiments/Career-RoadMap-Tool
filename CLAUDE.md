# Career Roadmap Tool - Project Documentation

## Project Overview

A personalized career roadmap generator that helps tech professionals and career switchers create a detailed plan to reach their target role. This tool imports data from the Free Profile Evaluator and generates a single-page, flowing roadmap with embedded resources, company insights, and actionable milestones.

---

## Key Principles

1. **Value-First**: Deliver maximum value through company insights, Scaler videos, and actionable guidance
2. **Non-Salesy**: Single CTA for career consultation, no pushy comparisons
3. **Single-Page Flow**: Everything flows naturally top-to-bottom, no tab switching
4. **Consistent Design**: Match Free Profile Evaluator's visual style EXACTLY
5. **Blog-Style Layout**: Small left navigation, flowing content sections (like old CRT)

---

## State Management Architecture

### Unified Context (UnifiedContext.js)

The application now uses a **single unified context** instead of separate Profile and Roadmap contexts. This provides:

1. **Single Source of Truth**: All app state in one place
2. **SSR Compatibility**: Next.js-aware localStorage handling
3. **Backward Compatibility**: Exports `useProfile()` and `useRoadmap()` hooks
4. **Persistent State**: Automatic localStorage sync

#### State Structure

```javascript
{
  // From Profile Evaluator
  profileData: null,
  background: 'tech' | 'non-tech',
  quizResponses: {},
  goals: { requirementType, targetCompany, topicOfInterest },
  evaluationResults: null,

  // Roadmap-specific
  currentSkills: [],
  timeline: '6-9 months' | '9-12 months' | etc,
  roadmap: null,

  // UI state
  loading: false,
  error: null
}
```

#### Usage

```javascript
import { useUnified } from '../context/UnifiedContext';
// OR use backward-compatible hooks:
import { useProfile } from '../context/UnifiedContext';
import { useRoadmap } from '../context/UnifiedContext';

function MyComponent() {
  const {
    profileData,
    currentSkills,
    setCurrentSkills,
    loading,
    setLoading
  } = useUnified();

  // All methods available from both old contexts
}
```

---

## Architecture Understanding

### Backend Integration with Scaler.com

```
┌─────────────────────────────────────────────────────────┐
│                    SCALER.COM                            │
│              (Main Platform Backend)                     │
│                                                          │
│  - User Authentication & Accounts                        │
│  - User Dashboard                                        │
│  - Stores Profile Evaluation Results (per user)         │
│  - Provides API for tools to access user data            │
└─────────────────────────────────────────────────────────┘
            ↓                              ↓
    ┌───────────────┐            ┌────────────────────┐
    │ Free Profile  │            │ Career Roadmap     │
    │ Evaluator     │            │ Tool               │
    │               │            │                    │
    │ Sends results │            │ Fetches profile    │
    │ to Scaler.com │            │ data from          │
    │ backend       │            │ Scaler.com backend │
    └───────────────┘            └────────────────────┘
```

**For Development/Testing:**
- Use MOCK DATA clearly marked as "FOR TESTING PURPOSES ONLY"
- Add detailed comments for future Scaler.com integration
- Structure code so mock data can be easily swapped with real API calls

**Future Integration Points:**
```javascript
// FUTURE: Fetch from Scaler.com API
// GET https://scaler.com/api/users/{user_id}/profile-evaluation
// For now: Use mock data from get_mock_profile_data()
```

---

## User Flow

### 1. Landing/Welcome Screen

```
┌────────────────────────────────────────────────┐
│ LEFT PANEL (Purple/Blue background)           │
│ "Career Roadmap Generator"                    │
│ (Similar to Free Profile Evaluator layout)    │
└────────────────────────────────────────────────┘

RIGHT PANEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to Career Roadmap Tool! 👋

We know you've evaluated your profile and you've
come to the right place!

Here are your details:

[Chat Bubble] Current Role: Software Engineer - Service Company
[Chat Bubble] Experience: 3-5 years
[Chat Bubble] Target: Senior Backend Engineer
[Chat Bubble] Goal: Product Companies + Higher Comp
[Chat Bubble] Coding Practice: 10-50 problems

[CTA Button: Generate My Career Roadmap →]
```

### 2. Question Flow (2 Questions Only)

**Route: `/quiz` (Next.js page)**

**Question 1: Current Technical Skills**
- Multi-select grid (like Scaler CRT implementation)
- Skills fetched based on target role from skill taxonomy
- Helper text: "Be honest - only select what you can use independently"

**Question 2: Timeline**
- Radio buttons (single select)
- Options (dynamic based on profile):
  - For Tech Professionals: 3-6 months / 6-9 months / 9-12 months / Just exploring
  - For Career Switchers: 6-9 months / 9-12 months / 12-18 months / 18+ months / Just exploring
- Timeline determines roadmap pacing and skill prioritization

**Then: [Generate Roadmap Button]** → Navigates to `/roadmap`

### 3. Roadmap Output (Blog-Style Layout)

**Route: `/roadmap` (Next.js page)**

```
┌─────────────────────────────────────────────────────────┐
│ FIXED NAVBAR (Sticky)                                   │
│ Logo + "Your Career Roadmap"                            │
└─────────────────────────────────────────────────────────┘

┌──────┬──────────────────────────────────────────────────┐
│ LEFT │  MAIN CONTENT                                    │
│ NAV  │                                                  │
│ (sm) │  ┌─────────────────────────────────────────────┐│
│      │  │ HERO SECTION                                ││
│ Sec1 │  │ Left: Greeting "Hello Sudhanva!" + Stats    ││
│ Sec2 │  │ Right: Founder Video (YouTube embed)        ││
│ Sec3 │  └─────────────────────────────────────────────┘│
│ ...  │                                                  │
│      │  [Blog-like content sections with videos]       │
│      │  - Skills Gap                                    │
│      │  - Learning Path (phases)                        │
│      │  - Company Insights (tabs like old CRT)          │
│      │  - Interview Prep                                │
│      │  - Projects                                      │
└──────┴──────────────────────────────────────────────────┘

[Floating CTA - Bottom Right] "Book Career Consultation"
[Floating AI Chat - Bottom Right] "Ask AI" (UI only for now)
```

---

## Data Structure

### Imported from Profile Evaluator (Mock for Testing)

```javascript
profileData = {
  userName: "Sudhanva Acharya",
  userType: "tech_professional" | "career_switcher",
  currentRole: "Software Engineer - Service Company",
  yearsExperience: "3-5 years",
  targetRole: "Senior Backend Engineer",
  targetCompanyType: "Product Unicorns/Scaleups",
  codingPractice: "10-50 problems",
  systemDesign: "basic",
  primaryGoal: "Move to better company + higher comp"
}
```

### New Data Collected

```javascript
roadmapData = {
  currentSkills: [
    "Python",
    "Git",
    "Basic SQL"
    // ... more skills from multi-select
  ],

  timeline: "6-9 months" | "9-12 months" | "12-18 months" | "just_exploring"
}
```

### Roadmap Output Structure

```javascript
roadmapOutput = {
  // Overview
  userName: string,
  targetRole: string,
  timeline: string,
  effortPerWeek: string,
  currentProgress: number, // 0-100%

  // Skills Gap (from Scaler CRT logic)
  matchScore: number, // 0-100
  currentSkills: Array<Skill>,
  missingSkills: {
    highPriority: Array<Skill>,
    mediumPriority: Array<Skill>,
    lowPriority: Array<Skill>
  },

  // Learning Path (from careerTopics.json)
  phases: Array<Phase>,

  // Interview Prep
  targetCompanies: Array<Company>,

  // Projects
  recommendedProjects: Array<Project>,

  // Company Insights (old CRT style)
  companyTypes: Array<CompanyType>
}
```

---

## Design Requirements (EXACT MATCH to Free Profile Evaluator)

### Typography

```css
/* FONT FAMILY - Plus Jakarta Sans (EXACT MATCH) */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Color Palette (FROM FREE PROFILE EVALUATOR)

```css
/* PRIMARY COLORS */
--color-primary: #E91E63; /* Magenta/Pink - MAIN CTA COLOR */
--color-primary-hover: #C2185B;
--color-primary-light: #FCE4EC;

/* ACCENT COLORS */
--color-accent-blue: #2196F3;
--color-accent-purple: #667eea;
--color-accent-green: #10b981;
--color-accent-yellow: #F59E0B;
--color-accent-red: #EF4444;

/* NEUTRAL COLORS */
--color-text: #1F2937; /* Dark gray */
--color-text-secondary: #6B7280; /* Medium gray */
--color-text-light: #9CA3AF; /* Light gray */
--color-background: #F9FAFB; /* Very light gray */
--color-white: #FFFFFF;
--color-border: #E5E7EB; /* Light gray border */
```

### Border Radius (SHARP CORNERS - MATCH FREE PROFILE EVALUATOR)

```css
/* SHARP CORNERS - Minimal or no rounding */
--radius-none: 0px;      /* Use this for most elements */
--radius-sm: 2px;        /* Slight rounding if needed */
--radius-md: 4px;        /* Very subtle */
--radius-pill: 9999px;   /* Only for pills/badges */
```

### Component Styles

```css
/* Primary Button (EXACT MATCH) */
.btn-primary {
  background-color: #E91E63;
  color: #FFFFFF;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 0px; /* SHARP CORNERS */
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(233, 30, 99, 0.2);
}

.btn-primary:hover {
  background-color: #C2185B;
  box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);
  transform: translateY(-1px);
}

/* Cards (SHARP CORNERS) */
.card {
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 0px; /* SHARP CORNERS */
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
```

---

## Tech Stack

### Frontend
- **Next.js 13** - React framework with SSR/SSG capabilities
- **React 18** - UI framework (same as Free Profile Evaluator)
- **Styled Components** - CSS-in-JS (same as Free Profile Evaluator)
- **Next.js App Router** - File-based routing with pages/ directory
- **Unified Context API** - Centralized state management combining Profile + Roadmap data
- **Framer Motion** - Animations (optional, for smooth transitions)
- **Axios** - HTTP client

### Backend
- **FastAPI (Python)** - Same as Free Profile Evaluator
- **Pydantic** - Data validation
- **OpenAI API** - For AI chat (future feature)
- **Uvicorn** - ASGI server

### Deployment
- **Railway** - Containerized deployment (same as Free Profile Evaluator)
- **Docker** - Backend containerization
- **Nixpacks** - Frontend build system

---

## References & Data Sources

### 1. Free Profile Evaluator (Design Reference)
**Location:** `Free Profile Evaluation - Core File/`

**What to Copy:**
- ✅ Exact design system (colors, fonts, spacing)
- ✅ Styled Components structure
- ✅ Context API pattern for state management (now unified)
- ✅ Layout components (Header, Navigation)
- ✅ Button styles, card styles
- ✅ index.css global styles

**Files to Reference:**
- `frontend/src/index.css` - Global styles
- `frontend/src/context/UnifiedContext.js` - **NEW: Unified state management**
- `frontend/pages/_app.js` - Next.js app wrapper with UnifiedProvider
- `frontend/src/components/NavigationBar.js` - Header component
- `frontend/src/components/results/*` - Card component patterns

---

### 2. Scaler CRT - Core File (Logic & Data)
**Location:** `Scaler CRT - Core File/`

**What to Reuse:**
- ✅ careerTopics.json - Career phases for each role
- ✅ Skill taxonomy and prioritization logic
- ✅ Match score calculation algorithm
- ✅ Company data structure
- ✅ Project data structure
- ✅ Skill analysis API logic

**Key Files:**
- `server/careerTopics.json` - Phase data for all roles
- `server/index.js` - Skill analysis algorithm, prioritization logic
- `client/src/context/CareerPathContext.js` - Topic status management pattern
- `client/src/components/LandingPage.js` - Question flow reference
- `client/src/components/tabs/CareerPathTab.js` - Phase rendering pattern

**Algorithms to Reuse:**

**A. Skill Match Score Calculation:**
```javascript
// Weight-based scoring
High priority skill = weight 3
Medium priority skill = weight 2
Low priority skill = weight 1

weightedScore = sum of (existing skills × their weights)
totalWeight = sum of (all target skills × their weights)
matchScore = (weightedScore / totalWeight) × 100
```

**B. Skill Prioritization:**
```javascript
prioritizeSkills(missingSkills, targetRole) {
  // Uses explicit priorities if available
  // Sorts by: High → Medium → Low
  // Returns: { skill, priorityScore, reason, priority }
}
```

**C. Timeline Adjustment:**
```javascript
baseTime = {
  'Beginner': 2 months,
  'Intermediate': 4 months,
  'Advanced': 8 months
}

experienceMultiplier = {
  years > 5: 0.7x,
  years > 2: 0.9x,
  years <= 2: 1.0x
}

estimatedTime = baseTime[difficulty] × experienceMultiplier
```

---

### 3. Old CRT Screenshots (Layout Reference)

**Key Elements from Screenshots:**

1. **Hero Section:**
   - Left: Greeting "Hello Sudhanva Acharya!" + stats
   - Right: Founder video embed (YouTube)
   - Gradient or solid background

2. **Company Type Tabs:**
   - Horizontal tabs: "High Growth Startups" | "Scaled Startups" | "Big Tech Companies" | "Dream Companies"
   - Each tab shows:
     - Company logos
     - Expected role & salary
     - Selection process with videos
     - Interview rounds breakdown
     - Work environment videos

3. **Selection Process:**
   - Timeline view with rounds
   - Each round shows: title, description, difficulty, duration
   - Video embeds for learning content

4. **Blog-Style Flow:**
   - Small left navigation (section links)
   - Main content flows vertically
   - Embedded YouTube videos throughout
   - Clear section headers

---

## Implementation Plan

### Phase 1: Project Setup
1. ✅ Create folder structure
2. Set up frontend project with React + Styled Components
3. Copy design system from Free Profile Evaluator
4. Set up backend with FastAPI
5. Copy careerTopics.json from Scaler CRT

### Phase 2: Landing Page
6. Build layout with left panel + right panel
7. Create chat bubble component for showing imported data
8. Add "Generate My Career Roadmap" CTA
9. Connect to mock profile data

### Phase 3: Question Flow
10. Build Question 1: Skills multi-select (reuse Scaler CRT logic)
11. Build Question 2: Timeline radio buttons
12. Add "Generate" button
13. Handle form submission

### Phase 4: Roadmap Results - Layout
14. Create blog-style layout (small left nav + main content)
15. Build fixed navbar
16. Build left sidebar navigation with scroll-spy
17. Add floating CTA component
18. Add floating AI Chat button (UI only)

### Phase 5: Roadmap Results - Hero Section
19. Build hero section (greeting + stats on left)
20. Add founder video embed on right
21. Style with Free Profile Evaluator colors

### Phase 6: Roadmap Results - Content Sections
22. Build Skills Gap section (using Scaler CRT algorithm)
23. Build Learning Path section (using careerTopics.json)
24. Build Company Insights section (tabs like old CRT)
25. Build Interview Prep section
26. Build Projects section

### Phase 7: Backend Integration
27. Set up FastAPI backend with mock data
28. Create POST /api/roadmap/generate endpoint
29. Implement skill analysis logic (from Scaler CRT)
30. Implement phase generation logic
31. Add integration comments for Scaler.com API

### Phase 8: Testing & Polish
32. Test responsive design (mobile, tablet, desktop)
33. Test all user flows
34. Add loading states
35. Add error handling
36. Performance optimization

---

## Key Features

### Core Features (MVP)
1. **Data Import**: Display imported Profile Eval data in chat bubbles
2. **Skills Selection**: Multi-select grid for current skills
3. **Timeline Selection**: Radio buttons for timeline preference
4. **Roadmap Generation**: Algorithm-driven phase creation
5. **Hero Section**: Greeting + founder video
6. **Skills Gap Analysis**: Show current vs required skills
7. **Learning Path**: Phases from careerTopics.json
8. **Company Insights**: Tabs with company types
9. **Interview Prep**: Company-specific interview info
10. **Projects**: Recommended projects by tier
11. **Sidebar Navigation**: Scroll-spy with section jumping
12. **Floating CTA**: Career consultation booking
13. **Responsive Design**: Mobile, tablet, desktop support

### Future Features (Post-MVP)
- AI Chat Integration (OpenAI API)
- Progress tracking & persistence
- PDF export
- Share roadmap URL
- Email reminders
- Dynamic roadmap adjustments

---

## Component Structure

```
<RoadmapLayout>
  <Header />

  <Container>
    <Sidebar>
      <SidebarNav items={sections} />
    </Sidebar>

    <MainContent>
      <HeroSection />

      <SkillsGapSection />

      <LearningPathSection>
        {phases.map(phase => <PhaseCard />)}
      </LearningPathSection>

      <CompanyInsightsSection>
        <Tabs>
          <Tab label="High Growth Startups" />
          <Tab label="Scaled Startups" />
          <Tab label="Big Tech" />
          <Tab label="Dream Companies" />
        </Tabs>
      </CompanyInsightsSection>

      <InterviewPrepSection>
        {companies.map(company => <CompanyCard />)}
      </InterviewPrepSection>

      <ProjectsSection>
        {projects.map(project => <ProjectCard />)}
      </ProjectsSection>
    </MainContent>
  </Container>

  <FloatingCTA />
  <FloatingAIChat /> {/* UI only for now */}
</RoadmapLayout>
```

---

## File Structure

```
Career RoadMap Tool - Core File/
├── CLAUDE.md                          # This file
├── frontend/
│   ├── package.json
│   ├── pages/                         # Next.js pages directory
│   │   ├── _app.js                    # App wrapper with UnifiedProvider
│   │   ├── _document.js               # Next.js document
│   │   ├── index.js                   # Landing page (/)
│   │   ├── quiz.js                    # Quiz flow (/quiz)
│   │   ├── roadmap.js                 # Roadmap results (/roadmap)
│   │   └── results.js                 # Evaluation results (/results)
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── index.css                  # Global styles (from Free Profile Eval)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.js
│   │   │   │   ├── Sidebar.js
│   │   │   │   ├── FloatingCTA.js
│   │   │   │   └── FloatingAIChat.js
│   │   │   ├── questions/
│   │   │   │   ├── WelcomeScreen.js   # Chat bubbles + CTA
│   │   │   │   ├── QuestionsFlow.js   # Question flow handler
│   │   │   │   ├── SkillsQuestion.js
│   │   │   │   └── TimelineQuestion.js
│   │   │   ├── roadmap/
│   │   │   │   ├── RoadmapResults.js  # Main roadmap page
│   │   │   │   ├── HeroSection.js
│   │   │   │   ├── SkillsGapSection.js
│   │   │   │   ├── LearningPathSection.js
│   │   │   │   ├── CompanyInsightsSection.js
│   │   │   │   ├── InterviewPrepSection.js
│   │   │   │   └── ProjectsSection.js
│   │   │   ├── LandingPage.js         # Landing page component
│   │   │   ├── QuizPage.js            # Quiz page component
│   │   │   ├── ResultsPage.js         # Results page component
│   │   │   └── NavigationBar.js       # Navigation component
│   │   ├── context/
│   │   │   ├── UnifiedContext.js      # **UNIFIED** state management
│   │   │   ├── ProfileContext.js      # [DEPRECATED - use UnifiedContext]
│   │   │   └── RoadmapContext.js      # [DEPRECATED - use UnifiedContext]
│   │   ├── utils/
│   │   │   ├── api.js                 # API calls
│   │   │   ├── mockData.js            # Mock profile data
│   │   │   ├── evaluationLogic.js     # Evaluation logic
│   │   │   └── careerTopics.json      # Career phases data
│   │   └── assets/
│   └── .gitignore
│
├── backend/
│   ├── main.py                        # FastAPI app
│   ├── models.py                      # Pydantic models
│   ├── roadmap_logic.py               # Roadmap generation
│   ├── skills_analysis.py             # Skill analysis (from Scaler CRT)
│   ├── data/
│   │   ├── careerTopics.json          # From Scaler CRT
│   │   ├── companies.json
│   │   └── projects.json
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
└── README.md
```

---

## Important Notes

### Design Consistency
- **MUST** use Plus Jakarta Sans font
- **MUST** use exact color palette from Free Profile Evaluator
- **MUST** use sharp corners (border-radius: 0px)
- **MUST** match button styles exactly
- **MUST** use Styled Components (same as Free Profile Evaluator)

### Backend Integration
- **FOR NOW**: Use mock data clearly marked as "TESTING ONLY"
- **FUTURE**: Add detailed comments for Scaler.com API integration
- **PATTERN**: Structure code for easy swap from mock to real API

### Data Reuse
- **careerTopics.json**: Use as-is from Scaler CRT
- **Skill analysis logic**: Reuse prioritization algorithm
- **Match score calculation**: Use weighted scoring system
- **Timeline adjustment**: Use experience multiplier

### AI Chat
- **Phase 1**: Create UI only (floating button)
- **Phase 2**: Integrate OpenAI API (future)
- **Add comments**: For future integration points

---

## Success Criteria

### Functional
- ✅ User can see imported profile data in chat bubbles
- ✅ User can select skills from multi-select grid
- ✅ User can choose timeline
- ✅ Roadmap generates with personalized phases
- ✅ Skills gap shows current vs required
- ✅ Company insights display with tabs
- ✅ All sections scrollable and navigable
- ✅ Floating CTA works on all screen sizes

### Design
- ✅ Identical to Free Profile Evaluator styling
- ✅ Blog-style layout with small left nav
- ✅ Hero section with video embed
- ✅ Responsive on mobile, tablet, desktop
- ✅ Smooth animations and transitions

### Technical
- ✅ Clean code with comments for integration
- ✅ Mock data clearly separated
- ✅ Reusable components
- ✅ Proper state management
- ✅ Error handling
- ✅ Loading states

---

## Contact & Questions

For any questions or clarifications during development, refer to:
1. Free Profile Evaluator design
2. Scaler CRT logic and data
3. Old CRT screenshots for layout
4. This CLAUDE.md document

---

---

## Migration Notes (October 23, 2025)

### Context Unification ✅

- ✅ Created `UnifiedContext.js` combining ProfileContext + RoadmapContext
- ✅ Updated `_app.js` to use `UnifiedProvider`
- ✅ Backward-compatible: `useProfile()` and `useRoadmap()` still work
- ⚠️ Old context files marked as DEPRECATED but not removed (for reference)

### Next.js Migration ✅

- ✅ Project uses Next.js 13 with pages/ directory
- ✅ File-based routing: `/` → index.js, `/quiz` → quiz.js, `/roadmap` → roadmap.js
- ✅ SSR-aware localStorage handling in UnifiedContext
- ✅ Updated CLAUDE.md to reflect Next.js architecture

### What Developers Need to Know

1. **Use UnifiedContext**: Import from `context/UnifiedContext.js`
2. **Hooks work the same**: `useProfile()` and `useRoadmap()` are aliases to `useUnified()`
3. **No breaking changes**: All existing component imports continue to work
4. **Next.js routing**: Use `import { useRouter } from 'next/router'` and `router.push('/path')`

---

**Last Updated:** October 23, 2025
**Status:** Context Unified ✅ | Next.js Architecture Documented ✅ | Ready to Build Roadmap Results 🚀
