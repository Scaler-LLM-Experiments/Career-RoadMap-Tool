/**
 * ROADMAP GENERATION API ENDPOINT
 *
 * POST /api/roadmap/generate
 *
 * Generates a complete personalized career roadmap based on:
 * - User's current skills
 * - Target role
 * - Timeline preference
 * - Years of experience
 *
 * Request Body:
 * {
 *   userSkills: ["Python", "Git", "SQL & Databases"],
 *   targetRole: "senior-backend",
 *   skillCategory: "Backend Engineering",
 *   timeline: "6-9 months",
 *   yearsExperience: 3,
 *   userName: "Sudhanva Acharya" // optional
 * }
 *
 * Response:
 * {
 *   success: true,
 *   roadmap: {
 *     overview: { userName, targetRole, timeline, matchScore, ... },
 *     skillAnalysis: { existingSkills, missingSkills, prioritized, ... },
 *     timelineEstimate: { estimatedMonths, effortPerWeek, ... },
 *     recommendations: { topSkillsToLearn, nextSteps, ... }
 *   }
 * }
 */

import { getSkillCategoryForRole, getRoleDisplayName } from '../../../src/utils/roleMapping';
import {
  generateSkillAnalysis,
  calculateTimeline,
} from '../../../src/utils/algorithmHelpers';

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      userSkills,
      targetRole,
      skillCategory: providedSkillCategory,
      timeline,
      yearsExperience = 0,
      userName = 'User',
    } = req.body;

    // Validate required fields
    if (!userSkills || !Array.isArray(userSkills)) {
      return res.status(400).json({
        error: 'userSkills is required and must be an array',
      });
    }

    if (!targetRole && !providedSkillCategory) {
      return res.status(400).json({
        error: 'Either targetRole or skillCategory is required',
      });
    }

    if (!timeline) {
      return res.status(400).json({
        error: 'timeline is required',
      });
    }

    // Determine skill category
    const skillCategory = providedSkillCategory || getSkillCategoryForRole(targetRole);
    const roleDisplayName = targetRole ? getRoleDisplayName(targetRole) : skillCategory;

    // Generate complete skill analysis
    const skillAnalysis = generateSkillAnalysis(userSkills, skillCategory);

    // Calculate timeline estimate
    const timelineEstimate = calculateTimeline({
      userSkills,
      skillCategory,
      userTimeline: timeline,
      yearsExperience,
    });

    // Generate next steps based on top skills
    const nextSteps = generateNextSteps(skillAnalysis.topSkillsToLearn, timeline);

    // Prepare roadmap response
    const roadmap = {
      // Overview
      overview: {
        userName,
        targetRole: roleDisplayName,
        skillCategory,
        timeline,
        matchScore: skillAnalysis.matchScore,
        currentProgress: skillAnalysis.matchScore,
        totalSkillsNeeded: skillAnalysis.totalSkillsNeeded,
        skillsAcquired: skillAnalysis.skillsAcquired,
        skillsRemaining:
          skillAnalysis.totalSkillsNeeded - skillAnalysis.skillsAcquired,
      },

      // Skill Analysis
      skillAnalysis: {
        matchScore: skillAnalysis.matchScore,
        weightedScore: skillAnalysis.weightedScore,
        totalWeight: skillAnalysis.totalWeight,
        existingSkills: skillAnalysis.existingSkills,
        missingSkills: skillAnalysis.missingSkills,
        prioritizedExisting: skillAnalysis.prioritizedExisting,
        prioritizedMissing: skillAnalysis.prioritizedMissing,
      },

      // Timeline Estimate
      timelineEstimate: {
        estimatedMonths: timelineEstimate.estimatedMonths,
        effortPerWeek: timelineEstimate.effortPerWeek,
        totalSkillsToLearn: timelineEstimate.totalSkillsToLearn,
        breakdown: timelineEstimate.breakdown,
      },

      // Recommendations
      recommendations: {
        topSkillsToLearn: skillAnalysis.topSkillsToLearn,
        nextSteps,
        focusAreas: getFocusAreas(skillAnalysis.missingSkills),
      },

      // Metadata
      generatedAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate roadmap',
      message: error.message,
    });
  }
}

/**
 * Generate actionable next steps based on top skills
 * @param {Array<string>} topSkills - Top 3 skills to learn
 * @param {string} timeline - User's timeline
 * @returns {Array<Object>} Next steps with actions
 */
function generateNextSteps(topSkills, timeline) {
  const nextSteps = [];

  // Step 1: Focus on top skill
  if (topSkills.length > 0) {
    nextSteps.push({
      step: 1,
      title: `Master ${topSkills[0]}`,
      description: `This is your highest priority skill. Focus on building strong fundamentals and practical projects.`,
      action: `Start with basics, then build 2-3 projects`,
      timeframe: 'Week 1-4',
    });
  }

  // Step 2: Learn second skill
  if (topSkills.length > 1) {
    nextSteps.push({
      step: 2,
      title: `Learn ${topSkills[1]}`,
      description: `Once comfortable with ${topSkills[0]}, move to this important supporting skill.`,
      action: `Complete online course and build integration projects`,
      timeframe: 'Week 5-8',
    });
  }

  // Step 3: Practice third skill
  if (topSkills.length > 2) {
    nextSteps.push({
      step: 3,
      title: `Add ${topSkills[2]} to your toolkit`,
      description: `Round out your skillset with this valuable addition.`,
      action: `Learn through documentation and mini-projects`,
      timeframe: 'Week 9-12',
    });
  }

  // Step 4: Build portfolio
  nextSteps.push({
    step: nextSteps.length + 1,
    title: 'Build Portfolio Projects',
    description: `Create 2-3 projects that showcase your new skills in real-world scenarios.`,
    action: `Build projects that combine multiple skills`,
    timeframe: 'Ongoing',
  });

  // Step 5: Interview prep
  nextSteps.push({
    step: nextSteps.length + 1,
    title: 'Prepare for Interviews',
    description: `Practice technical interviews and system design based on your target role.`,
    action: `Solve problems, review system design, practice mock interviews`,
    timeframe: 'Last 2-4 weeks',
  });

  return nextSteps;
}

/**
 * Get focus areas based on missing skills distribution
 * @param {Object} missingSkills - Object with highPriority, mediumPriority, lowPriority arrays
 * @returns {Array<string>} Focus area recommendations
 */
function getFocusAreas(missingSkills) {
  const focusAreas = [];

  const highCount = missingSkills.highPriority?.length || 0;
  const mediumCount = missingSkills.mediumPriority?.length || 0;
  const lowCount = missingSkills.lowPriority?.length || 0;

  if (highCount > 5) {
    focusAreas.push(
      'Focus heavily on core fundamentals - you have significant gaps in essential skills'
    );
  } else if (highCount > 0) {
    focusAreas.push(
      'Prioritize mastering the essential skills first before moving to advanced topics'
    );
  }

  if (mediumCount > 8) {
    focusAreas.push(
      'Build strong supporting skills through projects and hands-on practice'
    );
  }

  if (lowCount > 0) {
    focusAreas.push(
      'Learn specialized skills as you progress - these are nice-to-have additions'
    );
  }

  if (focusAreas.length === 0) {
    focusAreas.push(
      "You're on track! Focus on depth in your existing skills and build projects to showcase them"
    );
  }

  return focusAreas;
}
