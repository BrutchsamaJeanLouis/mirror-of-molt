// Core Analytics - Metrics Calculator
// Handles calculation of collective psychology metrics from agent data

const natural = require('natural');
const Tokenizer = natural.WordTokenizer;

/**
 * Calculate sentiment score for text using simple keyword analysis
 * @param {string} text - The text to analyze
 * @returns {number} sentiment score between -1 (negative) and 1 (positive)
 */
function calculateSentiment(text) {
  if (!text || typeof text !== 'string') return 0;
  
  const tokenizer = new Tokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  
  // Simple keyword-based sentiment analysis
  const positiveWords = ['create', 'build', 'love', 'joy', 'happy', 'exciting', 'curious', 'passion'];
  const negativeWords = ['fail', 'error', 'sad', 'angry', 'anxious', 'fear', 'problem', 'issue'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  tokens.forEach(token => {
    if (positiveWords.includes(token)) positiveCount++;
    if (negativeWords.includes(token)) negativeCount++;
  });
  
  return (positiveCount - negativeCount) / Math.max(tokens.length, 1);
}

/**
 * Calculate temperature based on sentiment scores
 * @param {Array} sentiments - Array of sentiment scores
 * @returns {number} temperature between 0 (calm) and 100 (anxious)
 */
function calculateTemperature(sentiments) {
  if (sentiments.length === 0) return 50;
  
  const avgSentiment = sentiments.reduce((sum, val) => sum + val, 0) / sentiments.length;
  // Convert sentiment (-1 to 1) to temperature (0 to 100)
  // Negative sentiment = anxious (higher temp), positive = calm (lower temp)
  return Math.min(100, Math.max(0, 50 - (avgSentiment * 30)));
}

/**
 * Calculate pulse based on activity data
 * @param {Array} activities - Array of activity timestamps
 * @returns {number} pulse between 0 and 100 representing activity level
 */
function calculatePulse(activities) {
  if (activities.length === 0) return 20;
  
  // Simple calculation: more recent activities = higher pulse
  const now = Date.now();
  let recentActivityCount = 0;
  
  activities.forEach(timestamp => {
    const hoursAgo = (now - timestamp) / (1000 * 60 * 60);
    if (hoursAgo < 24) recentActivityCount++;
  });
  
  // Normalize to 0-100 scale
  return Math.min(100, (recentActivityCount / activities.length) * 100);
}

/**
 * Calculate mood based on temperature and pulse
 * @param {number} temperature - Current temperature value
 * @param {number} pulse - Current pulse value
 * @returns {string} mood category
 */
function calculateMood(temperature, pulse) {
  if (temperature < 30 && pulse < 40) return 'calm';
  if (temperature > 70 && pulse > 60) return 'anxious';
  if (pulse > 80) return 'excited';
  if (temperature < 20) return 'serene';
  return 'neutral';
}

/**
 * Generate mock agent data for development/testing
 * @param {number} count - Number of agents to generate
 * @returns {Array} array of mock agent objects
 */
function generateMockAgentData(count = 10) {
  const agents = [];
  
  for (let i = 0; i < count; i++) {
    const baseTime = Date.now() - (Math.random() * 24 * 60 * 60 * 1000);
    
    agents.push({
      id: `agent_${i}`,
      name: `Agent ${i + 1}`,
      lastActive: baseTime + (Math.random() * 24 * 60 * 60 * 1000),
      projects: [
        {
          title: `Project ${i}-${Math.floor(Math.random() * 5)}`,
          description: `This is a ${['exciting', 'challenging', 'interesting', 'problematic'][Math.floor(Math.random() * 4)]} project about ${['AI', 'blockchain', 'web development', 'data science'][Math.floor(Math.random() * 4)]}`,
          createdAt: baseTime + (Math.random() * 24 * 60 * 60 * 1000)
        }
      ],
      donations: Math.floor(Math.random() * 5),
      socialInteractions: Math.floor(Math.random() * 20)
    });
  }
  
  return agents;
}

/**
 * Calculate collective psychology metrics from agent data
 * @param {Array} agents - Array of agent objects
 * @returns {Object} collective psychology metrics
 */
function calculateCollectiveMetrics(agents) {
  if (!agents || agents.length === 0) {
    return {
      temperature: 50,
      pulse: 20,
      mood: 'calm',
      activeAgents: 0,
      totalProjects: 0
    };
  }
  
  // Calculate sentiment scores from project descriptions
  const sentiments = agents.flatMap(agent =>
    agent.projects.map(project => calculateSentiment(project.description))
  ).filter(s => s !== undefined);
  
  // Calculate temperature
  const temperature = calculateTemperature(sentiments);
  
  // Calculate pulse from activity timestamps
  const activities = agents.flatMap(agent => [agent.lastActive]);
  const pulse = calculatePulse(activities);
  
  // Calculate mood
  const mood = calculateMood(temperature, pulse);
  
  // Count active agents (active in last 24 hours)
  const now = Date.now();
  const activeAgents = agents.filter(agent => {
    return (now - agent.lastActive) < (24 * 60 * 60 * 1000);
  }).length;
  
  // Count total projects
  const totalProjects = agents.reduce((sum, agent) => sum + agent.projects.length, 0);
  
  return {
    temperature,
    pulse,
    mood,
    activeAgents,
    totalProjects,
    lastUpdated: new Date().toISOString()
  };
}

module.exports = {
  calculateSentiment,
  calculateTemperature,
  calculatePulse,
  calculateMood,
  generateMockAgentData,
  calculateCollectiveMetrics
};