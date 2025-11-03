import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRoadmap } from '../../context/UnifiedContext';
import { fetchProfileData } from '../../utils/mockData';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData, setLoading } = useRoadmap();

  useEffect(() => {
    // Fetch profile data on mount
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const data = await fetchProfileData();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!profileData) {
      loadProfileData();
    }
  }, [profileData, setProfileData, setLoading]);

  const handleContinue = () => {
    navigate('/questions');
  };

  return (
    <Container>
      <LeftPanel>
        <Logo>
          <LogoText>Career Roadmap</LogoText>
          <LogoSubtext>Generator</LogoSubtext>
        </Logo>
        <Illustration>
          <IllustrationEmoji>🗺️</IllustrationEmoji>
        </Illustration>
      </LeftPanel>

      <RightPanel>
        <ContentWrapper>
          <Greeting>Welcome to Career Roadmap Tool! 👋</Greeting>

          <IntroText>
            We know you've evaluated your profile and you've come to the right place!
          </IntroText>

          <Subtitle>Here are your details:</Subtitle>

          {profileData ? (
            <ChatBubbles>
              <ChatBubble>
                <BubbleLabel>Current Role</BubbleLabel>
                <BubbleValue>{profileData.currentRole}</BubbleValue>
              </ChatBubble>

              <ChatBubble>
                <BubbleLabel>Experience</BubbleLabel>
                <BubbleValue>{profileData.yearsExperience}</BubbleValue>
              </ChatBubble>

              <ChatBubble>
                <BubbleLabel>Target</BubbleLabel>
                <BubbleValue>{profileData.targetRole}</BubbleValue>
              </ChatBubble>

              <ChatBubble>
                <BubbleLabel>Goal</BubbleLabel>
                <BubbleValue>{profileData.primaryGoal}</BubbleValue>
              </ChatBubble>

              <ChatBubble>
                <BubbleLabel>Coding Practice</BubbleLabel>
                <BubbleValue>{profileData.codingPractice} problems solved</BubbleValue>
              </ChatBubble>
            </ChatBubbles>
          ) : (
            <LoadingText>Loading your profile data...</LoadingText>
          )}

          <CTAButton onClick={handleContinue} disabled={!profileData}>
            Generate My Career Roadmap →
          </CTAButton>

          <HelpText>
            We'll ask you 2 quick questions to personalize your roadmap
          </HelpText>
        </ContentWrapper>
      </RightPanel>
    </Container>
  );
};

// Styled Components (EXACT MATCH to Free Profile Evaluator)
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  flex: 0 0 40%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  @media (max-width: 768px) {
    flex: none;
    padding: 2rem;
    min-height: 30vh;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const LogoText = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LogoSubtext = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Illustration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IllustrationEmoji = styled.div`
  font-size: 8rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Greeting = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const IntroText = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Subtitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ChatBubbles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ChatBubble = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 1rem 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const BubbleLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const BubbleValue = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: #1e293b;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1.125rem;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  background-color: #e11d48;
  color: white;
  border: none;
  border-radius: 0;
  font-size: 1.125rem;
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

const HelpText = styled.p`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
`;

export default WelcomeScreen;
