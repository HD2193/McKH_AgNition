import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useToast } from '../hooks/use-toast';

const VoiceButton = ({ onVoiceCommand }) => {
  const { translate } = useLanguage();
  const { toast } = useToast();

  const handleTranscription = (transcript) => {
    console.log('Voice transcription:', transcript);
    
    if (onVoiceCommand) {
      onVoiceCommand(transcript);
    }
    
    toast({
      title: translate('voice.understood'),
      description: `${translate('voice.youSaid')}: "${transcript}"`,
      duration: 3000,
    });
  };

  const { isListening, error, toggleListening } = useVoiceRecognition(handleTranscription);

  React.useEffect(() => {
    if (isListening) {
      toast({
        title: translate('voice.listening'),
        description: translate('voice.pleaseSpeak'),
        duration: 2000,
      });
    }
  }, [isListening, toast, translate]);

  React.useEffect(() => {
    if (error) {
      let errorMessage = translate('voice.errorUnderstanding');
      
      if (error === 'not-allowed' || error === 'service-not-allowed') {
        errorMessage = translate('voice.notSupported');
      }
      
      toast({
        title: translate('voice.sorry'),
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [error, toast, translate]);

  return (
    <button
      className={`kisan-voice-button ${isListening ? 'listening' : ''}`}
      onClick={toggleListening}
      aria-label="Voice Command"
    >
      🎤
    </button>
  );
};

export default VoiceButton;