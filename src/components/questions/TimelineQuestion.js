import React, { useState } from 'react';
import styled from 'styled-components';
import { useRoadmap } from '../../context/UnifiedContext';

const TimelineQuestion = ({ selectedTimeline = null, onSubmit, onBack }) => {
  const { profileData } = useRoadmap();
  const [timeline, setTimeline] = useState(selectedTimeline);

  // Different timelines based on user type
  const getTimelineOptions = () => {
    const isTechProfessional = profileData?.userType === 'tech_professional';
    const hasGoodCodingPractice = profileData?.codingPractice &&
      (profileData.codingPractice.includes('50') || profileData.codingPractice.includes('very'));

    if (isTechProfessional && hasGoodCodingPractice) {
      return [
        {
          value: '3-6-months',
          label: '3-6 months',
          description: 'Intensive - 8-10 hrs/week',
          intensity: 'high'
        },
        {
          value: '6-9-months',
          label: '6-9 months',
          description: 'Balanced - 5-7 hrs/week',
          intensity: 'medium',
          recommended: true
        },
        {
          value: '9-12-months',
          label: '9-12 months',
          description: 'Comfortable - 3-5 hrs/week',
          intensity: 'low'
        },
        {
          value: 'just-exploring',
          label: 'Just exploring',
          description: 'No specific timeline',
          intensity: 'flexible'
        }
      ];
    } else {
      // Career switchers or beginners
      return [
        {
          value: '6-9-months',
          label: '6-9 months',
          description: 'Intensive - 10+ hrs/week',
          intensity: 'high'
        },
        {
          value: '9-12-months',
          label: '9-12 months',
          description: 'Aggressive - 6-10 hrs/week',
          intensity: 'medium',
          recommended: true
        },
        {
          value: '12-18-months',
          label: '12-18 months',
          description: 'Balanced - 3-5 hrs/week',
          intensity: 'low'
        },
        {
          value: '18-plus-months',
          label: '18+ months',
          description: 'Comfortable pace',
          intensity: 'very-low'
        },
        {
          value: 'just-exploring',
          label: 'Just exploring',
          description: 'No specific timeline',
          intensity: 'flexible'
        }
      ];
    }
  };

  const timelineOptions = getTimelineOptions();

  const handleSelect = (value) => {
    setTimeline(value);
  };

  const handleContinue = () => {
    if (timeline) {
      onSubmit(timeline);
    }
  };

  return (
    <Container>
      <Content>
        <Header>
          <StepIndicator>Question 2 of 2</StepIndicator>
          <Title>When would you like to be interview-ready?</Title>
          <Subtitle>
            Choose a timeline that works with your schedule. This will help us pace your roadmap appropriately.
          </Subtitle>
        </Header>

        <OptionsGrid>
          {timelineOptions.map(option => (
            <TimelineOption
              key={option.value}
              selected={timeline === option.value}
              recommended={option.recommended}
              onClick={() => handleSelect(option.value)}
            >
              {option.recommended && <RecommendedBadge>Recommended</RecommendedBadge>}
              <OptionLabel>{option.label}</OptionLabel>
              <OptionDescription>{option.description}</OptionDescription>
              <RadioCircle selected={timeline === option.value}>
                {timeline === option.value && <RadioDot />}
              </RadioCircle>
            </TimelineOption>
          ))}
        </OptionsGrid>

        <InfoBox>
          <InfoIcon>💡</InfoIcon>
          <InfoText>
            Timeline determines the pacing of your roadmap and which skills to prioritize.
            You can always adjust your pace as you progress.
          </InfoText>
        </InfoBox>

        <Actions>
          <BackButton onClick={onBack}>← Back</BackButton>
          <GenerateButton
            onClick={handleContinue}
            disabled={!timeline}
          >
            Generate My Roadmap →
          </GenerateButton>
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
  max-width: 800px;
  width: 100%;
  background: white;
  padding: 3rem;
  border-radius: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
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
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TimelineOption = styled.button`
  position: relative;
  padding: 1.5rem;
  background: ${props => props.selected ? '#fef2f2' : 'white'};
  border: 2px solid ${props => props.selected ? '#e11d48' : '#e2e8f0'};
  border-radius: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif;

  &:hover {
    border-color: ${props => props.selected ? '#be185d' : '#cbd5e1'};
    background: ${props => props.selected ? '#fef2f2' : '#f8fafc'};
  }

  ${props => props.recommended && `
    border-color: #e11d48;
  `}
`;

const RecommendedBadge = styled.span`
  position: absolute;
  top: -10px;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: #e11d48;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const OptionLabel = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const RadioCircle = styled.div`
  position: absolute;
  top: 50%;
  right: 1.5rem;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? '#e11d48' : '#cbd5e1'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
`;

const RadioDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e11d48;
`;

const InfoBox = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0;
  margin-bottom: 2rem;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
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

const GenerateButton = styled.button`
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

export default TimelineQuestion;
