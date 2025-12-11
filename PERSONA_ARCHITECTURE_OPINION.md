# Persona Architecture Opinion - The "Big Beautiful Plan"

**Date:** 2025-12-10
**Context:** Comprehensive analysis of quiz structure, test_persona.json patterns, and user requirements
**Recommendation:** Hybrid Modular Composition (NOT 30 separate files)

---

## Executive Summary

Your instinct about the 5 roles × 3 levels × 2 backgrounds matrix is **correct** - this is the right decomposition. However, creating 30 separate JSON files is the **wrong implementation approach**.

Instead, I recommend a **hybrid modular composition system** that:
1. Creates **5 base role templates** (backend, frontend, fullstack, devops, data)
2. Creates **3 level overlays** (entry, mid, senior) that customize per role
3. Uses **dynamic variant switching** for tech vs non-tech (already shown in test_persona radarAxesConfig)
4. Creates **company-type variants** for targeting-specific companies
5. **Merges intelligently** in a specific priority order

**Result:** Maximum personalization with minimum file maintenance.

---

## Part 1: Why NOT 30 Separate Files?

### The Problem with 30 Files

```
personas/roles/
├── backend_entry_tech.json      ← Individual files = maintenance nightmare
├── backend_entry_nontech.json
├── backend_mid_tech.json
├── backend_mid_nontech.json
├── backend_senior_tech.json
├── backend_senior_nontech.json
├── ... (6 more per role)
└── ... (30 files total)
```

**Issues:**
1. **DRY Violation**: Core backend role knowledge gets duplicated 6 times (3 levels × 2 backgrounds)
2. **Update Hell**: Fix a skill for "Backend Engineer" → update 6 files
3. **Inconsistent Data**: Easy for variants to drift out of sync
4. **Poor Scalability**: Adding a new role = 6 new files. Adding a new level = 25 new files
5. **Merger Hell**: No clear path to company-type customization (that's 120 files!)

---

## Part 2: The Hybrid Modular Approach (My Recommendation)

### File Structure

```
personas/
├── roles/                          # Base role knowledge (5 files)
│   ├── backend.json
│   ├── frontend.json
│   ├── fullstack.json
│   ├── devops.json
│   └── data.json
│
├── levels/                         # Experience-level customizations (3 files)
│   ├── entry.json                  # Customizations for entry-level
│   ├── mid.json                    # Customizations for mid-level
│   └── senior.json                 # Customizations for senior-level
│
├── user-types/                     # Background customizations (2 files)
│   ├── tech.json                   # Variants for tech background
│   └── non-tech.json               # Variants for non-tech background
│
├── company-types/                  # Company targeting (4 files)
│   ├── bigtech.json                # Customizations for FAANG companies
│   ├── scaleup.json                # Customizations for unicorns
│   ├── startup.json                # Customizations for startups
│   └── service.json                # Customizations for service companies
│
└── _persona_list.json              # Registry of all combinations
```

**Total: 5 + 3 + 2 + 4 = 14 files** (instead of 30+)

### The Merge Order (Critical)

When a user completes the quiz with:
- Role: Backend Engineer
- Level: Mid (3-5 years)
- Background: Tech
- Company: FAANG (big-tech)

**Merge Priority:**
```
1. BASE:      backend.json              (fundamental role knowledge)
   └─ Provides: skillMap, projects, learning path, phases specific to backend

2. LEVEL:     mid.json                  (experience-level customizations)
   └─ Provides: Customize "system design" emphasis, timeline changes, senior-specific skills to exclude

3. USERTYPE:  tech.json                 (background-specific variants)
   └─ Provides: radarAxes variants, skill threshold overrides, wording adjustments

4. COMPANY:   bigtech.json              (company-targeting optimizations)
   └─ Provides: Interview round structure, required skills for FAANG, company lists

5. FINAL:     Transform + Enrich
   └─ Add: skill calculations, gap analysis, visualization data
```

**Why This Order Matters:**
- Start with ROLE because that's the main domain (backend is fundamentally different from frontend)
- Apply LEVEL because experience changes what's important (entry-level doesn't need architecture)
- Apply USERTYPE because background changes how concepts are explained (tech-background skips fundamentals)
- Apply COMPANY because targeting affects specific skills (FAANG emphasizes system design more)
- End with enrichment because that's calculated data (skill gaps, timelines, etc.)

---

## Part 3: Role-Specific Radar Axes (The Dynamic Magic)

### Current test_persona.json Shows the Pattern

**The radarAxesConfig pattern already exists:**

```javascript
"radarAxesConfig": {
  "tech": [
    { key: "dsa", label: "DSA", title: "Data Structures & Algorithms" },
    { key: "systemDesign", label: "System Design" },
    { key: "projects", label: "Projects" }
  ],
  "nonTech": [
    { key: "dsa", label: "DSA" },
    { key: "fundamentals", label: "Fundamentals" },
    { key: "projects", label: "Projects" }
  ]
}
```

**This is the RIGHT pattern. Use it for all dimensions.**

### How Axes Change Per Role × Level

#### Backend Engineer

**Entry Level:**
```javascript
// Remove: System Design (too advanced)
// Add: Fundamentals, Communication
radarAxesConfig: {
  "tech": [
    "dsa",           // Need to know problem-solving
    "projects",      // Need portfolio
    "fundamentals",  // Need backend basics (HTTP, REST, databases)
    "communication"  // Need to work in teams
  ],
  "nonTech": [
    "dsa",           // Crucial foundation
    "fundamentals",  // Very important for career changers
    "projects",      // Portfolio matters
    "communication"  // Soft skills are critical for non-tech folks
  ]
}
```

**Mid Level:**
```javascript
// System Design becomes important now
// Fundamentals less emphasized
radarAxesConfig: {
  "tech": [
    "dsa",           // Still important for growth
    "systemDesign",  // Now critical - designing scalable systems
    "projects",      // Build impressive projects
    "communication"  // Leadership starts here
  ],
  "nonTech": [
    "dsa",
    "systemDesign",  // Now relevant - understanding architecture
    "projects",
    "communication"
  ]
}
```

**Senior Level:**
```javascript
// Add: Architecture & Leadership
// System Design is now expected, not novel
radarAxesConfig: {
  "tech": [
    "systemDesign",  // Core competency
    "architecture",  // Design decisions, trade-offs
    "leadership",    // Mentoring, culture, hiring
    "dsa",           // Always needed, expected to teach others
    "projects"       // Shipping, impact
  ],
  "nonTech": [
    "systemDesign",
    "architecture",
    "projects",
    "communication"  // More important than dsa at senior level
  ]
}
```

#### Frontend Engineer

**Entry Level:**
```javascript
radarAxesConfig: {
  "tech": [
    "dsa",              // Fundamentals still matter
    "uiPatterns",       // Component design patterns
    "responsiveDesign", // CSS, responsive layouts
    "communication"     // Collaboration with designers
  ],
  "nonTech": [
    "dsa",
    "uiPatterns",
    "fundamentals",     // HTML/CSS/JS basics
    "communication"
  ]
}
```

**Mid Level:**
```javascript
radarAxesConfig: {
  "tech": [
    "dsa",
    "uiPatterns",
    "performance",      // Optimization matters now
    "testing",          // Unit tests, integration tests
    "systemDesign"      // Understanding API design
  ],
  "nonTech": [
    "dsa",
    "uiPatterns",
    "performance",
    "projects"
  ]
}
```

**Senior Level:**
```javascript
radarAxesConfig: {
  "tech": [
    "systemDesign",     // API design, architecture
    "performance",      // Core skill for big systems
    "leadership",       // Team leadership
    "architecture",     // App architecture
    "mentoring"         // Growing junior developers
  ],
  "nonTech": [
    "systemDesign",
    "performance",
    "architecture",
    "projects"
  ]
}
```

### The Implementation Pattern

In the **level.json files**, use **radarAxesConfig overrides**:

```javascript
// mid.json
{
  "skillMap": {
    "radarAxesConfig": {
      "overrideFor_backend": {
        "tech": ["dsa", "systemDesign", "projects", "communication"],
        "nonTech": ["dsa", "systemDesign", "projects", "communication"]
      },
      "overrideFor_frontend": {
        "tech": ["dsa", "uiPatterns", "performance", "testing", "systemDesign"],
        "nonTech": ["dsa", "uiPatterns", "performance", "projects"]
      }
      // ... other roles
    }
  }
}
```

**Then in your merge logic:**
```javascript
// In RoadmapCompositionOrchestrator.js
const axesOverride = levelTemplate.skillMap.radarAxesConfig?.[`overrideFor_${role}`];
if (axesOverride) {
  personaConfig.skillMap.radarAxesConfig = axesOverride;
}
```

---

## Part 4: Experience-Based Skill Emphasis

### Thresholds Change with Experience

The test_persona.json already shows this pattern:

```javascript
"thresholds": {
  "dsa": {
    "tech": {
      "100+": 85,      // Senior people who've solved 100+ problems → high DSA level
      "51-100": 65,    // Mid people
      "11-50": 40,     // Entry people - lower expectations
      "0-10": 15
    }
  }
}
```

### Per-Role Per-Level Emphasis

**Backend Entry Level Person:**
```javascript
// In entry.json, backend section:
"thresholds": {
  "dsa": {
    "100+": 70,        // Even experienced people at entry level → lower bar
    "51-100": 50,
    "11-50": 30,
    "0-10": 10
  },
  "fundamentals": {
    "100+": 80,        // Fundamentals are CRITICAL at entry level
    "51-100": 60,
    "11-50": 40,
    "0-10": 20
  },
  "systemDesign": null // Don't even measure system design at entry level
}
```

**Backend Mid Level Person:**
```javascript
// In mid.json, backend section:
"thresholds": {
  "dsa": {
    "100+": 85,        // Standard thresholds - DSA is mature skill
    "51-100": 65,
    "11-50": 40,
    "0-10": 15
  },
  "systemDesign": {
    "100+": 80,        // NOW we measure system design
    "51-100": 60,
    "11-50": 35,
    "0-10": 10
  },
  "fundamentals": {
    "100+": 60,        // Less emphasis - assumed to know this
    "51-100": 40,
    "11-50": 25,
    "0-10": 10
  }
}
```

**Backend Senior Level Person:**
```javascript
// In senior.json, backend section:
"thresholds": {
  "systemDesign": {
    "100+": 85,        // System design is CORE competency
    "51-100": 70,
    "11-50": 50,
    "0-10": 20
  },
  "architecture": {
    "100+": 85,        // NEW skill for seniors
    "51-100": 65,
    "11-50": 40,
    "0-10": 15
  },
  "leadership": {
    "100+": 80,        // Critical for senior roles
    "51-100": 60,
    "11-50": 35,
    "0-10": 10
  }
}
```

---

## Part 5: Company-Type Customization

### The Company Type Dimension

From test_persona.json, we see:
```javascript
"companyInsights": {
  "high-growth": { ... },
  "unicorns": { ... },
  "service": { ... },
  "big-tech": { ... }
}
```

**This should be in company-types/*.json files:**

```javascript
// company-types/bigtech.json (for FAANG companies)
{
  "companyInsights": {
    "name": "Big-Tech Companies",
    "fitAnalysis": { ... },
    "rounds": [
      {
        "name": "Phone Screen",
        "difficulty": "medium",
        "focusAreas": ["problem-solving", "communication"]
      },
      {
        "name": "System Design",
        "difficulty": "hard",
        "focusAreas": ["scalability", "tradeoffs"]
      },
      {
        "name": "On-site",
        "difficulty": "hard",
        "focusAreas": ["system design", "behavioral"]
      }
    ]
  },
  "skillMap": {
    // Override skill thresholds for FAANG
    "thresholds": {
      "systemDesign": {
        "tech": {
          "100+": 95,  // FAANG expects very high system design
          "51-100": 75,
          "11-50": 50,
          "0-10": 20
        }
      }
    }
  }
}

// company-types/startup.json (for startups)
{
  "companyInsights": {
    "name": "Startup Companies",
    "fitAnalysis": { ... },
    "rounds": [
      {
        "name": "Practical Assessment",
        "difficulty": "medium",
        "focusAreas": ["shipping", "pragmatism"]
      },
      {
        "name": "Architecture Discussion",
        "difficulty": "medium",
        "focusAreas": ["tradeoffs", "efficiency"]
      }
    ]
  },
  "skillMap": {
    // Override skill thresholds for startups
    "thresholds": {
      "projects": {
        "tech": {
          "100+": 90,  // Startups care a LOT about shipping
          "51-100": 75,
          "11-50": 50,
          "0-10": 25
        }
      }
    }
  }
}
```

---

## Part 6: Quiz Response → Persona Generation Flow

### Step-by-Step Decomposition

When a user completes the quiz:

**Input from Quiz:**
```javascript
{
  background: 'tech',
  currentRole: 'swe-product',
  yearsOfExperience: '3-5',
  primaryGoal: 'level-up',
  targetRole: 'Backend Engineer',
  targetCompanyType: 'faang',
  problemSolving: '51-100',
  systemDesign: 'learning',
  portfolio: 'limited-1-5',
  currentSkills: ['Python', 'Java', 'SQL', 'PostgreSQL'],
  targetRoleLabel: 'Backend Engineer'
}
```

**Step 1: Decompose to 4 Dimensions**
```javascript
// In decomposeToModularPersona() function
const dimensions = {
  role: normalizeRole(targetRole),         // 'Backend Engineer' → 'backend'
  level: determineLevel(yearsOfExperience), // '3-5' → 'mid'
  userType: normalizeUserType(background),  // 'tech' → 'tech'
  companyType: normalizeCompanyType(targetCompanyType) // 'faang' → 'bigtech'
}
// Result: { role: 'backend', level: 'mid', userType: 'tech', companyType: 'bigtech' }
```

**Step 2: Load Templates in Order**
```javascript
const templates = {
  role: loadPersona('roles/backend.json'),
  level: loadPersona('levels/mid.json'),
  userType: loadPersona('user-types/tech.json'),
  company: loadPersona('company-types/bigtech.json')
}
```

**Step 3: Merge with Priority**
```javascript
let persona = {};
persona = deepMerge(persona, templates.role);     // Start with role
persona = deepMerge(persona, templates.level);    // Apply level customizations
persona = deepMerge(persona, templates.userType); // Apply background variants
persona = deepMerge(persona, templates.company);  // Apply company customizations
```

**Step 4: Enrich with Calculations**
```javascript
// Add calculated data based on quiz responses
persona.skillMap.userCurrentLevels = calculateCurrentSkillLevels(
  problemSolving,
  systemDesign,
  portfolio,
  currentSkills,
  persona.skillMap.thresholds,
  userType
);

persona.skillMap.skillGaps = calculateSkillGaps(
  persona.skillMap.userCurrentLevels,
  persona.skillMap.radarAxes,
  persona.skillMap.thresholds.averageBaseline[userType]
);

persona.timeline = adjustTimeline(level, primaryGoal);
// ... other enrichments
```

**Step 5: Return Personalized Persona**
```javascript
// This becomes the full persona configuration for the roadmap
return persona;
```

---

## Part 7: Base Role Template Structure

### Example: backend.json

```javascript
{
  "meta": {
    "role": "backend",
    "roleLabel": "Backend Engineer",
    "description": "Server-side development, APIs, databases, scalability"
  },

  "hero": {
    "title": "Your Backend Engineering Roadmap",
    "description": "Master server-side development, system design, and scalability",
    "skillsToLearn": 8,
    "estimatedEffort": {
      "value": "15-20",
      "unit": "hours/week"
    },
    "videoUrl": "https://www.youtube.com/embed/BACKEND_VIDEO_ID"
  },

  "skillMap": {
    "title": "Backend Engineering Skills",
    "description": "Track your proficiency in key backend competencies",
    "radarAxesConfig": {
      // Will be overridden by level.json
      // This is just the default/mid-level axes
      "tech": [
        { key: "dsa", label: "DSA", title: "Data Structures & Algorithms" },
        { key: "systemDesign", label: "System Design" },
        { key: "projects", label: "Projects" }
      ],
      "nonTech": [
        { key: "dsa", label: "DSA" },
        { key: "fundamentals", label: "Fundamentals" },
        { key: "projects", label: "Projects" }
      ]
    },
    "skillPriorities": {
      "high": [
        "Database Design",
        "API Design",
        "System Scalability"
      ],
      "medium": [
        "Caching Strategies",
        "Message Queues",
        "Microservices"
      ],
      "low": [
        "DevOps Basics",
        "Monitoring",
        "Documentation"
      ]
    },
    "thresholds": {
      // Will be customized by level.json
      "dsa": {
        "tech": { "100+": 85, "51-100": 65, "11-50": 40, "0-10": 15 },
        "nonTech": { "confident": 50, "learning": 30, "beginner": 15, "complete-beginner": 5 }
      },
      "systemDesign": {
        "tech": { "100+": 80, "51-100": 60, "11-50": 35, "0-10": 10 },
        "nonTech": { "confident": 60, "learning": 40, "beginner": 20, "complete-beginner": 8 }
      },
      "projects": {
        "tech": { "100+": 90, "51-100": 70, "11-50": 45, "0-10": 20 },
        "nonTech": { "confident": 60, "learning": 40, "beginner": 20, "complete-beginner": 10 }
      },
      "averageBaseline": {
        "tech": { "dsa": 45, "systemDesign": 35, "projects": 50 },
        "nonTech": { "dsa": 20, "fundamentals": 25, "projects": 25 }
      }
    }
  },

  "learningPath": {
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Backend Fundamentals",
        "duration": "4-6 weeks",
        "whatYouLearn": [
          { title: "HTTP & REST APIs", description: "..." },
          { title: "Database Basics", description: "..." },
          { title: "Server-side Authentication", description: "..." }
        ],
        "target": "Build a basic REST API",
        "whyItMatters": [
          "Foundation for all backend work",
          "Required for any backend role"
        ]
      },
      {
        "phaseNumber": 2,
        "title": "Advanced Patterns",
        "duration": "6-8 weeks",
        "whatYouLearn": [
          { title: "System Design Patterns", description: "..." },
          { title: "Database Optimization", description: "..." },
          { title: "Scalability Techniques", description: "..." }
        ],
        "target": "Design a system for 1M users",
        "whyItMatters": [
          "Differentiates mid-level from junior",
          "Critical for interviews at big tech"
        ]
      },
      {
        "phaseNumber": 3,
        "title": "System Design Mastery",
        "duration": "8-12 weeks",
        "whatYouLearn": [
          { title: "Complex System Design", description: "..." },
          { title: "Tradeoff Analysis", description: "..." },
          { title: "Production Architecture", description: "..." }
        ],
        "target": "Design a complete system from scratch",
        "whyItMatters": [
          "Required for senior roles",
          "Key differentiator for FAANG interviews"
        ]
      }
    ]
  },

  "projects": [
    {
      "id": "twitter-like-system",
      "title": "Twitter-like Social Feed",
      "tier": "Intermediate",
      "duration": "3-4 weeks",
      "description": "Build a scalable social feed system",
      "learnings": ["Database Design", "Caching", "API Design"],
      "implementationSteps": [...]
    },
    {
      "id": "ecommerce-backend",
      "title": "E-commerce Platform Backend",
      "tier": "Intermediate",
      "duration": "4-5 weeks",
      "description": "Build a complete e-commerce backend",
      "learnings": ["Payment Integration", "Inventory Management", "Order Processing"],
      "implementationSteps": [...]
    },
    {
      "id": "distributed-cache",
      "title": "Distributed Caching System",
      "tier": "Advanced",
      "duration": "5-6 weeks",
      "description": "Build a Redis-like caching system",
      "learnings": ["System Design", "Concurrency", "Performance Optimization"],
      "implementationSteps": [...]
    }
  ]
}
```

---

## Part 8: Level Overlay Template Structure

### Example: entry.json

```javascript
{
  "meta": {
    "level": "entry",
    "description": "Customizations for entry-level professionals (0-2 years)"
  },

  "skillMap": {
    "radarAxesConfig": {
      "overrideFor_backend": {
        "tech": [
          { key: "dsa", label: "DSA", title: "Data Structures & Algorithms" },
          { key: "projects", label: "Projects", title: "Project Experience" },
          { key: "fundamentals", label: "Fund.", title: "Backend Fundamentals" },
          { key: "communication", label: "Comm.", title: "Communication" }
        ],
        "nonTech": [
          { key: "dsa", label: "DSA" },
          { key: "fundamentals", label: "Fund." },
          { key: "projects", label: "Projects" },
          { key: "communication", label: "Comm." }
        ]
      },
      "overrideFor_frontend": {
        "tech": [
          { key: "dsa", label: "DSA" },
          { key: "uiPatterns", label: "UI", title: "UI Component Patterns" },
          { key: "fundamentals", label: "Fund.", title: "Web Fundamentals" },
          { key: "communication", label: "Comm." }
        ],
        "nonTech": [
          { key: "dsa", label: "DSA" },
          { key: "fundamentals", label: "Fund." },
          { key: "projects", label: "Projects" },
          { key: "communication", label: "Comm." }
        ]
      }
      // ... other roles
    },
    "thresholds": {
      "overrideFor_backend": {
        "dsa": {
          "tech": { "100+": 70, "51-100": 50, "11-50": 30, "0-10": 10 },
          "nonTech": { "confident": 40, "learning": 25, "beginner": 12, "complete-beginner": 3 }
        },
        "systemDesign": null, // Don't measure system design for entry-level
        "fundamentals": {
          "tech": { "100+": 85, "51-100": 65, "11-50": 40, "0-10": 15 },
          "nonTech": { "confident": 70, "learning": 50, "beginner": 30, "complete-beginner": 10 }
        },
        "projects": {
          "tech": { "100+": 75, "51-100": 55, "11-50": 35, "0-10": 15 },
          "nonTech": { "confident": 60, "learning": 40, "beginner": 20, "complete-beginner": 8 }
        },
        "communication": {
          "tech": { "100+": 70, "51-100": 50, "11-50": 30, "0-10": 10 },
          "nonTech": { "confident": 75, "learning": 55, "beginner": 35, "complete-beginner": 15 }
        },
        "averageBaseline": {
          "tech": {
            "dsa": 30,
            "fundamentals": 50,
            "projects": 35,
            "communication": 40
          },
          "nonTech": {
            "dsa": 10,
            "fundamentals": 40,
            "projects": 20,
            "communication": 35
          }
        }
      }
      // ... other roles
    }
  },

  "learningPath": {
    "overrideFor_backend": {
      "phases": [
        {
          "phaseNumber": 1,
          "title": "Backend Fundamentals",
          "duration": "6-8 weeks", // Entry-level takes longer
          "description": "Strong foundation is critical at entry level"
        },
        {
          "phaseNumber": 2,
          "title": "First Production Project",
          "duration": "4-6 weeks",
          "description": "Build something real and get it live"
        },
        {
          "phaseNumber": 3,
          "title": "Intermediate Patterns",
          "duration": "6-8 weeks",
          "description": "Move beyond basics, learn industry standards"
        }
      ]
    }
    // ... other roles
  }
}
```

### Example: mid.json

```javascript
{
  "meta": {
    "level": "mid",
    "description": "Customizations for mid-level professionals (2-5 years)"
  },

  "skillMap": {
    "radarAxesConfig": {
      "overrideFor_backend": {
        "tech": [
          { key: "dsa", label: "DSA", title: "Data Structures & Algorithms" },
          { key: "systemDesign", label: "System Design" },
          { key: "projects", label: "Projects" },
          { key: "communication", label: "Comm." }
        ],
        "nonTech": [
          { key: "dsa", label: "DSA" },
          { key: "systemDesign", label: "System Design" },
          { key: "projects", label: "Projects" },
          { key: "communication", label: "Comm." }
        ]
      }
      // ... other roles
    },
    "thresholds": {
      "overrideFor_backend": {
        "dsa": {
          "tech": { "100+": 85, "51-100": 65, "11-50": 40, "0-10": 15 },
          "nonTech": { "confident": 50, "learning": 30, "beginner": 15, "complete-beginner": 5 }
        },
        "systemDesign": {
          "tech": { "100+": 80, "51-100": 60, "11-50": 35, "0-10": 10 },
          "nonTech": { "confident": 60, "learning": 40, "beginner": 20, "complete-beginner": 8 }
        },
        "projects": {
          "tech": { "100+": 90, "51-100": 70, "11-50": 45, "0-10": 20 },
          "nonTech": { "confident": 60, "learning": 40, "beginner": 20, "complete-beginner": 10 }
        },
        "averageBaseline": {
          "tech": {
            "dsa": 45,
            "systemDesign": 35,
            "projects": 50,
            "communication": 40
          },
          "nonTech": {
            "dsa": 25,
            "systemDesign": 30,
            "projects": 30,
            "communication": 35
          }
        }
      }
      // ... other roles
    }
  },

  "learningPath": {
    "overrideFor_backend": {
      "phases": [
        {
          "phaseNumber": 1,
          "title": "System Design Fundamentals",
          "duration": "4-6 weeks",
          "description": "Now it's time to learn how systems scale"
        },
        {
          "phaseNumber": 2,
          "title": "Advanced Optimization",
          "duration": "6-8 weeks",
          "description": "Move beyond basics, optimize for scale"
        },
        {
          "phaseNumber": 3,
          "title": "Leadership & Mentoring",
          "duration": "4-6 weeks",
          "description": "Start thinking about team growth"
        }
      ]
    }
    // ... other roles
  }
}
```

### Example: senior.json

```javascript
{
  "meta": {
    "level": "senior",
    "description": "Customizations for senior professionals (5+ years)"
  },

  "skillMap": {
    "radarAxesConfig": {
      "overrideFor_backend": {
        "tech": [
          { key: "systemDesign", label: "System Design" },
          { key: "architecture", label: "Arch.", title: "System Architecture" },
          { key: "leadership", label: "Lead.", title: "Leadership & Influence" },
          { key: "dsa", label: "DSA" },
          { key: "projects", label: "Projects" }
        ],
        "nonTech": [
          { key: "systemDesign", label: "System Design" },
          { key: "architecture", label: "Arch." },
          { key: "projects", label: "Projects" },
          { key: "communication", label: "Comm." }
        ]
      }
      // ... other roles
    },
    "thresholds": {
      "overrideFor_backend": {
        "systemDesign": {
          "tech": { "100+": 95, "51-100": 80, "11-50": 60, "0-10": 30 },
          "nonTech": { "confident": 80, "learning": 60, "beginner": 40, "complete-beginner": 20 }
        },
        "architecture": {
          "tech": { "100+": 90, "51-100": 75, "11-50": 55, "0-10": 25 },
          "nonTech": { "confident": 75, "learning": 55, "beginner": 35, "complete-beginner": 15 }
        },
        "leadership": {
          "tech": { "100+": 85, "51-100": 70, "11-50": 50, "0-10": 20 },
          "nonTech": { "confident": 80, "learning": 60, "beginner": 40, "complete-beginner": 15 }
        },
        "averageBaseline": {
          "tech": {
            "systemDesign": 60,
            "architecture": 55,
            "leadership": 50,
            "dsa": 55,
            "projects": 65
          },
          "nonTech": {
            "systemDesign": 45,
            "architecture": 40,
            "projects": 45,
            "communication": 50
          }
        }
      }
      // ... other roles
    }
  },

  "learningPath": {
    "overrideFor_backend": {
      "phases": [
        {
          "phaseNumber": 1,
          "title": "Advanced Architecture",
          "duration": "4-6 weeks",
          "description": "Design decisions, tradeoffs, and business context"
        },
        {
          "phaseNumber": 2,
          "title": "Organization & Scaling",
          "duration": "6-8 weeks",
          "description": "Lead teams, build systems that scale beyond technology"
        },
        {
          "phaseNumber": 3,
          "title": "Impact & Strategy",
          "duration": "ongoing",
          "description": "Think about long-term vision and strategic impact"
        }
      ]
    }
    // ... other roles
  }
}
```

---

## Part 9: Implementation Roadmap

### Phase 1: File Structure Setup (Week 1)

1. Create empty directory structure:
   ```
   personas/
   ├── roles/ (5 files)
   ├── levels/ (3 files)
   ├── user-types/ (2 files)
   ├── company-types/ (4 files)
   └── _persona_list.json
   ```

2. Move existing test_persona.json data to appropriate files:
   - Extract role-specific sections → roles/backend.json, etc.
   - Extract level customizations → levels/entry.json, etc.
   - Extract background variants → user-types/tech.json, user-types/non-tech.json
   - Extract company insights → company-types/bigtech.json, etc.

### Phase 2: Implement Merge Logic (Week 2)

1. Update `decomposeToModularPersona()` in RoadmapCompositionOrchestrator.js to:
   - Load 4 separate template files
   - Implement the correct merge order
   - Apply role-specific level overrides

2. Create `loadAndMergePersona()` function:
   ```javascript
   async function loadAndMergePersona(role, level, userType, companyType) {
     const templates = {
       role: await loadPersona(`roles/${role}.json`),
       level: await loadPersona(`levels/${level}.json`),
       userType: await loadPersona(`user-types/${userType}.json`),
       company: await loadPersona(`company-types/${companyType}.json`)
     };

     // Merge with correct priority
     let persona = {};
     persona = deepMerge(persona, templates.role);
     persona = deepMerge(persona, templates.level);
     persona = deepMerge(persona, templates.userType);
     persona = deepMerge(persona, templates.company);

     return persona;
   }
   ```

3. Test with all 30 combinations (5 roles × 3 levels × 2 backgrounds):
   - Should produce different radar axes per combination
   - Should produce different thresholds per combination
   - Should preserve company-specific data

### Phase 3: Fill In Role Content (Week 3-4)

For each of 5 roles (backend, frontend, fullstack, devops, data):
1. Define core role knowledge in roles/*.json
2. Define role-specific level customizations
3. Define learning phases
4. Define recommended projects
5. Define company-specific variations

### Phase 4: Test & Refine (Week 5)

1. Wire quiz responses to `loadAndMergePersona()`
2. Verify end-to-end: Quiz → Decompose → Merge → Roadmap
3. Test all 30 combinations manually
4. Iterate on thresholds and axes based on user feedback

---

## Part 10: Key Implementation Files to Modify

### 1. RoadmapCompositionOrchestrator.js

```javascript
export async function decomposeToModularPersona(quizResponses) {
  const dimensions = {
    role: normalizeRole(quizResponses.targetRole),
    level: determineLevel(quizResponses.yearsOfExperience),
    userType: normalizeUserType(quizResponses.background),
    companyType: normalizeCompanyType(quizResponses.targetCompanyType)
  };

  // NEW: Load and merge persona templates
  const persona = await loadAndMergePersona(
    dimensions.role,
    dimensions.level,
    dimensions.userType,
    dimensions.companyType
  );

  // Enrich with calculated data
  return enrichPersonaWithCalculations(persona, quizResponses);
}

async function loadAndMergePersona(role, level, userType, companyType) {
  const templates = {
    role: await loadPersona(`roles/${role}.json`),
    level: await loadPersona(`levels/${level}.json`),
    userType: await loadPersona(`user-types/${userType}.json`),
    company: await loadPersona(`company-types/${companyType}.json`)
  };

  let merged = {};
  merged = deepMerge(merged, templates.role);
  merged = deepMerge(merged, templates.level);
  merged = deepMerge(merged, templates.userType);
  merged = deepMerge(merged, templates.company);

  return merged;
}
```

### 2. personaLoader.js

Update to handle loading from multiple files with the merge strategy.

### 3. experimental/roadmap-experimental-v2/index.js

Wire quiz responses to persona generation:

```javascript
useEffect(() => {
  const loadPersonaFromQuiz = async () => {
    const { quizResponses } = unifiedContext;
    if (!quizResponses || !quizResponses.targetRole) {
      return;
    }

    const persona = await decomposeToModularPersona(quizResponses);
    const config = transformPersonaForExperimental(persona, quizResponses.currentSkills);
    setPersonaConfig(config);
  };

  loadPersonaFromQuiz();
}, [unifiedContext.quizResponses]);
```

---

## Part 11: Summary & Next Steps

### Your "Big Beautiful Plan" is:

1. **5 Base Role Templates** - backend, frontend, fullstack, devops, data
2. **3 Level Overlays** - entry, mid, senior (with role-specific customizations)
3. **2 Background Variants** - tech, non-tech (as radarAxesConfig overrides)
4. **4 Company Variants** - bigtech, scaleup, startup, service (as companyInsights + threshold overrides)
5. **Smart Merging** - Role → Level → Background → Company → Enrich

### Why This Works:

✅ **Maximum Personalization** - 30+ unique personas without duplication
✅ **Maintainable** - Only 14 files instead of 30+
✅ **Scalable** - Add a new level? Add 1 file. Add a new role? Add 1 file
✅ **Clear Logic** - Merge order is explicit, easy to debug
✅ **Data-Driven** - Everything comes from config, no hardcoding
✅ **Role-Focused** - Role is the primary driver (as you emphasized)

### Immediate Next Steps:

1. **Approve this architecture** - Confirm this approach aligns with your vision
2. **Extract test_persona.json** - Break it into the 14 modular files
3. **Implement merge logic** - Add loadAndMergePersona() to orchestrator
4. **Wire quiz to persona** - Connect quiz responses to persona generation
5. **Test all 30 combinations** - Verify personalization works end-to-end

---

**This is your "big beautiful plan" - role-driven, fully personalized, maintainable at scale.**

Would you like me to proceed with any of these phases?
