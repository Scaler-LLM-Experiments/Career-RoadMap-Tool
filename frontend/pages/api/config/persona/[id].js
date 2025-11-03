/**
 * API Endpoint: GET /api/config/persona/[id]
 *
 * Returns persona config file for a given persona ID
 * Supports Next.js dynamic API routes
 *
 * USAGE:
 * GET /api/config/persona/tech_mid_backend
 * Returns: tech_mid_backend.json config
 */

import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;

  // Validate persona ID to prevent path traversal attacks
  if (!id || typeof id !== 'string' || !/^[a-z0-9_]+$/.test(id)) {
    return res.status(400).json({
      error: 'Invalid persona ID',
      message: 'Persona ID must contain only lowercase letters, numbers, and underscores'
    });
  }

  try {
    // Build path to persona config
    const configPath = path.join(
      process.cwd(),
      'src',
      'configs',
      'personas',
      `${id}.json`
    );

    // Check if file exists
    if (!fs.existsSync(configPath)) {
      return res.status(404).json({
        error: 'Persona not found',
        personaId: id,
        availablePersonas: [
          'tech_entry_backend',
          'tech_entry_frontend',
          'tech_entry_fullstack',
          'tech_mid_backend',
          'tech_mid_frontend',
          'tech_mid_fullstack',
          'tech_senior_backend',
          'tech_senior_frontend',
          'switcher_early_backend',
          'switcher_early_frontend',
          'switcher_advanced_backend',
          'switcher_advanced_frontend'
        ]
      });
    }

    // Read and parse config file
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(fileContent);

    // Add metadata
    config._metadata = config._metadata || {};
    config._metadata.loadedAt = new Date().toISOString();
    config._metadata.source = 'API';

    // Return config with appropriate headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    return res.status(200).json(config);
  } catch (error) {
    console.error('Error loading persona config:', error);

    return res.status(500).json({
      error: 'Failed to load persona config',
      message: error.message,
      personaId: id
    });
  }
}
