import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Camera } from 'lucide-react';
import VoiceButton from '../components/VoiceButton';
import BottomNavigation from '../components/BottomNavigation';
import LanguageSelector from '../components/LanguageSelector';
import { mockWeather } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeCropImage } from '../services/vision';
import { speakTextInLanguage } from '../services/voice';

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translate, getLanguageCode } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase();
    
    let response = '';
    let navigationPath = '';
    
    if (lowerCommand.includes('crop') || lowerCommand.includes('disease') || lowerCommand.includes('फसल') || lowerCommand.includes('ಬೆಳೆ')) {
      response = translate('crop.diagnosis');
      navigationPath = '/crop-diagnosis';
    } else if (lowerCommand.includes('price') || lowerCommand.includes('market') || lowerCommand.includes('बाजार') || lowerCommand.includes('ಮಾರುಕಟ್ಟೆ')) {
      response = translate('market.prices');
      navigationPath = '/market-prices';
    } else if (lowerCommand.includes('scheme') || lowerCommand.includes('योजना') || lowerCommand.includes('ಯೋಜನೆ')) {
      response = translate('schemes.government');
      navigationPath = '/government-schemes';
    } else if (lowerCommand.includes('farm') || lowerCommand.includes('खेत') || lowerCommand.includes('ಫಾರ್ಮ್')) {
      response = translate('farm.myFarm');
      navigationPath = '/my-farm';
    } else {
      response = translate('voice.askAbout');
      toast({
        title: translate('voice.commandNotUnderstood'),
        description: translate('voice.askAbout'),
        duration: 3000,
      });
      
      // Speak the response
      await speakTextInLanguage(response, getLanguageCode());
      return;
    }
    
    // Speak the response
    await speakTextInLanguage(response, getLanguageCode());
    
    // Navigate to the appropriate page
    if (navigationPath) {
      navigate(navigationPath);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsAnalyzing(true);
      
      toast({
        title: translate('system.uploading'),
        description: translate('crop.analyzing'),
        duration: 2000,
      });
      
      try {
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          
          // Call vision API
          const result = await analyzeCropImage(base64Image);
          
          // Store result in session storage for diagnosis page
          sessionStorage.setItem('cropAnalysisResult', JSON.stringify(result));
          sessionStorage.setItem('uploadedImage', base64Image);
          
          // Navigate to diagnosis page
          navigate('/crop-diagnosis');
          
          // Speak the result
          const responseText = `${translate('crop.diseaseIdentified')}: ${result.disease.name}`;
          await speakTextInLanguage(responseText, getLanguageCode());
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error analyzing image:', error);
        toast({
          title: translate('system.error'),
          description: translate('system.tryAgain'),
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleCameraCapture = async () => {
    toast({
      title: translate('crop.camera'),
      description: translate('crop.uploadImage'),
      duration: 2000,
    });
    
    // TODO: Implement camera capture
    // For now, simulate camera capture
    setTimeout(() => {
      navigate('/crop-diagnosis');
    }, 1000);
  };

  const quickAccessItems = [
    {
      icon: '📷',
      titleKey: 'crop.info',
      path: '/crop-diagnosis'
    },
    {
      icon: '₹',
      titleKey: 'market.prices',
      path: '/market-prices'
    },
    {
      icon: '🏛',
      titleKey: 'schemes.government',
      path: '/government-schemes'
    },
    {
      icon: '👥',
      titleKey: 'farm.myFarm',
      path: '/my-farm'
    }
  ];

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <h1>Kisan AI</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-right">
            <div>{mockWeather.location}</div>
            <div>{mockWeather.temperature}°C • {mockWeather.condition}</div>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Welcome Message */}
      <div className="kisan-card">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            {translate('home.greeting')}
          </h2>
          <p className="text-gray-600 text-sm">
            The Digital Agronomist in Your Pocket
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="kisan-search-bar">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder={translate('home.searchPlaceholder')}
          className="kisan-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Voice and Upload Buttons */}
      <div className="flex gap-4 px-4 mb-4">
        <VoiceButton onVoiceCommand={handleVoiceCommand} />
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isAnalyzing}
          />
          <div className={`bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-400 transition-colors ${
            isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
            ) : (
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {isAnalyzing ? translate('system.pleaseWait') : translate('home.uploadImage')}
            </span>
          </div>
        </label>
      </div>

      {/* Quick Access */}
      <div className="px-4 mb-20">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          {translate('home.quickAccess')}
        </h3>
        <div className="kisan-grid">
          {quickAccessItems.map((item, index) => (
            <div
              key={index}
              className="kisan-quick-access"
              onClick={() => navigate(item.path)}
            >
              <div className="kisan-quick-access-icon">{item.icon}</div>
              <div className="kisan-quick-access-text">{translate(item.titleKey)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Card */}
      <div className="kisan-card mx-4 mb-20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-green-800">{translate('home.todaysWeather')}</h4>
            <p className="text-sm text-gray-600">{mockWeather.locationHindi}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{mockWeather.temperature}°C</div>
            <div className="text-sm text-gray-600">{mockWeather.condition}</div>
            <div className="text-xs text-gray-500">Humidity: {mockWeather.humidity}%</div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;