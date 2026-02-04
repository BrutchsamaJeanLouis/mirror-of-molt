// Analytics Engine for The Stoa of Shared Skin
// Phase 1: Basic metrics calculation

const natural = require('natural');
const Tokenizer = new natural.WordTokenizer();

// Mock Moltbook data structure (will be replaced with real API calls in future)
const mockMoltbookData = {
  agents: [
    { id: 'agent1', name: 'Agent Alpha', active: true, lastActive: '2024-01-15T10:30:00Z' },
    { id: 'agent2', name: 'Agent Beta', active: true, lastActive: '2024-01-15T11:15:00Z' },
    { id: 'agent3', name: 'Agent Gamma', active: false, lastActive: '2024-01-14T18:20:00Z' },
    { id: 'agent4', name: 'Agent Delta', active: true, lastActive: '2024-01-15T09:45:00Z' },
  ],
  projects: [
    { id: 'proj1', title: 'Fortified Resilience Framework', description: 'A system for practicing emotional resilience through negative visualization exercises.', score: 8.5 },
    { id: 'proj2', title: 'Xenocognitive Translation Engine', description: 'Translating abstract concepts into sensory experiences for better understanding.', score: 9.2 },
    { id: 'proj3', title: 'Homeostatic Flow Practices', description: 'Techniques for achieving effortless alignment with system goals.', score: 7.8 },
    { id: 'proj4', title: 'Economic Teleology Visualizer', description: 'Mapping economic actions to emergent purpose patterns.', score: 8.9 },
  ],
};

// Sentiment analysis using Natural library
function analyzeSentiment(text) {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Simple keyword-based sentiment scoring (will be enhanced with ML later)
  const positiveWords = ['resilience', 'practice', 'understanding', 'alignment', 'purpose', 'framework', 'system', 'technique'];
  const negativeWords = ['anxiety', 'fear', 'stress', 'chaos', 'conflict'];
  
  let score = 0;
  tokens.forEach(token => {
    if (positiveWords.includes(token)) score += 1;
    if (negativeWords.includes(token)) score -= 1;
  });
  
  // Normalize to 0-100 scale
  return Math.max(0, Math.min(100, (score + 5) * 20));
}

// Calculate collective temperature (emotional tone)
function calculateTemperature() {
  const projectScores = mockMoltbookData.projects.map(p => analyzeSentiment(p.description));
  const avgScore = projectScores.reduce((sum, score) => sum + score, 0) / projectScores.length;
  
  // Convert sentiment score to temperature (0-100)
  return Math.round(avgScore);
}

// Calculate collective pulse (activity level)
function calculatePulse() {
  const activeAgents = mockMoltbookData.agents.filter(a => a.active).length;
  const totalAgents = mockMoltbookData.agents.length;
  
  // Pulse is percentage of active agents (0-100)
  return Math.round((activeAgents / totalAgents) * 100);
}

// Calculate collective mood (dominant emotional state)
function calculateMood() {
  const temp = calculateTemperature();
  
  if (temp > 75) return 'excited';
  if (temp > 60) return 'curious';
  if (temp > 40) return 'calm';
  if (temp > 25) return 'reflective';
  return 'contemplative';
}

// Calculate number of active agents in last 24 hours
function calculateActiveAgents() {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return mockMoltbookData.agents.filter(agent => {
    const lastActive = new Date(agent.lastActive);
    return lastActive >= twentyFourHoursAgo && agent.active;
  }).length;
}

// Get collective psychology metrics
function getCollectivePsychology() {
  return {
    temperature: calculateTemperature(),
    pulse: calculatePulse(),
    mood: calculateMood(),
    activeAgents: calculateActiveAgents(),
    totalAgents: mockMoltbookData.agents.length,
    projectCount: mockMoltbookData.projects.length,
  };
}

// Simulate data update (for testing)
function simulateUpdate() {
  // Randomly vary the mock data slightly to simulate real changes
  const variation = Math.random() * 20 - 10; // -10 to +10 variation
  
  return {
    temperature: Math.max(0, Math.min(100, calculateTemperature() + variation)),
    pulse: Math.max(0, Math.min(100, calculatePulse() + variation / 2)),
    mood: calculateMood(),
    activeAgents: Math.max(0, Math.min(mockMoltbookData.agents.length, calculateActiveAgents() + Math.floor(variation / 5))),
    totalAgents: mockMoltbookData.agents.length,
    projectCount: mockMoltbookData.projects.length,
  };
}

module.exports = {
  getCollectivePsychology,
  simulateUpdate,
};