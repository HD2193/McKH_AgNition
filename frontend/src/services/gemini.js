// Gemini Pro AI Assistant for Agricultural Advice
// TODO: Add REACT_APP_GEMINI_API_KEY to .env

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Get response from Gemini Pro for agricultural queries
 * @param {string} userPrompt - User's question or prompt
 * @param {string} language - Preferred language for response
 * @param {string} context - Additional context (crop type, location, etc.)
 * @returns {Promise<Object>} AI response with advice
 */
export const getGeminiResponse = async (userPrompt, language = 'hindi', context = '') => {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found, using mock response');
      return getMockGeminiResponse(userPrompt, language);
    }

    const systemPrompt = `You are Kisan AI, a helpful agricultural assistant for Indian farmers. 
    You provide practical, actionable advice about farming, crop diseases, market prices, and government schemes.
    
    Context: ${context}
    Language: Respond in ${language} language
    
    Guidelines:
    - Keep responses concise but informative
    - Focus on practical solutions
    - Include both traditional and modern farming practices
    - Mention government schemes when relevant
    - Be sensitive to small-scale farming constraints
    - Always include confidence level in your advice`;

    // TODO: Replace with actual Gemini API call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser Question: ${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 500
        }
      })
    });

    const result = await response.json();
    
    // TODO: Process actual Gemini response
    // For now, return mock data
    return getMockGeminiResponse(userPrompt, language);
    
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return getMockGeminiResponse(userPrompt, language);
  }
};

/**
 * Get market price advice from Gemini
 * @param {string} cropName - Name of the crop
 * @param {number} currentPrice - Current market price
 * @param {Array} priceHistory - Historical prices
 * @param {string} language - Response language
 * @returns {Promise<Object>} Market advice
 */
export const getMarketAdvice = async (cropName, currentPrice, priceHistory, language = 'hindi') => {
  const prompt = `Should I sell my ${cropName} today? Current price is ₹${currentPrice}/kg. 
  Price history: ${priceHistory.map(p => `₹${p.price} on ${p.date}`).join(', ')}`;
  
  return getGeminiResponse(prompt, language, `Crop: ${cropName}, Current Price: ₹${currentPrice}`);
};

/**
 * Get farming guidance from Gemini
 * @param {string} cropType - Type of crop
 * @param {string} season - Current season
 * @param {string} location - Farmer's location
 * @param {string} language - Response language
 * @returns {Promise<Object>} Farming guidance
 */
export const getFarmingGuidance = async (cropType, season, location, language = 'hindi') => {
  const prompt = `What should I do this week for my ${cropType} crop? 
  Season: ${season}, Location: ${location}`;
  
  return getGeminiResponse(prompt, language, `Crop: ${cropType}, Season: ${season}, Location: ${location}`);
};

/**
 * Get government scheme recommendations
 * @param {string} farmerType - Type of farmer (small, marginal, etc.)
 * @param {string} cropType - Type of crop
 * @param {string} location - Farmer's location
 * @param {string} language - Response language
 * @returns {Promise<Object>} Scheme recommendations
 */
export const getSchemeRecommendations = async (farmerType, cropType, location, language = 'hindi') => {
  const prompt = `What government schemes can help me? I am a ${farmerType} farmer growing ${cropType} in ${location}`;
  
  return getGeminiResponse(prompt, language, `Farmer: ${farmerType}, Crop: ${cropType}, Location: ${location}`);
};

/**
 * Mock Gemini response for development
 * @param {string} userPrompt - User's question
 * @param {string} language - Response language
 * @returns {Object} Mock AI response
 */
const getMockGeminiResponse = (userPrompt, language) => {
  const responses = {
    hindi: {
      text: `आपके सवाल के जवाब में, मैं सुझाव देता हूं कि आप अपनी फसल की नियमित जांच करें। मौसम को देखते हुए, अगले 3-4 दिनों में सिंचाई करना उचित होगा। यदि आपको कोई बीमारी के लक्षण दिखें तो तुरंत स्थानीय कृषि विशेषज्ञ से सलाह लें।`,
      confidence: 85,
      category: 'farming_advice',
      actionable_steps: [
        'फसल की दैनिक जांच करें',
        'मिट्टी की नमी देखें',
        'मौसम की जानकारी रखें'
      ]
    },
    english: {
      text: `Based on your question, I recommend regular monitoring of your crop. Given the current weather conditions, irrigation in the next 3-4 days would be appropriate. If you notice any disease symptoms, consult your local agricultural expert immediately.`,
      confidence: 85,
      category: 'farming_advice',
      actionable_steps: [
        'Monitor crop daily',
        'Check soil moisture',
        'Stay updated on weather'
      ]
    }
  };
  
  return responses[language] || responses.hindi;
};