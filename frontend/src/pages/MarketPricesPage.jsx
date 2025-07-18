import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { mockCrops } from '../data/mockData';

const MarketPricesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains'];
  const categoriesHindi = ['सभी', 'सब्जियां', 'फल', 'अनाज'];

  const filteredCrops = mockCrops.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.nameHindi.includes(searchQuery)
  );

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1>Market Prices</h1>
        <div className="text-sm">बाजार भाव</div>
      </div>

      {/* Search Bar */}
      <div className="kisan-search-bar">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search for crops... / फसल खोजें..."
          className="kisan-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
              <span className="block text-xs">{categoriesHindi[index]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Prices */}
      <div className="px-4 mb-4">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Today's Prices
          <span className="block text-sm text-gray-600 font-normal">आज के भाव</span>
        </h3>
        
        <div className="space-y-3">
          {filteredCrops.map((crop) => (
            <div key={crop.id} className="kisan-price-item">
              <div className="text-4xl">{crop.image}</div>
              <div className="kisan-crop-info">
                <div className="kisan-crop-name">{crop.name}</div>
                <div className="text-sm text-gray-600">{crop.nameHindi}</div>
                <div className="kisan-crop-price">Average price: ₹{crop.avgPrice}/kg</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  {getTrendIcon(crop.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(crop.trend)}`}>
                    {crop.trend === 'up' ? '+5%' : crop.trend === 'down' ? '-3%' : '0%'}
                  </span>
                </div>
                <div className="kisan-price-range">{crop.priceRange}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Selling Recommendations */}
      <div className="px-4 mb-20">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          AI Selling Recommendations
          <span className="block text-sm text-gray-600 font-normal">AI बिक्री सुझाव</span>
        </h3>
        
        <div className="space-y-3">
          {filteredCrops.slice(0, 2).map((crop) => (
            <div key={crop.id} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{crop.image}</div>
                <div>
                  <h4 className="font-semibold text-green-800">{crop.name}</h4>
                  <p className="text-gray-600 text-sm">{crop.nameHindi}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-3">
                <p className="text-blue-800 font-medium">{crop.recommendation}</p>
                <p className="text-blue-700 text-sm mt-1">
                  {crop.trend === 'up' ? 'अभी बेचें - अच्छा भाव मिलेगा' : 
                   crop.trend === 'down' ? 'थोड़ा इंतज़ार करें - भाव बढ़ सकता है' : 
                   'स्थिर भाव - बेच सकते हैं'}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Current: ₹{crop.avgPrice}/kg
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MarketPricesPage;