/**
 * Skill Definitions Utility
 *
 * Loads and manages skill definitions for different roles.
 * Used for:
 * - Radar chart axes and visualization
 * - Skill gap analysis
 * - Timeline calculation
 * - Quiz skill selection
 */

// Import skill definitions
import backendSkills from '@/configs/personas/skills/backend.json';
import frontendSkills from '@/configs/personas/skills/frontend.json';
import fullstackSkills from '@/configs/personas/skills/fullstack.json';
import devopsSkills from '@/configs/personas/skills/devops.json';
import dataSkills from '@/configs/personas/skills/data.json';

// Map roles to their skill definitions
const SKILL_DEFINITIONS = {
  'Backend Engineer': backendSkills,
  'Frontend Engineer': frontendSkills,
  'Full Stack Engineer': fullstackSkills,
  'DevOps Engineer': devopsSkills,
  'Data Science Engineer': dataSkills,
};

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
