/**
 * Skills Data - Integrated with Modular Skill Definitions
 *
 * This module provides dynamic skill loading based on target roles.
 * Skills are now loaded from role-specific JSON files with priorities.
 */

import { getAllSkillsForRole } from './skillDefinitions';

/**
 * Map old/generic role names to our standardized role names
 * Handles both old category names and new role names
 */
const roleMapping = {
  // Old category names (from quiz)
  "Backend Engineering": "Backend Engineer",
  "Frontend Engineering": "Frontend Engineer",
  "Software Engineering": "Full Stack Engineer",
  "DevOps & Cloud Computing": "DevOps Engineer",
  "Data Science": "Data Science Engineer",
  "Data Analytics": "Data Science Engineer",
  "Machine Learning": "Data Science Engineer",

  // New role names (already correct)
  "Backend Engineer": "Backend Engineer",
  "Frontend Engineer": "Frontend Engineer",
  "Full Stack Engineer": "Full Stack Engineer",
  "DevOps Engineer": "DevOps Engineer",
  "Data Science Engineer": "Data Science Engineer",
};

/**
 * Normalize role name to standard format
 * Handles both old and new naming conventions
 */
const normalizeRole = (role) => {
  // Try direct mapping first
  if (roleMapping[role]) {
    return roleMapping[role];
  }

  // If no mapping found, return as-is (might be standard already)
  return role;
};

/**
 * Get skills for a specific role
 * Integrates with modular skill definition system
 *
 * NO FALLBACKS - Throws error if skills cannot be loaded
 * Use RoadmapCompositionOrchestrator for roadmap data instead
 *
 * @param {string} targetRole - The target role (e.g., "Backend Engineer")
 * @returns {Array} Array of skill names sorted by priority
 */
export const getSkillsForRole = (targetRole) => {
  // Normalize the role name
  const normalizedRole = normalizeRole(targetRole);

  // Get all skills for the role from our skill definitions
  // NO FALLBACKS - Let error propagate if loading fails
  const allSkills = getAllSkillsForRole(normalizedRole);

  if (!allSkills || allSkills.length === 0) {
    throw new Error(`No skills found for role: ${targetRole}`);
  }

  // Return skills sorted by priority (critical first)
  return allSkills.map(skill => skill.name);
};

/**
 * Get detailed skill information for a role
 * Includes priority levels and estimated weeks
 *
 * NO FALLBACKS - Throws error if skills cannot be loaded
 *
 * @param {string} targetRole - The target role
 * @returns {Array} Array of skill objects with metadata
 */
export const getDetailedSkillsForRole = (targetRole) => {
  const normalizedRole = normalizeRole(targetRole);
  const allSkills = getAllSkillsForRole(normalizedRole);

  if (!allSkills || allSkills.length === 0) {
    throw new Error(`No skill details found for role: ${targetRole}`);
  }

  return allSkills;
};

/**
 * Get supported roles from skill definitions
 * @returns {Array} Array of supported role names
 */
export const getSupportedRoles = () => {
  return [
    "Backend Engineer",
    "Frontend Engineer",
    "Full Stack Engineer",
    "DevOps Engineer",
    "Data Science Engineer"
  ];
};

// REMOVED: All hardcoded fallback skill taxonomies
// REMOVED: getFallbackSkills function
//
// Rationale: All skill data must come from the modular composition system
// via RoadmapCompositionOrchestrator. No hardcoded defaults allowed.
