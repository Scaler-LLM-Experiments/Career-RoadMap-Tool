/**
 * PERSONA MATCHING ENGINE
 * Matches quiz responses to appropriate persona and loads configuration
 *
 * ARCHITECTURE:
 * 1. Quiz responses from Free Profile Evaluator come in
 * 2. Calculate match score for each of 12 personas
 * 3. Select best matching persona
 * 4. Load persona config with company type tweaks
 * 5. Return assembled roadmap config
 */

// Load persona matching config - using require to handle JSON in Next.js
let personaMatching = null;

try {
  personaMatching = require('../configs/personaMatching.json');
} catch (error) {
  console.warn('Failed to load personaMatching.json on server-side:', error);
  // Will be loaded client-side instead
}

/**
 * Ensure personaMatching is loaded
 * If not loaded on server, fetch it
 */
const ensurePersonaMatchingLoaded = async () => {
  if (!personaMatching) {
    try {
      const response = await fetch('/personaMatching.json');
      personaMatching = await response.json();
    } catch (error) {
      console.error('Failed to load personaMatching.json:', error);
      throw new Error('Could not load persona matching configuration');
    }
  }
  return personaMatching;
};

/**
 * Calculate how well quiz responses match a persona
 * Returns score from 0-100
 */
export const calculatePersonaMatchScore = (quizResponses, persona) => {
  const criteria = persona.matching_criteria;
  let matchedCriteria = 0;
  let totalCriteria = 0;

  // Check each matching criteria
  const criteriaWeights = {
    userType: 0.30,
    yearsOfExperience: 0.25,
    targetRole: 0.35,
    requirementType: 0.10
  };

  // User Type matching
  if (criteria.userType) {
    totalCriteria += criteriaWeights.userType;
    if (criteria.userType.includes(quizResponses.userType)) {
      matchedCriteria += criteriaWeights.userType;
    }
  }

  // Years of Experience matching
  if (criteria.yearsOfExperience) {
    totalCriteria += criteriaWeights.yearsOfExperience;
    if (criteria.yearsOfExperience.includes(quizResponses.yearsOfExperience)) {
      matchedCriteria += criteriaWeights.yearsOfExperience;
    }
  }

  // Target Role matching
  if (criteria.targetRole) {
    totalCriteria += criteriaWeights.targetRole;
    if (criteria.targetRole.includes(quizResponses.targetRole)) {
      matchedCriteria += criteriaWeights.targetRole;
    }
  }

  // Requirement Type matching
  if (criteria.requirementType) {
    totalCriteria += criteriaWeights.requirementType;
    if (criteria.requirementType.includes(quizResponses.requirementType)) {
      matchedCriteria += criteriaWeights.requirementType;
    }
  }

  // Calculate percentage
  const score = totalCriteria > 0 ? (matchedCriteria / totalCriteria) * 100 : 0;
  return Math.round(score);
};

/**
 * Find the best matching persona from quiz responses
 * Implements fallback logic for edge cases
 */
export const findMatchingPersona = async (quizResponses) => {
  // Validate required fields
  if (!quizResponses || !quizResponses.userType || !quizResponses.targetRole) {
    console.warn('Invalid quiz responses for persona matching:', quizResponses);
    return null;
  }

  // Ensure config is loaded
  const config = await ensurePersonaMatchingLoaded();
  const personas = config.persona_definitions;
  const scores = {};

  // Calculate score for each persona
  Object.values(personas).forEach((persona) => {
    scores[persona.id] = calculatePersonaMatchScore(quizResponses, persona);
  });

  // Find highest score
  let bestPersona = null;
  let highestScore = -1;

  Object.entries(scores).forEach(([personaId, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestPersona = personas[personaId];
    }
  });

  // Edge case: no persona matched well
  if (highestScore < 30) {
    console.warn('Weak persona match. Score:', highestScore);
    // Fallback: match on targetRole alone
    bestPersona = await fallbackToTargetRole(quizResponses.targetRole, quizResponses.userType);
  }

  console.log('Selected persona:', bestPersona?.id, 'with score:', highestScore);
  return bestPersona;
};

/**
 * Fallback: match persona by target role only
 */
const fallbackToTargetRole = async (targetRole, userType) => {
  const config = await ensurePersonaMatchingLoaded();
  const personas = config.persona_definitions;

  // Priority: match user type first, then target role
  const matching = Object.values(personas).find(
    (p) => p.matching_criteria.userType?.includes(userType) &&
           p.matching_criteria.targetRole?.some(role =>
             targetRole.toLowerCase().includes(role.toLowerCase())
           )
  );

  // If no exact match, just match target role
  if (!matching) {
    return Object.values(personas).find(
      (p) => p.matching_criteria.targetRole?.some(role =>
        targetRole.toLowerCase().includes(role.toLowerCase())
      )
    );
  }

  return matching;
};

/**
 * Apply company type tweaks to persona config
 * Modifies specific sections based on company type preference
 */
export const applyCompanyTypeTweaks = (personaConfig, companyType) => {
  if (!companyType || !personaConfig) {
    return personaConfig;
  }

  const tweakedConfig = JSON.parse(JSON.stringify(personaConfig)); // Deep clone
  const companyTypeKey = `if_companyType`;

  /**
   * Recursively find and apply company type tweaks
   * if_companyType fields override default values when matched
   */
  const applyTweaks = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;

    Object.keys(obj).forEach((key) => {
      if (key === companyTypeKey && obj[key][companyType]) {
        // Found company type tweaks that match
        const tweaks = obj[key][companyType];

        // Apply modifications from tweaks
        Object.keys(tweaks).forEach((tweakKey) => {
          if (tweakKey !== 'emphasis' && tweakKey !== 'skipTopics') {
            obj[tweakKey] = tweaks[tweakKey];
          }
        });

        // Clean up the if_companyType field
        delete obj[companyTypeKey];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recurse into nested objects
        applyTweaks(obj[key]);
      }
    });
  };

  applyTweaks(tweakedConfig);
  return tweakedConfig;
};

/**
 * Main function: Get complete roadmap config for a user
 * Takes quiz responses and returns personalized roadmap
 */
export const getPersonalizedRoadmapConfig = async (quizResponses) => {
  try {
    console.log('🚀 Starting getPersonalizedRoadmapConfig with:', quizResponses);

    // Step 1: Find matching persona
    const personaDefinition = await findMatchingPersona(quizResponses);
    console.log('📊 Found persona definition:', personaDefinition);

    if (!personaDefinition) {
      throw new Error('Could not find matching persona for quiz responses');
    }

    console.log('✓ Persona matched:', personaDefinition.id);

    // Step 2: Load persona config file
    const personaConfig = await loadPersonaConfig(personaDefinition.id);
    console.log('📦 Loaded persona config:', personaConfig?.metadata?.label);

    if (!personaConfig) {
      throw new Error(`Could not load config for persona: ${personaDefinition.id}`);
    }

    // Step 3: Apply company type tweaks if provided
    let finalConfig = personaConfig;
    if (quizResponses.targetCompanyType) {
      console.log('🎯 Applying company type tweaks for:', quizResponses.targetCompanyType);
      finalConfig = applyCompanyTypeTweaks(personaConfig, quizResponses.targetCompanyType);
    }

    // Step 4: Add metadata
    finalConfig.metadata = finalConfig.metadata || {};
    finalConfig.metadata.selectedPersonaId = personaDefinition.id;
    finalConfig.metadata.selectedPersonaLabel = personaDefinition.label;
    finalConfig.metadata.generatedAt = new Date().toISOString();
    finalConfig.metadata.quizResponses = quizResponses; // Store for reference

    console.log('✅ Final config ready:', finalConfig.metadata);
    return finalConfig;
  } catch (error) {
    console.error('❌ Error generating personalized roadmap:', error);
    throw error;
  }
};

/**
 * Load persona config file dynamically
 * Supports both development and production environments
 */
export const loadPersonaConfig = async (personaId) => {
  try {
    // Fetch from API endpoint
    const response = await fetch(`/api/config/persona/${personaId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to load persona config for ${personaId}:`, error);
    return null;
  }
};

/**
 * Validate quiz responses before persona matching
 * Returns validation result with any errors
 */
export const validateQuizResponses = (quizResponses) => {
  const requiredFields = ['userType', 'yearsOfExperience', 'targetRole'];
  const errors = [];

  if (!quizResponses) {
    return {
      valid: false,
      errors: ['Quiz responses not provided']
    };
  }

  requiredFields.forEach((field) => {
    if (!quizResponses[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate specific field values
  const validUserTypes = ['tech_professional', 'career_switcher'];
  if (quizResponses.userType && !validUserTypes.includes(quizResponses.userType)) {
    errors.push(`Invalid userType: ${quizResponses.userType}`);
  }

  const validYearsRanges = ['0-2', '2-3', '3-5', '5-7', '7+', '10+', 'none'];
  if (quizResponses.yearsOfExperience && !validYearsRanges.includes(quizResponses.yearsOfExperience)) {
    errors.push(`Invalid yearsOfExperience: ${quizResponses.yearsOfExperience}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get all available personas for debugging/admin purposes
 */
export const getAllPersonas = () => {
  return Object.values(personaMatching.persona_definitions);
};

/**
 * Get persona details by ID
 */
export const getPersonaById = (personaId) => {
  return personaMatching.persona_definitions[personaId] || null;
};

/**
 * TEST UTILITY: Debug persona matching for quiz responses
 * Shows scores for all personas
 */
export const debugPersonaMatching = (quizResponses) => {
  const personas = personaMatching.persona_definitions;
  const results = {};

  Object.values(personas).forEach((persona) => {
    results[persona.id] = {
      label: persona.label,
      score: calculatePersonaMatchScore(quizResponses, persona),
      criteria: persona.matching_criteria
    };
  });

  return results;
};
