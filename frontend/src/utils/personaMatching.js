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
 * DEPRECATED - Use RoadmapCompositionOrchestrator instead
 *
 * Kept for backward compatibility only
 * New system uses modular decomposition which has NO FALLBACKS
 */
export const findMatchingPersona = async (quizResponses) => {
  console.warn('⚠️ findMatchingPersona is deprecated. Use RoadmapCompositionOrchestrator instead.');

  // Validate required fields
  if (!quizResponses || !quizResponses.userType || !quizResponses.targetRole) {
    throw new Error('Invalid quiz responses: missing userType or targetRole');
  }

  // NO FALLBACKS - let it throw if data is invalid
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

  // REMOVED: No fallbacks - throw error if match is weak
  if (!bestPersona || highestScore < 30) {
    throw new Error(`No suitable persona found. Best score: ${highestScore}. Use modular composition instead.`);
  }

  console.log('Selected persona:', bestPersona?.id, 'with score:', highestScore);
  return bestPersona;
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
 * NOW USES MODULAR COMPOSITION ORCHESTRATOR
 *
 * Takes quiz responses and returns fully personalized, enriched roadmap config
 * All data flows through modular composition system - NO FALLBACKS
 */
export const getPersonalizedRoadmapConfig = async (quizResponses, profileData = {}) => {
  try {
    // Import the new orchestrator
    const { generatePersonalizedRoadmap } = await import('./RoadmapCompositionOrchestrator');

    console.log('🚀 Using RoadmapCompositionOrchestrator for modular composition');

    // Use new modular composition system - NO FALLBACKS
    const result = await generatePersonalizedRoadmap(quizResponses, profileData);

    if (!result.success) {
      throw new Error('Modular composition failed');
    }

    return result.data;
  } catch (error) {
    console.error('❌ Error generating personalized roadmap:', error);
    throw error;
  }
};

/**
 * Load persona config file dynamically
 * DEPRECATED - Use RoadmapCompositionOrchestrator instead
 *
 * Throws error if config cannot be loaded - NO SILENT FAILURES
 */
export const loadPersonaConfig = async (personaId) => {
  try {
    // Fetch from API endpoint
    const response = await fetch(`/api/config/persona/${personaId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to load persona config for ${personaId}`);
    }
    return await response.json();
  } catch (error) {
    // NO FALLBACKS - throw the error, don't silently return null
    throw new Error(`Failed to load persona config for ${personaId}: ${error.message}`);
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

/**
 * DECOMPOSE TO MODULAR PERSONA
 *
 * Converts a persona ID or quiz responses into modular components
 * that can be used to compose a roadmap from templates
 *
 * Maps the 16 personas to role/level/userType/companyType combinations:
 *
 * TECH PROFESSIONALS:
 * - tech_entry_backend → role:backend, level:entry, userType:tech_professional
 * - tech_entry_frontend → role:frontend, level:entry, userType:tech_professional
 * - tech_entry_fullstack → role:fullstack, level:entry, userType:tech_professional
 * - tech_mid_backend → role:backend, level:mid, userType:tech_professional
 * - tech_mid_frontend → role:frontend, level:mid, userType:tech_professional
 * - tech_mid_fullstack → role:fullstack, level:mid, userType:tech_professional
 * - tech_senior_backend → role:backend, level:senior, userType:tech_professional
 * - tech_senior_frontend → role:frontend, level:senior, userType:tech_professional
 *
 * CAREER SWITCHERS:
 * - switcher_early_backend → role:backend, level:entry, userType:career_switcher
 * - switcher_early_frontend → role:frontend, level:entry, userType:career_switcher
 * - switcher_advanced_backend → role:backend, level:mid, userType:career_switcher
 * - switcher_advanced_frontend → role:frontend, level:mid, userType:career_switcher
 * - (4 more advanced variants for fullstack and data)
 *
 * Company type is extracted from quiz responses
 *
 * @param {string|Object} personaOrResponses - Either persona ID string or quiz responses object
 * @returns {Object} Modular persona with { role, level, userType, companyType }
 */
export const decomposeToModularPersona = (personaOrResponses) => {
  // Mapping of persona IDs to modular components
  const personaDecomposition = {
    'tech_entry_backend': { role: 'backend', level: 'entry', userType: 'tech_professional' },
    'tech_entry_frontend': { role: 'frontend', level: 'entry', userType: 'tech_professional' },
    'tech_entry_fullstack': { role: 'fullstack', level: 'entry', userType: 'tech_professional' },
    'tech_mid_backend': { role: 'backend', level: 'mid', userType: 'tech_professional' },
    'tech_mid_frontend': { role: 'frontend', level: 'mid', userType: 'tech_professional' },
    'tech_mid_fullstack': { role: 'fullstack', level: 'mid', userType: 'tech_professional' },
    'tech_senior_backend': { role: 'backend', level: 'senior', userType: 'tech_professional' },
    'tech_senior_frontend': { role: 'frontend', level: 'senior', userType: 'tech_professional' },
    'tech_senior_fullstack': { role: 'fullstack', level: 'senior', userType: 'tech_professional' },
    'switcher_early_backend': { role: 'backend', level: 'entry', userType: 'career_switcher' },
    'switcher_early_frontend': { role: 'frontend', level: 'entry', userType: 'career_switcher' },
    'switcher_early_fullstack': { role: 'fullstack', level: 'entry', userType: 'career_switcher' },
    'switcher_advanced_backend': { role: 'backend', level: 'mid', userType: 'career_switcher' },
    'switcher_advanced_frontend': { role: 'frontend', level: 'mid', userType: 'career_switcher' },
    'switcher_advanced_fullstack': { role: 'fullstack', level: 'mid', userType: 'career_switcher' },
    'switcher_advanced_data': { role: 'data', level: 'mid', userType: 'career_switcher' }
  };

  let personaId = null;
  let companyType = null;

  // Case 1: Persona ID string provided
  if (typeof personaOrResponses === 'string') {
    personaId = personaOrResponses;
  }
  // Case 2: Quiz responses object provided - find matching persona first
  else if (typeof personaOrResponses === 'object' && personaOrResponses !== null) {
    const quizResponses = personaOrResponses;

    // Extract company type from responses
    companyType = mapCompanyTypeFromResponses(quizResponses);

    // If persona ID is provided in responses, use it
    if (quizResponses.selectedPersonaId) {
      personaId = quizResponses.selectedPersonaId;
    } else {
      // Otherwise, build persona ID from quiz responses
      personaId = buildPersonaIdFromResponses(quizResponses);
    }
  }

  if (!personaId) {
    throw new Error('Could not determine persona ID from input');
  }

  const decomposed = personaDecomposition[personaId];

  if (!decomposed) {
    // NO FALLBACKS - throw error instead
    throw new Error(`Unknown persona ID: ${personaId}. Cannot decompose.`);
  }

  // Add company type if extracted from responses
  if (companyType) {
    decomposed.companyType = companyType;
  }

  console.log('✅ Decomposed persona:', decomposed);
  return decomposed;
};

/**
 * Helper: Build persona ID from quiz responses
 * Constructs the persona ID based on the user's quiz answers
 */
const buildPersonaIdFromResponses = (quizResponses) => {
  const userType = quizResponses.userType || 'tech_professional';
  const yearsExp = quizResponses.yearsOfExperience || '0-2';
  const targetRole = quizResponses.targetRole || 'backend';

  let level = 'entry';
  if (yearsExp === '5-7' || yearsExp === '7+' || yearsExp === '8+') {
    level = 'senior';
  } else if (yearsExp === '3-5') {
    level = 'mid';
  }

  // Map targetRole to role ID (backend, frontend, fullstack, etc)
  let role = 'backend';
  if (targetRole.toLowerCase().includes('frontend')) {
    role = 'frontend';
  } else if (targetRole.toLowerCase().includes('fullstack') || targetRole.toLowerCase().includes('full-stack')) {
    role = 'fullstack';
  }

  // Build persona ID
  if (userType === 'career_switcher') {
    if (level === 'entry') {
      return `switcher_early_${role}`;
    } else if (level === 'mid') {
      return `switcher_advanced_${role}`;
    } else {
      // NO FALLBACKS - throw instead
      throw new Error(`Invalid level for career_switcher: ${level}`);
    }
  } else {
    return `tech_${level}_${role}`;
  }
};

/**
 * Helper: Map company type from quiz responses
 * Extracts the company type from targetCompanyType field
 */
const mapCompanyTypeFromResponses = (quizResponses) => {
  const companyType = quizResponses.targetCompanyType || quizResponses.companyType;

  if (!companyType) {
    return null;
  }

  const lowerCase = companyType.toLowerCase();

  // Map various company type names to canonical values
  if (lowerCase.includes('startup') && !lowerCase.includes('scale')) {
    return 'startup';
  }
  if (lowerCase.includes('scale') || lowerCase.includes('unicorn')) {
    return 'scaleup';
  }
  if (lowerCase.includes('faang') || lowerCase.includes('big') || lowerCase.includes('google') ||
      lowerCase.includes('amazon') || lowerCase.includes('microsoft') || lowerCase.includes('meta') ||
      lowerCase.includes('apple')) {
    return 'bigtech';
  }
  if (lowerCase.includes('service') || lowerCase.includes('consulting')) {
    return 'service';
  }

  return null;
};

/**
 * Decompose persona with full validation
 * REMOVED FALLBACK - Now throws on any error
 * Use RoadmapCompositionOrchestrator.decomposeToModularPersona instead
 */
export const decomposeToModularPersonaWithValidation = (personaOrResponses) => {
  // NO FALLBACKS - Let errors propagate
  const decomposed = decomposeToModularPersona(personaOrResponses);

  return {
    valid: true,
    decomposed,
    errors: []
  };
};
