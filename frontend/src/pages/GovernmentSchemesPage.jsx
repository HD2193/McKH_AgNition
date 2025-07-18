import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ExternalLink } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { mockSchemes } from '../data/mockData';

const GovernmentSchemesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchemes = mockSchemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.nameHindi.includes(searchQuery) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularSchemes = filteredSchemes.filter(scheme => scheme.popular);
  const allSchemes = filteredSchemes;

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Direct Benefit':
        return '💰';
      case 'Insurance':
        return '🛡️';
      case 'Organic Farming':
        return '🌿';
      case 'Soil Health':
        return '🔬';
      default:
        return '📄';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Direct Benefit':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'Insurance':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Organic Farming':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Soil Health':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1>Government Schemes</h1>
        <div className="text-sm">सरकारी योजनाएं</div>
      </div>

      {/* Search Bar */}
      <div className="kisan-search-bar">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search for schemes... / योजना खोजें..."
          className="kisan-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Popular Schemes Carousel */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Popular Schemes
          <span className="block text-sm text-gray-600 font-normal">लोकप्रिय योजनाएं</span>
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {popularSchemes.map((scheme) => (
            <div key={scheme.id} className="flex-shrink-0 w-80">
              <div className="kisan-scheme-card">
                <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <div className="text-6xl">{scheme.image}</div>
                </div>
                <div className="kisan-scheme-content">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-2 ${getCategoryColor(scheme.category)}`}>
                    {getCategoryIcon(scheme.category)} {scheme.category}
                  </div>
                  <h4 className="kisan-scheme-title text-lg">{scheme.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{scheme.nameHindi}</p>
                  <p className="kisan-scheme-description">{scheme.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{scheme.descriptionHindi}</p>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Eligibility:</span>
                      <ExternalLink className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm text-green-800 mt-1">{scheme.eligibility}</p>
                    <p className="text-xs text-gray-500">{scheme.eligibilityHindi}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Schemes List */}
      <div className="px-4 mb-20">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          All Schemes
          <span className="block text-sm text-gray-600 font-normal">सभी योजनाएं</span>
        </h3>
        
        <div className="space-y-3">
          {allSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{scheme.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(scheme.category)}`}>
                      {getCategoryIcon(scheme.category)} {scheme.category}
                    </div>
                    {scheme.popular && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-green-800 mb-1">{scheme.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{scheme.nameHindi}</p>
                  <p className="text-sm text-gray-700 mb-2">{scheme.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{scheme.descriptionHindi}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-gray-600">Eligibility: </span>
                      <span className="text-xs text-green-800">{scheme.eligibility}</span>
                    </div>
                    <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1">
                      Apply Now <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default GovernmentSchemesPage;