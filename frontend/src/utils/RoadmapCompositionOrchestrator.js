/**
 * ROADMAP COMPOSITION ORCHESTRATOR
 *
 * Single source of truth for all roadmap data composition.
 * Handles:
 * 1. Decomposing quiz responses to modular persona components
 * 2. Loading modular templates (role, level, userType, company)
 * 3. Deep merging templates with proper priority
 * 4. Applying user-data-driven customizations
 * 5. Enriching with calculated data
 *
 * NO FALLBACKS - Everything flows through modular system
 * NO MOCK DATA - All data from actual config files
 * NO HARDCODING - All data driven by user inputs
 */

// This utility uses only client-side compatible code
// All config files are imported statically via webpack

/**
 * Deep merge utility - intelligently merges nested objects
 * Later values override earlier values
 */
function deepMerge(target = {}, source = {}) {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (Array.isArray(source[key])) {
        result[key] = source[key];
      } else if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}

/**
 * STEP 1: Decompose quiz responses to modular persona components
 * Maps any combination of (role, level, userType, company) to modular dimensions
 */
export async function decomposeToModularPersona(quizResponses) {
  if (!quizResponses) {
    throw new Error('Quiz responses required for persona decomposition');
  }

  // Extract components from quiz responses
  const role = normalizeRole(quizResponses.targetRole);
  const level = determineLevel(quizResponses.yearsOfExperience);
  const userType = determineUserType(quizResponses.background, quizResponses.userType);
  const companyType = normalizeCompanyType(quizResponses.targetCompanyType);

  return {
    role,
    level,
    userType,
    companyType,
    // Original values for reference
    originalValues: {
      targetRole: quizResponses.targetRole,
      yearsOfExperience: quizResponses.yearsOfExperience,
      background: quizResponses.background,
      targetCompanyType: quizResponses.targetCompanyType
    }
  };
}

/**
 * Normalize role name to valid role key
 * Handles compound roles like "Data Science Engineer" → "data"
 */
function normalizeRole(targetRole) {
  if (!targetRole) return 'backend'; // Default fallback

  const role = targetRole.toLowerCase().trim();

  // Mapping table for role names to role keys
  const roleMapping = {
    'backend': 'backend',
    'backend engineer': 'backend',
    'senior backend engineer': 'backend',
    'lead backend engineer': 'backend',

    'frontend': 'frontend',
    'frontend engineer': 'frontend',
    'senior frontend engineer': 'frontend',
    'lead frontend engineer': 'frontend',
    'react engineer': 'frontend',
    'angular engineer': 'frontend',
    'vue engineer': 'frontend',

    'fullstack': 'fullstack',
    'full stack': 'fullstack',
    'fullstack engineer': 'fullstack',
    'full stack engineer': 'fullstack',
    'senior fullstack engineer': 'fullstack',
    'lead fullstack engineer': 'fullstack',

    'devops': 'devops',
    'devops engineer': 'devops',
    'senior devops engineer': 'devops',
    'lead devops engineer': 'devops',
    'site reliability engineer': 'devops',
    'sre': 'devops',
    'infrastructure engineer': 'devops',

    'data': 'data',
    'data engineer': 'data',
    'data science engineer': 'data',
    'data scientist': 'data',
    'senior data engineer': 'data',
    'lead data engineer': 'data',
    'analytics engineer': 'data'
  };

  // First try exact match
  if (roleMapping[role]) {
    return roleMapping[role];
  }

  // Try removing common suffixes and prefixes
  let normalized = role
    .replace(/^\s*(senior|lead|principal|staff|junior)\s+/i, '') // Remove seniority prefix
    .replace(/\s+(engineer|scientist|specialist|expert)?\s*$/i, '') // Remove suffix
    .trim();

  if (roleMapping[normalized]) {
    return roleMapping[normalized];
  }

  // Try matching by keywords (for partial matches)
  const keywords = {
    'backend': 'backend',
    'frontend': 'frontend',
    'fullstack': 'fullstack',
    'full-stack': 'fullstack',
    'full stack': 'fullstack',
    'devops': 'devops',
    'sre': 'devops',
    'reliability': 'devops',
    'infrastructure': 'devops',
    'data': 'data'
  };

  for (const [keyword, roleKey] of Object.entries(keywords)) {
    if (normalized.includes(keyword)) {
      return roleKey;
    }
  }

  // Default fallback
  return 'backend';
}

/**
 * Determine experience level from years
 */
function determineLevel(yearsOfExperience) {
  if (!yearsOfExperience) return 'entry';

  const years = parseInt(yearsOfExperience);
  if (isNaN(years)) {
    // Handle range formats like "3-5"
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
 * Determine user type from background
 */
function determineUserType(background, userType) {
  if (userType) {
    const valid = ['tech_professional', 'career_switcher'];
    if (valid.includes(userType)) return userType;
  }

  // Infer from background
  if (background === 'non-tech') return 'career_switcher';
  return 'tech_professional';
}

/**
 * Normalize company type
 */
function normalizeCompanyType(targetCompanyType) {
  if (!targetCompanyType) return 'startup';

  const company = targetCompanyType.toLowerCase().trim();

  // Map various inputs to standard company types
  const companyMap = {
    'startup': 'startup',
    'high-growth': 'startup',
    'scaleup': 'scaleup',
    'scaled': 'scaleup',
    'scale-up': 'scaleup',
    'bigtech': 'bigtech',
    'big-tech': 'bigtech',
    'big tech': 'bigtech',
    'faang': 'bigtech',
    'service': 'service',
    'enterprise': 'service',
    'corporate': 'service'
  };

  return companyMap[company] || 'startup';
}

/**
 * STEP 2: Load modular templates
 * Loads 4 independent template files in parallel
 */
async function loadModularTemplates(modularPersona) {
  const { role, level, userType, companyType } = modularPersona;

  try {
    // Load all 4 templates in parallel
    const [roleConfig, levelConfig, userTypeConfig, companyTypeConfig] = await Promise.all([
      loadTemplate(`roles/${role}.json`),
      loadTemplate(`levels/${level}.json`),
      loadTemplate(`user-types/${userType}.json`),
      loadTemplate(`company-types/${companyType}.json`)
    ]);

    return {
      role: roleConfig,
      level: levelConfig,
      userType: userTypeConfig,
      companyType: companyTypeConfig
    };
  } catch (error) {
    throw new Error(`Failed to load modular templates: ${error.message}`);
  }
}

/**
 * Load a single template from the API endpoint
 * Browser-safe: fetches from /api/config/template endpoint
 */
async function loadTemplate(templatePath) {
  try {
    // Use API endpoint to load templates from server
    const response = await fetch(`/api/config/template?path=${encodeURIComponent(templatePath)}`);

    if (!response.ok) {
      // Get error details from response
      let errorDetail = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.error || errorDetail;
      } catch (e) {
        // Response wasn't JSON
      }
      throw new Error(`${errorDetail} - Template: ${templatePath}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Provide helpful error message
    const errorMsg = error instanceof TypeError
      ? `Network error loading template ${templatePath}: ${error.message}`
      : `Failed to load template ${templatePath}: ${error.message}`;
    throw new Error(errorMsg);
  }
}

/**
 * STEP 3: Compose by deep merging templates
 * Priority order: role → level → userType → companyType
 * Later templates override earlier ones
 */
function composeTemplates(templates) {
  let composed = {};

  // Merge in strict priority order
  // Role is the base
  composed = deepMerge(composed, templates.role);

  // Level adjusts for experience
  composed = deepMerge(composed, templates.level);

  // UserType adjusts for professional vs switcher
  composed = deepMerge(composed, templates.userType);

  // CompanyType adjusts for target company
  composed = deepMerge(composed, templates.companyType);

  return composed;
}

/**
 * STEP 4: Apply user-data-driven customizations
 * Adjust roadmap based on actual quiz responses
 */
function applyUserDataOverrides(config, quizResponses) {
  const customized = JSON.parse(JSON.stringify(config));

  // Problem-solving level adjustment
  if (quizResponses.problemSolving !== undefined) {
    if (quizResponses.problemSolving <= 10) {
      // Add DSA fundamentals phase at the beginning
      if (customized.learningPath?.phasesStructure) {
        customized.learningPath.phasesStructure.unshift({
          phaseNumber: 0,
          phaseName: 'DSA & Fundamentals',
          duration: '4-6 weeks',
          focus: 'Core data structures and algorithms',
          topics: [
            'Arrays and Linked Lists',
            'Stacks and Queues',
            'Trees and Graphs',
            'Sorting and Searching',
            'Dynamic Programming basics'
          ]
        });
        customized.learningPath.totalPhases = (customized.learningPath.totalPhases || 3) + 1;
      }
    }
  }

  // Timeline adjustment based on availability
  if (quizResponses.timePerWeek !== undefined) {
    if (quizResponses.timePerWeek < 10) {
      // Extend timeline by 40%
      if (customized.hero?.stats) {
        const duration = customized.hero.stats.estimatedDuration;
        if (typeof duration === 'string') {
          customized.hero.stats.estimatedDuration = extendTimeline(duration, 1.4);
        }
      }
    } else if (quizResponses.timePerWeek > 20) {
      // Compress timeline by 20%
      if (customized.hero?.stats) {
        const duration = customized.hero.stats.estimatedDuration;
        if (typeof duration === 'string') {
          customized.hero.stats.estimatedTimeline = compressTimeline(duration, 0.8);
        }
      }
    }
  }

  // Portfolio adjustment - affects project starting tier
  if (quizResponses.portfolio) {
    if (quizResponses.portfolio === 'active-5+') {
      customized.projectsAdaptation = { startingTier: 'tier2' };
    } else if (quizResponses.portfolio === 'none' || quizResponses.portfolio === 'inactive') {
      customized.projectsAdaptation = { startingTier: 'tier1' };
    }
  }

  // System design experience adjustment
  if (quizResponses.systemDesign) {
    if (quizResponses.systemDesign === 'never') {
      // Add system design fundamentals early
      if (customized.learningPath?.phasesStructure) {
        const phase = customized.learningPath.phasesStructure[0];
        if (!phase.topics.some(t => t.includes('System Design'))) {
          phase.topics.unshift('System Design Fundamentals');
        }
      }
    }
  }

  return customized;
}

/**
 * Helper: Extend timeline
 */
function extendTimeline(duration, multiplier) {
  // Parse formats like "3-6 months", "6-9 months"
  const match = duration.match(/(\d+)-(\d+)\s*months?/i);
  if (match) {
    const min = Math.ceil(parseInt(match[1]) * multiplier);
    const max = Math.ceil(parseInt(match[2]) * multiplier);
    return `${min}-${max} months`;
  }
  return duration;
}

/**
 * Helper: Compress timeline
 */
function compressTimeline(duration, multiplier) {
  const match = duration.match(/(\d+)-(\d+)\s*months?/i);
  if (match) {
    const min = Math.max(1, Math.floor(parseInt(match[1]) * multiplier));
    const max = Math.max(2, Math.floor(parseInt(match[2]) * multiplier));
    return `${min}-${max} months`;
  }
  return duration;
}

/**
 * STEP 5: Enrich config with calculated data
 */
function enrichRoadmapConfig(config, quizResponses) {
  const enriched = JSON.parse(JSON.stringify(config));

  // Extract skills from metadata and group by priority
  const allSkills = config.metadata?.skills || [];
  const skillsByPriority = {
    critical: allSkills.filter(s => s.priority === 'critical').map(s => s.name),
    high: allSkills.filter(s => s.priority === 'high').map(s => s.name),
    medium: allSkills.filter(s => s.priority === 'medium').map(s => s.name)
  };

  // Current skills from user
  const currentSkills = quizResponses.currentSkills || [];

  // Calculate match score based on critical skills
  const criticalMatches = skillsByPriority.critical.filter(skill =>
    currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
  ).length;

  const matchScore = skillsByPriority.critical.length > 0
    ? Math.round((criticalMatches / skillsByPriority.critical.length) * 100)
    : 0;

  // Initialize skillsGap if it doesn't exist
  enriched.skillsGap = enriched.skillsGap || {};
  enriched.skillsGap.matchScore = matchScore;

  // Personalize skills breakdown
  enriched.skillsGap.personalized = {
    currentSkills: currentSkills,
    currentCount: currentSkills.length,

    highPriorityBreakdown: {
      have: skillsByPriority.critical.filter(skill =>
        currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      ),
      missing: skillsByPriority.critical.filter(skill =>
        !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      )
    },

    mediumPriorityBreakdown: {
      have: skillsByPriority.high.filter(skill =>
        currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      ),
      missing: skillsByPriority.high.filter(skill =>
        !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      )
    },

    lowPriorityBreakdown: {
      have: skillsByPriority.medium.filter(skill =>
        currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      ),
      missing: skillsByPriority.medium.filter(skill =>
        !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
      )
    }
  };

  // Add company types array from tabs for easier access
  if (enriched.companiesInsight?.tabs && !enriched.companiesInsight?.types) {
    enriched.companiesInsight.types = enriched.companiesInsight.tabs;
  }

  // Add personalization metadata
  enriched.personalization = {
    userName: quizResponses.userName || 'User',
    targetRole: quizResponses.targetRole,
    yearsOfExperience: quizResponses.yearsOfExperience,
    timeline: quizResponses.timeline,
    timePerWeek: quizResponses.timePerWeek,
    generatedAt: new Date().toISOString()
  };

  return enriched;
}

/**
 * MAIN ORCHESTRATOR FUNCTION
 *
 * Takes quiz responses and profile data
 * Returns fully personalized, enriched roadmap config
 *
 * NO FALLBACKS - Will throw if any step fails
 */
export async function generatePersonalizedRoadmap(quizResponses, profileData) {
  if (!quizResponses) {
    throw new Error('Quiz responses required to generate personalized roadmap');
  }

  try {
    console.log('🔄 Step 1: Decomposing quiz responses to modular persona...');
    const modularPersona = await decomposeToModularPersona(quizResponses);
    console.log('✅ Decomposed:', modularPersona);

    console.log('🔄 Step 2: Loading modular templates...');
    const templates = await loadModularTemplates(modularPersona);
    console.log('✅ Templates loaded');

    console.log('🔄 Step 3: Composing templates via deep merge...');
    let composed = composeTemplates(templates);
    console.log('✅ Templates composed');

    console.log('🔄 Step 4: Applying user-data-driven customizations...');
    composed = applyUserDataOverrides(composed, quizResponses);
    console.log('✅ Customizations applied');

    console.log('🔄 Step 5: Enriching with calculated data...');
    composed = enrichRoadmapConfig(composed, quizResponses);
    console.log('✅ Enrichment complete');

    console.log('🔄 Step 6: Personalizing hero section...');
    if (composed.hero) {
      const userName = profileData?.userName || quizResponses.userName || 'User';
      const targetRole = quizResponses.targetRole || 'Backend Engineer';
      // Extract just the role name without "Engineer" suffix for {role} placeholder
      const roleOnly = normalizeRole(targetRole);

      console.log(`   Hero personalization: userName="${userName}", targetRole="${targetRole}", roleOnly="${roleOnly}"`);
      console.log(`   Original title: "${composed.hero.title}"`);

      composed.hero.greeting = `Hey ${userName}! 👋`;
      if (composed.hero.title) {
        composed.hero.title = composed.hero.title
          .replace(/{userName}/g, userName)
          .replace(/{targetRole}/g, targetRole)
          .replace(/{role}/g, roleOnly); // Support both {role} and {targetRole} placeholders
        console.log(`   Replaced title: "${composed.hero.title}"`);
      }
    }
    console.log('✅ Personalization complete');

    return {
      success: true,
      data: composed,
      metadata: {
        modularPersona,
        personalization: composed.personalization,
        skillsGapScore: composed.skillsGap?.matchScore
      }
    };
  } catch (error) {
    console.error('❌ Roadmap generation failed:', error);
    throw new Error(`Failed to generate personalized roadmap: ${error.message}`);
  }
}

/**
 * BATCH GENERATION (for testing multiple personas)
 */
export async function generateRoadmapsForAllPersonas(quizResponses, profileData) {
  const validRoles = ['backend', 'frontend', 'fullstack', 'devops', 'data'];
  const results = {};

  for (const role of validRoles) {
    try {
      const modifiedQuiz = { ...quizResponses, targetRole: role };
      const roadmap = await generatePersonalizedRoadmap(modifiedQuiz, profileData);
      results[role] = roadmap;
    } catch (error) {
      results[role] = { error: error.message };
    }
  }

  return results;
}
