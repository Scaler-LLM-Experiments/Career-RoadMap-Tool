/**
 * SKILLS SECTION - FINAL REDESIGN
 * Prominent title + Two-column layout with modern table
 *
 * CONFIG INTEGRATION:
 * Uses persona config data from mockRoadmapData._fullConfig.skillsGap
 * Falls back to mock data if config not available
 */

import React from 'react';
import { GraduationCap } from 'phosphor-react';
import SkillMapNew from '../../../src/components/roadmap/SkillMapNew';

// Skill database with priority and descriptions for tooltips (fallback)
const skillDatabase = {
  // High Priority Skills
  'System Design': { priority: 'high', description: 'Design scalable distributed systems' },
  'DSA': { priority: 'high', description: 'Data structures and algorithms' },
  'Backend Design': { priority: 'high', description: 'Server-side architecture patterns' },
  'Microservices': { priority: 'high', description: 'Distributed system architecture' },
  'Database Design': { priority: 'high', description: 'Database optimization & scaling' },

  // Medium Priority Skills
  'Docker': { priority: 'medium', description: 'Container management' },
  'Kubernetes': { priority: 'medium', description: 'Container orchestration' },
  'Redis': { priority: 'medium', description: 'In-memory caching' },
  'PostgreSQL': { priority: 'medium', description: 'Advanced SQL knowledge' },
  'API Design': { priority: 'medium', description: 'RESTful/GraphQL APIs' },
  'Message Queues': { priority: 'medium', description: 'Async job processing' },
  'CI/CD': { priority: 'medium', description: 'Automated deployment' },
  'gRPC': { priority: 'medium', description: 'Service communication' },
  'Elasticsearch': { priority: 'medium', description: 'Search & analytics' },
  'Apache Kafka': { priority: 'medium', description: 'Stream processing' },

  // Low Priority Skills
  'GraphQL': { priority: 'low', description: 'Query language alternative' },
  'WebSockets': { priority: 'low', description: 'Real-time communication' },
  'Caching Strategies': { priority: 'low', description: 'Performance optimization' },
  'Monitoring': { priority: 'low', description: 'System observability' },
  'Load Balancing': { priority: 'low', description: 'Traffic distribution' }
};

const SkillsSection = ({
  mockRoadmapData,
  quizResponses,
  evaluationResults,
  background
}) => {
  // Get skills from config or use fallback
  const configData = mockRoadmapData._fullConfig?.skillsGap;
  const sectionTitle = configData?.title || 'Understand Where You Stand Right Now';
  const sectionDescription = configData?.description || 'Identify your skill gaps and focus on what matters most.';

  // Get current skills selected in quiz to filter them out
  const currentSkillsSet = new Set(
    (mockRoadmapData?.currentSkills || []).map(skill =>
      typeof skill === 'string' ? skill.toLowerCase() : skill.name?.toLowerCase()
    )
  );

  // Helper function to check if skill should be filtered out
  const shouldIncludeSkill = (skillName) => {
    return !currentSkillsSet.has(skillName.toLowerCase());
  };

  // Use config skills if available, otherwise build from skillDatabase
  let highPrioritySkills = [];
  let mediumPrioritySkills = [];
  let lowPrioritySkills = [];

  if (configData?.missingSkills) {
    // Use skills from config, filtering out current skills
    highPrioritySkills = (configData.missingSkills.highPriority || [])
      .filter(skill => shouldIncludeSkill(skill.skill || skill.name))
      .map(skill => ({
        name: skill.skill || skill.name,
        description: skill.description || 'Skill description',
        priority: 'high'
      }));

    mediumPrioritySkills = (configData.missingSkills.mediumPriority || [])
      .filter(skill => shouldIncludeSkill(skill.skill || skill.name))
      .map(skill => ({
        name: skill.skill || skill.name,
        description: skill.description || 'Skill description',
        priority: 'medium'
      }));

    lowPrioritySkills = (configData.missingSkills.lowPriority || [])
      .filter(skill => shouldIncludeSkill(skill.skill || skill.name))
      .map(skill => ({
        name: skill.skill || skill.name,
        description: skill.description || 'Skill description',
        priority: 'low'
      }));
  } else {
    // Fallback to hardcoded skillDatabase, filtering out current skills
    highPrioritySkills = Object.entries(skillDatabase)
      .filter(([name, data]) => data.priority === 'high' && shouldIncludeSkill(name))
      .map(([name, data]) => ({ name, ...data }));

    mediumPrioritySkills = Object.entries(skillDatabase)
      .filter(([name, data]) => data.priority === 'medium' && shouldIncludeSkill(name))
      .map(([name, data]) => ({ name, ...data }));

    lowPrioritySkills = Object.entries(skillDatabase)
      .filter(([name, data]) => data.priority === 'low' && shouldIncludeSkill(name))
      .map(([name, data]) => ({ name, ...data }));
  }

  return (
    <section id="skills" className="scroll-mt-24">
      {/* PROMINENT SECTION HEADER */}
      <div className="mb-12">
        {/* Title Section */}
        <div className="text-left mb-3">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 whitespace-nowrap">Your Skill Analysis</p>
          <h2 className="text-3.5xl font-bold text-slate-900 leading-snug whitespace-nowrap">
            {sectionTitle}
          </h2>
        </div>
        {/* Description Below */}
        <p className="text-base text-slate-600 leading-relaxed whitespace-nowrap">
          {sectionDescription}
        </p>
      </div>

      {/* Two Column Layout: Skill Map (Left 50%) + Skills Table (Right 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16 lg:mb-20">
        {/* LEFT: Skill Map - 50% width */}
        <div className="flex flex-col h-full relative z-20">
          <div className="mb-4 relative z-20">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-30">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 pt-0.5">Your Skill Map</h3>
            </div>
            <div className="w-full border-b border-slate-300 mt-2"></div>
          </div>
          <div className="w-full">
            <SkillMapNew
              currentSkills={mockRoadmapData.currentSkills}
              targetRole={mockRoadmapData.targetRole}
              quizResponses={quizResponses || {}}
              evaluationResults={evaluationResults}
              background={background || 'tech'}
              existingSkills={mockRoadmapData.existingSkills}
              missingSkills={mockRoadmapData.missingSkills}
            />
          </div>
        </div>

        {/* RIGHT: Skills Table - 50% width */}
        <div className="flex flex-col h-full relative">
          <div className="mb-6 relative z-20">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 pt-0.5">Skills You Need to Master</h3>
            </div>
            <div className="w-full border-b border-slate-300 mt-2"></div>
          </div>

          {/* Skills Table */}
          <div className="w-full border-t border-b border-slate-200">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 py-3 px-4 bg-slate-50 border-b border-slate-200">
              <div><h5 className="text-base font-bold text-slate-900">High Priority</h5></div>
              <div><h5 className="text-base font-bold text-slate-900">Medium Priority</h5></div>
              <div><h5 className="text-base font-bold text-slate-900">Low Priority</h5></div>
            </div>

            {/* Table Content */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 py-4 px-4 bg-white">
              {/* High Priority */}
              <div className="flex flex-col gap-2">
                {highPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-sm relative">
                    <GraduationCap size={14} weight="fill" className="text-red-600 flex-shrink-0" />
                    <span className="text-red-800 text-xs font-medium break-words">{skill.name}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                      <div className="bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">{skill.description}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Medium Priority */}
              <div className="flex flex-col gap-2">
                {mediumPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 border border-orange-200 rounded-sm relative">
                    <GraduationCap size={14} weight="fill" className="text-orange-600 flex-shrink-0" />
                    <span className="text-orange-800 text-xs font-medium break-words">{skill.name}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                      <div className="bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">{skill.description}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Low Priority */}
              <div className="flex flex-col gap-2">
                {lowPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded-sm relative">
                    <GraduationCap size={14} weight="fill" className="text-slate-600 flex-shrink-0" />
                    <span className="text-slate-700 text-xs font-medium break-words">{skill.name}</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                      <div className="bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">{skill.description}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
