/**
 * NEW ROADMAP PAGE - Clean build with Tailwind + shadcn
 *
 * Structure:
 * - Navigation Bar (sticky)
 * - Hero Section (full width bg, 120px margins, max-w-[1200px] content)
 * - Main Content (sidebar + content sections)
 */

import React, { useState, useEffect } from 'react';
import { useUnified } from '../src/context/UnifiedContext';
import Navbar from '../src/components/roadmap-new/Navbar';
import Hero from '../src/components/roadmap-new/Hero';
import Sidebar from '../src/components/roadmap-new/Sidebar';
import SkillMapNew from '../src/components/roadmap/SkillMapNew';
import CompanyTicker from '../src/components/roadmap-new/CompanyTicker';
import { GraduationCap, CheckCircle, ArrowRight, Target, CurrencyDollar, Users, TrendUp, Clock, ChartBar, X, Code, SquaresFour, Tree, GraphicsCard, Function, Check, Phone, ArrowUpRight, Gauge, Timer, MagnifyingGlass, BriefcaseMetal, ChartLine, Sparkle } from 'phosphor-react';
import projectsData from '../src/data/projects.json';
import projectStepsData from '../src/data/projectSteps.json';

const RoadmapNew = () => {
  const { roadmapData, quizResponses, background, evaluationResults } = useUnified();

  const [activeSection, setActiveSection] = useState('skills');
  const [selectedCompanyType, setSelectedCompanyType] = useState('high-growth');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Loader states
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

  // Loader animation - 6 second fake loader
  useEffect(() => {
    // Ensure loader always shows on mount
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

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrollPercentage, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracking based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['skills', 'companies', 'learning', 'projects'];
      const scrollPosition = window.scrollY + 150; // Offset for navbar

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
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for testing (will use actual roadmapData when available)
  const mockRoadmapData = roadmapData || {
    targetRole: 'Senior Backend Engineer',
    targetCompany: 'Big-Tech Companies',
    timeline: '6-9 months',
    effortPerWeek: '10',
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

  // Company types data
  const companyTypes = {
    'high-growth': {
      name: 'High Growth Startups',
      description: 'Fast-scaling companies with product-market fit. Offers high learning, equity upside, and cutting-edge tech with lean teams.',
      fit: {
        level: 'achievable',
        color: 'blue',
        message: 'Stretched target - You might need longer time, higher level of DSA & system design skills with relevant work experience'
      },
      whyFit: [
        'You have solid programming fundamentals',
        'Your experience aligns with startup needs',
        'Strong potential for rapid growth'
      ],
      whatToDo: [
        'Master System Design patterns',
        'Build 2-3 production-ready projects',
        'Practice 100+ DSA problems'
      ],
      salary: '₹15-30 LPA',
      teamSize: '20-200 people',
      workLife: {
        level: 'Moderate',
        description: 'Fast-paced environment with learning opportunities'
      },
      companies: ['Razorpay', 'Zerodha', 'Cred', 'Groww', 'Meesho', 'Urban Company', 'ShareChat', 'Dream11', 'PharmEasy', 'Lenskart', 'Nykaa', 'Slice'],
      rounds: [
        {
          name: 'Coding Assessment',
          difficulty: 'medium',
          duration: '45 mins',
          videoUrl: 'https://www.youtube.com/embed/sg5pwazWomM',
          points: [
            '2-3 DSA problems (arrays, strings, trees)',
            'Focus on optimal time complexity',
            'Code quality and edge cases matter'
          ]
        },
        {
          name: 'System Design',
          difficulty: 'hard',
          duration: '60 mins',
          videoUrl: 'https://www.youtube.com/embed/o39hGS4ef6E',
          points: [
            'Design scalable systems (e.g., URL shortener, chat app)',
            'Discuss tradeoffs and bottlenecks',
            'Show understanding of databases, caching, load balancing'
          ]
        },
        {
          name: 'Hiring Manager',
          difficulty: 'easy',
          duration: '30 mins',
          videoUrl: 'https://www.youtube.com/embed/6yJ8eTtId8A',
          points: [
            'Cultural fit and past experience',
            'Problem-solving approach',
            'Questions about the role and team'
          ]
        }
      ]
    },
    'unicorns': {
      name: 'Product Unicorns',
      description: 'Billion-dollar companies serving millions. Combines startup innovation with big-company stability, excellent pay and work culture.',
      fit: {
        level: 'good',
        color: 'green',
        message: 'Next best step - You can immediately work towards this path, it\'s your most achievable next move'
      },
      whyFit: [
        'Strong technical foundation matches their requirements',
        'Experience with modern tech stack',
        'Problem-solving mindset aligns with product culture'
      ],
      whatToDo: [
        'Deep dive into distributed systems',
        'Build portfolio with scalable architecture',
        'Practice behavioral interviews'
      ],
      salary: '₹25-50 LPA',
      teamSize: '200-1000 people',
      workLife: {
        level: 'Good',
        description: 'Structured processes with work-life balance'
      },
      companies: ['Swiggy', 'Zomato', 'Paytm', 'PhonePe', 'Ola', 'Flipkart', 'Myntra', 'Udaan', 'OYO', 'BigBasket', 'PolicyBazaar', 'Delhivery'],
      rounds: [
        {
          name: 'Online Assessment',
          difficulty: 'medium',
          duration: '90 mins',
          videoUrl: 'https://www.youtube.com/embed/sg5pwazWomM',
          points: [
            '3-4 DSA problems with increasing difficulty',
            'Focus on clean, well-documented code',
            'Handle edge cases and optimize solutions'
          ]
        },
        {
          name: 'Technical Interview',
          difficulty: 'hard',
          duration: '60 mins',
          videoUrl: 'https://www.youtube.com/embed/o39hGS4ef6E',
          points: [
            'Live coding with advanced DSA problems',
            'System design discussion',
            'Past project deep-dive'
          ]
        },
        {
          name: 'Managerial Round',
          difficulty: 'medium',
          duration: '45 mins',
          videoUrl: 'https://www.youtube.com/embed/6yJ8eTtId8A',
          points: [
            'Leadership and team collaboration',
            'Handling ambiguity and conflicts',
            'Career goals and motivations'
          ]
        }
      ]
    },
    'service': {
      name: 'Service Companies',
      description: 'IT consulting firms with diverse projects. Offer stability and domain exposure, but typically lower pay and slower growth than product companies.',
      fit: {
        level: 'transition',
        color: 'orange',
        message: 'Later career opportunity - Sets you up for any other role in tech. You\'d need significant mastery in DSA, system design and exceptional work record'
      },
      whyFit: [
        'Lower barrier to entry',
        'Good for building foundational experience',
        'Opportunities to work on diverse projects'
      ],
      whatToDo: [
        'Build strong coding fundamentals',
        'Get comfortable with common frameworks',
        'Focus on communication skills'
      ],
      salary: '₹8-20 LPA',
      teamSize: '100-10000+ people',
      workLife: {
        level: 'Variable',
        description: 'Depends on client projects and deadlines'
      },
      companies: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'HCL', 'Tech Mahindra', 'Accenture', 'Capgemini', 'LTI', 'Mindtree', 'Mphasis', 'Persistent'],
      rounds: [
        {
          name: 'Aptitude Test',
          difficulty: 'easy',
          duration: '60 mins',
          videoUrl: 'https://www.youtube.com/embed/sg5pwazWomM',
          points: [
            'Logical reasoning and quantitative aptitude',
            'Basic programming concepts',
            'English comprehension'
          ]
        },
        {
          name: 'Technical Interview',
          difficulty: 'medium',
          duration: '45 mins',
          videoUrl: 'https://www.youtube.com/embed/sg5pwazWomM',
          points: [
            'Core language concepts (Java/Python)',
            'Database queries and OOP',
            'Basic DSA questions'
          ]
        },
        {
          name: 'HR Round',
          difficulty: 'easy',
          duration: '30 mins',
          videoUrl: 'https://www.youtube.com/embed/6yJ8eTtId8A',
          points: [
            'Background verification',
            'Salary negotiation',
            'Notice period and joining date'
          ]
        }
      ]
    },
    'big-tech': {
      name: 'FAANG / Big-Tech',
      description: 'Global tech giants (Google, Amazon, Meta, Microsoft, Apple). World-class pay, cutting-edge tech, excellent work-life balance, and top-tier learning.',
      fit: {
        level: 'achievable',
        color: 'blue',
        message: 'Stretched target - You might need longer time, higher level of DSA & system design skills with relevant work experience'
      },
      whyFit: [
        'You have the right foundation to build upon',
        'Your problem-solving skills can be sharpened',
        'Timeline allows for comprehensive preparation'
      ],
      whatToDo: [
        'Solve 200+ LeetCode problems (Easy to Hard)',
        'Master advanced system design (distributed systems, scalability)',
        'Practice behavioral questions (STAR format)'
      ],
      salary: '₹40-80 LPA',
      teamSize: '1000+ people',
      workLife: {
        level: 'Excellent',
        description: 'Strong work-life balance with great perks'
      },
      companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Salesforce', 'Oracle', 'Intel', 'Nvidia', 'Twitter'],
      rounds: [
        {
          name: 'Phone Screen',
          difficulty: 'medium',
          duration: '45 mins',
          videoUrl: 'https://www.youtube.com/embed/sg5pwazWomM',
          points: [
            '1-2 medium DSA problems',
            'Focus on communication and approach',
            'Optimization and complexity analysis'
          ]
        },
        {
          name: 'Onsite Coding Rounds',
          difficulty: 'hard',
          duration: '4-5 hours',
          videoUrl: 'https://www.youtube.com/embed/o39hGS4ef6E',
          points: [
            'Multiple rounds with medium-hard DSA problems',
            'System design for senior roles',
            'Focus on scalability and tradeoffs'
          ]
        },
        {
          name: 'Behavioral Round',
          difficulty: 'medium',
          duration: '45 mins',
          videoUrl: 'https://www.youtube.com/embed/6yJ8eTtId8A',
          points: [
            'Leadership principles and values',
            'Past experiences and conflict resolution',
            'Long-term career goals'
          ]
        }
      ]
    }
  };

  const currentCompany = companyTypes[selectedCompanyType];

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

  return (
    <>
      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <Hero roadmapData={mockRoadmapData} />

      {/* Main Content Area */}
      <div className="w-full">
        <div className="mx-auto px-5 py-16 pb-32 lg:px-[100px] max-w-[1440px]">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex gap-12">

              {/* Sidebar */}
              <Sidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                <div className="space-y-20">
                  {/* Section 1: Skills Analysis */}
                  <section id="skills" className="scroll-mt-24">
                    <div className="mb-8 relative z-10 bg-white">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">YOUR CURRENT LEVEL</p>
                      <h2 className="text-3xl font-bold text-slate-900">
                        Understand Where You Stand Today
                      </h2>
                    </div>

                    <div className="relative space-y-12">
                      {/* Connecting line for desktop/tablet */}
                      <div className="hidden md:block absolute left-[15px] top-8 bottom-12 w-0.5 bg-slate-300"></div>

                      {/* Step 1: Skill Map */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6 relative z-20 pb-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            1
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Your Skill Map</h3>
                        </div>
                        <div className="md:ml-14">

                          <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12 items-start">
                            {/* RIGHT: Chart (LEFT on desktop after flex-row-reverse) */}
                            <div className="w-full lg:flex-1 flex-shrink-0 -mt-16 lg:-mt-32">
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

                            {/* LEFT: Explanation (RIGHT on desktop after flex-row-reverse) */}
                            <div className="w-full lg:w-[380px] flex-shrink-0">
                              <p className="text-base text-slate-600 leading-relaxed text-left mb-4">
                                To reach your target role of <span className="font-semibold text-slate-900">{mockRoadmapData.targetRole}</span>, you need to be strong in DSA, System Design, Languages, Databases, and have solid Projects.
                              </p>
                              <p className="text-base text-slate-600 leading-relaxed text-left">
                                The dotted line shows the average skill level for your target role. Focus on closing the gaps in high-priority areas first.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Skill Analysis */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            2
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Skill Analysis</h3>
                        </div>
                        <div className="md:ml-14">

                          <p className="text-base text-slate-600 leading-relaxed mb-8">
                            We understand that you have good proficiency in{' '}
                            {mockRoadmapData.currentSkills.map((skill, idx) => (
                              <span key={idx}>
                                <code className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm font-mono">
                                  {skill}
                                </code>
                                {idx < mockRoadmapData.currentSkills.length - 2 && ', '}
                                {idx === mockRoadmapData.currentSkills.length - 2 && ' and '}
                              </span>
                            ))}. We have found that you need to master{' '}
                            <span className="font-semibold text-slate-900">
                              {mockRoadmapData.missingSkills.highPriority.length +
                               mockRoadmapData.missingSkills.mediumPriority.length +
                               mockRoadmapData.missingSkills.lowPriority.length} skills
                            </span>{' '}
                            to reach your target role. Below is a priority order for you.
                          </p>

                          {/* Skills Table */}
                          <div className="w-full overflow-x-auto -mx-4 md:mx-0">
                            <div className="min-w-[600px] md:min-w-0 border-t border-b border-slate-200">
                              {/* Header Row */}
                              <div className="grid grid-cols-3 gap-4 md:gap-6 py-3 px-4 bg-slate-50 border-b border-slate-200">
                                <div>
                                  <h5 className="text-base font-bold text-slate-900">High Priority</h5>
                                </div>
                                <div>
                                  <h5 className="text-base font-bold text-slate-900">Medium Priority</h5>
                                </div>
                                <div>
                                  <h5 className="text-base font-bold text-slate-900">Low Priority</h5>
                                </div>
                              </div>

                              {/* Content Row */}
                              <div className="grid grid-cols-3 gap-4 md:gap-6 py-4 px-4">
                                {/* High Priority */}
                                <div className="flex flex-col gap-2">
                                  {mockRoadmapData.missingSkills.highPriority.map((item, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-sm whitespace-nowrap">
                                      <GraduationCap size={14} weight="fill" className="text-red-600 flex-shrink-0" />
                                      <span className="text-red-800 text-xs font-medium">{item.skill}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Medium Priority */}
                                <div className="flex flex-col gap-2">
                                  {mockRoadmapData.missingSkills.mediumPriority.map((item, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 border border-orange-200 rounded-sm whitespace-nowrap">
                                      <GraduationCap size={14} weight="fill" className="text-orange-600 flex-shrink-0" />
                                      <span className="text-orange-800 text-xs font-medium">{item.skill}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Low Priority */}
                                <div className="flex flex-col gap-2">
                                  {mockRoadmapData.missingSkills.lowPriority.map((item, idx) => (
                                    <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded-sm whitespace-nowrap">
                                      <GraduationCap size={14} weight="fill" className="text-slate-600 flex-shrink-0" />
                                      <span className="text-slate-700 text-xs font-medium">{item.skill}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Company Insights */}
                  <section id="companies" className="scroll-mt-24">
                    <div className="mb-8">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">TARGET COMPANIES</p>
                      <h2 className="text-3xl font-bold text-slate-900">
                        Company Insights
                      </h2>
                    </div>

                    {/* Segmented Control - Sticky */}
                    <div className="sticky top-16 z-20 bg-white pt-4 pb-6 mb-6">
                      <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-none w-full overflow-x-auto">
                        <button
                          onClick={() => setSelectedCompanyType('high-growth')}
                          className={`flex-1 px-3 md:px-4 py-2.5 text-xs md:text-sm font-semibold rounded-none transition-colors whitespace-nowrap ${
                            selectedCompanyType === 'high-growth'
                              ? 'text-white bg-slate-700 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          High Growth Startups
                        </button>
                        <button
                          onClick={() => setSelectedCompanyType('unicorns')}
                          className={`flex-1 px-3 md:px-4 py-2.5 text-xs md:text-sm font-semibold rounded-none transition-colors whitespace-nowrap ${
                            selectedCompanyType === 'unicorns'
                              ? 'text-white bg-slate-700 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Product Unicorns
                        </button>
                        <button
                          onClick={() => setSelectedCompanyType('service')}
                          className={`flex-1 px-3 md:px-4 py-2.5 text-xs md:text-sm font-semibold rounded-none transition-colors whitespace-nowrap ${
                            selectedCompanyType === 'service'
                              ? 'text-white bg-slate-700 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Service Companies
                        </button>
                        <button
                          onClick={() => setSelectedCompanyType('big-tech')}
                          className={`flex-1 px-3 md:px-4 py-2.5 text-xs md:text-sm font-semibold rounded-none transition-colors whitespace-nowrap ${
                            selectedCompanyType === 'big-tech'
                              ? 'text-white bg-slate-700 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          FAANG / Big-Tech
                        </button>
                      </div>
                    </div>

                    {/* Company Overview Section - Before Steppers */}
                    <div className="mb-16">
                      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* LEFT: Description + Stats */}
                        <div className="lg:w-1/2 space-y-6">
                          {/* Description */}
                          <p className="text-base text-slate-700 leading-relaxed">
                            {currentCompany.description}
                          </p>

                          {/* Stats - Horizontal on desktop, vertical on mobile */}
                          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                            {/* Team Size */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                                <Users size={16} weight="regular" className="text-slate-600" />
                              </div>
                              <div>
                                <h5 className="text-xs text-slate-500 mb-0.5">Company Size</h5>
                                <p className="text-base font-semibold text-slate-900">{currentCompany.teamSize}</p>
                              </div>
                            </div>

                            {/* Divider - Hidden on mobile, vertical line on desktop */}
                            <div className="hidden md:block md:h-10 md:w-px bg-slate-200"></div>

                            {/* Expected Salary */}
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                                <CurrencyDollar size={16} weight="regular" className="text-slate-600" />
                              </div>
                              <div>
                                <h5 className="text-xs text-slate-500 mb-0.5">Expected Salary</h5>
                                <p className="text-base font-semibold text-slate-900">{currentCompany.salary}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT: Company Ticker */}
                        <div className="lg:w-1/2">
                          <CompanyTicker companies={currentCompany.companies} />
                        </div>
                      </div>
                    </div>

                    <div className="relative space-y-12">
                      {/* Connecting line for desktop/tablet */}
                      <div className="hidden md:block absolute left-[15px] top-8 bottom-8 w-0.5 bg-slate-300"></div>

                      {/* Step 1: Your Fit Analysis */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            1
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Your Fit Analysis</h3>
                        </div>
                        <div className="md:ml-14 space-y-6">
                          {/* Fit Banner with Icon */}
                          <div className={`flex items-center gap-3 p-4 rounded-sm border ${
                            currentCompany.fit.color === 'green'
                              ? 'bg-green-50 border-green-200'
                              : currentCompany.fit.color === 'blue'
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-orange-50 border-orange-200'
                          }`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center ${
                              currentCompany.fit.color === 'green'
                                ? 'bg-green-100'
                                : currentCompany.fit.color === 'blue'
                                ? 'bg-blue-100'
                                : 'bg-orange-100'
                            }`}>
                              <Target
                                size={16}
                                weight="fill"
                                className={
                                  currentCompany.fit.color === 'green'
                                    ? 'text-green-600'
                                    : currentCompany.fit.color === 'blue'
                                    ? 'text-blue-600'
                                    : 'text-orange-600'
                                }
                              />
                            </div>
                            <p className={`text-sm font-semibold leading-relaxed ${
                              currentCompany.fit.color === 'green'
                                ? 'text-green-900'
                                : currentCompany.fit.color === 'blue'
                                ? 'text-blue-900'
                                : 'text-orange-900'
                            }`}>
                              {currentCompany.fit.message}
                            </p>
                          </div>

                          {/* Two horizontal boxes with gradients */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Box - Dynamic based on fit level */}
                            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">
                                {currentCompany.fit.color === 'green'
                                  ? "Why You're a Good Fit"
                                  : currentCompany.fit.color === 'blue'
                                  ? "Why It's Feasible"
                                  : "Why You Still Have a Shot"
                                }
                              </h4>
                              <ul className="space-y-3">
                                {currentCompany.whyFit.map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                    <CheckCircle size={18} weight="fill" className="text-green-600 flex-shrink-0 mt-0.5" />
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Right Box - Dynamic based on fit level */}
                            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">
                                {currentCompany.fit.color === 'green'
                                  ? "What You Need to Improve"
                                  : currentCompany.fit.color === 'blue'
                                  ? "What You Need"
                                  : "Why It's Challenging"
                                }
                              </h4>
                              <ul className="space-y-3">
                                {currentCompany.whatToDo.map((task, idx) => (
                                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                                    <TrendUp size={18} weight="bold" className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2: Selection Process */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            2
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Selection Process</h3>
                        </div>
                        <div className="md:ml-14">
                          {/* Accordion - Exact copy of reference */}
                          <div className="space-y-0 border border-slate-200">
                            {currentCompany.rounds.map((round, idx) => {
                              // Get difficulty badge styling
                              const getDifficultyStyle = (difficulty) => {
                                const styles = {
                                  easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-600' },
                                  medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' },
                                  hard: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' }
                                };
                                return styles[difficulty] || styles.medium;
                              };

                              const diffStyle = getDifficultyStyle(round.difficulty);

                              return (
                                <details key={idx} className="group border-b border-slate-200 last:border-b-0">
                                  <summary className="flex items-center gap-4 p-5 cursor-pointer list-none bg-slate-50 transition-colors">
                                    {/* Chevron on left - right pointing */}
                                    <svg className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>

                                    {/* Title and tags */}
                                    <div className="flex-1 flex items-center gap-3 flex-wrap">
                                      <h4 className="text-base font-semibold text-slate-900">
                                        Round {idx + 1}: {round.name}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-none ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                                          <ChartBar size={12} weight="bold" className={diffStyle.icon} />
                                          {round.difficulty.charAt(0).toUpperCase() + round.difficulty.slice(1)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded-none">
                                          <Clock size={12} weight="bold" className="text-slate-600" />
                                          {round.duration}
                                        </span>
                                      </div>
                                    </div>
                                  </summary>

                                  <div className="p-5 bg-white">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      {/* Left: Points list */}
                                      <div>
                                        <ul className="space-y-2.5">
                                          {round.points.map((point, pointIdx) => (
                                            <li key={pointIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                                              <span className="flex-shrink-0 w-1.5 h-1.5 bg-slate-400 mt-2"></span>
                                              <span>{point}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Right: YouTube Embed */}
                                      <div>
                                        {round.videoUrl ? (
                                          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                            <iframe
                                              className="absolute top-0 left-0 w-full h-full rounded-sm border-0"
                                              src={round.videoUrl}
                                              title={round.videoTitle || `How to ace ${round.name}`}
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                            ></iframe>
                                          </div>
                                        ) : (
                                          <div className="relative w-full bg-slate-100 rounded-sm flex items-center justify-center" style={{ paddingBottom: '56.25%' }}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                              <p className="text-slate-400 text-sm">Video coming soon</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </details>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 3: Learning Path */}
                  <section id="learning" className="scroll-mt-24">
                    <div className="mb-8">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ROADMAP TO SUCCESS</p>
                      <h2 className="text-3xl font-bold text-slate-900 mb-3">
                        Your Learning Path
                      </h2>
                      <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
                        Based on your current skill set and target role, here's the structured path we recommend to bridge the gap and land your dream job.
                      </p>
                    </div>

                    <div className="relative space-y-12">
                      {/* Connecting line for desktop/tablet */}
                      <div className="hidden md:block absolute left-[15px] top-8 bottom-8 w-0.5 bg-slate-300"></div>

                      {/* Phase 1: Master DSA */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            1
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Master Data Structures & Algorithms</h3>
                        </div>

                        <div className="md:ml-14 space-y-6">
                          {/* What You'll Learn with Video */}
                          <div className="bg-gradient-to-b from-white to-slate-50 p-6 rounded-sm">
                            <h4 className="text-lg font-bold text-slate-900 mb-6">What You'll Learn</h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                              {/* Left: Learning Points */}
                              <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">1.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Arrays, Strings & Hash Tables</h5>
                                    <p className="text-xs text-slate-600">Master common data structures and pattern recognition</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">2.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Trees, Graphs & Traversals</h5>
                                    <p className="text-xs text-slate-600">Understand hierarchical structures and algorithms</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">3.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Dynamic Programming Patterns</h5>
                                    <p className="text-xs text-slate-600">Break down complex problems efficiently</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">4.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Time & Space Complexity</h5>
                                    <p className="text-xs text-slate-600">Analyze and optimize algorithm efficiency</p>
                                  </div>
                                </li>
                              </ul>

                              {/* Right: Video Embed */}
                              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full rounded-sm border-0"
                                  src="https://www.youtube.com/embed/_dl8KiU1HYY"
                                  title="DSA Fundamentals"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          </div>

                          {/* Two Column Layout: Target & Why It Matters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Target */}
                            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">Target</h4>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-green-100 flex items-center justify-center">
                                  <Target size={20} weight="bold" className="text-green-600" />
                                </div>
                                <p className="text-xl font-bold text-slate-900">150+ DSA Problems</p>
                              </div>
                              <p className="text-sm text-slate-700">
                                Solve problems across easy, medium, and hard difficulty on LeetCode covering all patterns
                              </p>
                            </div>

                            {/* Why It Matters */}
                            <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">Why It Matters</h4>
                              <ul className="space-y-2.5">
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>DSA forms 80% of technical rounds</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Demonstrates algorithmic thinking</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Essential for code optimization</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Required for senior roles</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phase 2: System Design */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            2
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Learn System Design Fundamentals</h3>
                        </div>

                        <div className="md:ml-14 space-y-6">
                          {/* What You'll Learn with Video - FLIPPED LAYOUT */}
                          <div className="bg-gradient-to-b from-white to-slate-50 p-6 rounded-sm">
                            <h4 className="text-lg font-bold text-slate-900 mb-6">What You'll Learn</h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                              {/* Left: Video Embed (FLIPPED) */}
                              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full rounded-sm border-0"
                                  src="https://www.youtube.com/embed/o39hGS4ef6E"
                                  title="System Design Fundamentals"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>

                              {/* Right: Learning Points (FLIPPED) */}
                              <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">1.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Scalability & Load Balancing</h5>
                                    <p className="text-xs text-slate-600">Design systems that handle millions of users efficiently</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">2.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Databases & Caching</h5>
                                    <p className="text-xs text-slate-600">Master SQL, NoSQL, Redis, and database optimization</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">3.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Microservices Architecture</h5>
                                    <p className="text-xs text-slate-600">Break monoliths into scalable microservices</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">4.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Trade-offs & Best Practices</h5>
                                    <p className="text-xs text-slate-600">Make informed architectural decisions</p>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Two Column Layout: Target & Why It Matters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Target */}
                            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">Target</h4>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-green-100 flex items-center justify-center">
                                  <Target size={20} weight="bold" className="text-green-600" />
                                </div>
                                <p className="text-xl font-bold text-slate-900">10+ System Designs</p>
                              </div>
                              <p className="text-sm text-slate-700">
                                Design popular systems like URL shortener, Twitter, Netflix, and Uber to understand real-world patterns
                              </p>
                            </div>

                            {/* Why It Matters */}
                            <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">Why It Matters</h4>
                              <ul className="space-y-2.5">
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Mandatory for senior positions</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Tests architectural thinking</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Critical for scalable systems</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Differentiates senior engineers</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Phase 3: Build Projects */}
                      <div className="relative">
                        <div className="flex gap-3 md:gap-6 items-start mb-6">
                          <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
                            3
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 pt-0.5">Build Real-World Projects</h3>
                        </div>

                        <div className="md:ml-14 space-y-6">
                          {/* What You'll Learn with Video */}
                          <div className="bg-gradient-to-b from-white to-slate-50 p-6 rounded-sm">
                            <h4 className="text-lg font-bold text-slate-900 mb-6">What You'll Learn</h4>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                              {/* Left: Learning Points */}
                              <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">1.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Full-Stack Development</h5>
                                    <p className="text-xs text-slate-600">Build end-to-end apps with authentication and APIs</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">2.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Production Best Practices</h5>
                                    <p className="text-xs text-slate-600">Write clean, maintainable code with testing</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">3.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Deployment & DevOps</h5>
                                    <p className="text-xs text-slate-600">Deploy to cloud with CI/CD and Docker</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <span className="flex-shrink-0 text-slate-900 font-bold text-sm mt-0.5">4.</span>
                                  <div>
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1">Portfolio Presentation</h5>
                                    <p className="text-xs text-slate-600">Document projects for interview showcase</p>
                                  </div>
                                </li>
                              </ul>

                              {/* Right: Video Embed */}
                              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full rounded-sm border-0"
                                  src="https://www.youtube.com/embed/6yJ8eTtId8A"
                                  title="Build Production Projects"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          </div>

                          {/* Two Column Layout: Target & Why It Matters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Target */}
                            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">Target</h4>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-green-100 flex items-center justify-center">
                                  <Target size={20} weight="bold" className="text-green-600" />
                                </div>
                                <p className="text-xl font-bold text-slate-900">3-5 Projects</p>
                              </div>
                              <p className="text-sm text-slate-700">
                                Build projects of increasing complexity - from basic CRUD apps to advanced microservices architectures
                              </p>
                            </div>

                            {/* Why It Matters */}
                            <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-sm">
                              <h4 className="text-lg font-bold text-slate-900 mb-4">Why It Matters</h4>
                              <ul className="space-y-2.5">
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Proves production-ready skills</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Conversation starters in interviews</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Validates technical expertise</span>
                                </li>
                                <li className="flex items-start gap-2.5 text-sm text-slate-700">
                                  <Check size={16} weight="bold" className="text-purple-600 flex-shrink-0 mt-0.5" />
                                  <span>Showcases end-to-end capability</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Project Ideas */}
                  <section id="projects" className="scroll-mt-24 mb-40">
                    <div className="mb-8">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">BUILD & SHOWCASE</p>
                      <h2 className="text-3xl font-bold text-slate-900">
                        Project Ideas to Crack Your Role
                      </h2>
                      <p className="text-slate-600 mt-2">
                        Build these projects to demonstrate your skills and stand out in interviews
                      </p>
                    </div>

                    {/* Project Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projectsData['Backend Engineering'].slice(0, 3).map((project, index) => {
                        // Cycle through different icon colors and icons
                        const iconColors = [
                          { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: Code },
                          { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', icon: SquaresFour },
                          { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', icon: Tree }
                        ];
                        const colorScheme = iconColors[index % iconColors.length];
                        const IconComponent = colorScheme.icon;

                        return (
                          <div
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project);
                              setIsDrawerOpen(true);
                            }}
                            className="border border-slate-200 rounded-sm p-6 cursor-pointer hover:border-slate-400 hover:shadow-lg transition-all bg-white flex flex-col"
                          >
                            {/* Icon Container */}
                            <div className={`w-12 h-12 ${colorScheme.bg} border ${colorScheme.border} rounded-sm flex items-center justify-center mb-4`}>
                              <IconComponent size={24} weight="bold" className={colorScheme.text} />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{project.title}</h3>

                            {/* Tags */}
                            <div className="flex items-center gap-2 mb-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-none ${
                                project.tier === 'Beginner'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : project.tier === 'Intermediate'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                <Gauge size={12} weight="bold" />
                                {project.tier}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-none bg-slate-50 text-slate-700 border border-slate-200">
                                <Timer size={12} weight="bold" />
                                {project.estimatedTime}
                              </span>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">{project.description}</p>

                            {/* Full-width CTA - matching Ask Aditi style */}
                            <button
                              className="w-full py-2.5 px-4 text-sm font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all rounded-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                              VIEW DETAILS
                              <ArrowUpRight size={14} weight="bold" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Side Drawer for Project Details */}
      {isDrawerOpen && selectedProject && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedProject.title}</h2>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-none ${
                    selectedProject.tier === 'Beginner'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : selectedProject.tier === 'Intermediate'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    {selectedProject.tier}
                  </span>
                  <span className="text-sm text-slate-600 flex items-center gap-1.5">
                    <Clock size={14} weight="bold" />
                    {selectedProject.estimatedTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-sm transition-colors"
              >
                <X size={24} weight="bold" className="text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Description</h3>
                <p className="text-slate-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Skills You'll Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-none border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Implementation Steps */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Implementation Steps</h3>

                {projectStepsData[selectedProject.id] ? (
                  <div className="space-y-0 border border-slate-200">
                    {projectStepsData[selectedProject.id].steps.map((step, idx) => (
                      <details key={idx} className="group border-b border-slate-200 last:border-b-0">
                        <summary className="flex items-center gap-4 p-4 cursor-pointer list-none bg-slate-50 transition-colors">
                          <svg className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <div className="flex-1 flex items-center gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="text-base font-semibold text-slate-900">{step.title}</h4>
                          </div>
                        </summary>
                        <div className="p-4 bg-white">
                          <p className="text-sm text-slate-700 leading-relaxed">{step.description}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Implementation steps coming soon...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA Button - Visible on both mobile and desktop */}
      <button
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#B30158] hover:bg-[#8A0145] text-white font-bold py-3 px-6 rounded-none transition-all duration-200 z-50 uppercase tracking-wide text-sm flex items-center gap-2.5"
        style={{
          boxShadow: '0 4px 14px 0 rgba(179, 1, 88, 0.39)'
        }}
        onClick={() => window.open('/callback', '_blank')}
      >
        <Phone size={20} weight="fill" className="flex-shrink-0" />
        <span className="whitespace-nowrap">Book a Free Career Call</span>
      </button>
    </>
  );
};

export default RoadmapNew;
