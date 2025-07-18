// Mock data for Kisan AI

export const mockCrops = [
  {
    id: 1,
    name: "Tomatoes",
    nameHindi: "टमाटर",
    image: "🍅",
    avgPrice: 15,
    priceRange: "₹12-₹18/kg",
    trend: "up",
    recommendation: "Sell now - prices may drop next week"
  },
  {
    id: 2,
    name: "Potatoes",
    nameHindi: "आलू",
    image: "🥔",
    avgPrice: 20,
    priceRange: "₹18-₹22/kg",
    trend: "stable",
    recommendation: "Hold for 2-3 days for better prices"
  },
  {
    id: 3,
    name: "Onions",
    nameHindi: "प्याज",
    image: "🧅",
    avgPrice: 25,
    priceRange: "₹22-₹28/kg",
    trend: "up",
    recommendation: "Good time to sell - demand is high"
  },
  {
    id: 4,
    name: "Wheat",
    nameHindi: "गेहूं",
    image: "🌾",
    avgPrice: 30,
    priceRange: "₹28-₹32/kg",
    trend: "down",
    recommendation: "Wait for harvest season end"
  },
  {
    id: 5,
    name: "Rice",
    nameHindi: "चावल",
    image: "🍚",
    avgPrice: 35,
    priceRange: "₹32-₹38/kg",
    trend: "stable",
    recommendation: "Stable prices - good time to sell"
  }
];

export const mockDiseases = [
  {
    id: 1,
    name: "Early Blight",
    nameHindi: "प्रारंभिक झुलसा",
    crop: "Tomato",
    confidence: 85,
    symptoms: "Brown spots on leaves, yellowing, wilting",
    treatments: [
      {
        title: "Fungicide Application",
        titleHindi: "फफूंदनाशक का प्रयोग",
        description: "Apply fungicide every 7-10 days",
        descriptionHindi: "हर 7-10 दिन में फफूंदनाशक का छिड़काव करें",
        icon: "🧪"
      },
      {
        title: "Improve Ventilation",
        titleHindi: "हवा की आवाजाही बढ़ाएं",
        description: "Ensure proper spacing between plants",
        descriptionHindi: "पौधों के बीच उचित दूरी बनाए रखें",
        icon: "🌬️"
      },
      {
        title: "Pruning",
        titleHindi: "छंटाई",
        description: "Remove infected leaves to prevent spread",
        descriptionHindi: "संक्रमित पत्तियों को हटाकर फैलाव रोकें",
        icon: "✂️"
      }
    ]
  },
  {
    id: 2,
    name: "Bacterial Wilt",
    nameHindi: "जीवाणु मुरझाना",
    crop: "Potato",
    confidence: 92,
    symptoms: "Sudden wilting, brown streaks in stems",
    treatments: [
      {
        title: "Remove Infected Plants",
        titleHindi: "संक्रमित पौधे हटाएं",
        description: "Immediately remove and destroy affected plants",
        descriptionHindi: "संक्रमित पौधों को तुरंत हटाकर नष्ट करें",
        icon: "🚫"
      },
      {
        title: "Soil Treatment",
        titleHindi: "मिट्टी का उपचार",
        description: "Apply soil fumigant or copper-based fungicide",
        descriptionHindi: "मिट्टी में फ्यूमिगेंट या तांबा आधारित फफूंदनाशक डालें",
        icon: "🌱"
      }
    ]
  }
];

export const mockSchemes = [
  {
    id: 1,
    name: "Pradhan Mantri Kisan Samman Nidhi",
    nameHindi: "प्रधानमंत्री किसान सम्मान निधि",
    description: "₹6000 per year direct benefit transfer to farmers",
    descriptionHindi: "किसानों को प्रति वर्ष ₹6000 की प्रत्यक्ष लाभ हस्तांतरण",
    category: "Direct Benefit",
    categoryHindi: "प्रत्यक्ष लाभ",
    eligibility: "Small and marginal farmers",
    eligibilityHindi: "छोटे और सीमांत किसान",
    image: "🌾",
    popular: true
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    nameHindi: "प्रधानमंत्री फसल बीमा योजना",
    description: "Crop insurance scheme for farmers",
    descriptionHindi: "किसानों के लिए फसल बीमा योजना",
    category: "Insurance",
    categoryHindi: "बीमा",
    eligibility: "All farmers",
    eligibilityHindi: "सभी किसान",
    image: "🛡️",
    popular: true
  },
  {
    id: 3,
    name: "Paramparagat Krishi Vikas Yojana",
    nameHindi: "परंपरागत कृषि विकास योजना",
    description: "Organic farming promotion scheme",
    descriptionHindi: "जैविक खेती को बढ़ावा देने की योजना",
    category: "Organic Farming",
    categoryHindi: "जैविक खेती",
    eligibility: "Farmers willing to adopt organic farming",
    eligibilityHindi: "जैविक खेती अपनाने वाले किसान",
    image: "🌿",
    popular: true
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    nameHindi: "मृदा स्वास्थ्य कार्ड योजना",
    description: "Soil testing and health card for farmers",
    descriptionHindi: "किसानों के लिए मिट्टी परीक्षण और स्वास्थ्य कार्ड",
    category: "Soil Health",
    categoryHindi: "मिट्टी स्वास्थ्य",
    eligibility: "All farmers",
    eligibilityHindi: "सभी किसान",
    image: "🔬",
    popular: false
  }
];

export const mockAdvice = [
  {
    id: 1,
    title: "Monitor crops closely",
    titleHindi: "फसलों की नजदीक से निगरानी करें",
    description: "Check your crops for any signs of fungal diseases in your wheat crops. Early detection helps in preventing widespread damage.",
    descriptionHindi: "गेहूं की फसल में फफूंदी रोग के संकेतों की जांच करें। जल्दी पता लगाने से व्यापक नुकसान से बचा जा सकता है।",
    image: "🔍",
    category: "Disease Prevention",
    categoryHindi: "रोग रोकथाम",
    priority: "high"
  },
  {
    id: 2,
    title: "Adjust irrigation schedule",
    titleHindi: "सिंचाई की समय सारणी समायोजित करें",
    description: "Reduce irrigation frequency due to increased humidity. Monitor soil moisture levels before watering.",
    descriptionHindi: "बढ़ी हुई आर्द्रता के कारण सिंचाई की आवृत्ति कम करें। पानी देने से पहले मिट्टी की नमी की जांच करें।",
    image: "💧",
    category: "Irrigation",
    categoryHindi: "सिंचाई",
    priority: "medium"
  }
];

export const mockTasks = [
  {
    id: 1,
    title: "Inspect wheat crop for fungal diseases",
    titleHindi: "गेहूं की फसल में फफूंदी रोग की जांच करें",
    time: "7:00 AM",
    completed: true,
    priority: "high",
    category: "Inspection"
  },
  {
    id: 2,
    title: "Reduce irrigation for rice paddies",
    titleHindi: "धान के खेतों में सिंचाई कम करें",
    time: "10:00 AM",
    completed: true,
    priority: "medium",
    category: "Irrigation"
  },
  {
    id: 3,
    title: "Apply organic fertilizer to tomato plants",
    titleHindi: "टमाटर के पौधों में जैविक खाद डालें",
    time: "4:00 PM",
    completed: false,
    priority: "high",
    category: "Fertilization"
  },
  {
    id: 4,
    title: "Check market prices for onions",
    titleHindi: "प्याज के बाजार भाव की जांच करें",
    time: "6:00 PM",
    completed: false,
    priority: "low",
    category: "Market"
  }
];

export const mockWeather = {
  temperature: 28,
  condition: "Partly Cloudy",
  conditionHindi: "आंशिक रूप से बादल",
  humidity: 65,
  rainfall: 12,
  location: "Varanasi, UP",
  locationHindi: "वाराणसी, उत्तर प्रदेश"
};