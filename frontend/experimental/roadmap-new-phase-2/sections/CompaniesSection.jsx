/**
 * COMPANIES SECTION
 * Company insights, selection process, and interview rounds
 *
 * CONFIG INTEGRATION:
 * Uses persona config data from config.companiesInsight if available
 * Falls back to hardcoded COMPANY_TYPES if config not provided
 */

import React, { useState } from 'react';
import { Target, CheckCircle, TrendUp, Users, CurrencyDollar, Clock, ChartBar } from 'phosphor-react';
import CompanyTicker from '../../../src/components/roadmap-new/CompanyTicker';

// Company data (same as in index.jsx) - FALLBACK
const COMPANY_TYPES = {
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

const CompaniesSection = ({ config }) => {
  // Hardcoded company types for buttons and overview
  const companyTypeKeys = ['high-growth', 'unicorns', 'service', 'big-tech'];
  const [selectedCompanyType, setSelectedCompanyType] = useState('high-growth');

  // Get company overview from hardcoded COMPANY_TYPES (description, salary, team size, logos)
  const hardcodedCompanyOverview = COMPANY_TYPES[selectedCompanyType];

  // Get personalized fit analysis and interview rounds from config if available
  const configData = config?.companiesInsight?.companyTypes?.find(ct => ct.type === selectedCompanyType);

  // Merge: use hardcoded overview + config-driven fit analysis and rounds
  const currentCompany = {
    // Hardcoded overview
    name: hardcodedCompanyOverview.name,
    description: hardcodedCompanyOverview.description,
    salary: hardcodedCompanyOverview.salary,
    teamSize: hardcodedCompanyOverview.teamSize,
    companies: hardcodedCompanyOverview.companies,
    // Config-driven personalized content (fallback to hardcoded if no config)
    fit: configData?.fit || hardcodedCompanyOverview.fit,
    whyFit: configData?.whyFit || hardcodedCompanyOverview.whyFit,
    whatToDo: configData?.whatToDo || hardcodedCompanyOverview.whatToDo,
    rounds: configData?.rounds || hardcodedCompanyOverview.rounds
  };

  const getDifficultyStyle = (difficulty) => {
    const styles = {
      easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-600' },
      medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-600' },
      hard: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-600' }
    };
    return styles[difficulty] || styles.medium;
  };

  return (
    <section id="companies" className="scroll-mt-24">
      <div className="mb-12">
        {/* Title Section */}
        <div className="text-left mb-3">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 whitespace-nowrap">TARGET COMPANIES</p>
          <h2 className="text-3.5xl font-bold text-slate-900 leading-snug whitespace-nowrap">
            See Which Type of Companies You Fit Into
          </h2>
        </div>
        {/* Description Below */}
        <p className="text-base text-slate-600 leading-relaxed whitespace-nowrap">
          Explore company types, their interview processes, and what they're looking for.
        </p>
      </div>

      {/* Segmented Control - Sticky */}
      <div className="sticky top-16 z-20 bg-white pt-4 pb-6 mb-6">
        <div className="flex items-center gap-0 bg-slate-100 p-1 rounded-none w-full overflow-x-auto">
          {companyTypeKeys.map((typeKey) => {
            // Get label from hardcoded COMPANY_TYPES
            const label = COMPANY_TYPES[typeKey]?.name || typeKey;

            return (
              <button
                key={typeKey}
                onClick={() => setSelectedCompanyType(typeKey)}
                className={`flex-1 px-3 md:px-4 py-2.5 text-xs md:text-sm font-semibold rounded-none transition-colors whitespace-nowrap ${
                  selectedCompanyType === typeKey
                    ? 'text-white bg-slate-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Company Overview Section */}
      <div className="mb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* LEFT: Description + Stats */}
          <div className="lg:w-1/2 space-y-6">
            {/* Description */}
            <p className="text-base text-slate-700 leading-relaxed">
              {currentCompany.description}
            </p>

            {/* Stats */}
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

              {/* Divider */}
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
        {/* Connecting line */}
        <div className="hidden md:block absolute left-[15px] top-8 bottom-8 w-0.5 bg-slate-300"></div>

        {/* Step 1: Fit Analysis */}
        <div className="relative">
          <div className="flex gap-3 md:gap-6 items-start mb-6">
            <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-slate-50 border border-slate-300 text-slate-700 flex items-center justify-center font-semibold text-base z-10">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 pt-0.5">Your Fit Analysis</h3>
          </div>
          <div className="md:ml-14 space-y-6">
            {/* Fit Banner */}
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

            {/* Two boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Box */}
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

              {/* Right Box */}
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
            {/* Accordion */}
            <div className="space-y-0 border border-slate-200">
              {currentCompany.rounds.map((round, idx) => {
                const diffStyle = getDifficultyStyle(round.difficulty);

                return (
                  <details key={idx} className="group border-b border-slate-200 last:border-b-0">
                    <summary className="flex items-center gap-4 p-5 cursor-pointer list-none bg-slate-50 transition-colors">
                      <svg className="w-4 h-4 text-slate-600 group-open:rotate-90 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>

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
                        {/* Left: Points */}
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

                        {/* Right: Video */}
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
  );
};

export default CompaniesSection;
