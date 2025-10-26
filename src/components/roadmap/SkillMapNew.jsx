import React, { useState } from 'react';
import styled from 'styled-components';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Crosshair, CheckCircle } from 'phosphor-react';

// Separate component for skill badge to handle logo state properly
const SkillBadge = ({ skill }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <KnownSkillBadge>
      {!logoError ? (
        <SkillLogo
          src={`https://img.logo.dev/${skill.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com?token=pk_X-18mHGdQfuhjN7ywKkE-Q`}
          onError={() => setLogoError(true)}
          alt=""
        />
      ) : (
        <CheckCircle size={18} weight="fill" color="#10b981" style={{ flexShrink: 0 }} />
      )}
      {skill}
    </KnownSkillBadge>
  );
};

const SkillMap = ({ currentSkills, targetRole, quizResponses, evaluationResults, background, existingSkills, missingSkills }) => {
  // Check if mobile view
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate DSA level based on actual quiz responses
  const calculateDSALevel = () => {
    if (background === 'tech') {
      // Use problemSolving from tech quiz
      switch (quizResponses?.problemSolving) {
        case '100+': return 85;
        case '51-100': return 65;
        case '11-50': return 40;
        case '0-10': return 15;
        default: return evaluationResults?.interview_readiness?.coding_assessment_percent || 20;
      }
    } else {
      // Use codeComfort from non-tech quiz
      switch (quizResponses?.codeComfort) {
        case 'confident': return 50;
        case 'learning': return 30;
        case 'beginner': return 15;
        case 'complete-beginner': return 5;
        default: return evaluationResults?.interview_readiness?.coding_assessment_percent || 10;
      }
    }
  };

  // Calculate System Design level based on actual quiz responses
  const calculateSystemDesignLevel = () => {
    if (background === 'tech') {
      // Use systemDesign from tech quiz
      switch (quizResponses?.systemDesign) {
        case 'multiple': return 80;
        case 'once': return 55;
        case 'learning': return 30;
        case 'not-yet': return 10;
        default: return evaluationResults?.interview_readiness?.system_design_percent || 15;
      }
    } else {
      // Non-tech users typically start with low system design knowledge
      return evaluationResults?.interview_readiness?.system_design_percent || 10;
    }
  };

  // Calculate Projects level based on portfolio and experience
  const calculateProjectsLevel = () => {
    if (background === 'tech') {
      switch (quizResponses?.portfolio) {
        case 'active-5+': return 80;
        case 'limited-1-5': return 50;
        case 'inactive': return 25;
        case 'none': return 10;
        default: return 30;
      }
    } else {
      // For non-tech, use stepsTaken
      switch (quizResponses?.stepsTaken) {
        case 'built-projects': return 40;
        case 'completed-course': return 25;
        case 'bootcamp': return 30;
        case 'self-learning': return 20;
        case 'just-exploring': return 5;
        default: return 15;
      }
    }
  };

  // Calculate Backend Language proficiency from current skills
  const calculateLanguageLevel = () => {
    const backendLanguages = ['Python', 'Java', 'Node.js', 'JavaScript', 'Go', 'C++', 'Ruby', 'PHP', '.NET', 'C#'];
    const matchedLanguages = currentSkills.filter(skill =>
      backendLanguages.some(lang => skill.toLowerCase().includes(lang.toLowerCase()))
    );

    if (background === 'tech') {
      return Math.min(100, matchedLanguages.length * 35);
    } else {
      return Math.min(100, matchedLanguages.length * 25);
    }
  };

  // Calculate SQL/Database proficiency from current skills
  const calculateDatabaseLevel = () => {
    const databaseSkills = ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database', 'NoSQL'];
    const matchedSkills = currentSkills.filter(skill =>
      databaseSkills.some(db => skill.toLowerCase().includes(db.toLowerCase()))
    );

    if (background === 'tech') {
      return Math.min(100, matchedSkills.length * 30);
    } else {
      return Math.min(100, matchedSkills.length * 20);
    }
  };

  // Get average learner baseline (differs by background)
  const getAverageBaseline = () => {
    if (background === 'tech') {
      return {
        dsa: 45,
        systemDesign: 35,
        projects: 50,
        language: 60,
        database: 55
      };
    } else {
      return {
        dsa: 20,
        systemDesign: 10,
        projects: 25,
        language: 30,
        database: 20
      };
    }
  };

  const avgBaseline = getAverageBaseline();

  // Prepare data for radar chart using actual calculations
  const data = [
    {
      category: 'DSA',
      user: calculateDSALevel(),
      average: avgBaseline.dsa,
      fullMark: 100,
    },
    {
      category: isMobile ? 'System Des.' : 'System Design',
      user: calculateSystemDesignLevel(),
      average: avgBaseline.systemDesign,
      fullMark: 100,
    },
    {
      category: 'Projects',
      user: calculateProjectsLevel(),
      average: avgBaseline.projects,
      fullMark: 100,
    },
    {
      category: 'Languages',
      user: calculateLanguageLevel(),
      average: avgBaseline.language,
      fullMark: 100,
    },
    {
      category: 'Databases',
      user: calculateDatabaseLevel(),
      average: avgBaseline.database,
      fullMark: 100,
    },
  ];

  return (
    <ContentWrapper>
        {/* Chart - centered with gradient background */}
        <ChartColumn>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              cx="50%"
              cy="45%"
              outerRadius="80%"
              margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />

              {/* Average learner (dotted outline) */}
              <Radar
                name={`Avg. ${targetRole}`}
                dataKey="average"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />

              {/* User's skills (filled area) */}
              <Radar
                name="My Skills"
                dataKey="user"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.5}
                strokeWidth={2}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: '10px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.875rem'
                }}
                iconType="rect"
                formatter={(value) => (
                  <span style={{ marginLeft: '8px', marginRight: '24px' }}>{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartColumn>
      </ContentWrapper>
  );
};

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 40px 0 32px 0;
`;

const SkillMapContainer = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  padding: 32px 24px;
  margin: 24px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 24px 0 !important;
    margin: 0 -20px !important; /* Break out of ContentArea's 20px padding */
    border-left: none !important;
    border-right: none !important;
    width: auto !important;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  border-radius: 8px;
  padding: 20px 20px 0 20px;
  margin-top: -36px;

  @media (max-width: 1024px) {
    padding: 20px 20px 0 40px;
  }

  @media (max-width: 768px) {
    padding: 24px 0 10px 0;
    margin-top: -34px;
    margin-left: 0;
    margin-right: 0;
  }
`;

const ChartColumn = styled.div`
  width: 100%;
  max-width: 700px;
  height: 440px;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 400px;
    max-width: 100%;
    padding: 0;
  }
`;

const ExplanationColumn = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0;

  @media (max-width: 1024px) {
    padding-left: 0;
    margin-top: 24px;
  }
`;

const ExplanationTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

const ExplanationText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.7;
  margin: 0;

  strong {
    color: #1e293b;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

// Skills sections styled components
const KnownSkillsSection = styled.div`
  margin-bottom: 32px;
`;

const KnownSkillsHeader = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const KnownSkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SkillLogo = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  border-radius: 2px;
`;

const KnownSkillBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  font-size: 14px;
  color: #065f46;
  font-weight: 500;
`;

const MissingSkillsSection = styled.div`
  margin-top: 32px;
`;

const MissingSkillsHeader = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MissingSkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PriorityColumn = styled.div``;

const PriorityHeader = styled.div`
  margin-bottom: 12px;
`;

const PriorityTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SkillItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkillItemCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: ${props => props.bg || '#ffffff'};
  border: 1px solid ${props => props.borderColor || '#e2e8f0'};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const SkillItemText = styled.span`
  font-size: 0.875rem;
  color: ${props => props.color || '#1e293b'};
  font-weight: 500;
  flex: 1;
`;

const EmptySkillText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
  margin: 0;
`;

export default SkillMap;
export {
  SkillBadge,
  KnownSkillsContainer,
  KnownSkillsHeader,
  KnownSkillsSection,
  MissingSkillsGrid,
  PriorityColumn,
  PriorityHeader,
  PriorityTitle,
  SkillItemsContainer,
  SkillItemCard,
  SkillItemText,
  EmptySkillText
};
