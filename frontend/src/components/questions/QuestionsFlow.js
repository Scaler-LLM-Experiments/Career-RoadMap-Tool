import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRoadmap } from '../../context/UnifiedContext';
import SkillsQuestion from './SkillsQuestion';
import TimelineQuestion from './TimelineQuestion';

const QuestionsFlow = () => {
  const navigate = useNavigate();
  const { currentSkills, timeline, setCurrentSkills, setTimeline } = useRoadmap();
  const [currentStep, setCurrentStep] = useState(0);

  const handleSkillsSubmit = (skills) => {
    setCurrentSkills(skills);
    setCurrentStep(1);
  };

  const handleTimelineSubmit = (selectedTimeline) => {
    setTimeline(selectedTimeline);
    // Navigate to roadmap generation
    navigate('/roadmap');
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Container>
      <ProgressBar>
        <ProgressFill width={(currentStep + 1) / 2 * 100} />
      </ProgressBar>

      <Content>
        {currentStep === 0 && (
          <SkillsQuestion
            selectedSkills={currentSkills}
            onSubmit={handleSkillsSubmit}
            onBack={handleBack}
          />
        )}

        {currentStep === 1 && (
          <TimelineQuestion
            selectedTimeline={timeline}
            onSubmit={handleTimelineSubmit}
            onBack={handleBack}
          />
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #e2e8f0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #e11d48;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const Content = styled.div`
  padding-top: 4px;
`;

export default QuestionsFlow;
