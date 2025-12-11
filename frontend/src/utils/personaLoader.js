/**
 * PERSONA LOADER - Simple utility to load persona JSON files
 *
 * No orchestration, no logic - just loads the persona JSON directly
 */

/**
 * Load persona data from JSON file using fetch
 * @param {string} personaId - Persona ID (e.g., 'tech_mid_backend')
 * @returns {Promise<Object>} Persona data
 */
export async function loadPersona(personaId) {
  try {
    // Use fetch to load persona JSON files from public folder
    // Next.js serves files from /public directly
    const response = await fetch(`/personas/${personaId}.json`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: File not found`);
    }

    const personaData = await response.json();

    if (!personaData) {
      throw new Error(`No data found in persona file: ${personaId}`);
    }

    console.log(`✅ Loaded persona: ${personaId}`);
    return personaData;
  } catch (error) {
    console.error('❌ Error loading persona:', error);
    throw new Error(`Failed to load persona '${personaId}': ${error.message}`);
  }
}

/**
 * Transform persona data to match roadmap-new.js component expectations
 * @param {Object} persona - Persona JSON data
 * @param {Array<string>} userSelectedSkills - Skills user selected in quiz
 * @returns {Object} Transformed data for frontend components
 */
export function transformPersonaForFrontend(persona, userSelectedSkills = []) {
  // SAFE: Get skillPriorities with proper null checking
  const skillPrioritiesData = persona?.skillMap?.skillPriorities;

  if (!skillPrioritiesData) {
    console.warn('⚠️ WARNING: skillPriorities not found in persona. Using empty arrays.');
  }

  const highPrioritySkills = skillPrioritiesData?.high || [];
  const mediumPrioritySkills = skillPrioritiesData?.medium || [];
  const lowPrioritySkills = skillPrioritiesData?.low || [];

  // Filter out selected skills from priorities
  const unselectedHigh = highPrioritySkills.filter(
    skill => !userSelectedSkills.includes(skill)
  );
  const unselectedMedium = mediumPrioritySkills.filter(
    skill => !userSelectedSkills.includes(skill)
  );
  const unselectedLow = lowPrioritySkills.filter(
    skill => !userSelectedSkills.includes(skill)
  );

  return {
    // Hero section
    targetRole: persona.meta.roleLabel,
    skillsToLearn: persona.hero.skillsToLearn,
    estimatedEffort: persona.hero.estimatedEffort,
    videoUrl: persona.hero.videoUrl,

    // Skill Map section - pass entire skillMap with all config
    skillMap: persona.skillMap,

    // Current skills (from user selection in quiz)
    currentSkills: userSelectedSkills,

    // Skill priorities for the table
    skillPriorities: {
      high: unselectedHigh,
      medium: unselectedMedium,
      low: unselectedLow
    },

    // Company insights (already in correct format)
    companyInsights: persona.companyInsights,

    // Learning path
    learningPath: persona.learningPath,

    // Projects
    projects: persona.projects
  };
}

/**
 * Transform persona data to match experimental roadmap component expectations
 * Maps persona JSON structure to what RoadmapNewExperimental expects
 * @param {Object} persona - Persona JSON data
 * @param {Array<string>} userSelectedSkills - Skills user selected in quiz
 * @returns {Object} Config object for experimental component
 */
export function transformPersonaForExperimental(persona, userSelectedSkills = []) {
  // DEBUG: Log persona structure
  console.log('🔄 transformPersonaForExperimental called with:');
  console.log('  persona keys:', Object.keys(persona || {}));
  console.log('  persona.learningPath:', persona?.learningPath);
  console.log('  persona.learningPath.phases:', persona?.learningPath?.phases);
  console.log('  persona.learningPath.phases.length:', persona?.learningPath?.phases?.length);

  // SAFE: Get skillPriorities with proper null checking
  const skillPrioritiesData = persona?.skillMap?.skillPriorities;

  if (!skillPrioritiesData) {
    console.warn('⚠️ WARNING: skillPriorities not found in persona. Using empty arrays.');
  }

  const highPrioritySkills = skillPrioritiesData?.high || [];
  const mediumPrioritySkills = skillPrioritiesData?.medium || [];
  const lowPrioritySkills = skillPrioritiesData?.low || [];

  // Filter out selected skills from priorities
  const unselectedHigh = highPrioritySkills.filter(
    skill => !userSelectedSkills.includes(skill)
  );
  const unselectedMedium = mediumPrioritySkills.filter(
    skill => !userSelectedSkills.includes(skill)
  );
  const unselectedLow = lowPrioritySkills.filter(
    skill => !userSelectedSkills.includes(skill)
  );

  // Get hero data - all personas should have consistent structure now
  const skillsToLearn = persona.hero?.skillsToLearn || 8;
  const estimatedEffort = persona.hero?.estimatedEffort;
  const videoUrl = persona.hero?.videoUrl;

  return {
    metadata: {
      roleLabel: persona.meta?.roleLabel,
      level: persona.meta?.level,
      userType: persona.meta?.userType,
      personaId: persona.meta?.personaId
    },

    hero: {
      title: persona.hero?.title,
      skillsToLearn: skillsToLearn,
      stats: {
        estimatedEffort: estimatedEffort
      },
      videoUrl: videoUrl
    },

    skillMap: {
      // Pass entire skillMap from persona including radarAxes, thresholds, and other config
      ...persona.skillMap,
      // Ensure axes field is also available for backward compatibility
      axes: persona.skillMap?.radarAxes || persona.skillMap?.axes
    },

    skillsGap: {
      title: 'Understand Where You Stand Right Now',
      description: 'Identify your skill gaps and focus on what matters most.'
    },

    currentSkills: userSelectedSkills,

    missingSkills: {
      highPriority: unselectedHigh,
      mediumPriority: unselectedMedium,
      lowPriority: unselectedLow
    },

    companyInsights: persona.companyInsights,

    learningPath: persona.learningPath,

    // Projects wrapped in object for ProjectsSection compatibility
    projects: {
      projects: persona.projects
    }
  };
}

/**
 * Map quiz responses to persona ID
 * Constructs persona ID from user type, level, and target role
 * @param {Object} quizResponses - Quiz responses from context
 * @returns {string} Persona ID (e.g., 'tech_mid_backend')
 */
export function getPersonaIdFromQuiz(quizResponses) {
  if (!quizResponses || !quizResponses.targetRole) {
    throw new Error('Missing required quiz responses: targetRole');
  }

  // Map user type
  const userType = quizResponses.background === 'non-tech' ? 'non_tech' : 'tech';

  // Map years of experience to level
  const yearsMap = {
    '0-2 years': 'junior',
    '2-5 years': 'mid',
    '5-10 years': 'senior',
    '10+ years': 'lead'
  };
  const level = yearsMap[quizResponses.yearsExperience] || 'mid';

  // Normalize role name
  const roleNormalized = quizResponses.targetRole
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  return `${userType}_${level}_${roleNormalized}`;
}
