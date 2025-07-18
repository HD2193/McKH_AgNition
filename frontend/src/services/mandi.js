// Mandi Price Data from Government of India API
// TODO: Add REACT_APP_MANDI_API_KEY to .env (if required)

const MANDI_API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const MANDI_API_KEY = process.env.REACT_APP_MANDI_API_KEY;

/**
 * Fetch mandi prices for a specific crop and region
 * @param {string} cropName - Name of the crop
 * @param {string} region - Region/state name
 * @param {string} district - District name (optional)
 * @returns {Promise<Object>} Mandi price data
 */
export const fetchMandiPrices = async (cropName, region, district = '') => {
  try {
    if (!MANDI_API_KEY) {
      console.warn('Mandi API key not found, using mock data');
      return getMockMandiPrices(cropName, region);
    }

    const params = new URLSearchParams({
      'api-key': MANDI_API_KEY,
      'format': 'json',
      'limit': '100',
      'filters[state]': region,
      'filters[commodity]': cropName
    });

    if (district) {
      params.append('filters[district]', district);
    }

    // TODO: Replace with actual Mandi API call
    const response = await fetch(`${MANDI_API_URL}?${params}`);
    const result = await response.json();
    
    // TODO: Process actual API response
    // For now, return mock data
    return getMockMandiPrices(cropName, region);
    
  } catch (error) {
    console.error('Error fetching mandi prices:', error);
    return getMockMandiPrices(cropName, region);
  }
};

/**
 * Get price trends for a crop over time
 * @param {string} cropName - Name of the crop
 * @param {string} region - Region/state name
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} Price trend data
 */
export const getPriceTrends = async (cropName, region, days = 7) => {
  try {
    // TODO: Implement actual price trend API call
    return getMockPriceTrends(cropName, days);
  } catch (error) {
    console.error('Error fetching price trends:', error);
    return getMockPriceTrends(cropName, days);
  }
};

/**
 * Get nearby mandi locations
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radius - Search radius in km
 * @returns {Promise<Array>} Nearby mandi locations
 */
export const getNearbyMandis = async (latitude, longitude, radius = 50) => {
  try {
    // TODO: Implement actual mandi location API call
    return getMockNearbyMandis(latitude, longitude);
  } catch (error) {
    console.error('Error fetching nearby mandis:', error);
    return getMockNearbyMandis(latitude, longitude);
  }
};

/**
 * Mock mandi prices for development
 * @param {string} cropName - Name of the crop
 * @param {string} region - Region name
 * @returns {Object} Mock mandi data
 */
const getMockMandiPrices = (cropName, region) => {
  const basePrice = getCropBasePrice(cropName);
  const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
  
  return {
    crop: cropName,
    region: region,
    averagePrice: Math.round(basePrice * (1 + variation)),
    minPrice: Math.round(basePrice * (1 + variation - 0.1)),
    maxPrice: Math.round(basePrice * (1 + variation + 0.1)),
    priceDate: new Date().toISOString().split('T')[0],
    trend: Math.random() > 0.5 ? 'up' : 'down',
    trendPercentage: Math.round(Math.random() * 10),
    marketCount: Math.floor(Math.random() * 20) + 5,
    lastUpdated: new Date().toISOString(),
    recommendations: {
      action: Math.random() > 0.5 ? 'sell' : 'wait',
      reason: Math.random() > 0.5 ? 'Prices are at peak' : 'Prices may rise in 2-3 days',
      reasonHindi: Math.random() > 0.5 ? 'भाव चरम पर हैं' : 'भाव 2-3 दिन में बढ़ सकते हैं',
      confidence: Math.floor(Math.random() * 20) + 70
    }
  };
};

/**
 * Mock price trends for development
 * @param {string} cropName - Name of the crop
 * @param {number} days - Number of days
 * @returns {Array} Mock price trend data
 */
const getMockPriceTrends = (cropName, days) => {
  const basePrice = getCropBasePrice(cropName);
  const trends = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 0.15;
    const price = Math.round(basePrice * (1 + variation));
    
    trends.push({
      date: date.toISOString().split('T')[0],
      price: price,
      volume: Math.floor(Math.random() * 1000) + 500
    });
  }
  
  return trends;
};

/**
 * Mock nearby mandis for development
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Array} Mock mandi locations
 */
const getMockNearbyMandis = (latitude, longitude) => {
  return [
    {
      name: 'Main Vegetable Mandi',
      nameHindi: 'मुख्य सब्जी मंडी',
      address: 'Station Road, City Center',
      addressHindi: 'स्टेशन रोड, सिटी सेंटर',
      distance: 2.5,
      contact: '+91 98765 43210',
      timings: '5:00 AM - 2:00 PM',
      timingsHindi: 'सुबह 5:00 - दोपहर 2:00',
      latitude: latitude + 0.01,
      longitude: longitude + 0.01
    },
    {
      name: 'Grain Market',
      nameHindi: 'अनाज मंडी',
      address: 'Agriculture Road, Sector 15',
      addressHindi: 'कृषि रोड, सेक्टर 15',
      distance: 5.2,
      contact: '+91 98765 43211',
      timings: '6:00 AM - 12:00 PM',
      timingsHindi: 'सुबह 6:00 - दोपहर 12:00',
      latitude: latitude + 0.02,
      longitude: longitude - 0.01
    }
  ];
};

/**
 * Get base price for different crops
 * @param {string} cropName - Name of the crop
 * @returns {number} Base price per kg
 */
const getCropBasePrice = (cropName) => {
  const basePrices = {
    'tomato': 15,
    'tomatoes': 15,
    'potato': 20,
    'potatoes': 20,
    'onion': 25,
    'onions': 25,
    'wheat': 30,
    'rice': 35,
    'cotton': 5500, // per quintal
    'sugarcane': 300, // per quintal
    'maize': 20,
    'barley': 25,
    'mustard': 55,
    'groundnut': 55,
    'soybean': 45
  };
  
  return basePrices[cropName.toLowerCase()] || 20;
};