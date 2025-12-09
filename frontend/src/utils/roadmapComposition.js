/**
 * ROADMAP COMPOSITION ENGINE
 *
 * Orchestrates the composition of modular persona templates into a complete roadmap configuration.
 *
 * Architecture:
 * 1. Load modular templates (role, level, userType, companyType)
 * 2. Deep merge templates in priority order
 * 3. Apply user-data-driven overrides
 * 4. Enrich with calculated values
 * 5. Return complete roadmap config
 *
 * Order of precedence (later overrides earlier):
 * role → level → userType → companyType → user data overrides
 */

import { deepMerge, applyUserDataOverrides, enrichRoadmapConfig } from './compositionHelpers';

/**
 * Load a template file dynamically
 * @param {string} type - Template type (role, level, userType, companyType)
 * @param {string} name - Template name (e.g., 'backend', 'entry', 'tech_professional', 'startup')
 * @returns {Promise<Object>} Loaded template configuration
 */
async function loadTemplate(type, name) {
  try {
    const templatePath = `/configs/personas/${type}/${name}.json`;
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${type}/${name}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Warning: Could not load ${type}/${name} template`, error);
    return {}; // Return empty object if template not found
  }
}

/**
 * Main composition function
 *
 * Takes modular persona components and assembles them into a complete roadmap config
 *
 * @param {Object} modularPersona - Decomposed persona with role, level, userType, companyType
 * @param {string} modularPersona.role - e.g., 'backend', 'frontend', 'fullstack'
 * @param {string} modularPersona.level - e.g., 'entry', 'mid', 'senior'
 * @param {string} modularPersona.userType - e.g., 'tech_professional', 'career_switcher'
 * @param {string} modularPersona.companyType - e.g., 'startup', 'scaleup', 'bigtech', 'service'
 *
 * @param {Object} quizResponses - User's quiz responses containing all selections
 * @param {Array<string>} quizResponses.currentSkills - Selected current skills
 * @param {string} quizResponses.timeline - Selected timeline preference
 * @param {number} quizResponses.problemSolving - 0-100 scale for problem-solving confidence
 * @param {string} quizResponses.systemDesign - 'not-yet', 'learning', 'once', 'multiple'
 * @param {string} quizResponses.portfolio - 'none', 'inactive', 'limited-1-5', 'active-5+'
 * @param {number} quizResponses.timePerWeek - Hours per week user can dedicate
 *
 * @param {Object} profileData - User profile from Free Profile Evaluator
 * @param {string} profileData.userName - User's name
 * @param {string} profileData.targetRole - Target role
 * @param {string} profileData.yearsExperience - Years of experience
 * @param {string} profileData.targetCompanyType - Target company type
 *
 * @returns {Promise<Object>} Complete roadmap configuration ready for rendering
 */
export async function composeRoadmapConfig(modularPersona, quizResponses, profileData) {
  console.log('🔧 Starting roadmap composition...', {
    modularPersona,
    quizResponses,
    profileData
  });

  try {
    // STEP 1: Load all modular templates
    console.log('📥 Loading modular templates...');
    const [roleTemplate, levelTemplate, userTypeTemplate, companyTypeTemplate] = await Promise.all([
      loadTemplate('roles', modularPersona.role),
      loadTemplate('levels', modularPersona.level),
      loadTemplate('user-types', modularPersona.userType),
      modularPersona.companyType ? loadTemplate('company-types', modularPersona.companyType) : Promise.resolve({})
    ]);

    console.log('✅ Templates loaded', {
      role: roleTemplate.metadata?.title,
      level: levelTemplate.metadata?.yearsRange,
      userType: userTypeTemplate.metadata?.label,
      companyType: companyTypeTemplate.metadata?.label
    });

    // STEP 2: Deep merge templates in priority order
    console.log('🔀 Merging templates in priority order...');
    let composedConfig = {};
    composedConfig = deepMerge(composedConfig, roleTemplate);          // 1. Role base
    composedConfig = deepMerge(composedConfig, levelTemplate);          // 2. Level overrides
    composedConfig = deepMerge(composedConfig, userTypeTemplate);       // 3. User type overrides
    composedConfig = deepMerge(composedConfig, companyTypeTemplate);    // 4. Company type overrides

    console.log('✅ Templates merged successfully');

    // STEP 3: Apply user-data-driven overrides
    console.log('🎯 Applying user-data overrides...');
    composedConfig = applyUserDataOverrides(composedConfig, quizResponses, modularPersona);

    console.log('✅ User data overrides applied');

    // STEP 4: Inject profile data into hero section
    console.log('👤 Personalizing hero section with profile data...');
    if (composedConfig.hero) {
      composedConfig.hero.greeting = composedConfig.hero.greeting.replace('{userName}', profileData.userName);
      composedConfig.hero.title = composedConfig.hero.title.replace('{role}', modularPersona.role);
    }

    // STEP 5: Enrich with calculated values
    console.log('📊 Enriching with calculated values...');
    composedConfig = enrichRoadmapConfig(composedConfig, quizResponses, profileData);

    console.log('✅ Enrichment complete');

    // STEP 6: Add metadata for tracking
    composedConfig.metadata = {
      generatedAt: new Date().toISOString(),
      modularPersona,
      quizResponses,
      profileData
    };

    console.log('✨ Roadmap composition complete!', composedConfig);
    return composedConfig;

  } catch (error) {
    console.error('❌ Error during roadmap composition:', error);
    throw new Error(`Failed to compose roadmap: ${error.message}`);
  }
}

/**
 * Compose roadmap with caching to avoid reloading templates
 *
 * @param {Object} modularPersona
 * @param {Object} quizResponses
 * @param {Object} profileData
 * @param {Object} templateCache - Optional cache object to store loaded templates
 * @returns {Promise<Object>} Complete roadmap configuration
 */
export async function composeRoadmapConfigWithCache(
  modularPersona,
  quizResponses,
  profileData,
  templateCache = {}
) {
  const cacheKey = `${modularPersona.role}_${modularPersona.level}_${modularPersona.userType}_${modularPersona.companyType}`;

  // Return cached result if available
  if (templateCache[cacheKey]) {
    console.log('💾 Using cached roadmap config');
    return templateCache[cacheKey];
  }

  // Compose new config
  const composedConfig = await composeRoadmapConfig(modularPersona, quizResponses, profileData);

  // Cache the result
  templateCache[cacheKey] = composedConfig;

  return composedConfig;
}

export default {
  composeRoadmapConfig,
  composeRoadmapConfigWithCache,
  loadTemplate
};
