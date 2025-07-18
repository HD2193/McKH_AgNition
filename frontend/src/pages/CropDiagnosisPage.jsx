import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, ExternalLink } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { mockDiseases } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const CropDiagnosisPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    // Simulate automatic disease detection
    if (uploadedImage) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setSelectedDisease(mockDiseases[0]);
        setIsAnalyzing(false);
        toast({
          title: "रोग की पहचान हुई",
          description: "आपकी फसल में Early Blight की समस्या है",
          duration: 3000,
        });
      }, 2000);
    }
  }, [uploadedImage, toast]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    toast({
      title: "कैमरा खुल रहा है",
      description: "फसल की तस्वीर खींचें",
      duration: 2000,
    });
    
    // Simulate camera capture
    setTimeout(() => {
      setUploadedImage("/api/placeholder/crop-disease.jpg");
    }, 1000);
  };

  return (
    <div className="kisan-container">
      {/* Header */}
      <div className="kisan-header">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1>Crop Diagnosis</h1>
        <div className="text-sm">फसल निदान</div>
      </div>

      {/* Upload Section */}
      {!uploadedImage && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              Upload Crop Image
            </h2>
            <p className="text-gray-600 mb-6">फसल की तस्वीर अपलोड करें</p>
            
            <div className="flex gap-4">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 cursor-pointer hover:bg-green-100 transition-colors">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Gallery</span>
                  <div className="text-xs text-green-600 mt-1">गैलरी से चुनें</div>
                </div>
              </label>
              
              <button
                onClick={handleCameraCapture}
                className="flex-1 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 hover:bg-yellow-100 transition-colors"
              >
                <Camera className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Camera</span>
                <div className="text-xs text-yellow-600 mt-1">फोटो खींचें</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Section */}
      {uploadedImage && (
        <div className="p-4">
          {/* Crop Image */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
            <img
              src={uploadedImage}
              alt="Crop analysis"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            {isAnalyzing && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-green-600 font-medium">Analyzing crop...</p>
                <p className="text-gray-500 text-sm">फसल का विश्लेषण हो रहा है...</p>
              </div>
            )}
          </div>

          {/* Disease Result */}
          {selectedDisease && !isAnalyzing && (
            <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-800">Disease Identified</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">{selectedDisease.confidence}%</div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-4">
                <h4 className="font-semibold text-red-800">{selectedDisease.name}</h4>
                <p className="text-red-700 text-sm">{selectedDisease.nameHindi}</p>
                <p className="text-red-600 text-sm mt-1">{selectedDisease.symptoms}</p>
              </div>
            </div>
          )}

          {/* Treatment Recommendations */}
          {selectedDisease && !isAnalyzing && (
            <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Treatment Recommendations
                <span className="block text-sm text-gray-600 font-normal">उपचार सुझाव</span>
              </h3>
              
              <div className="space-y-3">
                {selectedDisease.treatments.map((treatment, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl">{treatment.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">{treatment.title}</h4>
                      <p className="text-green-700 text-sm">{treatment.titleHindi}</p>
                      <p className="text-gray-600 text-sm mt-1">{treatment.description}</p>
                      <p className="text-gray-500 text-xs mt-1">{treatment.descriptionHindi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Resources */}
          {selectedDisease && !isAnalyzing && (
            <div className="bg-white rounded-xl p-4 mb-20 shadow-md">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Additional Resources</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Learn more about {selectedDisease.name}</p>
                    <p className="text-blue-700 text-sm">{selectedDisease.nameHindi} के बारे में और जानें</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">Find nearest agri-store</p>
                    <p className="text-purple-700 text-sm">नजदीकी कृषि दुकान खोजें</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default CropDiagnosisPage;