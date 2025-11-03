// Quiz Configuration for Career Roadmap Tool
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
  CheckCircle
} from 'phosphor-react';
import { getSkillsForRole } from '../../utils/skillsData';

// Career Roadmap Quiz - 2 Screens
export const QUIZ_SCREENS = [
  // Screen 1: Welcome Screen - Show profile data
  {
    id: 'welcome',
    initialChatText: "Hey, good to see you back! 👋 Hope the Free Profile Evaluator was helpful.\n\nTo generate your career roadmap, we've imported some details about you. Here's what we have:",
    getDynamicProfileDetails: (profileData) => {
      return [
        {
          icon: 'Briefcase',
          label: 'Current Role',
          value: profileData?.currentRole || 'Software Engineer - Service Company'
        },
        {
          icon: 'Clock',
          label: 'Experience',
          value: profileData?.yearsExperience || '3-5 years'
        },
        {
          icon: 'Target',
          label: 'Target Role',
          value: profileData?.targetRole || 'Senior Backend Engineer'
        },
        {
          icon: 'Buildings',
          label: 'Target Company',
          value: profileData?.targetCompanyType || 'Product Unicorns/Scaleups'
        },
        {
          icon: 'TrendUp',
          label: 'Goal',
          value: profileData?.primaryGoal || 'Move to better company + higher comp'
        }
      ];
    },
    questions: [
      {
        id: 'profileConfirmation',
        type: 'info-with-cta',
        ctaLabel: 'CONTINUE',
        ctaValue: 'continue'
      }
    ]
  },

  // Screen 2: Skills Selection
  {
    id: 'skills',
    initialChatText: "To get started, I'd love to know your current skills!\n\nSelect all skills you're comfortable using independently. Be honest - this helps us create a more accurate roadmap for you.",
    moveUpOnDesktop: true, // Flag to move content up on desktop
    questions: [
      {
        id: 'currentSkills',
        getDynamicQuestion: (profileData) => {
          const targetRole = profileData?.targetRole || 'Backend Engineer';
          return `Since your target role is ${targetRole}, select the skills you're comfortable with:`;
        },
        type: 'multi-select-pills',
        // Options will be dynamically generated based on targetRole
        getDynamicOptions: (profileData) => {
          const targetRole = profileData?.targetRole || 'Backend Engineering';
          const skills = getSkillsForRole(targetRole);
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

// Helper function to get skill icon (returns duotone icons for multi-select pills)
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

  // Default icon for any skill
  return <Code size={size} weight="duotone" />;
}

// Screen completion validation
export function isScreenComplete(screen, responses, profileData) {
  if (!screen || !screen.questions) return false;

  return screen.questions.every(question => {
    const value = responses[question.id];

    // Info with CTA: check if CTA was clicked
    if (question.type === 'info-with-cta') {
      return value !== undefined && value !== null;
    }

    // Multi-select: check if array has at least one item
    if (question.type === 'multi-select-pills') {
      return Array.isArray(value) && value.length > 0;
    }

    // Single select: check if value exists
    return value !== undefined && value !== null && value !== '';
  });
}
