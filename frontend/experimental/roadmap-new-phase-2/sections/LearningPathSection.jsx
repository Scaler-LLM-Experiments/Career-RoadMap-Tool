/**
 * LEARNING PATH SECTION
 * Phases with scroll spy: left nav updates as right content scrolls
 */

import React, { useState, useEffect, useRef } from 'react';
import { Target, Check, Rocket, Lightbulb, Crown, Briefcase } from 'phosphor-react';

const LearningPathSection = ({ config }) => {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const contentRef = useRef(null);
  const phaseRefsMap = useRef({});

  // Get phases from config
  const configPhases = config?.learningPath?.phases || [];

  // Map config phases to UI format with icons
  const iconMap = [Rocket, Lightbulb, Crown, Briefcase];
  const phases = configPhases.map((phase, idx) => ({
    id: `phase${idx + 1}`,
    index: idx,
    phase: `Phase ${idx + 1}`,
    title: phase.title,
    icon: iconMap[idx] || Briefcase,
    description: phase.description,
    ...phase
  }));

  // Scroll spy with Intersection Observer
  useEffect(() => {
    const contentContainer = contentRef.current;
    if (!contentContainer) return;

    const observerOptions = {
      root: contentContainer,
      threshold: [0, 0.5]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const phaseId = entry.target.id;
          const phaseIndex = parseInt(phaseId.replace('phase-content-', ''));
          setSelectedPhaseIndex(phaseIndex);
        }
      });
    }, observerOptions);

    // Observe all phase content elements
    Object.keys(phaseRefsMap.current).forEach((key) => {
      const ref = phaseRefsMap.current[key];
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [phases]);

  // Set up refs for phase content
  const setPhaseRef = (index, element) => {
    if (element) {
      phaseRefsMap.current[`phase-${index}`] = element;
    }
  };

  return (
    <section id="learning" className="scroll-mt-24">
      <div className="mb-12">
        <div className="text-left mb-3">
          <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">ROADMAP TO SUCCESS</p>
          <h2 className="text-2xl md:text-3xl lg:text-3.5xl font-bold text-slate-900 leading-snug">
            Your Personalised Learning Path
          </h2>
        </div>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          A structured plan to master the skills you need, with milestones and progress checkpoints.
        </p>
      </div>

      {/* TAB-BASED LAYOUT: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        {/* LEFT: Phase Navigation Tabs - Hidden on Mobile */}
        <div className="hidden lg:flex flex-col gap-3">
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseIndex(phase.index)}
                className={`flex items-center gap-3 p-4 rounded-sm text-left transition-all ${
                  selectedPhaseIndex === phase.index
                    ? 'bg-[#073CA0] text-white shadow-lg'
                    : 'bg-white border border-slate-200 text-slate-900 hover:border-blue-300'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-none flex items-center justify-center ${
                  selectedPhaseIndex === phase.index
                    ? 'bg-white/20'
                    : 'bg-slate-100'
                }`}>
                  <Icon size={28} weight={selectedPhaseIndex === phase.index ? 'fill' : 'regular'} />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${selectedPhaseIndex === phase.index ? 'text-blue-100' : 'text-slate-500'}`}>
                    {phase.phase}
                  </p>
                  <h3 className="font-semibold">{phase.title}</h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Phase Content - Scrollable */}
        <div ref={contentRef} className="col-span-1 lg:col-span-3 max-h-none lg:max-h-[70vh] overflow-y-auto lg:pr-4 space-y-16">
          {phases.map((phase) => (
            <div
              key={phase.id}
              id={`phase-content-${phase.index}`}
              ref={(el) => setPhaseRef(phase.index, el)}
              className="space-y-8"
            >
              {/* Phase Header */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                <div className="bg-[#073CA0] text-white px-3 py-1 rounded-none text-xs lg:text-sm font-bold whitespace-nowrap w-fit">
                  {phase.phase}
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900">{phase.title}</h2>
              </div>

              {/* WHAT YOU'LL LEARN SECTION */}
              {phase.learningPoints && phase.learningPoints.length > 0 && (
                <div className="bg-gradient-to-b from-white to-slate-50 p-4 md:p-6 lg:p-8 rounded-sm border border-slate-200">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 md:mb-8">What You'll Learn</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Learning Points (or Video, depending on position) */}
                    {phase.videoPosition !== 'left' ? (
                      <ul className="space-y-4">
                        {phase.learningPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">{idx + 1}.</span>
                            <div>
                              <h5 className="font-semibold text-slate-900 text-sm mb-1">{point.title}</h5>
                              <p className="text-xs text-slate-600">{point.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-sm border-0"
                          src={phase.learningVideoUrl}
                          title={phase.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Video (or Learning Points, depending on position) */}
                    {phase.videoPosition !== 'left' ? (
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-sm border-0"
                          src={phase.learningVideoUrl}
                          title={phase.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {phase.learningPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">{idx + 1}.</span>
                            <div>
                              <h5 className="font-semibold text-slate-900 text-sm mb-1">{point.title}</h5>
                              <p className="text-xs text-slate-600">{point.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* TARGET & WHY IT MATTERS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TARGET */}
                {phase.target && (
                  <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-sm border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Target</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-green-100 flex items-center justify-center">
                        <Target size={20} weight="bold" className="text-green-600" />
                      </div>
                      <p className="text-xl font-bold text-slate-900">{phase.target.metric}</p>
                    </div>
                    <p className="text-sm text-slate-700">{phase.target.description}</p>
                  </div>
                )}

                {/* WHY IT MATTERS */}
                {phase.whyItMatters && phase.whyItMatters.length > 0 && (
                  <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-sm border border-slate-200">
                    <h4 className="text-lg font-bold text-slate-900 mb-4">Why It Matters</h4>
                    <ul className="space-y-2.5">
                      {phase.whyItMatters.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPathSection;
