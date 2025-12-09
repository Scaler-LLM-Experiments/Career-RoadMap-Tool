/**
 * ROADMAP INTEGRATION ENGINE
 *
 * Orchestrates the complete flow from quiz responses to final roadmap config:
 * 1. Takes quiz responses and profile data from UnifiedContext
 * 2. Decomposes to modular persona components (role, level, userType, companyType)
 * 3. Composes final roadmap by merging modular templates
 * 4. Enriches with calculated values (skill gap, fit analysis, etc)
 * 5. Returns ready-to-render config
 *
 * This is the main integration point for the frontend
 */

import { decomposeToModularPersona, decomposeToModularPersonaWithValidation } from './personaMatching';
import { composeRoadmapConfig } from './roadmapComposition';

/**
 * Main integration function - generates complete personalized roadmap
 *
 * @param {Object} quizResponses - User's quiz answers from Career Roadmap Tool
 * @param {Object} profileData - User profile from Free Profile Evaluator
 * @returns {Promise<Object>} Complete roadmap configuration ready to render
 */
export async function generatePersonalizedRoadmap(quizResponses, profileData) {
  console.log('🚀 Starting roadmap generation...', {
    quizResponses,
    profileData
  });

  try {
    // STEP 1: Validate inputs
    console.log('✓ Validating inputs...');
    if (!quizResponses) {
      throw new Error('Quiz responses are required');
    }
    if (!profileData) {
      throw new Error('Profile data is required');
    }

    // STEP 2: Decompose to modular persona
    console.log('🔧 Decomposing to modular persona...');
    const modularPersona = decomposeToModularPersona(quizResponses);

    if (!modularPersona) {
      throw new Error('Failed to decompose persona');
    }

    console.log('✅ Modular persona:', modularPersona);

    // STEP 3: Compose roadmap config from templates
    console.log('🔀 Composing roadmap config from templates...');
    const composedConfig = await composeRoadmapConfig(
      modularPersona,
      quizResponses,
      profileData
    );

    if (!composedConfig) {
      throw new Error('Failed to compose roadmap config');
    }

    console.log('✅ Roadmap config composed successfully');

    // STEP 4: Add integration metadata
    console.log('📝 Adding integration metadata...');
    composedConfig.integrationMetadata = {
      generatedAt: new Date().toISOString(),
      generationMethod: 'modular-composition',
      version: '2.0',
      modularPersona,
      quizResponses,
      profileData
    };

    console.log('✨ Roadmap generation complete!');
    return composedConfig;

  } catch (error) {
    console.error('❌ Error in roadmap generation:', error);
    throw error;
  }
}

/**
 * Convert Free Profile Evaluator data to Career Roadmap Tool quiz format
 *
 * This adapter converts the data structure from the Free Profile Evaluator
 * (which has different field names) into the format expected by the Career Roadmap Tool
 *
 * @param {Object} evaluationResults - Results from Free Profile Evaluator
 * @param {Object} background - Background type ('tech' or 'non-tech')
 * @returns {Object} Converted quiz responses in Career Roadmap format
 */
export function convertEvaluationResultsToQuizFormat(evaluationResults, background) {
  if (!evaluationResults) {
    console.warn('No evaluation results provided');
    return {};
  }

  const converted = {};

  // Map user type
  converted.userType = background === 'non-tech' ? 'career_switcher' : 'tech_professional';

  // Map years of experience
  if (evaluationResults.yearsOfExperience || evaluationResults.experience) {
    converted.yearsOfExperience = evaluationResults.yearsOfExperience || evaluationResults.experience;
  }

  // Map target role
  if (evaluationResults.targetRole) {
    converted.targetRole = evaluationResults.targetRole;
  }

  // Map target company type
  if (evaluationResults.targetCompanyType) {
    converted.targetCompanyType = evaluationResults.targetCompanyType;
  }

  // Map tech-professional specific fields
  if (background === 'tech') {
    if (evaluationResults.primaryGoal) converted.primaryGoal = evaluationResults.primaryGoal;
    if (evaluationResults.currentRole) converted.currentRole = evaluationResults.currentRole;
    if (evaluationResults.problemSolving) converted.problemSolving = evaluationResults.problemSolving;
    if (evaluationResults.systemDesign) converted.systemDesign = evaluationResults.systemDesign;
    if (evaluationResults.portfolio) converted.portfolio = evaluationResults.portfolio;
    if (evaluationResults.codingPractice) converted.codingPractice = evaluationResults.codingPractice;
  }

  // Map career-switcher specific fields
  if (background === 'non-tech') {
    if (evaluationResults.currentBackground) converted.currentBackground = evaluationResults.currentBackground;
    if (evaluationResults.stepsTaken) converted.stepsTaken = evaluationResults.stepsTaken;
    if (evaluationResults.codeComfort) converted.codeComfort = evaluationResults.codeComfort;
  }

  return converted;
}

/**
 * Generate roadmap with error handling and fallbacks
 *
 * This is the production version with comprehensive error handling
 *
 * @param {Object} quizResponses - Quiz responses
 * @param {Object} profileData - Profile data
 * @returns {Promise<{success: boolean, config: Object, error: string}>} Result object
 */
export async function generateRoadmapSafely(quizResponses, profileData) {
  try {
    // Generate roadmap
    const config = await generatePersonalizedRoadmap(quizResponses, profileData);

    return {
      success: true,
      config,
      error: null
    };
  } catch (error) {
    console.error('Error generating roadmap:', error);

    // Return error details for frontend error handling
    return {
      success: false,
      config: null,
      error: {
        message: error.message,
        type: error.name,
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Debug function: Show decomposition for a given input
 * Useful for testing and debugging
 *
 * @param {Object} quizResponses - Quiz responses to decompose
 * @returns {Object} Decomposition result with validation
 */
export function debugDecomposition(quizResponses) {
  console.log('🔍 DEBUG: Decomposing persona...');

  const result = decomposeToModularPersonaWithValidation(quizResponses);

  console.log('📊 Decomposition Result:', result);

  return result;
}

/**
 * Validate that all required data is present before roadmap generation
 *
 * @param {Object} quizResponses - Quiz responses
 * @param {Object} profileData - Profile data
 * @returns {Object} Validation result with errors
 */
export function validateRoadmapGenerationInputs(quizResponses, profileData) {
  const errors = [];

  // Validate quiz responses
  if (!quizResponses) {
    errors.push('Quiz responses are missing');
  } else {
    if (!quizResponses.userType && !quizResponses.background) {
      errors.push('User type (userType or background) is required');
    }
    if (!quizResponses.yearsOfExperience && !quizResponses.experience) {
      errors.push('Years of experience is required');
    }
    if (!quizResponses.targetRole) {
      errors.push('Target role is required');
    }
  }

  // Validate profile data
  if (!profileData) {
    errors.push('Profile data is missing');
  } else {
    if (!profileData.userName) {
      errors.push('User name is required');
    }
    // yearExperience is optional for profile but good to have
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  generatePersonalizedRoadmap,
  generateRoadmapSafely,
  convertEvaluationResultsToQuizFormat,
  debugDecomposition,
  validateRoadmapGenerationInputs
};
