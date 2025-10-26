// ============================================
// FOR TESTING PURPOSES ONLY - MOCK DATA
// ============================================
// This file provides mock Profile Evaluator data for development/testing
//
// FUTURE INTEGRATION:
// Replace this with actual API call to Scaler.com backend:
// GET https://scaler.com/api/users/{user_id}/profile-evaluation
// ============================================

export const getMockProfileData = () => {
  return {
    userName: "Sudhanva Acharya",
    userType: "tech_professional", // or "career_switcher"
    currentRole: "Software Engineer - Service Company",
    yearsExperience: "3-5 years",
    targetRole: "Senior Backend Engineer",
    targetCompanyType: "Product Unicorns/Scaleups",
    codingPractice: "10-50 problems",
    systemDesign: "basic",
    primaryGoal: "Move to better company + higher comp",

    // Additional fields from Profile Evaluator
    skillBuildingFocus: "DSA & System Design",
    currentCompany: "Service Company",
    currentSkill: "Intermediate",
  };
};

// Mock data for career switcher
export const getMockCareerSwitcherData = () => {
  return {
    userName: "Alex Johnson",
    userType: "career_switcher",
    currentRole: "Marketing Manager",
    yearsExperience: "0-2 years in tech",
    targetRole: "Software Engineering",
    targetCompanyType: "High Growth Startups",
    codingPractice: "0-10 problems",
    systemDesign: "not-yet",
    primaryGoal: "Career switch to tech",

    skillBuildingFocus: "Programming Fundamentals",
    codeComfort: "learning",
    timeAvailable: "10+ hours/week",
  };
};

// Function to simulate fetching profile data
// FUTURE: Replace with actual API call
export const fetchProfileData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // For now, return mock data
  // In production, this would be:
  // const userId = getAuthenticatedUserId();
  // const response = await fetch(`${SCALER_API_URL}/users/${userId}/profile-evaluation`);
  // return response.json();

  return getMockProfileData();
};
