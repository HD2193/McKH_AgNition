import json
import os
import requests
from typing import Dict, Any, Optional
from models.chat import ChatResponse

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.gemini_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        
    async def get_chat_response(self, message: str, language: str = "hi", context: Optional[Dict] = None) -> ChatResponse:
        """
        Get response from Gemini Pro for agricultural queries
        """
        try:
            if not self.api_key:
                print("Warning: Gemini API key not found, using mock response")
                return self._get_mock_response(message, language)
            
            # Prepare system prompt
            system_prompt = self._get_system_prompt(language, context)
            
            request_data = {
                "contents": [{
                    "parts": [{
                        "text": f"{system_prompt}\n\nUser Question: {message}"
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.8,
                    "topK": 40,
                    "maxOutputTokens": 500
                }
            }
            
            # Make API call
            response = requests.post(
                f"{self.gemini_url}?key={self.api_key}",
                headers={'Content-Type': 'application/json'},
                json=request_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    content = result['candidates'][0]['content']['parts'][0]['text']
                    
                    return ChatResponse(
                        message=content,
                        language=language,
                        confidence=0.85,
                        category="farming_advice"
                    )
                else:
                    return self._get_mock_response(message, language)
            else:
                print(f"Gemini API error: {response.status_code} - {response.text}")
                return self._get_mock_response(message, language)
                
        except Exception as e:
            print(f"Error in Gemini chat: {str(e)}")
            return self._get_mock_response(message, language)
    
    async def get_market_advice(self, crop_name: str, current_price: float, language: str = "hi") -> ChatResponse:
        """
        Get market advice for a specific crop
        """
        message = f"Should I sell my {crop_name} today? Current price is ₹{current_price}/kg."
        context = {
            "crop_type": crop_name,
            "current_price": current_price,
            "advice_type": "market"
        }
        
        response = await self.get_chat_response(message, language, context)
        response.category = "market_advice"
        return response
    
    async def get_farming_guidance(self, crop_type: str, location: str, language: str = "hi") -> ChatResponse:
        """
        Get farming guidance for specific crop and location
        """
        message = f"What should I do this week for my {crop_type} crop in {location}?"
        context = {
            "crop_type": crop_type,
            "location": location,
            "advice_type": "farming"
        }
        
        response = await self.get_chat_response(message, language, context)
        response.category = "farming_advice"
        return response
    
    async def get_scheme_recommendations(self, farmer_type: str, crop_type: str, location: str, language: str = "hi") -> ChatResponse:
        """
        Get government scheme recommendations
        """
        message = f"What government schemes can help me? I am a {farmer_type} farmer growing {crop_type} in {location}."
        context = {
            "farmer_type": farmer_type,
            "crop_type": crop_type,
            "location": location,
            "advice_type": "schemes"
        }
        
        response = await self.get_chat_response(message, language, context)
        response.category = "scheme_info"
        return response
    
    def _get_system_prompt(self, language: str, context: Optional[Dict] = None) -> str:
        """
        Generate system prompt based on language and context
        """
        lang_prompts = {
            "hi": "आप किसान AI हैं, भारतीय किसानों के लिए एक सहायक कृषि सलाहकार। आप खेती, फसल की बीमारियों, बाजार की कीमतों और सरकारी योजनाओं के बारे में व्यावहारिक, कार्यान्वित सलाह प्रदान करते हैं।",
            "en": "You are Kisan AI, a helpful agricultural assistant for Indian farmers. You provide practical, actionable advice about farming, crop diseases, market prices, and government schemes.",
            "kn": "ನೀವು ಕಿಸಾನ್ AI, ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ಸಹಾಯಕ ಕೃಷಿ ಸಲಹೆಗಾರ. ನೀವು ಕೃಷಿ, ಬೆಳೆ ರೋಗಗಳು, ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ ನೀಡುತ್ತೀರಿ.",
            "ta": "நீங்கள் கிசான் AI, இந்திய விவசாயிகளுக்கான உதவிகரமான வேளாண் உதவியாளர். நீங்கள் விவசாயம், பயிர் நோய்கள், சந்தை விலைகள் மற்றும் அரசு திட்டங்கள் பற்றிய நடைமுறை ஆலோசனை வழங்குகிறீர்கள்.",
            "te": "మీరు కిసాన్ AI, భారతీయ రైతుల కోసం సహాయకరమైన వ్యవసాయ సహాయకుడు. మీరు వ్యవసాయం, పంట వ్యాధులు, మార్కెట్ ధరలు మరియు ప్రభుత్వ పథకాల గురించి ఆచరణాత్మక సలహాలు అందిస్తారు.",
            "mr": "तुम्ही किसान AI आहात, भारतीय शेतकऱ्यांसाठी उपयुक्त कृषी सल्लागार. तुम्ही शेती, पिकांचे रोग, बाजार भाव आणि सरकारी योजनांबद्दल व्यावहारिक सल्ला देता.",
            "bn": "আপনি কিসান AI, ভারতীয় কৃষকদের জন্য একটি সহায়ক কৃষি পরামর্শদাতা। আপনি কৃষি, ফসলের রোগ, বাজারের দাম এবং সরকারি প্রকল্প সম্পর্কে ব্যবহারিক পরামর্শ প্রদান করেন।",
            "gu": "તમે કિસાન AI છો, ભારતીય ખેડૂતો માટે સહાયક કૃષિ સલાહકાર. તમે ખેતી, પાકના રોગો, બજાર ભાવ અને સરકારી યોજનાઓ વિશે વ્યવહારિક સલાહ આપો છો."
        }
        
        base_prompt = lang_prompts.get(language, lang_prompts["hi"])
        
        if context:
            base_prompt += f"\n\nContext: {json.dumps(context, ensure_ascii=False)}"
        
        base_prompt += f"\n\nLanguage: Respond in {language} language"
        base_prompt += "\n\nGuidelines:\n- Keep responses concise but informative\n- Focus on practical solutions\n- Include both traditional and modern farming practices\n- Mention government schemes when relevant\n- Be sensitive to small-scale farming constraints\n- Always include confidence level in your advice"
        
        return base_prompt
    
    def _get_mock_response(self, message: str, language: str) -> ChatResponse:
        """
        Generate mock response for development
        """
        responses = {
            "hi": {
                "text": "आपके सवाल के जवाब में, मैं सुझाव देता हूं कि आप अपनी फसल की नियमित जांच करें। मौसम को देखते हुए, अगले 3-4 दिनों में सिंचाई करना उचित होगा। यदि आपको कोई बीमारी के लक्षण दिखें तो तुरंत स्थानीय कृषि विशेषज्ञ से सलाह लें।",
                "confidence": 0.85,
                "category": "farming_advice",
                "actionable_steps": [
                    "फसल की दैनिक जांच करें",
                    "मिट्टी की नमी देखें",
                    "मौसम की जानकारी रखें"
                ]
            },
            "en": {
                "text": "Based on your question, I recommend regular monitoring of your crop. Given the current weather conditions, irrigation in the next 3-4 days would be appropriate. If you notice any disease symptoms, consult your local agricultural expert immediately.",
                "confidence": 0.85,
                "category": "farming_advice",
                "actionable_steps": [
                    "Monitor crop daily",
                    "Check soil moisture",
                    "Stay updated on weather"
                ]
            },
            "kn": {
                "text": "ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರವಾಗಿ, ನಿಮ್ಮ ಬೆಳೆಯ ನಿಯಮಿತ ಪರಿಶೀಲನೆ ಮಾಡಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ. ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಗಮನಿಸಿದರೆ, ಮುಂದಿನ 3-4 ದಿನಗಳಲ್ಲಿ ನೀರಾವರಿ ಮಾಡುವುದು ಸೂಕ್ತವಾಗಿರುತ್ತದೆ.",
                "confidence": 0.85,
                "category": "farming_advice",
                "actionable_steps": [
                    "ಬೆಳೆಯನ್ನು ಪ್ರತಿದಿನ ಪರಿಶೀಲಿಸಿ",
                    "ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರಿಶೀಲಿಸಿ",
                    "ಹವಾಮಾನ ಮಾಹಿತಿಯನ್ನು ಅಪ್ಡೇಟ್ ಮಾಡಿ"
                ]
            }
        }
        
        response_data = responses.get(language, responses["hi"])
        
        return ChatResponse(
            message=response_data["text"],
            language=language,
            confidence=response_data["confidence"],
            category=response_data["category"],
            actionable_steps=response_data.get("actionable_steps", [])
        )