/**
 * EXPERIMENTAL ROADMAP - Phase 2 UI Redesign
 *
 * CONFIG INTEGRATION:
 * This component now loads persona-specific config based on quiz responses
 * from the UnifiedContext. It intelligently matches personas and applies
 * company-type tweaks to provide personalized content.
 */

import React, { useState, useEffect } from 'react';
import { useUnified } from '../../src/context/UnifiedContext';
import Navbar from '../../src/components/roadmap-new/Navbar';
import Hero from '../../src/components/roadmap-new/Hero';
import HorizontalNavigation from './sections/HorizontalNavigation';
import SkillsSection from './sections/SkillsSection';
import CompaniesSection from './sections/CompaniesSection';
import LearningPathSection from './sections/LearningPathSection';
import ProjectsSection from './sections/ProjectsSection';
import { getPersonalizedRoadmapConfig } from '../../src/utils/personaMatching';

const RoadmapNewExperimental = () => {
  const { roadmapData, quizResponses, background, evaluationResults } = useUnified();
  const [activeSection, setActiveSection] = useState('skills');
  const [personaConfig, setPersonaConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  /**
   * Load persona config based on quiz responses
   * Converts quiz responses to the format needed for persona matching
   */
  useEffect(() => {
    const loadPersonaConfig = async () => {
      try {
        setConfigLoading(true);
        setConfigError(null);

        // Debug: Log what we have in quizResponses
        console.log('🔍 Quiz Responses Raw:', quizResponses);

        // Convert quiz responses to format needed for persona matching
        // Use defaults if quiz responses are empty
        const matchingInput = {
          userType: quizResponses?.userType || 'tech_professional',
          yearsOfExperience: quizResponses?.yearsOfExperience || '3-5',
          targetRole: quizResponses?.targetRole || 'Senior Backend Engineer',
          requirementType: quizResponses?.requirementType || 'upskill',
          targetCompanyType: quizResponses?.targetCompanyType || 'scaleup'
        };

        console.log('📋 Matching Input for Persona:', matchingInput);

        // Get personalized config
        const config = await getPersonalizedRoadmapConfig(matchingInput);

        if (config) {
          console.log('✅ Persona config loaded successfully:', config.metadata);
          setPersonaConfig(config);
        } else {
          throw new Error('Failed to load persona configuration - returned null');
        }
      } catch (error) {
        console.error('❌ Error loading persona config:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        setConfigError(error.message);
        // Set default config as fallback
        setPersonaConfig(null);
      } finally {
        setConfigLoading(false);
      }
    };

    // Load config immediately with defaults
    // (Don't wait for quiz responses - use defaults)
    loadPersonaConfig();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['skills', 'companies', 'learning', 'projects'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Build roadmap data from persona config or fallback to mock data
   * Handles cases where config hasn't loaded yet
   */
  const buildRoadmapData = () => {
    if (personaConfig) {
      // Use persona config data
      return {
        targetRole: personaConfig.metadata?.label || 'Senior Backend Engineer',
        targetCompany: quizResponses?.targetCompanyType || 'Big-Tech Companies',
        timeline: quizResponses?.timeline || '6-9 months',
        currentSkills: personaConfig.skillsGap?.currentSkills?.map(s => s.skill) || [],
        existingSkills: personaConfig.skillsGap?.currentSkills || [],
        missingSkills: personaConfig.skillsGap?.missingSkills || {
          highPriority: [],
          mediumPriority: [],
          lowPriority: []
        },
        // Include full config for sections to reference
        _fullConfig: personaConfig
      };
    }

    // Fallback to mock data if config not loaded
    return roadmapData || {
      targetRole: 'Senior Backend Engineer',
      targetCompany: 'Big-Tech Companies',
      timeline: '6-9 months',
      currentSkills: ['Python', 'JavaScript', 'Git', 'REST APIs'],
      existingSkills: [
        { skill: 'Python', priority: 'high' },
        { skill: 'JavaScript', priority: 'high' },
        { skill: 'Git', priority: 'medium' }
      ],
      missingSkills: {
        highPriority: [
          { skill: 'System Design', priority: 'high' },
          { skill: 'Microservices', priority: 'high' },
          { skill: 'Docker', priority: 'high' }
        ],
        mediumPriority: [
          { skill: 'Kubernetes', priority: 'medium' },
          { skill: 'Redis', priority: 'medium' }
        ],
        lowPriority: [
          { skill: 'GraphQL', priority: 'low' }
        ]
      }
    };
  };

  const roadmapDisplay = buildRoadmapData();

  return (
    <>
      <Navbar />
      <Hero roadmapData={roadmapDisplay} />
      <HorizontalNavigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="w-full bg-white">
        <div className="mx-auto px-5 py-12 lg:px-[120px] lg:pt-16 lg:pb-40 max-w-[1440px]">
          <div className="w-full space-y-32">
            {/* Config Status Info - For Testing */}
            {configError && (
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                padding: '12px 16px',
                borderRadius: '4px',
                color: '#92400E'
              }}>
                ⚠️ Config Loading Error: {configError}
              </div>
            )}

            <SkillsSection
              mockRoadmapData={roadmapDisplay}
              quizResponses={quizResponses}
              evaluationResults={evaluationResults}
              background={background}
            />
            <CompaniesSection config={roadmapDisplay._fullConfig} />
            <LearningPathSection config={roadmapDisplay._fullConfig} />
            <ProjectsSection config={roadmapDisplay._fullConfig} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoadmapNewExperimental;
