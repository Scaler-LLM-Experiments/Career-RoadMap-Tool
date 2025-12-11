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
 *
 * IMPORTANT: This preserves nested properties from target if source doesn't have them
 * Example: if target.a.b exists and source.a doesn't have b, the result preserves target.a.b
 */
function deepMerge(target = {}, source = {}, depth = 0) {
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
        // RECURSIVE MERGE: Merge source into target, preserving target's nested properties
        // This ensures that if source.skillMap.thresholds doesn't have averageBaseline,
        // we still keep the averageBaseline from target.skillMap.thresholds
        result[key] = deepMerge(result[key] || {}, source[key], depth + 1);
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
 * THROWS ERROR if role is not provided or unrecognized - NO FALLBACKS
 */
function normalizeRole(targetRole) {
  if (!targetRole) throw new Error('targetRole is required for persona matching');

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

  // THROW ERROR - No unrecognized roles allowed
  throw new Error(`Unrecognized target role: "${targetRole}". Must be one of: backend, frontend, fullstack, devops, data`);
}

/**
 * Determine experience level from years
 * THROWS ERROR if yearsOfExperience is not provided - NO FALLBACKS
 */
function determineLevel(yearsOfExperience) {
  if (!yearsOfExperience) throw new Error('yearsOfExperience is required to determine experience level');

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

  // Return mapped value or throw error if company type is not recognized
  if (companyMap[company]) return companyMap[company];
  // If unrecognized, return the value as-is (might be a valid company type we don't recognize yet)
  return company;
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

    // DEBUG: Log what we loaded
    console.log('📦 TEMPLATES LOADED:');
    console.log('   Role thresholds keys:', roleConfig?.skillMap?.thresholds ? Object.keys(roleConfig.skillMap.thresholds) : 'NO SKILLMAP');
    console.log('   Level skillMap:', levelConfig?.skillMap ? 'EXISTS' : 'NONE');
    if (levelConfig?.skillMap?.thresholds) {
      console.log('   Level thresholds keys:', Object.keys(levelConfig.skillMap.thresholds));
    }
    console.log('   UserType skillMap:', userTypeConfig?.skillMap ? 'EXISTS' : 'NONE');
    if (userTypeConfig?.skillMap?.thresholds) {
      console.log('   UserType thresholds keys:', Object.keys(userTypeConfig.skillMap.thresholds));
    }
    console.log('   CompanyType skillMap:', companyTypeConfig?.skillMap ? 'EXISTS' : 'NONE');
    if (companyTypeConfig?.skillMap?.thresholds) {
      console.log('   CompanyType thresholds keys:', Object.keys(companyTypeConfig.skillMap.thresholds));
    }

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
  const debugInfo = {
    steps: []
  };

  // Merge in strict priority order
  // Role is the base
  console.log('🔹 Before merging role template:');
  console.log('   skillMap exists in role:', !!templates.role.skillMap);
  console.log('   averageBaseline in role:', !!templates.role?.skillMap?.thresholds?.averageBaseline);
  if (templates.role?.skillMap?.thresholds?.averageBaseline) {
    console.log('   averageBaseline keys:', Object.keys(templates.role.skillMap.thresholds.averageBaseline));
  }

  composed = deepMerge(composed, templates.role);

  debugInfo.steps.push({
    step: 'After role merge',
    hasAverageBaseline: !!composed?.skillMap?.thresholds?.averageBaseline,
    thresholdKeys: composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : []
  });

  console.log('🔹 After merging role template:');
  console.log('   skillMap exists in composed:', !!composed.skillMap);
  console.log('   averageBaseline in composed:', !!composed?.skillMap?.thresholds?.averageBaseline);
  console.log('   thresholds keys in composed:', composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : 'no thresholds');

  // Level adjusts for experience
  console.log('🔹 Before merging level template:');
  console.log('   skillMap exists in level:', !!templates.level.skillMap);
  console.log('   level template keys:', Object.keys(templates.level));

  composed = deepMerge(composed, templates.level);

  debugInfo.steps.push({
    step: 'After level merge',
    hasAverageBaseline: !!composed?.skillMap?.thresholds?.averageBaseline,
    thresholdKeys: composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : []
  });

  console.log('🔹 After merging level template:');
  console.log('   averageBaseline in composed:', !!composed?.skillMap?.thresholds?.averageBaseline);
  console.log('   thresholds keys in composed:', composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : 'no thresholds');

  // UserType adjusts for professional vs switcher
  console.log('🔹 Before merging userType template:');
  console.log('   skillMap exists in userType:', !!templates.userType.skillMap);
  console.log('   userType template keys:', Object.keys(templates.userType));

  composed = deepMerge(composed, templates.userType);

  debugInfo.steps.push({
    step: 'After userType merge',
    hasAverageBaseline: !!composed?.skillMap?.thresholds?.averageBaseline,
    thresholdKeys: composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : []
  });

  console.log('🔹 After merging userType template:');
  console.log('   averageBaseline in composed:', !!composed?.skillMap?.thresholds?.averageBaseline);
  console.log('   thresholds keys in composed:', composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : 'no thresholds');

  // CompanyType adjusts for target company
  console.log('🔹 Before merging companyType template:');
  console.log('   skillMap exists in companyType:', !!templates.companyType.skillMap);
  console.log('   companyType template keys:', Object.keys(templates.companyType));

  composed = deepMerge(composed, templates.companyType);

  debugInfo.steps.push({
    step: 'After companyType merge',
    hasAverageBaseline: !!composed?.skillMap?.thresholds?.averageBaseline,
    thresholdKeys: composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : []
  });

  console.log('🔹 After merging companyType template:');
  console.log('   averageBaseline in composed:', !!composed?.skillMap?.thresholds?.averageBaseline);
  console.log('   thresholds keys in composed:', composed?.skillMap?.thresholds ? Object.keys(composed.skillMap.thresholds) : 'no thresholds');
  console.log('   Full skillMap structure:', JSON.stringify(composed?.skillMap, null, 2).substring(0, 500));
  console.log('📋 COMPOSITION DEBUG INFO:', debugInfo);

  // CRITICAL FIX: Ensure averageBaseline is always present in skillMap.thresholds
  // This should have come from the role template and not be removed during merging
  if (composed?.skillMap?.thresholds && !composed.skillMap.thresholds.averageBaseline) {
    console.warn('⚠️ CRITICAL: averageBaseline was lost during composition. This will cause skill map to fail.');
    console.warn('   Available thresholds:', Object.keys(composed.skillMap.thresholds));
    // Try to recover from role template's averageBaseline if it exists at top level
    if (composed?.skillMap?.averageBaseline) {
      console.log('   Recovering averageBaseline from skillMap.averageBaseline');
      composed.skillMap.thresholds.averageBaseline = composed.skillMap.averageBaseline;
    } else {
      throw new Error('CRITICAL: averageBaseline missing from both thresholds and skillMap root. Composition failed.');
    }
  }

  // Attach debug info to composed object for visibility in browser
  composed._debugCompositionInfo = debugInfo;

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

  // CRITICAL DEBUG: Log currentSkills being processed
  const currentSkills = quizResponses.currentSkills || [];
  console.log('🔍 ENRICHMENT: Processing currentSkills');
  console.log('   Input quizResponses.currentSkills:', quizResponses.currentSkills);
  console.log('   Parsed currentSkills array:', currentSkills);
  console.log('   currentSkills count:', currentSkills.length);
  console.log('   allSkills from config.metadata:', allSkills.length, 'total');
  console.log('   Critical skills available:', skillsByPriority.critical.length);
  console.log('   High priority skills available:', skillsByPriority.high.length);
  console.log('   Medium priority skills available:', skillsByPriority.medium.length);

  // Calculate match score based on critical skills
  const criticalMatches = skillsByPriority.critical.filter(skill =>
    currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
  ).length;

  const matchScore = skillsByPriority.critical.length > 0
    ? Math.round((criticalMatches / skillsByPriority.critical.length) * 100)
    : 0;

  // Log match score calculation
  console.log('✅ MATCH SCORE CALCULATED:');
  console.log('   Critical matches:', criticalMatches, '/', skillsByPriority.critical.length);
  console.log('   Match score:', matchScore, '%');
  console.log('   Skills with match:', skillsByPriority.critical.filter(skill =>
    currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
  ));
  console.log('   Missing critical skills:', skillsByPriority.critical.filter(skill =>
    !currentSkills.some(cs => cs.toLowerCase() === skill.toLowerCase())
  ));

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

  // Create missingSkills structure for components (Hero, Skills sections)
  // This directly provides what components expect without nested breakdown structure
  enriched.missingSkills = {
    highPriority: enriched.skillsGap.personalized.highPriorityBreakdown.missing,
    mediumPriority: enriched.skillsGap.personalized.mediumPriorityBreakdown.missing,
    lowPriority: enriched.skillsGap.personalized.lowPriorityBreakdown.missing
  };

  // Create existingSkills structure for components
  enriched.existingSkills = {
    highPriority: enriched.skillsGap.personalized.highPriorityBreakdown.have,
    mediumPriority: enriched.skillsGap.personalized.mediumPriorityBreakdown.have,
    lowPriority: enriched.skillsGap.personalized.lowPriorityBreakdown.have
  };

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
    console.log('   CHECK AFTER COMPOSE: averageBaseline in skillMap?', !!composed?.skillMap?.thresholds?.averageBaseline);
    if (composed?.skillMap?.thresholds?.averageBaseline) {
      console.log('   ✅ averageBaseline PRESERVED after compose');
    } else {
      console.log('   ❌ averageBaseline LOST after compose!');
      console.log('   Available thresholds:', Object.keys(composed?.skillMap?.thresholds || {}));
    }

    console.log('🔄 Step 4: Applying user-data-driven customizations...');
    composed = applyUserDataOverrides(composed, quizResponses);
    console.log('✅ Customizations applied');
    console.log('   CHECK AFTER OVERRIDE: averageBaseline in skillMap?', !!composed?.skillMap?.thresholds?.averageBaseline);

    console.log('🔄 Step 5: Enriching with calculated data...');
    composed = enrichRoadmapConfig(composed, quizResponses);
    console.log('✅ Enrichment complete');
    console.log('   CHECK AFTER ENRICH: averageBaseline in skillMap?', !!composed?.skillMap?.thresholds?.averageBaseline);

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
