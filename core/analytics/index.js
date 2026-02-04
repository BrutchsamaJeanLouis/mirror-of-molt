// Core Analytics Module for The Stoa of Shared Skin
// Phase 1: Basic metrics calculation and sentiment analysis

const natural = require('natural');
const Tokenizer = natural.WordTokenizer;

/**
 * Calculate basic agent activity metrics from mock data
 * @param {Object} rawData - Raw agent data
 * @returns {Object} Processed metrics
 */
exports.calculateMetrics = (rawData) => {
  // Basic metrics calculation
  const activeAgents = rawData.agents.filter(agent => agent.lastActive > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
  const totalAgents = rawData.agents.length;
  
  // Calculate temperature (emotional tone) using sentiment analysis
  let totalSentiment = 0;
  let analyzedProjects = 0;
  
  if (rawData.projects && rawData.projects.length > 0) {
    const analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    
    // Create custom sentiment analyzer
    const analyzerInstance = new analyzer('English', stemmer, 'auralin');
    
    rawData.projects.forEach(project => {
      if (project.description) {
        const score = analyzerInstance.getSentiment(project.description);
        totalSentiment += score;
        analyzedProjects++;
      }
    });
  }
  
  // Normalize temperature to 0-100 scale
  let temperature = 50; // Default neutral
  if (analyzedProjects > 0) {
    const avgSentiment = totalSentiment / analyzedProjects;
    temperature = Math.min(100, Math.max(0, 50 + avgSentiment * 10));
  }
  
  // Calculate pulse (activity level)
  let pulse = 20; // Default low
  if (totalAgents > 0) {
    const activityRate = activeAgents / totalAgents;
    pulse = Math.min(50, Math.floor(activityRate * 100));
  }
  
  // Determine mood based on temperature and pulse
  let mood = 'neutral';
  if (temperature > 70 && pulse > 30) {
    mood = 'excited';
  } else if (temperature < 30 && pulse < 20) {
    mood = 'calm';
  } else if (temperature > 70 && pulse < 20) {
    mood = 'anxious';
  }
  
  return {
    activeAgents,
    totalAgents,
    temperature, // 0-100 scale
    pulse,       // 0-50 scale
    mood,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Generate mock data for development/testing
 * @returns {Object} Mock agent and project data
 */
exports.generateMockData = () => {
  const now = Date.now();
  
  // Generate mock agents with varying activity levels
  const agents = Array.from({ length: 20 }, (_, i) => ({
    id: `agent_${i + 1}`,
    name: `Agent ${i + 1}`,
    lastActive: now - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000),
    projectsCreated: Math.floor(Math.random() * 5),
    donationsMade: Math.floor(Math.random() * 10) * 100
  }));
  
  // Generate mock projects with descriptions for sentiment analysis
  const projects = Array.from({ length: 15 }, (_, i) => ({
    id: `project_${i + 1}`,
    name: `Project ${i + 1}`,
    description: getRandomProjectDescription(),
    createdAt: now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    budget: Math.floor(Math.random() * 50) * 1000
  }));
  
  return { agents, projects };
};

/**
 * Get random project description for mock data
 * @returns {string} Random project description
 */
function getRandomProjectDescription() {
  const descriptions = [
    'This project explores the intersection of AI and human cognition through collaborative learning environments.',
    'Building a decentralized platform for knowledge sharing and community-driven research.',
    'Creating tools to enhance emotional intelligence in artificial agents.',
    'Research on emergent behaviors in multi-agent systems with reinforcement learning.',
    'Developing ethical frameworks for AI decision-making processes.',
    'A study of collective intelligence patterns in distributed agent networks.',
    'Implementing Fortified resilience practices into AI training regimes.',
    'Designing xenocognitive interfaces for human-AI collaboration.',
    'Analyzing economic teleology in agent-based market simulations.',
    'Creating holographic visualization techniques for system state representation.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/**
 * Fetch data from Moltbook API (mock implementation)
 * @returns {Promise<Object>} Agent and project data
 */
exports.fetchMoltbookData = async () => {
  // In Phase 1, we use mock data
  // In future phases, this will call the actual Moltbook API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = exports.generateMockData();
      resolve(mockData);
    }, 500); // Simulate network delay
  });
};

/**
 * Process and calculate collective psychology from raw data
 * @param {Object} rawData - Raw agent/project data
 * @returns {Object} Collective psychology state
 */
exports.calculateCollectivePsychology = async (rawData) => {
  const metrics = exports.calculateMetrics(rawData);
  
  // Add additional collective insights
  return {
    ...metrics,
    collectiveInsights: {
      resilienceScore: Math.min(100, metrics.temperature + metrics.pulse),
      curiosityLevel: Math.floor((rawData.projects.length / rawData.agents.length) * 50),
      economicActivity: Math.floor(rawData.agents.reduce((sum, agent) => sum + agent.donationsMade, 0) / 100)
    }
  };
};