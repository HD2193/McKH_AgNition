import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Camera } from 'lucide-react';
import VoiceButton from '../components/VoiceButton';
import BottomNavigation from '../components/BottomNavigation';
import { mockWeather } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('crop') || lowerCommand.includes('disease') || lowerCommand.includes('फसल')) {
      navigate('/crop-diagnosis');
    } else if (lowerCommand.includes('price') || lowerCommand.includes('market') || lowerCommand.includes('बाजार')) {
      navigate('/market-prices');
    } else if (lowerCommand.includes('scheme') || lowerCommand.includes('योजना')) {
      navigate('/government-schemes');
    } else if (lowerCommand.includes('farm') || lowerCommand.includes('खेत')) {
      navigate('/my-farm');
    } else {
      toast({
        title: "कमांड समझा नहीं",
        description: "कृपया 'फसल', 'बाजार', 'योजना' या 'खेत' के बारे में पूछें",
        duration: 3000,
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast({
        title: "तस्वीर अपलोड हुई",
        description: "फसल की जांच की जा रही है...",
        duration: 2000,
      });
      setTimeout(() => {
        navigate('/crop-diagnosis');
      }, 1000);
    }
  };

  const quickAccessItems = [
    {
      icon: '📷',
      title: 'Crop Info',
      titleHindi: 'फसल जानकारी',
      path: '/crop-diagnosis'
    },
    {
      icon: '₹',
      title: 'Market Prices',
      titleHindi: 'बाजार भाव',
      path: '/market-prices'
    },
    {
      icon: '🏛',
      title: 'Schemes',
      titleHindi: 'योजनाएं',
      path: '/government-schemes'
    },
    {
      icon: '👥',
      title: 'Community',
      titleHindi: 'समुदाय',
      path: '/my-farm'
    }
  ];

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <h1>Kisan AI</h1>
        <div className="text-sm">
          <div>{mockWeather.location}</div>
          <div>{mockWeather.temperature}°C • {mockWeather.condition}</div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="kisan-card">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            नमस्ते! मैं आपका कृषि सहायक हूं
          </h2>
          <p className="text-gray-600 text-sm">
            Hello! I'm your agricultural assistant
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="kisan-search-bar">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search for crops, markets, schemes... / फसल, बाजार, योजना खोजें..."
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
          />
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-green-400 transition-colors">
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Upload Image</span>
            <div className="text-xs text-gray-500 mt-1">तस्वीर अपलोड करें</div>
          </div>
        </label>
      </div>

      {/* Quick Access */}
      <div className="px-4 mb-20">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Quick Access</h3>
        <div className="kisan-grid">
          {quickAccessItems.map((item, index) => (
            <div
              key={index}
              className="kisan-quick-access"
              onClick={() => navigate(item.path)}
            >
              <div className="kisan-quick-access-icon">{item.icon}</div>
              <div className="kisan-quick-access-text">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">{item.titleHindi}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Card */}
      <div className="kisan-card mx-4 mb-20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-green-800">Today's Weather</h4>
            <p className="text-sm text-gray-600">आज का मौसम</p>
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