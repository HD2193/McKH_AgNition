// Google Vision API for Crop Disease Diagnosis
// TODO: Add REACT_APP_GOOGLE_VISION_API_KEY to .env

const GOOGLE_VISION_API_KEY = process.env.REACT_APP_GOOGLE_VISION_API_KEY;
const VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Analyze crop image for disease detection
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<Object>} Disease analysis result
 */
export const analyzeCropImage = async (base64Image) => {
  try {
    if (!GOOGLE_VISION_API_KEY) {
      console.warn('Google Vision API key not found, using mock data');
      return getMockDiseaseAnalysis();
    }

    // TODO: Replace with actual Google Vision API call
    const response = await fetch(`${VISION_API_URL}?key=${GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image.replace(/^data:image\/[a-z]+;base64,/, '')
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10
              }
            ]
          }
        ]
      })
    });

    const result = await response.json();
    
    // TODO: Process actual Google Vision response
    // For now, return mock data
    return getMockDiseaseAnalysis();
    
  } catch (error) {
    console.error('Error analyzing crop image:', error);
    return getMockDiseaseAnalysis();
  }
};

/**
 * Mock disease analysis for development
 * @returns {Object} Mock disease analysis
 */
const getMockDiseaseAnalysis = () => {
  return {
    disease: {
      name: 'Early Blight',
      nameHindi: 'प्रारंभिक झुलसा',
      confidence: 85,
      symptoms: 'Brown spots on leaves, yellowing, wilting',
      symptomsHindi: 'पत्तियों पर भूरे धब्बे, पीलापन, मुरझाना'
    },
    treatments: [
      {
        title: 'Fungicide Application',
        titleHindi: 'फफूंदनाशक का प्रयोग',
        description: 'Apply fungicide every 7-10 days',
        descriptionHindi: 'हर 7-10 दिन में ففूंदनाशक का छिड़काव करें',
        icon: '🧪',
        priority: 'high'
      },
      {
        title: 'Improve Ventilation',
        titleHindi: 'हवा की आवाजाही बढ़ाएं',
        description: 'Ensure proper spacing between plants',
        descriptionHindi: 'पौधों के बीच उचित दूरी बनाए रखें',
        icon: '🌬️',
        priority: 'medium'
      }
    ],
    additionalInfo: {
      causes: 'High humidity and poor air circulation',
      causesHindi: 'अधिक नमी और खराब हवा संचार',
      prevention: 'Regular pruning and proper spacing',
      preventionHindi: 'नियमित छंटाई और उचित दूरी'
    }
  };
};