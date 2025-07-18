import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

const VoiceButton = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'hi-IN'; // Hindi language
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "सुन रहा हूं...",
          description: "कृपया अपनी बात कहें",
          duration: 2000,
        });
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice command:', transcript);
        
        if (onVoiceCommand) {
          onVoiceCommand(transcript);
        }
        
        toast({
          title: "समझ गया!",
          description: `आपने कहा: "${transcript}"`,
          duration: 3000,
        });
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "माफ करें",
          description: "आवाज समझने में समस्या हुई। कृपया दोबारा कोशिश करें।",
          variant: "destructive",
          duration: 3000,
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.log('Speech recognition not supported');
    }
  }, [onVoiceCommand, toast]);

  const handleVoiceClick = () => {
    if (!recognition) {
      toast({
        title: "माफ करें",
        description: "आपका ब्राउज़र वॉइस सपोर्ट नहीं करता",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <button
      className={`kisan-voice-button ${isListening ? 'listening' : ''}`}
      onClick={handleVoiceClick}
      aria-label="Voice Command"
    >
      🎤
    </button>
  );
};

export default VoiceButton;