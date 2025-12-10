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
import FloatingCTA from './sections/FloatingCTA';
import { getPersonalizedRoadmapConfig } from '../../src/utils/personaMatching';
import { MagnifyingGlass, Target, BriefcaseMetal, ChartLine, Sparkle } from 'phosphor-react';

const RoadmapNewExperimental = () => {
  const { roadmapData, quizResponses, background, evaluationResults } = useUnified();
  const [activeSection, setActiveSection] = useState('skills');
  const [personaConfig, setPersonaConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  // Loader states (similar to roadmap-new.js)
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    { icon: <MagnifyingGlass size={28} weight="bold" />, text: 'Analyzing your skills...', subtext: 'Evaluating your current skill level' },
    { icon: <Target size={28} weight="bold" />, text: 'Building your roadmap...', subtext: 'Creating a personalized learning path' },
    { icon: <BriefcaseMetal size={28} weight="bold" />, text: 'Finding relevant companies...', subtext: 'Matching you with top opportunities' },
    { icon: <ChartLine size={28} weight="bold" />, text: 'Curating project ideas...', subtext: 'Selecting projects to build your portfolio' },
    { icon: <Sparkle size={28} weight="bold" />, text: 'Finalizing your roadmap...', subtext: 'Almost there!' }
  ];

  /**
   * Load persona config based on quiz responses
   * Maps quiz response keys to persona matching format
   * NO DEFAULTS - Will throw error if data is missing
   */
  useEffect(() => {
    const loadPersonaConfig = async () => {
      try {
        setConfigLoading(true);
        setConfigError(null);

        // Debug: Log what we have in quizResponses
        console.log('🔍 Quiz Responses Raw:', quizResponses);
        console.log('🔍 Quiz Responses Keys:', Object.keys(quizResponses || {}));

        // Check if we have quiz responses
        if (!quizResponses || Object.keys(quizResponses).length === 0) {
          throw new Error(
            '⚠️ No quiz responses found. Please complete the quiz first before viewing your roadmap.'
          );
        }

        // Helper function to map company type values
        const mapCompanyType = (value) => {
          const companyMap = {
            'faang': 'bigtech',
            'unicorns': 'scaleup',
            'startups': 'startup',
            'service': 'service'
          };
          return companyMap[value] || value || 'startup';
        };

        // Map quiz response keys to persona matching format
        // Quiz stores: background, yearsExperience, targetRole, primaryGoal, targetCompanyType
        // Orchestrator expects: userType, yearsOfExperience, targetRole, requirementType, targetCompanyType
        const matchingInput = {
          // background (tech/non-tech) → userType (tech_professional/career_switcher)
          userType: quizResponses.background === 'non-tech'
            ? 'career_switcher'
            : 'tech_professional',

          // yearsExperience → yearsOfExperience (normalize spaces)
          yearsOfExperience: quizResponses.yearsExperience,

          // targetRole - use as-is
          targetRole: quizResponses.targetRole,

          // primaryGoal → requirementType
          requirementType: quizResponses.primaryGoal ?
            (quizResponses.primaryGoal.includes('level') ? 'upskill' : quizResponses.primaryGoal)
            : 'upskill',

          // targetCompanyType - map company values
          targetCompanyType: mapCompanyType(quizResponses.targetCompanyType)
        };

        console.log('📋 Mapped Input for Orchestrator:', matchingInput);

        // Validate required fields - NO DEFAULTS
        if (!matchingInput.targetRole || !matchingInput.yearsOfExperience) {
          throw new Error('Missing required quiz responses: targetRole and yearsOfExperience are mandatory');
        }

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
          stack: error.stack,
          quizResponses
        });
        setConfigError(error.message);
        // Do NOT set default config - let user know they need to complete quiz
        setPersonaConfig(null);
      } finally {
        setConfigLoading(false);
      }
    };

    // Load config whenever quizResponses change - DO NOT use empty dependency array
    loadPersonaConfig();
  }, [quizResponses]);

  // Loader animation - 6 second fake loader (similar to roadmap-new.js)
  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStep(0);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 1.6;
      });
    }, 100); // Update every 100ms

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200); // Change step every 1.2 seconds

    // Hide loader after 6 seconds
    const loaderTimeout = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 300); // Small delay for smooth transition
    }, 6000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(loaderTimeout);
    };
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
   * Build roadmap data from persona config
   * NO MOCK DATA - Only uses real data from orchestrator/persona config
   * Returns data or null if config not loaded
   */
  const buildRoadmapData = () => {
    if (personaConfig) {
      // Use persona config data directly from orchestrator
      return {
        targetRole: personaConfig.metadata?.roleLabel || quizResponses?.targetRole,
        targetCompany: quizResponses?.targetCompanyType || 'Big-Tech Companies',
        timeline: quizResponses?.timeline || '6-9 months',
        effortPerWeek: personaConfig.hero?.stats?.estimatedEffort?.value || '10',
        currentSkills: personaConfig.currentSkills || [],
        missingSkills: personaConfig.missingSkills || {
          highPriority: [],
          mediumPriority: [],
          lowPriority: []
        },
        // Include full config for sections to reference
        _fullConfig: personaConfig
      };
    }

    // NO FALLBACK - Return null if config not loaded
    // Components should handle null state gracefully
    return null;
  };

  const roadmapDisplay = buildRoadmapData();

  // Show loader for 6 seconds
  if (isLoading) {
    const currentStep = loadingSteps[loadingStep];
    return (
      <>
        <Navbar />
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 -mt-20">
          <div className="flex flex-col items-center justify-center w-full max-w-[700px] mx-auto px-8">
            {/* Loading Icon and Text */}
            <div className="flex flex-col items-center gap-4 mb-10 opacity-100 animate-pulse">
              <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center text-[#B30158]">
                {currentStep.icon}
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-slate-900 mb-1.5">
                  {currentStep.text}
                </div>
                <div className="text-sm text-slate-600">
                  {currentStep.subtext}
                </div>
              </div>
            </div>

            {/* Progress Bar - Wider */}
            <div className="w-full max-w-[500px] h-2 bg-slate-200 rounded-none overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B30158] to-[#E91E63] transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show error if no data available
  if (!roadmapDisplay || configLoading) {
    return (
      <>
        <Navbar />
        {configError && (
          <div style={{
            margin: '40px auto',
            maxWidth: '800px',
            padding: '24px',
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '0',
            color: '#7F1D1D'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              ⚠️ Unable to Load Roadmap
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {configError}
            </p>
            <p style={{ fontSize: '13px', marginTop: '12px', opacity: 0.8 }}>
              Please go back and complete the quiz to generate your personalized roadmap.
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Hero roadmapData={roadmapDisplay} />
      <HorizontalNavigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="w-full bg-white">
        <div className="mx-auto px-5 py-12 lg:px-[120px] lg:pt-16 lg:pb-40 max-w-[1440px]">
          <div className="w-full space-y-32">
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
