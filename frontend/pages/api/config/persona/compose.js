/**
 * API Endpoint: POST /api/config/persona/compose
 *
 * PURE MODULAR COMPOSITION - NO FALLBACKS, NO LEGACY MODE
 *
 * Accepts quiz responses and returns fully personalized, enriched roadmap config
 * This endpoint runs the RoadmapCompositionOrchestrator server-side
 *
 * Request body:
 * {
 *   "quizResponses": { ... },  // Quiz responses from frontend
 *   "profileData": { userName, ... }  // Optional user data
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
    const { quizResponses, profileData } = req.body;

    // Validate: must have quizResponses
    if (!quizResponses) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'Request must include quizResponses object',
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

    // Generate personalized roadmap using modular composition
    const result = await generatePersonalizedRoadmap(quizResponses, profileData || {});

    if (!result.success) {
      throw new Error(result.error || 'Roadmap composition failed');
    }

    // Return response
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
