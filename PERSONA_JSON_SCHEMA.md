# Persona JSON Schema - Complete Data Structure

This document defines the **exact JSON structure** that persona files must follow to power the entire roadmap frontend. Each section maps directly to UI components with **zero logic** - it's pure data-driven.

---

## File Location & Naming

```
frontend/src/configs/personas/
├── tech_junior_backend.json
├── tech_mid_backend.json
├── tech_senior_backend.json
├── tech_junior_frontend.json
├── ... (other role combinations)
└── non_tech_mid_data.json
```

**Persona ID Format:** `[userType]_[level]_[primaryRole]`
- Examples: `tech_mid_backend`, `non_tech_junior_frontend`, `tech_senior_fullstack`

---

## Complete Persona JSON Structure

```json
{
  "meta": {
    "personaId": "tech_mid_backend",
    "roleLabel": "Backend Engineer",
    "level": "mid",
    "userType": "tech",
    "description": "Mid-level backend engineer aiming for senior role"
  },

  "hero": {
    "title": "Your personalized roadmap to become a Senior {roleLabel} is ready!",
    "skillsToLearn": 12,
    "estimatedEffort": {
      "value": "12-15",
      "unit": "hrs/week"
    },
    "videoUrl": "dQw4w9WgXcQ"
  },

  "skillMap": {
    "axes": [
      {
        "name": "Data Structures & Algorithms",
        "targetValue": 85
      },
      {
        "name": "System Design",
        "targetValue": 70
      },
      {
        "name": "Databases",
        "targetValue": 80
      },
      {
        "name": "Backend Frameworks",
        "targetValue": 75
      },
      {
        "name": "Projects",
        "targetValue": 60
      }
    ],
    "skillPriorities": {
      "high": [
        "System Design",
        "Database Design",
        "Microservices Architecture",
        "API Design",
        "Caching Strategies"
      ],
      "medium": [
        "Message Queues",
        "Security & Authentication",
        "Deployment & DevOps",
        "Testing"
      ],
      "low": [
        "Code Quality",
        "Documentation"
      ]
    }
  },

  "companyInsights": {
    "highGrowthStartups": {
      "name": "High Growth Startups",
      "description": "Fast-scaling companies with product-market fit. Offers high learning, equity upside, and cutting-edge tech with lean teams.",
      "teamSize": "20-200 people",
      "salary": "₹15-30 LPA",
      "fitAnalysis": {
        "level": "achievable",
        "color": "blue",
        "message": "Stretched target - You might need longer time, higher level of DSA & system design skills with relevant work experience"
      },
      "whyFeasible": [
        "You have solid programming fundamentals",
        "Your experience aligns with startup needs",
        "Strong potential for rapid growth"
      ],
      "whatYouNeed": [
        "Master System Design patterns",
        "Build 2-3 production-ready projects",
        "Practice 100+ DSA problems"
      ],
      "companies": [
        "Razorpay",
        "Zerodha",
        "Cred",
        "Groww",
        "Meesho"
      ],
      "selectionProcess": [
        {
          "name": "Coding Assessment",
          "difficulty": "medium",
          "duration": "45 mins",
          "videoUrl": "https://www.youtube.com/embed/sg5pwazWomM",
          "points": [
            "2-3 DSA problems (arrays, strings, trees)",
            "Focus on optimal time complexity",
            "Code quality and edge cases matter"
          ]
        },
        {
          "name": "System Design",
          "difficulty": "hard",
          "duration": "60 mins",
          "videoUrl": "https://www.youtube.com/embed/o39hGS4ef6E",
          "points": [
            "Design scalable systems (e.g., URL shortener, chat app)",
            "Discuss tradeoffs and bottlenecks",
            "Show understanding of databases, caching, load balancing"
          ]
        },
        {
          "name": "Hiring Manager",
          "difficulty": "easy",
          "duration": "30 mins",
          "videoUrl": "https://www.youtube.com/embed/6yJ8eTtId8A",
          "points": [
            "Cultural fit and past experience",
            "Problem-solving approach",
            "Questions about the role and team"
          ]
        }
      ]
    },
    "productUnicorns": {
      "name": "Product Unicorns",
      "description": "Billion-dollar companies serving millions. Combines startup innovation with big-company stability, excellent pay and work culture.",
      "teamSize": "200-1000 people",
      "salary": "₹25-50 LPA",
      "fitAnalysis": {
        "level": "good",
        "color": "green",
        "message": "Next best step - You can immediately work towards this path, it's your most achievable next move"
      },
      "whyFeasible": [
        "Strong technical foundation matches their requirements",
        "Experience with modern tech stack",
        "Problem-solving mindset aligns with product culture"
      ],
      "whatYouNeed": [
        "Deep dive into distributed systems",
        "Build portfolio with scalable architecture",
        "Practice behavioral interviews"
      ],
      "companies": [
        "Swiggy",
        "Zomato",
        "Paytm",
        "PhonePe",
        "Ola"
      ],
      "selectionProcess": [
        {
          "name": "Online Assessment",
          "difficulty": "medium",
          "duration": "90 mins",
          "videoUrl": "https://www.youtube.com/embed/sg5pwazWomM",
          "points": [
            "3-4 DSA problems with increasing difficulty",
            "Focus on clean, well-documented code",
            "Handle edge cases and optimize solutions"
          ]
        },
        {
          "name": "Technical Interview",
          "difficulty": "hard",
          "duration": "60 mins",
          "videoUrl": "https://www.youtube.com/embed/o39hGS4ef6E",
          "points": [
            "Live coding with advanced DSA problems",
            "System design discussion",
            "Past project deep-dive"
          ]
        },
        {
          "name": "Managerial Round",
          "difficulty": "medium",
          "duration": "45 mins",
          "videoUrl": "https://www.youtube.com/embed/6yJ8eTtId8A",
          "points": [
            "Leadership and team collaboration",
            "Handling ambiguity and conflicts",
            "Career goals and motivations"
          ]
        }
      ]
    },
    "serviceCompanies": {
      "name": "Service Companies",
      "description": "IT consulting firms with diverse projects. Offer stability and domain exposure, but typically lower pay and slower growth than product companies.",
      "teamSize": "100-10000+ people",
      "salary": "₹8-20 LPA",
      "fitAnalysis": {
        "level": "transition",
        "color": "orange",
        "message": "Later career opportunity - Sets you up for any other role in tech. You'd need significant mastery in DSA, system design and exceptional work record"
      },
      "whyFeasible": [
        "Lower barrier to entry",
        "Good for building foundational experience",
        "Opportunities to work on diverse projects"
      ],
      "whatYouNeed": [
        "Build strong coding fundamentals",
        "Get comfortable with common frameworks",
        "Focus on communication skills"
      ],
      "companies": [
        "TCS",
        "Infosys",
        "Wipro",
        "Cognizant",
        "HCL"
      ],
      "selectionProcess": [
        {
          "name": "Aptitude Test",
          "difficulty": "easy",
          "duration": "60 mins",
          "videoUrl": "https://www.youtube.com/embed/sg5pwazWomM",
          "points": [
            "Logical reasoning and quantitative aptitude",
            "Basic programming concepts",
            "English comprehension"
          ]
        },
        {
          "name": "Technical Interview",
          "difficulty": "medium",
          "duration": "45 mins",
          "videoUrl": "https://www.youtube.com/embed/sg5pwazWomM",
          "points": [
            "Core language concepts (Java/Python)",
            "Database queries and OOP",
            "Basic DSA questions"
          ]
        },
        {
          "name": "HR Round",
          "difficulty": "easy",
          "duration": "30 mins",
          "videoUrl": "https://www.youtube.com/embed/6yJ8eTtId8A",
          "points": [
            "Background verification",
            "Salary negotiation",
            "Notice period and joining date"
          ]
        }
      ]
    },
    "bigTech": {
      "name": "FAANG / Big-Tech",
      "description": "Global tech giants (Google, Amazon, Meta, Microsoft, Apple). World-class pay, cutting-edge tech, excellent work-life balance, and top-tier learning.",
      "teamSize": "1000+ people",
      "salary": "₹40-80 LPA",
      "fitAnalysis": {
        "level": "achievable",
        "color": "blue",
        "message": "Stretched target - You might need longer time, higher level of DSA & system design skills with relevant work experience"
      },
      "whyFeasible": [
        "You have the right foundation to build upon",
        "Your problem-solving skills can be sharpened",
        "Timeline allows for comprehensive preparation"
      ],
      "whatYouNeed": [
        "Solve 200+ LeetCode problems (Easy to Hard)",
        "Master advanced system design (distributed systems, scalability)",
        "Practice behavioral questions (STAR format)"
      ],
      "companies": [
        "Google",
        "Amazon",
        "Microsoft",
        "Meta",
        "Apple",
        "Netflix"
      ],
      "selectionProcess": [
        {
          "name": "Phone Screen",
          "difficulty": "medium",
          "duration": "45 mins",
          "videoUrl": "https://www.youtube.com/embed/sg5pwazWomM",
          "points": [
            "1-2 medium DSA problems",
            "Focus on communication and approach",
            "Optimization and complexity analysis"
          ]
        },
        {
          "name": "Onsite Coding Rounds",
          "difficulty": "hard",
          "duration": "4-5 hours",
          "videoUrl": "https://www.youtube.com/embed/o39hGS4ef6E",
          "points": [
            "Multiple rounds with medium-hard DSA problems",
            "System design for senior roles",
            "Focus on scalability and tradeoffs"
          ]
        },
        {
          "name": "Behavioral Round",
          "difficulty": "medium",
          "duration": "45 mins",
          "videoUrl": "https://www.youtube.com/embed/6yJ8eTtId8A",
          "points": [
            "Leadership principles and values",
            "Past experiences and conflict resolution",
            "Long-term career goals"
          ]
        }
      ]
    }
  },

  "learningPath": {
    "phases": [
      {
        "phaseNumber": 1,
        "title": "Foundation: Advanced Concepts Deep Dive",
        "duration": "8 weeks",
        "learningPoints": [
          {
            "title": "Scalability & Load Balancing",
            "description": "Design systems that handle millions of concurrent users"
          },
          {
            "title": "Advanced Database Optimization",
            "description": "Indexing strategies, query optimization, sharding, partitioning"
          },
          {
            "title": "Distributed System Patterns",
            "description": "CAP theorem, eventual consistency, distributed tracing"
          },
          {
            "title": "Caching & Replication",
            "description": "Redis, memcached, database replication strategies"
          }
        ],
        "videoUrl": "https://www.youtube.com/embed/_dl8KiU1HYY",
        "target": {
          "metric": "10+ Architecture Designs",
          "description": "Design popular systems like Netflix, Twitter, Uber at scale"
        },
        "whyItMatters": [
          "Mandatory skill for senior technical interviews",
          "Shows architectural thinking",
          "Required for senior role responsibilities",
          "Differentiates senior from mid-level engineers"
        ]
      },
      {
        "phaseNumber": 2,
        "title": "Specialization: Mastering Your Domain",
        "duration": "6 weeks",
        "learningPoints": [
          {
            "title": "Advanced Patterns",
            "description": "Microservices, event sourcing, CQRS, saga patterns"
          },
          {
            "title": "Production Systems",
            "description": "Debugging production issues, monitoring, alerting"
          },
          {
            "title": "Reliability & Resilience",
            "description": "Circuit breakers, retry logic, graceful degradation"
          },
          {
            "title": "Testing Strategies",
            "description": "Integration testing, performance testing, chaos engineering"
          }
        ],
        "videoUrl": "https://www.youtube.com/embed/o39hGS4ef6E",
        "target": {
          "metric": "5+ Production Projects",
          "description": "Build and deploy progressively complex systems at scale"
        },
        "whyItMatters": [
          "Required for handling real production systems",
          "Senior engineers spend most time here",
          "Shows practical experience",
          "Demonstrates maturity and responsibility"
        ]
      },
      {
        "phaseNumber": 3,
        "title": "Mastery: Interview Prep & Leadership",
        "duration": "4-6 weeks",
        "learningPoints": [
          {
            "title": "Case Study Analysis",
            "description": "Study real systems: Google, Amazon, Netflix, Uber"
          },
          {
            "title": "Trade-off Thinking",
            "description": "Master the art of making architectural trade-offs"
          },
          {
            "title": "Cost Optimization",
            "description": "Optimize for latency, throughput, cost"
          },
          {
            "title": "Communication Skills",
            "description": "Explain complex designs clearly to interviewers"
          }
        ],
        "videoUrl": "https://www.youtube.com/embed/6yJ8eTtId8A",
        "target": {
          "metric": "3-5 Mock Interviews",
          "description": "Complete mock interviews at senior level from target companies"
        },
        "whyItMatters": [
          "Proves you're production-ready at senior level",
          "Interview conversation starters",
          "Validates technical expertise",
          "Showcases end-to-end capability"
        ]
      }
    ]
  },

  "projects": [
    {
      "id": "ecommerce-backend",
      "title": "E-Commerce Backend System",
      "tier": "Intermediate",
      "estimatedTime": "2-3 weeks",
      "shortDescription": "Build a product catalog, shopping cart, and order management system with proper error handling",
      "fullDescription": "Build a product catalog, shopping cart, and order management system with proper error handling and database optimization.",
      "skillsYouLearn": [
        "Complex API design",
        "Database optimization",
        "Error handling",
        "Caching basics"
      ],
      "implementationSteps": [
        {
          "stepNumber": 1,
          "title": "Design database schema for products, carts, and orders",
          "description": "Create normalized database schema with proper relationships and indexing"
        },
        {
          "stepNumber": 2,
          "title": "Build product management API",
          "description": "RESTful endpoints for creating, reading, updating products with pagination"
        },
        {
          "stepNumber": 3,
          "title": "Implement shopping cart functionality",
          "description": "Add to cart, remove, update quantities, calculate totals"
        },
        {
          "stepNumber": 4,
          "title": "Integrate Stripe payment processing",
          "description": "Handle payment flows, webhooks, and order confirmation"
        },
        {
          "stepNumber": 5,
          "title": "Build order management endpoints",
          "description": "Track order status, history, cancellations"
        },
        {
          "stepNumber": 6,
          "title": "Add search, filtering, and comprehensive testing",
          "description": "Full-text search, filters, unit tests, integration tests"
        }
      ]
    },
    {
      "id": "social-media-feed",
      "title": "Social Media Feed Backend",
      "tier": "Advanced",
      "estimatedTime": "3-4 weeks",
      "shortDescription": "Build a simplified Twitter-like backend with posts, comments, likes, and user interactions",
      "fullDescription": "Build a real-time social media feed backend with posts, comments, likes, followers, and feed generation at scale.",
      "skillsYouLearn": [
        "Real-time systems",
        "Message queues",
        "Caching at scale",
        "Feed algorithms"
      ],
      "implementationSteps": [
        {
          "stepNumber": 1,
          "title": "Design database schema for users, posts, and interactions",
          "description": "Handle user relationships, post metadata, engagement metrics"
        },
        {
          "stepNumber": 2,
          "title": "Implement user and authentication system",
          "description": "User registration, JWT authentication, follow/unfollow logic"
        },
        {
          "stepNumber": 3,
          "title": "Build posts and engagement APIs",
          "description": "Create, read, delete posts; like, comment, repost functionality"
        },
        {
          "stepNumber": 4,
          "title": "Implement feed generation algorithm",
          "description": "Merge followed users' posts with personalized ranking"
        },
        {
          "stepNumber": 5,
          "title": "Optimize with caching and message queues",
          "description": "Cache hot feeds, use queues for async notifications"
        },
        {
          "stepNumber": 6,
          "title": "Add real-time updates and analytics",
          "description": "WebSocket connections for live updates, engagement analytics"
        }
      ]
    },
    {
      "id": "microservices-ecommerce",
      "title": "Microservices E-Commerce Platform",
      "tier": "Advanced",
      "estimatedTime": "4-5 weeks",
      "shortDescription": "Build a scalable e-commerce system using microservices with independent services for products, orders, payments, and notifications",
      "fullDescription": "Build a production-ready microservices architecture with independent services for products, orders, payments, and notifications, including service discovery and inter-service communication.",
      "skillsYouLearn": [
        "Microservices architecture",
        "Service mesh & communication",
        "Event-driven systems",
        "Distributed transactions"
      ],
      "implementationSteps": [
        {
          "stepNumber": 1,
          "title": "Design microservices architecture and boundaries",
          "description": "Define service boundaries: Product, Order, Payment, Notification services"
        },
        {
          "stepNumber": 2,
          "title": "Implement Product Microservice",
          "description": "Product catalog, inventory management with independent database"
        },
        {
          "stepNumber": 3,
          "title": "Build Order Microservice",
          "description": "Order creation, management, status tracking with saga pattern"
        },
        {
          "stepNumber": 4,
          "title": "Create Payment Microservice",
          "description": "Payment processing, refunds, webhook handling from payment gateway"
        },
        {
          "stepNumber": 5,
          "title": "Implement inter-service communication",
          "description": "API Gateway, message queues for async communication, service discovery"
        },
        {
          "stepNumber": 6,
          "title": "Add monitoring, logging, and deployment",
          "description": "Distributed tracing, centralized logging, Docker containerization, Kubernetes deployment"
        }
      ]
    }
  ]
}
```

---

## Notes on Data Mapping

### Hero Section Mapping
```
UI Field          → Persona Path
Title             → hero.title (with {roleLabel} substitution)
Skills to Learn   → hero.skillsToLearn
Est. Effort       → hero.estimatedEffort.value + hero.estimatedEffort.unit
Video URL         → hero.videoUrl
```

### Skill Map Mapping
```
UI Field                  → Persona Path
Axis Names (5)            → skillMap.axes[].name
Target Values (dotted)    → skillMap.axes[].targetValue
High Priority Skills      → skillMap.skillPriorities.high
Medium Priority Skills    → skillMap.skillPriorities.medium
Low Priority Skills       → skillMap.skillPriorities.low
```

### Company Insights Mapping
```
UI Tab                    → Persona Path
High Growth Startups      → companyInsights.highGrowthStartups
Product Unicorns          → companyInsights.productUnicorns
Service Companies         → companyInsights.serviceCompanies
FAANG / Big-Tech          → companyInsights.bigTech

Each Tab Field:
Description               → [companyType].description
Company Size              → [companyType].teamSize
Expected Salary           → [companyType].salary
Fit Message               → [companyType].fitAnalysis.message
Why Feasible (3 points)   → [companyType].whyFeasible
What You Need (3 points)  → [companyType].whatYouNeed
Companies List            → [companyType].companies
Selection Process Rounds  → [companyType].selectionProcess
```

### Learning Path Mapping
```
UI Field                  → Persona Path
Phase Title               → learningPath.phases[].title
Learning Points (4-5)     → learningPath.phases[].learningPoints[].title + description
Video URL                 → learningPath.phases[].videoUrl
Target Metric             → learningPath.phases[].target.metric
Target Description        → learningPath.phases[].target.description
Why It Matters (3-4)      → learningPath.phases[].whyItMatters
```

### Projects Mapping
```
UI Field                  → Persona Path
Project Title             → projects[].title
Difficulty Tier           → projects[].tier
Estimated Time            → projects[].estimatedTime
Short Description         → projects[].shortDescription
Full Description          → projects[].fullDescription
Skills You'll Learn       → projects[].skillsYouLearn
Implementation Steps      → projects[].implementationSteps[].stepNumber + title + description
```

---

## Key Points

1. **No Logic Required** - All data comes directly from the persona JSON
2. **One-to-One Mapping** - Each UI field maps to exactly one persona field
3. **Role Substitution** - Use `{roleLabel}` in templates for dynamic text (e.g., hero title)
4. **Company Type Keys** - Use exact keys: `highGrowthStartups`, `productUnicorns`, `serviceCompanies`, `bigTech`
5. **All Fields Required** - Every section must have complete data; no partial/fallback data
6. **No Hardcoding** - All customization happens via persona JSON variations

---

## Version

Schema Version: 1.0
Last Updated: December 10, 2025
