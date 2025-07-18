import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranscriptionFromVoice } from '../services/voice';

export const useVoiceRecognition = (onTranscription) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const { getLanguageCode } = useLanguage();
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscription) {
          onTranscription(transcript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscription]);

  const startListening = async () => {
    try {
      setError(null);
      
      // Update language
      if (recognitionRef.current) {
        recognitionRef.current.lang = getLanguageCode();
      }
      
      // Try Web Speech API first
      if (recognitionRef.current) {
        recognitionRef.current.start();
        return;
      }
      
      // Fallback to MediaRecorder for custom API
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          try {
            const transcript = await getTranscriptionFromVoice(audioBlob, getLanguageCode());
            if (onTranscription) {
              onTranscription(transcript);
            }
          } catch (error) {
            setError('Failed to transcribe audio');
          }
          setIsListening(false);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorderRef.current.start();
        setIsListening(true);
      } else {
        throw new Error('Media devices not supported');
      }
    } catch (err) {
      setError(err.message);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return {
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening
  };
};