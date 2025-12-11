/**
 * Skill Definitions Utility
 *
 * Loads and manages skill definitions for different roles from role JSON files.
 * Used for:
 * - Radar chart axes and visualization
 * - Skill gap analysis
 * - Timeline calculation
 * - Quiz skill selection
 */

// Import role definitions that contain skill data
import backendRole from '@/configs/personas/roles/backend.json';
import frontendRole from '@/configs/personas/roles/frontend.json';
import fullstackRole from '@/configs/personas/roles/fullstack.json';
import devopsRole from '@/configs/personas/roles/devops.json';
import dataRole from '@/configs/personas/roles/data.json';

// Map roles to their complete definitions
const ROLE_DEFINITIONS = {
  'Backend Engineer': backendRole,
  'Frontend Engineer': frontendRole,
  'Full Stack Engineer': fullstackRole,
  'DevOps Engineer': devopsRole,
  'Data Science Engineer': dataRole,
};

// Extract skill definitions from role data
const SKILL_DEFINITIONS = {};
Object.entries(ROLE_DEFINITIONS).forEach(([roleName, roleData]) => {
  let skills = [];

  // Try new format first: metadata.skills (array of skill objects)
  // Some files use 'metadata', others use 'meta'
  const metaData = roleData.metadata || roleData.meta;

  if (metaData?.skills && Array.isArray(metaData.skills)) {
    skills = metaData.skills;
  }
  // Fall back to old format: skillMap.skillPriorities (object with string arrays)
  else if (roleData.skillMap?.skillPriorities) {
    const skillPriorities = roleData.skillMap.skillPriorities;

    // Extract skill names from priority arrays
    Object.entries(skillPriorities).forEach(([priorityKey, skillList]) => {
      if (Array.isArray(skillList)) {
        // Convert string skill names to objects if needed
        skillList.forEach(skill => {
          if (typeof skill === 'string') {
            skills.push({
              name: skill,
              priority: priorityKey,
              category: 'general',
              description: ''
            });
          } else {
            skills.push(skill);
          }
        });
      }
    });
  }

  SKILL_DEFINITIONS[roleName] = {
    skills: skills,
    metadata: {
      radarCategories: (roleData.skillMap?.radarAxes || []).map(axis => axis.label || axis.key),
    },
  };

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`[skillDefinitions] Loaded ${skills.length} skills for ${roleName}`);
  }
});

/**
 * Get skill definition for a specific role
 */
export function getSkillDefinition(role) {
  return SKILL_DEFINITIONS[role] || SKILL_DEFINITIONS['Backend Engineer'];
}

/**
 * Get all skills for a role
 */
export function getAllSkillsForRole(role) {
  const definition = getSkillDefinition(role);
  return definition.skills || [];
}

/**
 * Get radar chart categories/axes for a role
 */
export function getRadarCategories(role) {
  const definition = getSkillDefinition(role);
  return definition.metadata.radarCategories || [];
}

/**
 * Get skills by priority level
 */
export function getSkillsByPriority(role, priority) {
  const skills = getAllSkillsForRole(role);
  return skills.filter(skill => skill.priority === priority);
}

/**
 * Calculate missing skills for a user
 */
export function calculateMissingSkills(role, userCurrentSkills = []) {
  const allSkills = getAllSkillsForRole(role);

  const missingSkills = allSkills.filter(skill =>
    !userCurrentSkills.includes(skill.name)
  );

  return {
    highPriority: missingSkills.filter(s => s.priority === 'critical'),
    mediumPriority: missingSkills.filter(s => s.priority === 'high'),
    lowPriority: missingSkills.filter(s => s.priority === 'medium'),
    all: missingSkills,
    totalCount: missingSkills.length,
  };
}

/**
 * Calculate estimated timeline for learning missing skills
 */
export function calculateEstimatedTimeline(role, userCurrentSkills = []) {
  const missing = calculateMissingSkills(role, userCurrentSkills);

  const totalWeeks = missing.all.reduce((sum, skill) =>
    sum + (skill.estimatedWeeks || 4), 0
  );

  // Convert weeks to months
  const months = Math.ceil(totalWeeks / 4);

  return {
    totalWeeks,
    totalMonths: months,
    breakdown: {
      highPriority: missing.highPriority.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0),
      mediumPriority: missing.mediumPriority.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0),
      lowPriority: missing.lowPriority.reduce((sum, s) => sum + (s.estimatedWeeks || 4), 0),
    },
  };
}

/**
 * Calculate skill match score (0-100)
 */
export function calculateSkillMatchScore(role, userCurrentSkills = []) {
  const allSkills = getAllSkillsForRole(role);

  if (allSkills.length === 0) return 0;

  const userMatches = userCurrentSkills.filter(skill =>
    allSkills.some(s => s.name === skill)
  );

  const matchScore = (userMatches.length / allSkills.length) * 100;
  return Math.round(matchScore);
}

/**
 * Get skills mapped to radar axes for visualization
 */
export function getSkillsByRadarAxis(role, userCurrentSkills = []) {
  const definition = getSkillDefinition(role);
  const allSkills = definition.skills || [];
  const axes = definition.metadata.radarCategories || [];

  const result = {};

  axes.forEach(axis => {
    const axisSkills = allSkills.filter(s => s.radarAxis === axis);
    const userMatches = userCurrentSkills.filter(skill =>
      axisSkills.some(s => s.name === skill)
    );

    result[axis] = {
      total: axisSkills.length,
      matched: userMatches.length,
      percentage: (userMatches.length / axisSkills.length) * 100,
      skills: axisSkills,
      userHasSkills: userMatches,
    };
  });

  return result;
}

/**
 * Get interview-critical skills for a role
 */
export function getInterviewCriticalSkills(role) {
  const skills = getAllSkillsForRole(role);
  return skills.filter(skill => skill.interviewCritical === true);
}

/**
 * Check if role has skill definition
 */
export function hasSkillDefinition(role) {
  return role in SKILL_DEFINITIONS;
}

/**
 * Get all supported roles
 */
export function getSupportedRoles() {
  return Object.keys(SKILL_DEFINITIONS);
}

/**
 * Validate skill name against role definition
 */
export function isValidSkillForRole(role, skillName) {
  const skills = getAllSkillsForRole(role);
  return skills.some(s => s.name === skillName);
}

/**
 * Get skill details
 */
export function getSkillDetail(role, skillName) {
  const skills = getAllSkillsForRole(role);
  return skills.find(s => s.name === skillName) || null;
}

export default {
  getSkillDefinition,
  getAllSkillsForRole,
  getRadarCategories,
  getSkillsByPriority,
  calculateMissingSkills,
  calculateEstimatedTimeline,
  calculateSkillMatchScore,
  getSkillsByRadarAxis,
  getInterviewCriticalSkills,
  hasSkillDefinition,
  getSupportedRoles,
  isValidSkillForRole,
  getSkillDetail,
};
