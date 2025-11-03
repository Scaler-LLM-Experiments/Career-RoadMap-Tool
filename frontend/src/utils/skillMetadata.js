/**
 * SKILL METADATA - Phase 2 Enhancement
 * Provides enriched skill data with reasoning, resources, difficulty, and learning time
 */

export const skillMetadata = {
  // === HIGH PRIORITY SKILLS ===
  'System Design': {
    priority: 'high',
    difficulty: 'advanced',
    learningTimeWeeks: 8,
    reason: 'Critical for backend engineer interviews at tech companies. Shows you can scale systems to handle millions of users and think about distributed system challenges.',
    whyMatters: [
      'Asked in 40-50% of senior engineer interviews',
      'Demonstrates architectural thinking',
      'Essential for handling production scale challenges',
      'Shows understanding of trade-offs in system design'
    ],
    resources: [
      {
        type: 'course',
        title: 'Grokking System Design Interview',
        platform: 'DesignGuru',
        duration: '40-50 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'System Design Masterclass',
        platform: 'Scaler Academy',
        duration: '60 hours',
        url: '#'
      },
      {
        type: 'video',
        title: 'System Design Basics - 10 min intro',
        platform: 'YouTube',
        duration: '10 minutes',
        url: '#'
      }
    ]
  },

  'Microservices': {
    priority: 'high',
    difficulty: 'advanced',
    learningTimeWeeks: 6,
    reason: 'Modern backend systems are built with microservices architecture. Understanding service-oriented design is crucial for senior roles.',
    whyMatters: [
      'Industry standard for large-scale systems',
      'Shows understanding of service boundaries',
      'Demonstrates knowledge of distributed systems',
      'Required for handling polyglot environments'
    ],
    resources: [
      {
        type: 'course',
        title: 'Microservices Architecture',
        platform: 'Udemy',
        duration: '15 hours',
        url: '#'
      },
      {
        type: 'article',
        title: 'Microservices Best Practices',
        platform: 'Martin Fowler Blog',
        duration: '30 min read',
        url: '#'
      },
      {
        type: 'course',
        title: 'Building Microservices',
        platform: 'Scaler Academy',
        duration: '40 hours',
        url: '#'
      }
    ]
  },

  'Docker': {
    priority: 'high',
    difficulty: 'intermediate',
    learningTimeWeeks: 3,
    reason: 'Essential containerization tool used in 95% of modern tech companies. Required for deploying and managing applications at scale.',
    whyMatters: [
      'Standard for deployment pipelines',
      'Required knowledge in almost all tech companies',
      'Simplifies development environment setup',
      'Critical for CI/CD pipelines'
    ],
    resources: [
      {
        type: 'course',
        title: 'Docker for Beginners',
        platform: 'Docker Official Docs',
        duration: '8 hours',
        url: '#'
      },
      {
        type: 'video',
        title: 'Docker in 100 Seconds',
        platform: 'Fireship',
        duration: '2 minutes',
        url: '#'
      },
      {
        type: 'course',
        title: 'Docker & Kubernetes Masterclass',
        platform: 'Udemy',
        duration: '25 hours',
        url: '#'
      }
    ]
  },

  'Kubernetes': {
    priority: 'high',
    difficulty: 'advanced',
    learningTimeWeeks: 8,
    reason: 'Container orchestration platform used by major tech companies. Essential for managing containerized applications at scale.',
    whyMatters: [
      'Industry standard for container orchestration',
      'Used by 70%+ of enterprises',
      'Shows understanding of deployment automation',
      'Critical for DevOps and platform engineering'
    ],
    resources: [
      {
        type: 'course',
        title: 'Kubernetes Basics',
        platform: 'Linux Academy',
        duration: '20 hours',
        url: '#'
      },
      {
        type: 'documentation',
        title: 'Official Kubernetes Documentation',
        platform: 'kubernetes.io',
        duration: 'Self-paced',
        url: '#'
      },
      {
        type: 'course',
        title: 'CKA Preparation Course',
        platform: 'A Cloud Guru',
        duration: '40 hours',
        url: '#'
      }
    ]
  },

  'gRPC': {
    priority: 'high',
    difficulty: 'advanced',
    learningTimeWeeks: 4,
    reason: 'Modern RPC framework for service-to-service communication. Growing adoption in companies building high-performance systems.',
    whyMatters: [
      'Superior to REST for microservice communication',
      'Reduces latency in distributed systems',
      'Supports streaming and multiplexing',
      'Used by Google, Netflix, Uber internally'
    ],
    resources: [
      {
        type: 'documentation',
        title: 'gRPC Official Guide',
        platform: 'grpc.io',
        duration: '6 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'gRPC Deep Dive',
        platform: 'Coursera',
        duration: '12 hours',
        url: '#'
      }
    ]
  },

  // === MEDIUM PRIORITY SKILLS ===
  'Redis': {
    priority: 'medium',
    difficulty: 'intermediate',
    learningTimeWeeks: 3,
    reason: 'In-memory cache used in nearly every production system. Essential for optimizing application performance.',
    whyMatters: [
      'Improves application performance 10-100x',
      'Standard caching solution across industries',
      'Used for sessions, caching, and pub/sub',
      'Shows understanding of performance optimization'
    ],
    resources: [
      {
        type: 'course',
        title: 'Redis Crash Course',
        platform: 'Traversy Media',
        duration: '2 hours',
        url: '#'
      },
      {
        type: 'documentation',
        title: 'Redis Official Documentation',
        platform: 'redis.io',
        duration: '5 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'Redis Advanced Patterns',
        platform: 'Udemy',
        duration: '10 hours',
        url: '#'
      }
    ]
  },

  'Elasticsearch': {
    priority: 'medium',
    difficulty: 'intermediate',
    learningTimeWeeks: 4,
    reason: 'Search and analytics engine. Critical for companies dealing with large data volumes and complex search requirements.',
    whyMatters: [
      'Powers search in millions of applications',
      'Essential for log analysis and monitoring',
      'Enables real-time data analysis',
      'Shows understanding of search infrastructure'
    ],
    resources: [
      {
        type: 'course',
        title: 'Elasticsearch Essential Training',
        platform: 'LinkedIn Learning',
        duration: '3 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'Elasticsearch Deep Dive',
        platform: 'Udemy',
        duration: '15 hours',
        url: '#'
      }
    ]
  },

  'Apache Kafka': {
    priority: 'medium',
    difficulty: 'advanced',
    learningTimeWeeks: 5,
    reason: 'Distributed streaming platform. Essential for event-driven architectures and real-time data processing.',
    whyMatters: [
      'Powers event-driven systems at scale',
      'Used by Netflix, Uber, LinkedIn, etc.',
      'Shows understanding of async architectures',
      'Critical for real-time data pipelines'
    ],
    resources: [
      {
        type: 'course',
        title: 'Apache Kafka Series',
        platform: 'Udemy',
        duration: '30 hours',
        url: '#'
      },
      {
        type: 'documentation',
        title: 'Kafka Official Documentation',
        platform: 'kafka.apache.org',
        duration: '8 hours',
        url: '#'
      }
    ]
  },

  'PostgreSQL/MySQL Advanced': {
    priority: 'medium',
    difficulty: 'intermediate',
    learningTimeWeeks: 4,
    reason: 'Deep database knowledge including optimization, indexing, and performance tuning is crucial for backend engineers.',
    whyMatters: [
      'Most common database in production',
      'Query optimization impacts application speed',
      'Indexing knowledge prevents common mistakes',
      'Shows maturity in backend thinking'
    ],
    resources: [
      {
        type: 'course',
        title: 'SQL Performance Tuning',
        platform: 'Pluralsight',
        duration: '6 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'Advanced SQL Masterclass',
        platform: 'Udemy',
        duration: '15 hours',
        url: '#'
      }
    ]
  },

  'CI/CD Pipelines': {
    priority: 'medium',
    difficulty: 'intermediate',
    learningTimeWeeks: 2,
    reason: 'Automated deployment and testing is standard practice. Understanding CI/CD shows DevOps awareness.',
    whyMatters: [
      'Standard practice in all modern teams',
      'Speeds up development and deployment',
      'Reduces human error in deployments',
      'Shows DevOps and automation knowledge'
    ],
    resources: [
      {
        type: 'course',
        title: 'Jenkins Pipeline Basics',
        platform: 'Linux Academy',
        duration: '4 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'GitHub Actions Masterclass',
        platform: 'Udemy',
        duration: '8 hours',
        url: '#'
      }
    ]
  },

  // === LOW PRIORITY SKILLS ===
  'GraphQL': {
    priority: 'low',
    difficulty: 'intermediate',
    learningTimeWeeks: 3,
    reason: 'Modern query language growing in adoption. Nice-to-have but not essential for all roles.',
    whyMatters: [
      'Alternative to REST gaining popularity',
      'Used by companies like GitHub, Shopify',
      'Provides flexibility to frontend teams',
      'Shows awareness of modern API trends'
    ],
    resources: [
      {
        type: 'course',
        title: 'GraphQL Basics',
        platform: 'Scrimba',
        duration: '3 hours',
        url: '#'
      },
      {
        type: 'course',
        title: 'GraphQL with Apollo',
        platform: 'Udemy',
        duration: '12 hours',
        url: '#'
      }
    ]
  },

  'WebSockets': {
    priority: 'low',
    difficulty: 'intermediate',
    learningTimeWeeks: 2,
    reason: 'Real-time communication protocol. Useful for specific use cases like notifications and live updates.',
    whyMatters: [
      'Enables real-time features',
      'Used in chat apps and live notifications',
      'More efficient than polling',
      'Shows understanding of protocol design'
    ],
    resources: [
      {
        type: 'course',
        title: 'WebSockets Deep Dive',
        platform: 'Pluralsight',
        duration: '3 hours',
        url: '#'
      }
    ]
  },

  'Message Queues': {
    priority: 'low',
    difficulty: 'intermediate',
    learningTimeWeeks: 3,
    reason: 'Asynchronous processing pattern. Good to know but depends on specific tech stack.',
    whyMatters: [
      'Enables asynchronous task processing',
      'Decouples services',
      'Improves system reliability',
      'Used in background job systems'
    ],
    resources: [
      {
        type: 'course',
        title: 'RabbitMQ Essentials',
        platform: 'Udemy',
        duration: '5 hours',
        url: '#'
      }
    ]
  }
};

/**
 * Get metadata for a specific skill
 * Falls back to default if skill not found
 */
export const getSkillMetadata = (skillName) => {
  return skillMetadata[skillName] || {
    priority: 'unknown',
    difficulty: 'intermediate',
    learningTimeWeeks: 4,
    reason: 'Important skill for your career growth',
    whyMatters: ['Shows continuous learning and growth'],
    resources: []
  };
};

/**
 * Get difficulty badge color
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    intermediate: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    advanced: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  };
  return colors[difficulty] || colors.intermediate;
};

/**
 * Get learning time estimate based on background
 */
export const getAdjustedLearningTime = (skillName, userBackground) => {
  const metadata = getSkillMetadata(skillName);
  const baseWeeks = metadata.learningTimeWeeks;

  // Tech professionals learn faster
  if (userBackground === 'tech') {
    return Math.max(1, Math.ceil(baseWeeks * 0.7));
  }
  // Career switchers need more time
  return Math.ceil(baseWeeks * 1.3);
};

/**
 * Filter skills based on timeline
 */
export const filterSkillsByTimeline = (skills, timeline) => {
  const timelineMap = {
    '6-9 months': { weeks: 26, maxSkills: 5, priorities: ['high'] },
    '9-12 months': { weeks: 39, maxSkills: 8, priorities: ['high', 'medium'] },
    '12-18 months': { weeks: 65, maxSkills: 15, priorities: ['high', 'medium', 'low'] },
    '18+ months': { weeks: 78, maxSkills: 20, priorities: ['high', 'medium', 'low'] },
    'just exploring': { weeks: 12, maxSkills: 3, priorities: ['high'] }
  };

  const config = timelineMap[timeline] || timelineMap['9-12 months'];
  return skills.filter(skill => {
    const metadata = getSkillMetadata(skill.skill);
    return config.priorities.includes(metadata.priority);
  });
};
