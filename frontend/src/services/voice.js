// Voice Services - Speech-to-Text and Text-to-Speech
// TODO: Add REACT_APP_VERTEX_API_KEY to .env

const VERTEX_API_KEY = process.env.REACT_APP_VERTEX_API_KEY;
const STT_API_URL = 'https://speech.googleapis.com/v1/speech:recognize';
const TTS_API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

/**
 * Convert audio blob to text transcription
 * @param {Blob} audioBlob - Audio recording blob
 * @param {string} languageCode - Language code (hi-IN, en-IN, etc.)
 * @returns {Promise<string>} Transcribed text
 */
export const getTranscriptionFromVoice = async (audioBlob, languageCode = 'hi-IN') => {
  try {
    if (!VERTEX_API_KEY) {
      console.warn('Vertex API key not found, using mock transcription');
      return getMockTranscription(languageCode);
    }

    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    
    // TODO: Replace with actual Vertex AI STT API call
    const response = await fetch(`${STT_API_URL}?key=${VERTEX_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: languageCode,
          enableAutomaticPunctuation: true,
          model: 'latest_long'
        },
        audio: {
          content: base64Audio.split(',')[1]
        }
      })
    });

    const result = await response.json();
    
    // TODO: Process actual STT response
    // For now, return mock data
    return getMockTranscription(languageCode);
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return getMockTranscription(languageCode);
  }
};

/**
 * Convert text to speech and play audio
 * @param {string} text - Text to speak
 * @param {string} langCode - Language code
 * @returns {Promise<void>}
 */
export const speakTextInLanguage = async (text, langCode = 'hi-IN') => {
  try {
    if (!VERTEX_API_KEY) {
      console.warn('Vertex API key not found, using Web Speech API fallback');
      return speakWithWebAPI(text, langCode);
    }

    // TODO: Replace with actual Vertex AI TTS API call
    const response = await fetch(`${TTS_API_URL}?key=${VERTEX_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text: text },
        voice: {
          languageCode: langCode,
          name: getVoiceName(langCode),
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1.0
        }
      })
    });

    const result = await response.json();
    
    // TODO: Process actual TTS response and play audio
    // For now, use Web Speech API fallback
    return speakWithWebAPI(text, langCode);
    
  } catch (error) {
    console.error('Error with text-to-speech:', error);
    return speakWithWebAPI(text, langCode);
  }
};

/**
 * Fallback to Web Speech API
 * @param {string} text - Text to speak
 * @param {string} langCode - Language code
 */
const speakWithWebAPI = (text, langCode) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
  } else {
    console.warn('Speech synthesis not supported');
  }
};

/**
 * Get appropriate voice name for language
 * @param {string} langCode - Language code
 * @returns {string} Voice name
 */
const getVoiceName = (langCode) => {
  const voiceMap = {
    'hi-IN': 'hi-IN-Wavenet-A',
    'en-IN': 'en-IN-Wavenet-A',
    'kn-IN': 'kn-IN-Wavenet-A',
    'ta-IN': 'ta-IN-Wavenet-A',
    'te-IN': 'te-IN-Wavenet-A',
    'mr-IN': 'mr-IN-Wavenet-A',
    'bn-IN': 'bn-IN-Wavenet-A',
    'gu-IN': 'gu-IN-Wavenet-A'
  };
  return voiceMap[langCode] || 'hi-IN-Wavenet-A';
};

/**
 * Convert blob to base64
 * @param {Blob} blob - Audio blob
 * @returns {Promise<string>} Base64 string
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Mock transcription for development
 * @param {string} languageCode - Language code
 * @returns {string} Mock transcription
 */
const getMockTranscription = (languageCode) => {
  const mockTranscriptions = {
    'hi-IN': 'मेरी फसल में बीमारी है',
    'en-IN': 'My crop has disease',
    'kn-IN': 'ನನ್ನ ಬೆಳೆಗೆ ರೋಗವಿದೆ',
    'ta-IN': 'என் பயிரில் நோய் உள்ளது',
    'te-IN': 'నా పంటలో వ్యాధి ఉంది',
    'mr-IN': 'माझ्या पिकात रोग आहे',
    'bn-IN': 'আমার ফসলে রোগ আছে',
    'gu-IN': 'મારા પાકમાં રોગ છે'
  };
  return mockTranscriptions[languageCode] || mockTranscriptions['hi-IN'];
};