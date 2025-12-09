/**
 * COMPLETE QUIZ CONFIGURATION - Free Profile Evaluator Flow
 *
 * Architecture:
 * 1. Background Selection (Tech / Non-Tech) - determines which flow
 * 2. Conditional flows based on background
 * 3. Dynamic skills selection based on target role
 * 4. Generate Roadmap CTA
 */

import React from 'react';
import {
  Code,
  Database,
  Cube,
  CloudArrowUp,
  ChartBar,
  ShieldCheck,
  Gauge,
  FileCode,
  GitBranch,
  Clock,
  Lightning,
  FireSimple,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Gear,
  Graph
} from 'phosphor-react';
import { getSkillsForRole } from '../../utils/skillsData';

// ============================================================
// SHARED OPTIONS
// ============================================================

const TARGET_ROLES = [
  { value: 'Backend Engineer', label: 'Backend Engineer', icon: <Database size={24} weight="duotone" />, category: 'Backend Engineering' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer', icon: <Code size={24} weight="duotone" />, category: 'Frontend Engineering' },
  { value: 'Full Stack Engineer', label: 'Full-Stack Engineer', icon: <Cube size={24} weight="duotone" />, category: 'Software Engineering' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', icon: <Gear size={24} weight="duotone" />, category: 'DevOps & Cloud Computing' },
  { value: 'Data Science Engineer', label: 'Data Science Engineer', icon: <Graph size={24} weight="duotone" />, category: 'Data Science' },
];

const TARGET_COMPANIES = [
  { value: 'faang', label: 'FAANG / Big Tech' },
  { value: 'unicorns', label: 'Product Unicorns/Scaleups' },
  { value: 'startups', label: 'High Growth Startups' },
  { value: 'service', label: 'Service Companies' },
];

// ============================================================
// TECH PROFESSIONAL OPTIONS
// ============================================================

const TECH_CURRENT_ROLES = [
  { value: 'swe-product', label: 'Software Engineer - Product Company' },
  { value: 'swe-service', label: 'Software Engineer - Service Company' },
  { value: 'devops', label: 'DevOps / Cloud / Infrastructure Engineer' },
  { value: 'qa', label: 'QA / Support / Other Technical Role' },
];

const TECH_EXPERIENCE = [
  { value: '0-2', label: '0-2 years' },
  { value: '2-3', label: '2-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-8', label: '5-8 years' },
  { value: '8+', label: '8+ years' },
];

const TECH_PRIMARY_GOALS = [
  { value: 'better-company', label: 'Move to a better company (same level)' },
  { value: 'level-up', label: 'Level up (senior role / promotion)' },
  { value: 'higher-comp', label: 'Higher compensation' },
  { value: 'switch-domain', label: 'Switch to different tech domain' },
  { value: 'upskilling', label: 'Upskilling in current role' },
];

const TECH_PROBLEM_SOLVING = [
  { value: '100+', label: 'Very Active (100+ problems)' },
  { value: '51-100', label: 'Moderately Active (50-100 problems)' },
  { value: '11-50', label: 'Somewhat Active (10-50 problems)' },
  { value: '0-10', label: 'Not Active (0-10 problems)' },
];

const TECH_SYSTEM_DESIGN = [
  { value: 'multiple', label: 'Led design discussions' },
  { value: 'once', label: 'Participated in discussions' },
  { value: 'learning', label: 'Self-learning only' },
  { value: 'not-yet', label: 'Not yet, will learn' },
];

const TECH_PORTFOLIO = [
  { value: 'active-5+', label: 'Active (5+ public repos)' },
  { value: 'limited-1-5', label: 'Limited (1-5 repos)' },
  { value: 'inactive', label: 'Inactive (old activity)' },
  { value: 'none', label: 'No portfolio yet' },
];

// ============================================================
// NON-TECH / CAREER SWITCHER OPTIONS
// ============================================================

const NONTECH_BACKGROUND = [
  { value: 'sales-marketing', label: 'Sales / Marketing / Business' },
  { value: 'operations', label: 'Operations / Consulting / PM' },
  { value: 'design', label: 'Design (UI/UX / Graphic / Product)' },
  { value: 'finance', label: 'Finance / Accounting / Banking' },
  { value: 'other', label: 'Other Non-Tech / Fresh Grad' },
];

const NONTECH_EXPERIENCE = [
  { value: '0', label: '0 years (Fresh grad)' },
  { value: '0-2', label: '0-2 years' },
  { value: '2-3', label: '2-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' },
];

const NONTECH_STEPS_TAKEN = [
  { value: 'bootcamp', label: 'Attended bootcamp/workshop' },
  { value: 'completed-course', label: 'Completed online courses' },
  { value: 'built-projects', label: 'Built 1-2 small projects' },
  { value: 'self-learning', label: 'Self-learning (YouTube/blogs)' },
  { value: 'just-exploring', label: 'Just exploring, haven\'t started' },
];

const NONTECH_TARGET_ROLES = [
  { value: 'Backend Engineer', label: 'Backend Engineer', category: 'Backend Engineering' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer', category: 'Frontend Engineering' },
  { value: 'Full Stack Engineer', label: 'Full-Stack Engineer', category: 'Software Engineering' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer', category: 'DevOps & Cloud Computing' },
  { value: 'Data Science Engineer', label: 'Data Science Engineer', category: 'Data Science' },
];

const NONTECH_CODE_COMFORT = [
  { value: 'confident', label: 'Confident (solve simple problems independently)' },
  { value: 'learning', label: 'Learning (follow tutorials, struggle alone)' },
  { value: 'beginner', label: 'Beginner (understand concepts, can\'t code yet)' },
  { value: 'complete-beginner', label: 'Complete Beginner (haven\'t tried yet)' },
];

// ============================================================
// QUIZ SCREENS - COMPLETE FLOW
// ============================================================

/**
 * Get quiz screens based on user background
 * Creates dynamic flow for tech vs non-tech users
 * Consolidated: max 3 questions per screen to minimize clicks
 */
export const getQuizScreens = (background) => {
  const baseScreens = [
    // Screen 1: Background Selection - Simple, clean first screen
    {
      id: 'background',
      initialChatText: "Let's get started with your profile",
      singleColumn: true,
      questions: [
        {
          id: 'background',
          question: 'What\'s your current background?',
          type: 'button-grid',
          options: [
            {
              value: 'non-tech',
              label: 'Non-Tech / Career Switcher',
              description: 'Coming from sales, design, consulting, or other non-technical background',
              icon: <GraduationCap size={24} weight="duotone" />
            },
            {
              value: 'tech',
              label: 'Tech Professional',
              description: 'Already working as a software engineer or in a technical role',
              icon: <Code size={24} weight="duotone" />
            },
          ]
        }
      ]
    }
  ];

  if (background === 'tech') {
    return [
      ...baseScreens,
      // TECH PROFESSIONAL FLOW - CONSOLIDATED
      // Screen 2: WHO YOU ARE (Current Role + Experience)
      {
        id: 'tech-who-are-you',
        initialChatText: "Great! Let's understand your current tech experience.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentRole',
            question: 'What\'s your current role in the tech world?',
            type: 'button-grid',
            options: TECH_CURRENT_ROLES
          },
          {
            id: 'yearsOfExperience',
            question: 'How many years have you been in the tech industry?',
            type: 'radio-buttons',
            options: TECH_EXPERIENCE
          }
        ]
      },

      // Screen 3: WHERE YOU WANT TO GO (Goals + Target Role + Company)
      {
        id: 'tech-goals',
        initialChatText: "Now, let's talk about your career goals and target role.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'primaryGoal',
            question: 'What\'s your main career goal right now?',
            type: 'button-grid',
            options: TECH_PRIMARY_GOALS
          },
          {
            id: 'targetRole',
            question: 'Which role excites you the most?',
            type: 'button-grid',
            options: TARGET_ROLES
          },
          {
            id: 'targetCompanyType',
            question: 'What type of company are you targeting?',
            type: 'button-grid',
            options: TARGET_COMPANIES
          }
        ]
      },

      // Screen 4: READINESS ASSESSMENT (Problem Solving + System Design + Portfolio)
      {
        id: 'tech-readiness',
        initialChatText: "Let's assess your current readiness level.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'problemSolving',
            question: 'How much have you been practicing coding problems recently?',
            type: 'radio-buttons',
            options: TECH_PROBLEM_SOLVING
          },
          {
            id: 'systemDesign',
            question: 'How comfortable are you with system design?',
            type: 'radio-buttons',
            options: TECH_SYSTEM_DESIGN
          },
          {
            id: 'portfolio',
            question: 'How active is your GitHub / GitLab profile?',
            type: 'radio-buttons',
            options: TECH_PORTFOLIO
          }
        ]
      },

      // Screen 5: SKILLS SELECTION
      {
        id: 'skills',
        initialChatText: "Excellent! Now let's understand your current technical skills.\n\nSelect all the skills you're comfortable using independently.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentSkills',
            getDynamicQuestion: (responses) => {
              const selectedRole = responses?.targetRole || 'Backend Engineer';
              const roleOption = TARGET_ROLES.find(r => r.value === selectedRole);
              const category = roleOption?.category || 'Backend Engineering';
              return `Which of these ${category.toLowerCase()} skills do you already have?`;
            },
            type: 'multi-select-pills',
            getDynamicOptions: (responses) => {
              const selectedRole = responses?.targetRole || 'Backend Engineer';
              const roleOption = TARGET_ROLES.find(r => r.value === selectedRole);
              const category = roleOption?.category || 'Backend Engineering';
              const skills = getSkillsForRole(category);
              return skills.map(skill => ({
                value: skill,
                label: skill,
                icon: getSkillIcon(skill)
              }));
            }
          }
        ]
      }
    ];
  } else {
    // NON-TECH / CAREER SWITCHER FLOW - CONSOLIDATED
    return [
      ...baseScreens,
      // Screen 2: WHO YOU ARE (Background + Experience + Steps Taken)
      {
        id: 'nontech-who-are-you',
        initialChatText: "Great! Let's understand your professional background.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentBackground',
            question: 'What\'s your current professional background?',
            type: 'button-grid',
            options: NONTECH_BACKGROUND
          },
          {
            id: 'yearsOfExperience',
            question: 'How many years of work experience do you have?',
            type: 'radio-buttons',
            options: NONTECH_EXPERIENCE
          },
          {
            id: 'stepsTaken',
            question: 'What steps have you taken toward a tech career so far?',
            type: 'button-grid',
            options: NONTECH_STEPS_TAKEN
          }
        ]
      },

      // Screen 3: WHERE YOU WANT TO GO (Target Role + Company + Code Comfort)
      {
        id: 'nontech-goals-readiness',
        initialChatText: "Now, let's talk about your tech career goals and readiness.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'targetRole',
            question: 'Which tech role excites you the most?',
            type: 'button-grid',
            options: NONTECH_TARGET_ROLES
          },
          {
            id: 'targetCompanyType',
            question: 'What type of company would you love to work for?',
            type: 'button-grid',
            options: TARGET_COMPANIES
          },
          {
            id: 'codeComfort',
            question: 'How comfortable are you with coding right now?',
            type: 'radio-buttons',
            options: NONTECH_CODE_COMFORT
          }
        ]
      },

      // Screen 4: SKILLS SELECTION
      {
        id: 'skills',
        initialChatText: "Perfect! Now let's understand your current skills.\n\nSelect all the skills you already have or are familiar with.",
        moveUpOnDesktop: true,
        questions: [
          {
            id: 'currentSkills',
            getDynamicQuestion: (responses) => {
              const selectedRole = responses?.targetRole || 'Backend Engineer';
              const roleOption = NONTECH_TARGET_ROLES.find(r => r.value === selectedRole);
              const category = roleOption?.category || 'Backend Engineering';
              return `Which of these ${category.toLowerCase()} skills do you already have?`;
            },
            type: 'multi-select-pills',
            getDynamicOptions: (responses) => {
              const selectedRole = responses?.targetRole || 'Backend Engineer';
              const roleOption = NONTECH_TARGET_ROLES.find(r => r.value === selectedRole);
              const category = roleOption?.category || 'Backend Engineering';
              const skills = getSkillsForRole(category);
              return skills.map(skill => ({
                value: skill,
                label: skill,
                icon: getSkillIcon(skill)
              }));
            }
          }
        ]
      }
    ];
  }
};

// Legacy export for backward compatibility
export const QUIZ_SCREENS = getQuizScreens('tech');

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get skill icon based on skill name
 */
function getSkillIcon(skill, size = 18) {
  const skillLower = skill.toLowerCase();

  if (skillLower.includes('python') || skillLower.includes('java') || skillLower.includes('node') || skillLower.includes('go')) {
    return <Code size={size} weight="duotone" />;
  }
  if (skillLower.includes('data structures') || skillLower.includes('algorithms')) {
    return <ChartBar size={size} weight="duotone" />;
  }
  if (skillLower.includes('system design')) {
    return <Cube size={size} weight="duotone" />;
  }
  if (skillLower.includes('sql') || skillLower.includes('database') || skillLower.includes('nosql') || skillLower.includes('mongodb') || skillLower.includes('redis')) {
    return <Database size={size} weight="duotone" />;
  }
  if (skillLower.includes('api') || skillLower.includes('rest') || skillLower.includes('graphql')) {
    return <FileCode size={size} weight="duotone" />;
  }
  if (skillLower.includes('microservices') || skillLower.includes('architecture')) {
    return <Cube size={size} weight="duotone" />;
  }
  if (skillLower.includes('docker') || skillLower.includes('kubernetes')) {
    return <CloudArrowUp size={size} weight="duotone" />;
  }
  if (skillLower.includes('aws') || skillLower.includes('cloud')) {
    return <CloudArrowUp size={size} weight="duotone" />;
  }
  if (skillLower.includes('kafka') || skillLower.includes('queue') || skillLower.includes('message')) {
    return <ChartBar size={size} weight="duotone" />;
  }
  if (skillLower.includes('caching') || skillLower.includes('performance')) {
    return <Gauge size={size} weight="duotone" />;
  }
  if (skillLower.includes('security') || skillLower.includes('authentication')) {
    return <ShieldCheck size={size} weight="duotone" />;
  }
  if (skillLower.includes('ci/cd') || skillLower.includes('git')) {
    return <GitBranch size={size} weight="duotone" />;
  }

  return <Code size={size} weight="duotone" />;
}

/**
 * Screen completion validation
 */
export function isScreenComplete(screen, responses, profileData) {
  if (!screen || !screen.questions) return false;

  return screen.questions.every(question => {
    const value = responses[question.id];

    // Info with CTA: check if CTA was clicked
    if (question.type === 'info-with-cta') {
      return value !== undefined && value !== null;
    }

    // Multi-select pills: check if array has at least one item
    if (question.type === 'multi-select-pills') {
      return Array.isArray(value) && value.length > 0;
    }

    // Button grid: check if single value selected
    if (question.type === 'button-grid') {
      return value !== undefined && value !== null && value !== '';
    }

    // Radio buttons: check if single value selected
    if (question.type === 'radio-buttons') {
      return value !== undefined && value !== null && value !== '';
    }

    // Default: check if value exists
    return value !== undefined && value !== null && value !== '';
  });
}
