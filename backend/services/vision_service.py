import base64
import json
import os
import requests
from typing import Dict, Any
from models.crop_analysis import CropAnalysisResult, DiseaseAnalysis, Treatment

class VisionService:
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_VISION_API_KEY')
        self.vision_url = 'https://vision.googleapis.com/v1/images:annotate'
        
    async def analyze_crop_image(self, image_base64: str, language: str = "hi") -> CropAnalysisResult:
        """
        Analyze crop image for disease detection using Google Vision API
        """
        try:
            if not self.api_key:
                print("Warning: Google Vision API key not found, using mock data")
                return self._get_mock_analysis(language)
            
            # Prepare the request
            clean_base64 = image_base64.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '')
            
            request_data = {
                "requests": [
                    {
                        "image": {
                            "content": clean_base64
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION",
                                "maxResults": 10
                            },
                            {
                                "type": "OBJECT_LOCALIZATION",
                                "maxResults": 10
                            }
                        ]
                    }
                ]
            }
            
            # Make API call
            response = requests.post(
                f"{self.vision_url}?key={self.api_key}",
                headers={'Content-Type': 'application/json'},
                json=request_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return self._process_vision_result(result, language)
            else:
                print(f"Vision API error: {response.status_code} - {response.text}")
                return self._get_mock_analysis(language)
                
        except Exception as e:
            print(f"Error in vision analysis: {str(e)}")
            return self._get_mock_analysis(language)
    
    def _process_vision_result(self, result: Dict, language: str) -> CropAnalysisResult:
        """
        Process Google Vision API result and map to disease analysis
        """
        # TODO: Implement actual disease mapping logic based on Vision API results
        # For now, return mock data with higher confidence if plant-related labels are found
        
        labels = result.get('responses', [{}])[0].get('labelAnnotations', [])
        plant_related = any('plant' in label.get('description', '').lower() or 
                           'leaf' in label.get('description', '').lower() or
                           'crop' in label.get('description', '').lower() 
                           for label in labels)
        
        confidence = 0.85 if plant_related else 0.60
        
        return self._get_mock_analysis(language, confidence)
    
    def _get_mock_analysis(self, language: str = "hi", confidence: float = 0.85) -> CropAnalysisResult:
        """
        Generate mock crop analysis for development
        """
        disease_data = {
            "hi": {
                "name": "Early Blight",
                "name_hindi": "प्रारंभिक झुलसा",
                "symptoms": "Brown spots on leaves, yellowing, wilting",
                "symptoms_hindi": "पत्तियों पर भूरे धब्बे, पीलापन, मुरझाना",
                "causes": "High humidity and poor air circulation",
                "causes_hindi": "अधिक नमी और खराब हवा संचार",
                "prevention": "Regular pruning and proper spacing",
                "prevention_hindi": "नियमित छंटाई और उचित दूरी"
            },
            "en": {
                "name": "Early Blight",
                "name_hindi": "प्रारंभिक झुलसा",
                "symptoms": "Brown spots on leaves, yellowing, wilting",
                "symptoms_hindi": "पत्तियों पर भूरे धब्बे, पीलापन, मुरझाना",
                "causes": "High humidity and poor air circulation",
                "causes_hindi": "अधिक नमी और खराब हवा संचार",
                "prevention": "Regular pruning and proper spacing",
                "prevention_hindi": "नियमित छंटाई और उचित दूरी"
            }
        }
        
        treatments_data = {
            "hi": [
                {
                    "title": "Fungicide Application",
                    "title_hindi": "फफूंदनाशक का प्रयोग",
                    "description": "Apply fungicide every 7-10 days during humid conditions",
                    "description_hindi": "नमी के दौरान हर 7-10 दिन में फफूंदनाशक का छिड़काव करें",
                    "icon": "🧪",
                    "priority": "high"
                },
                {
                    "title": "Improve Ventilation",
                    "title_hindi": "हवा की आवाजाही बढ़ाएं",
                    "description": "Ensure proper spacing between plants for air circulation",
                    "description_hindi": "हवा के संचार के लिए पौधों के बीच उचित दूरी बनाए रखें",
                    "icon": "🌬️",
                    "priority": "medium"
                },
                {
                    "title": "Remove Infected Parts",
                    "title_hindi": "संक्रमित हिस्से हटाएं",
                    "description": "Prune and dispose of infected leaves and stems",
                    "description_hindi": "संक्रमित पत्तियों और तनों को काटकर नष्ट करें",
                    "icon": "✂️",
                    "priority": "high"
                }
            ],
            "en": [
                {
                    "title": "Fungicide Application",
                    "title_hindi": "फफूंदनाशक का प्रयोग",
                    "description": "Apply fungicide every 7-10 days during humid conditions",
                    "description_hindi": "नमी के दौरान हर 7-10 दिन में फफूंदनाशक का छिड़काव करें",
                    "icon": "🧪",
                    "priority": "high"
                },
                {
                    "title": "Improve Ventilation",
                    "title_hindi": "हवा की आवाजाही बढ़ाएं",
                    "description": "Ensure proper spacing between plants for air circulation",
                    "description_hindi": "हवा के संचार के लिए पौधों के बीच उचित दूरी बनाए रखें",
                    "icon": "🌬️",
                    "priority": "medium"
                },
                {
                    "title": "Remove Infected Parts",
                    "title_hindi": "संक्रमित हिस्से हटाएं",
                    "description": "Prune and dispose of infected leaves and stems",
                    "description_hindi": "संक्रमित पत्तियों और तनों को काटकर नष्ट करें",
                    "icon": "✂️",
                    "priority": "high"
                }
            ]
        }
        
        lang_data = disease_data.get(language, disease_data["hi"])
        treatments = treatments_data.get(language, treatments_data["hi"])
        
        disease = DiseaseAnalysis(
            name=lang_data["name"],
            name_hindi=lang_data["name_hindi"],
            confidence=confidence,
            symptoms=lang_data["symptoms"],
            symptoms_hindi=lang_data["symptoms_hindi"],
            causes=lang_data["causes"],
            causes_hindi=lang_data["causes_hindi"],
            prevention=lang_data["prevention"],
            prevention_hindi=lang_data["prevention_hindi"]
        )
        
        treatment_objects = [Treatment(**treatment) for treatment in treatments]
        
        return CropAnalysisResult(
            disease=disease,
            treatments=treatment_objects,
            confidence=confidence
        )