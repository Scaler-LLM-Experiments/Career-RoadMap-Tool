/**
 * API Endpoint: POST /api/config/persona
 *
 * PURE MODULAR COMPOSITION - NO FALLBACKS, NO LEGACY MODE
 *
 * Accepts quiz responses or modular persona parameters
 * Decomposes to modular components (role, level, userType, company)
 * Composes from templates via RoadmapCompositionOrchestrator
 * Returns fully personalized, enriched roadmap config
 *
 * Request body:
 * {
 *   "quizResponses": { ... },  // From quiz or
 *   "modularPersona": { role, level, userType, companyType },  // Direct
 *   "profileData": { userName, ... }  // Optional
 * }
 */

// Direct import of orchestrator - safe on server-side
import { generatePersonalizedRoadmap } from '../../../../src/utils/RoadmapCompositionOrchestrator';

export default async function handler(req, res) {
  // Only POST allowed - pure composition system
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests',
      allowedMethods: ['POST']
    });
  }

  try {
    const { quizResponses, modularPersona, profileData } = req.body;

    // Validate: must have either quizResponses or modularPersona
    if (!quizResponses && !modularPersona) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'Request must include either quizResponses or modularPersona object',
        example: {
          quizResponses: {
            targetRole: 'Backend Engineer',
            yearsOfExperience: '3-5',
            background: 'tech',
            currentSkills: ['Python', 'SQL'],
            timeline: '6-9 months',
            timePerWeek: 18
          }
        }
      });
    }

    if (!generatePersonalizedRoadmap) {
      throw new Error('RoadmapCompositionOrchestrator.generatePersonalizedRoadmap not available');
    }

    // STEP 1: Use quiz responses if provided, otherwise validate modular persona
    let inputData = quizResponses;

    if (modularPersona && !quizResponses) {
      // Direct modular persona provided - convert to quiz responses for consistency
      inputData = {
        targetRole: mapRoleToTargetRole(modularPersona.role),
        yearsOfExperience: mapLevelToYears(modularPersona.level),
        background: mapUserTypeToBg(modularPersona.userType),
        userType: modularPersona.userType,
        targetCompanyType: modularPersona.companyType,
        currentSkills: [],
        timeline: '6-9 months',
        timePerWeek: 15
      };
    }

    // STEP 2: Generate personalized roadmap using modular composition
    const result = await generatePersonalizedRoadmap(inputData, profileData || {});

    if (!result.success) {
      throw new Error(result.error || 'Roadmap composition failed');
    }

    // STEP 3: Return response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache'); // Don't cache user-specific data

    return res.status(200).json({
      success: true,
      data: result.data,
      metadata: result.metadata,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Persona composition API error:', error);

    return res.status(500).json({
      error: 'Failed to generate personalized roadmap',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Helper: Map role to targetRole format
 */
function mapRoleToTargetRole(role) {
  const mapping = {
    backend: 'Backend Engineer',
    frontend: 'Frontend Engineer',
    fullstack: 'Full Stack Engineer',
    devops: 'DevOps Engineer',
    data: 'Data Science Engineer'
  };
  return mapping[role] || role;
}

/**
 * Helper: Map level to years of experience
 */
function mapLevelToYears(level) {
  const mapping = {
    entry: '0-2',
    mid: '3-5',
    senior: '5-7'
  };
  return mapping[level] || '0-2';
}

/**
 * Helper: Map userType to background
 */
function mapUserTypeToBg(userType) {
  if (userType === 'career_switcher') return 'non-tech';
  return 'tech';
}
