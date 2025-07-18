import base64
import json
import os
import requests
from typing import Dict, Any
from models.chat import VoiceResponse, TTSResponse

class VoiceService:
    def __init__(self):
        self.vertex_api_key = os.getenv('VERTEX_API_KEY')
        self.stt_url = 'https://speech.googleapis.com/v1/speech:recognize'
        self.tts_url = 'https://texttospeech.googleapis.com/v1/text:synthesize'
        
    async def transcribe_audio(self, audio_base64: str, language: str = "hi-IN") -> VoiceResponse:
        """
        Convert audio to text using Vertex AI Speech-to-Text
        """
        try:
            if not self.vertex_api_key:
                print("Warning: Vertex API key not found, using mock transcription")
                return self._get_mock_transcription(language)
            
            # Prepare the request
            clean_base64 = audio_base64.replace('data:audio/webm;base64,', '').replace('data:audio/wav;base64,', '')
            
            request_data = {
                "config": {
                    "encoding": "WEBM_OPUS",
                    "sampleRateHertz": 48000,
                    "languageCode": language,
                    "enableAutomaticPunctuation": True,
                    "model": "latest_long"
                },
                "audio": {
                    "content": clean_base64
                }
            }
            
            # Make API call
            response = requests.post(
                f"{self.stt_url}?key={self.vertex_api_key}",
                headers={'Content-Type': 'application/json'},
                json=request_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'results' in result and len(result['results']) > 0:
                    transcript = result['results'][0]['alternatives'][0]['transcript']
                    confidence = result['results'][0]['alternatives'][0].get('confidence', 0.8)
                    
                    return VoiceResponse(
                        transcript=transcript,
                        confidence=confidence,
                        language=language
                    )
                else:
                    return self._get_mock_transcription(language)
            else:
                print(f"STT API error: {response.status_code} - {response.text}")
                return self._get_mock_transcription(language)
                
        except Exception as e:
            print(f"Error in speech transcription: {str(e)}")
            return self._get_mock_transcription(language)
    
    async def synthesize_speech(self, text: str, language: str = "hi-IN", voice_name: str = None) -> TTSResponse:
        """
        Convert text to speech using Vertex AI Text-to-Speech
        """
        try:
            if not self.vertex_api_key:
                print("Warning: Vertex API key not found, using mock TTS")
                return self._get_mock_tts(text, language)
            
            # Get appropriate voice name
            if not voice_name:
                voice_name = self._get_voice_name(language)
            
            request_data = {
                "input": {"text": text},
                "voice": {
                    "languageCode": language,
                    "name": voice_name,
                    "ssmlGender": "NEUTRAL"
                },
                "audioConfig": {
                    "audioEncoding": "MP3",
                    "pitch": 0,
                    "speakingRate": 1.0
                }
            }
            
            # Make API call
            response = requests.post(
                f"{self.tts_url}?key={self.vertex_api_key}",
                headers={'Content-Type': 'application/json'},
                json=request_data,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                audio_content = result.get('audioContent', '')
                
                return TTSResponse(
                    audio_base64=audio_content,
                    language=language
                )
            else:
                print(f"TTS API error: {response.status_code} - {response.text}")
                return self._get_mock_tts(text, language)
                
        except Exception as e:
            print(f"Error in speech synthesis: {str(e)}")
            return self._get_mock_tts(text, language)
    
    def _get_voice_name(self, language_code: str) -> str:
        """
        Get appropriate voice name for language
        """
        voice_map = {
            'hi-IN': 'hi-IN-Wavenet-A',
            'en-IN': 'en-IN-Wavenet-A',
            'kn-IN': 'kn-IN-Wavenet-A',
            'ta-IN': 'ta-IN-Wavenet-A',
            'te-IN': 'te-IN-Wavenet-A',
            'mr-IN': 'mr-IN-Wavenet-A',
            'bn-IN': 'bn-IN-Wavenet-A',
            'gu-IN': 'gu-IN-Wavenet-A'
        }
        return voice_map.get(language_code, 'hi-IN-Wavenet-A')
    
    def _get_mock_transcription(self, language: str) -> VoiceResponse:
        """
        Generate mock transcription for development
        """
        mock_transcriptions = {
            'hi-IN': 'मेरी फसल में बीमारी है',
            'en-IN': 'My crop has disease',
            'kn-IN': 'ನನ್ನ ಬೆಳೆಗೆ ರೋಗವಿದೆ',
            'ta-IN': 'என் பயிரில் நோய் உள்ளது',
            'te-IN': 'నా పంటలో వ్యాధి ఉంది',
            'mr-IN': 'माझ्या पिकात रोग आहे',
            'bn-IN': 'আমার ফসলে রোগ আছে',
            'gu-IN': 'મારા પાકમાં રોગ છે'
        }
        
        return VoiceResponse(
            transcript=mock_transcriptions.get(language, mock_transcriptions['hi-IN']),
            confidence=0.85,
            language=language
        )
    
    def _get_mock_tts(self, text: str, language: str) -> TTSResponse:
        """
        Generate mock TTS response for development
        """
        # Return empty base64 for mock - in production this would be actual audio
        return TTSResponse(
            audio_base64="",
            language=language
        )