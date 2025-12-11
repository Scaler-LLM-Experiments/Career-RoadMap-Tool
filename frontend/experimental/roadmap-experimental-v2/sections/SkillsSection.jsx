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
import SkillMapNew from '../../../src/components/roadmap/SkillMapNew.jsx';

const SkillsSection = ({ config }) => {
  // Get skills from persona config
  const sectionTitle = config?.skillsGap?.title || 'Understand Where You Stand Right Now';
  const sectionDescription = config?.skillsGap?.description || 'Identify your skill gaps and focus on what matters most.';

  // Get missing skills from persona
  const missingSkillsConfig = config?.missingSkills;

  const highPrioritySkills = (missingSkillsConfig?.highPriority || []).map(skill => ({
    name: skill,
    description: 'From persona',
    priority: 'high'
  }));

  const mediumPrioritySkills = (missingSkillsConfig?.mediumPriority || []).map(skill => ({
    name: skill,
    description: 'From persona',
    priority: 'medium'
  }));

  const lowPrioritySkills = (missingSkillsConfig?.lowPriority || []).map(skill => ({
    name: skill,
    description: 'From persona',
    priority: 'low'
  }));

  return (
    <section id="skills" className="scroll-mt-24">
      {/* PROMINENT SECTION HEADER */}
      <div className="mb-12">
        {/* Title Section */}
        <div className="text-left mb-3">
          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Your Skill Analysis</p>
          <h2 className="text-2xl md:text-3xl lg:text-3.5xl font-bold text-slate-900 leading-snug">
            {sectionTitle}
          </h2>
        </div>
        {/* Description Below */}
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          {sectionDescription}
        </p>
      </div>

      {/* Two Column Layout: Skill Map (Left 50%) + Skills Table (Right 50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-start mb-8 md:mb-16 lg:mb-20">
        {/* LEFT: Skill Map - 50% width */}
        <div className="flex flex-col h-full relative z-20">
          <div className="mb-2 md:mb-4 relative z-20">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-30">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 pt-0.5">Your Skill Map</h3>
            </div>
            <div className="w-full border-b border-slate-300 mt-2"></div>
          </div>
          <div className="w-full">
            {config?.skillMap ? (
              <SkillMapNew
                radarAxes={config?.skillMap?.radarAxes || []}
                averageBaseline={config?.skillMap?.thresholds?.averageBaseline?.[config?.metadata?.userType === 'tech' ? 'tech' : 'nonTech'] || {}}
                skillMapThresholds={config?.skillMap?.thresholds || {}}
                background={config?.metadata?.userType === 'tech' ? 'tech' : 'nonTech'}
                quizResponses={{
                  problemSolving: '51-100',
                  codeComfort: 'learning',
                  stepsTaken: 'learning',
                  portfolio: 'some-projects',
                  systemDesign: '11-50',
                  communication: '51-100'
                }}
              />
            ) : (
              <p className="text-slate-500">Loading skill map...</p>
            )}
          </div>
        </div>

        {/* RIGHT: Skills Table - 50% width */}
        <div className="flex flex-col h-full relative overflow-visible">
          <div className="mb-6 relative z-20">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-none bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
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
            <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-6 py-4 px-2 md:px-4 bg-white overflow-visible">
              {/* High Priority */}
              <div className="flex flex-col gap-2">
                {highPrioritySkills.map((skill, idx) => (
                  <div key={idx} className="group flex items-center gap-1 px-2 py-1.5 bg-red-50 border border-red-200 rounded-none relative">
                    <GraduationCap size={12} weight="fill" className="text-red-600 flex-shrink-0" />
                    <span className="text-red-800 text-xs font-medium break-words hyphens-auto">{skill.name}</span>
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
                  <div key={idx} className="group flex items-center gap-1 px-2 py-1.5 bg-orange-50 border border-orange-200 rounded-none relative">
                    <GraduationCap size={12} weight="fill" className="text-orange-600 flex-shrink-0" />
                    <span className="text-orange-800 text-xs font-medium break-words hyphens-auto">{skill.name}</span>
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
                  <div key={idx} className="group flex items-center gap-1 px-2 py-1.5 bg-slate-100 border border-slate-300 rounded-none relative">
                    <GraduationCap size={12} weight="fill" className="text-slate-600 flex-shrink-0" />
                    <span className="text-slate-700 text-xs font-medium break-words hyphens-auto">{skill.name}</span>
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
