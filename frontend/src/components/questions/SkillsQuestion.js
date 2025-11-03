import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useUnified } from '../../context/UnifiedContext';
import { getAllSkillsForRole } from '../../utils/skillPriorities';
import { getSkillCategoryForRole, getRoleDisplayName } from '../../utils/roleMapping';

const SkillsQuestion = ({ selectedSkills = [], onSubmit, onBack }) => {
  const { quizResponses } = useUnified();
  const [skills, setSkills] = useState([]);
  const [currentSkills, setCurrentSkills] = useState(selectedSkills);
  const [targetRoleDisplay, setTargetRoleDisplay] = useState('');

  useEffect(() => {
    // Get target role from Profile Evaluator quiz responses
    const targetRole = quizResponses?.targetRole;

    if (targetRole) {
      // Map Profile Eval role to skill category
      const skillCategory = getSkillCategoryForRole(targetRole);

      // Get all skills for this category (HIGH + MEDIUM + LOW combined)
      const roleSkills = getAllSkillsForRole(skillCategory);

      // Add "None of these" option
      const skillsWithNone = ['None of these', ...roleSkills];

      setSkills(skillsWithNone);
      setTargetRoleDisplay(getRoleDisplayName(targetRole));
    } else {
      // Fallback if no target role found
      setSkills([]);
      setTargetRoleDisplay('your target role');
    }
  }, [quizResponses]);

  const toggleSkill = (skill) => {
    setCurrentSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleContinue = () => {
    if (currentSkills.length > 0) {
      onSubmit(currentSkills);
    }
  };

  return (
    <Container>
      <Content>
        <Header>
          <StepIndicator>Question 1 of 2</StepIndicator>
          <Title>What are your current technical skills?</Title>
          <Subtitle>
            Great! Since you had given your target role as <strong>{targetRoleDisplay}</strong> during
            your profile evaluation, here are the key skills for this role. Please select the ones
            you're already comfortable using independently.
          </Subtitle>
          <HelperText>
            Be honest with your selection - this helps us create a personalized and accurate
            roadmap tailored to your current skill level.
          </HelperText>
        </Header>

        <SkillsGrid>
          {skills.map(skill => (
            <SkillButton
              key={skill}
              selected={currentSkills.includes(skill)}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </SkillButton>
          ))}
        </SkillsGrid>

        <SelectedCount>
          Selected {currentSkills.length} {currentSkills.length === 1 ? 'skill' : 'skills'}
        </SelectedCount>

        <Actions>
          <BackButton onClick={onBack}>← Back</BackButton>
          <ContinueButton
            onClick={handleContinue}
            disabled={currentSkills.length === 0}
          >
            Continue →
          </ContinueButton>
        </Actions>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Content = styled.div`
  max-width: 900px;
  width: 100%;
  background: white;
  padding: 2rem 3rem;
  border-radius: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StepIndicator = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e11d48;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 0.75rem;

  strong {
    color: #e11d48;
    font-weight: 600;
  }
`;

const HelperText = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
  max-width: 600px;
  margin: 0 auto;
  font-style: italic;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.875rem;
  max-height: calc(100vh - 480px);
  overflow-y: auto;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  margin-bottom: 1.25rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const SkillButton = styled.button`
  padding: 0.875rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border: 2px solid;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  ${props => props.selected ? `
    background-color: #fce4ec;
    color: #e11d48;
    border-color: #e11d48;

    &:before {
      content: "✓";
      display: inline-block;
      font-weight: 700;
      color: #e11d48;
    }

    &:hover {
      background-color: #fce4ec;
      border-color: #be185d;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(225, 29, 72, 0.2);
    }
  ` : `
    background-color: white;
    color: #475569;
    border-color: #e2e8f0;

    &:hover {
      background-color: #f8fafc;
      border-color: #cbd5e1;
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `}
`;

const SelectedCount = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.25rem;
  padding: 0.625rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BackButton = styled.button`
  padding: 0.875rem 1.5rem;
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:hover {
    background-color: #e2e8f0;
  }
`;

const ContinueButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background-color: #e11d48;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:hover:not(:disabled) {
    background-color: #be185d;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(225, 29, 72, 0.3);
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;

export default SkillsQuestion;
