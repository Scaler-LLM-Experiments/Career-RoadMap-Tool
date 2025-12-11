/**
 * PERSONA MERGER UTILITY
 * 
 * Loads and merges modular persona templates based on quiz responses.
 * 
 * Flow:
 * 1. Extract dimensions from quiz responses (role, level, userType, companyType)
 * 2. Load 4 modular template files in parallel
 * 3. Deep merge in priority order: role → level → userType → company
 * 4. Return complete merged persona
 */

/**
 * Deep merge utility - intelligently combines nested objects
 * Later values override earlier values
 */
function deepMerge(target = {}, source = {}) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (Array.isArray(source[key])) {
        // Arrays are replaced, not merged
        result[key] = source[key];
      } else if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        // Recursive merge for nested objects
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        // Primitive values are replaced
        result[key] = source[key];
      }
    }
  }
  return result;
}

/**
 * Extract dimensions from quiz responses
 */
function extractDimensions(quizResponses) {
  const role = extractRole(quizResponses.targetRole);
  const level = extractLevel(quizResponses.yearsOfExperience);
  const userType = quizResponses.background === 'non-tech' ? 'non-tech' : 'tech';
  const companyType = extractCompanyType(quizResponses.targetCompanyType);

  return { role, level, userType, companyType };
}

/**
 * Normalize role name to file name
 */
function extractRole(targetRole) {
  if (!targetRole) return 'backend'; // fallback
  
  const role = targetRole.toLowerCase().trim();
  
  const mapping = {
    'backend': 'backend',
    'backend engineer': 'backend',
    'frontend': 'frontend',
    'frontend engineer': 'frontend',
    'fullstack': 'fullstack',
    'full stack': 'fullstack',
    'full stack engineer': 'fullstack',
    'devops': 'devops',
    'devops engineer': 'devops',
    'data': 'data',
    'data engineer': 'data',
    'data science engineer': 'data',
  };

  if (mapping[role]) return mapping[role];
  
  // Partial match
  if (role.includes('backend')) return 'backend';
  if (role.includes('frontend')) return 'frontend';
  if (role.includes('fullstack') || role.includes('full stack')) return 'fullstack';
  if (role.includes('devops')) return 'devops';
  if (role.includes('data')) return 'data';
  
  return 'backend'; // Safe fallback
}

/**
 * Extract experience level from years
 */
function extractLevel(yearsOfExperience) {
  if (!yearsOfExperience) return 'mid'; // fallback

  const years = parseInt(yearsOfExperience);
  if (isNaN(years)) {
    const match = yearsOfExperience.match(/(\d+)/);
    if (match) {
      const minYears = parseInt(match[1]);
      if (minYears >= 5) return 'senior';
      if (minYears >= 3) return 'mid';
    }
    return 'entry';
  }

  if (years >= 5) return 'senior';
  if (years >= 3) return 'mid';
  return 'entry';
}

/**
 * Normalize company type
 */
function extractCompanyType(targetCompanyType) {
  if (!targetCompanyType) return 'startup'; // fallback

  const company = targetCompanyType.toLowerCase().trim();

  const mapping = {
    'startup': 'startup',
    'high-growth': 'startup',
    'scaleup': 'scaleup',
    'scaled': 'scaleup',
    'scale-up': 'scaleup',
    'unicorn': 'scaleup',
    'bigtech': 'bigtech',
    'big-tech': 'bigtech',
    'big tech': 'bigtech',
    'faang': 'bigtech',
    'service': 'service',
    'enterprise': 'service',
  };

  return mapping[company] || 'startup'; // fallback
}

/**
 * Load a single template file from public folder
 * Files are served as static assets from public/personas/
 */
async function loadTemplate(filePath) {
  try {
    // Fetch JSON files from public/personas/
    // Format: roles/backend.json → /personas/roles/backend.json
    const response = await fetch(`/personas/${filePath}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`❌ Failed to load /personas/${filePath}:`, error);
    throw new Error(`Cannot load template: ${filePath}`);
  }
}

/**
 * Load all 4 modular templates in parallel
 */
async function loadTemplates(dimensions) {
  const { role, level, userType, companyType } = dimensions;

  try {
    console.log('📦 Loading modular templates...');
    console.log(`   Role: ${role}, Level: ${level}, UserType: ${userType}, Company: ${companyType}`);

    const [roleTemplate, levelTemplate, userTypeTemplate, companyTemplate] = await Promise.all([
      loadTemplate(`roles/${role}.json`),
      loadTemplate(`levels/${level}.json`),
      loadTemplate(`user-types/${userType}.json`),
      loadTemplate(`company-types/${companyType}.json`),
    ]);

    console.log('✅ All templates loaded successfully');

    return {
      role: roleTemplate,
      level: levelTemplate,
      userType: userTypeTemplate,
      company: companyTemplate,
    };
  } catch (error) {
    console.error('❌ Error loading templates:', error);
    throw error;
  }
}

/**
 * Merge templates in priority order:
 * 1. Role (base knowledge)
 * 2. Level (experience customizations)
 * 3. UserType (background variants)
 * 4. Company (company-specific customizations)
 */
function mergeTemplates(templates) {
  console.log('🔄 Merging templates in priority order...');

  let merged = {};

  // Step 1: Apply role base
  merged = deepMerge(merged, templates.role);
  console.log('   ✓ Role merged');

  // Step 2: Apply level customizations
  merged = deepMerge(merged, templates.level);
  console.log('   ✓ Level merged');

  // Step 3: Apply user type variants
  merged = deepMerge(merged, templates.userType);
  console.log('   ✓ UserType merged');

  // Step 4: Apply company customizations
  merged = deepMerge(merged, templates.company);
  console.log('   ✓ Company merged');

  console.log('✅ Merge complete');

  return merged;
}

/**
 * Main function: Load and merge persona based on quiz responses
 * 
 * Usage:
 * const persona = await loadAndMergePersona(quizResponses);
 */
export async function loadAndMergePersona(quizResponses) {
  if (!quizResponses) {
    throw new Error('Quiz responses required');
  }

  console.log('🚀 Starting persona generation from quiz responses...');
  console.log('   Quiz responses:', quizResponses);

  try {
    // Step 1: Extract dimensions
    const dimensions = extractDimensions(quizResponses);
    console.log('📍 Dimensions extracted:', dimensions);

    // Step 2: Load templates
    const templates = await loadTemplates(dimensions);

    // Step 3: Merge templates
    const mergedPersona = mergeTemplates(templates);

    console.log('✅ Persona generated successfully');
    console.log('   Role:', mergedPersona.meta?.roleLabel);
    console.log('   Skills to learn:', mergedPersona.hero?.skillsToLearn);
    console.log('   Radar axes:', mergedPersona.skillMap?.radarAxes?.length || 0);

    return mergedPersona;
  } catch (error) {
    console.error('❌ Error generating persona:', error);
    throw error;
  }
}

export default loadAndMergePersona;
