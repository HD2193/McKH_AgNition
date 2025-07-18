import json
import os
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime, date, timedelta
from models.market import MarketPrice, MarketAnalysis, MarketAdvice, PriceTrend

class MandiService:
    def __init__(self):
        self.api_key = os.getenv('MANDI_API_KEY')
        self.mandi_url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'
        
    async def get_market_prices(self, crop_name: str, region: str, district: str = None, language: str = "hi") -> MarketAnalysis:
        """
        Fetch market prices for a specific crop and region
        """
        try:
            if not self.api_key:
                print("Warning: Mandi API key not found, using mock data")
                return self._get_mock_market_analysis(crop_name, region, language)
            
            # Prepare API parameters
            params = {
                'api-key': self.api_key,
                'format': 'json',
                'limit': '100',
                'filters[state]': region,
                'filters[commodity]': crop_name
            }
            
            if district:
                params['filters[district]'] = district
            
            # Make API call
            response = requests.get(self.mandi_url, params=params, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return self._process_mandi_data(result, crop_name, region, language)
            else:
                print(f"Mandi API error: {response.status_code} - {response.text}")
                return self._get_mock_market_analysis(crop_name, region, language)
                
        except Exception as e:
            print(f"Error fetching market prices: {str(e)}")
            return self._get_mock_market_analysis(crop_name, region, language)
    
    async def get_price_trends(self, crop_name: str, region: str, days: int = 7) -> List[PriceTrend]:
        """
        Get price trends for a crop over specified days
        """
        try:
            # TODO: Implement actual price trend API call
            # For now, return mock data
            return self._get_mock_price_trends(crop_name, days)
            
        except Exception as e:
            print(f"Error fetching price trends: {str(e)}")
            return self._get_mock_price_trends(crop_name, days)
    
    async def get_nearby_markets(self, latitude: float, longitude: float, radius: int = 50) -> List[Dict]:
        """
        Get nearby mandi locations
        """
        try:
            # TODO: Implement actual location-based mandi API call
            # For now, return mock data
            return self._get_mock_nearby_markets(latitude, longitude)
            
        except Exception as e:
            print(f"Error fetching nearby markets: {str(e)}")
            return self._get_mock_nearby_markets(latitude, longitude)
    
    def _process_mandi_data(self, data: Dict, crop_name: str, region: str, language: str) -> MarketAnalysis:
        """
        Process actual mandi API data
        """
        # TODO: Implement actual data processing
        # For now, return mock data with some randomization
        return self._get_mock_market_analysis(crop_name, region, language)
    
    def _get_mock_market_analysis(self, crop_name: str, region: str, language: str) -> MarketAnalysis:
        """
        Generate mock market analysis for development
        """
        # Get base price for the crop
        base_price = self._get_crop_base_price(crop_name)
        
        # Add some randomization (±20%)
        import random
        variation = (random.random() - 0.5) * 0.4
        current_avg = round(base_price * (1 + variation), 2)
        current_min = round(current_avg * 0.9, 2)
        current_max = round(current_avg * 1.1, 2)
        
        # Create current price
        current_price = MarketPrice(
            crop_name=crop_name,
            crop_name_hindi=self._get_crop_name_hindi(crop_name),
            region=region,
            district="Sample District",
            market_name="Main Mandi",
            market_name_hindi="मुख्य मंडी",
            min_price=current_min,
            max_price=current_max,
            avg_price=current_avg,
            price_date=date.today()
        )
        
        # Generate price trends
        price_trends = self._get_mock_price_trends(crop_name, 7)
        
        # Generate market advice
        advice = self._generate_market_advice(price_trends, current_avg, language)
        
        # Mock nearby markets
        nearby_markets = self._get_mock_nearby_markets(20.5937, 78.9629)  # Center of India
        
        return MarketAnalysis(
            crop_name=crop_name,
            current_price=current_price,
            price_trends=price_trends,
            advice=advice,
            nearby_markets=nearby_markets
        )
    
    def _get_mock_price_trends(self, crop_name: str, days: int) -> List[PriceTrend]:
        """
        Generate mock price trends
        """
        base_price = self._get_crop_base_price(crop_name)
        trends = []
        
        import random
        for i in range(days, 0, -1):
            trend_date = date.today() - timedelta(days=i)
            variation = (random.random() - 0.5) * 0.3
            price = round(base_price * (1 + variation), 2)
            volume = random.randint(500, 2000)
            
            trends.append(PriceTrend(
                date=trend_date,
                price=price,
                volume=volume
            ))
        
        return trends
    
    def _generate_market_advice(self, price_trends: List[PriceTrend], current_price: float, language: str) -> MarketAdvice:
        """
        Generate market advice based on price trends
        """
        # Simple trend analysis
        if len(price_trends) >= 2:
            recent_trend = price_trends[-1].price - price_trends[-2].price
            if recent_trend > 0:
                trend_direction = "up"
            elif recent_trend < 0:
                trend_direction = "down"
            else:
                trend_direction = "stable"
        else:
            trend_direction = "stable"
        
        # Generate advice based on trend
        advice_data = {
            "hi": {
                "up": {
                    "action": "sell",
                    "reason": "भाव बढ़ रहे हैं, अभी बेचना फायदेमंद होगा",
                    "timeframe": "1-2 दिन में"
                },
                "down": {
                    "action": "wait",
                    "reason": "भाव गिर रहे हैं, थोड़ा इंतजार करें",
                    "timeframe": "3-4 दिन में"
                },
                "stable": {
                    "action": "hold",
                    "reason": "भाव स्थिर हैं, बेच सकते हैं",
                    "timeframe": "अभी"
                }
            },
            "en": {
                "up": {
                    "action": "sell",
                    "reason": "Prices are rising, good time to sell",
                    "timeframe": "1-2 days"
                },
                "down": {
                    "action": "wait",
                    "reason": "Prices are falling, wait for better rates",
                    "timeframe": "3-4 days"
                },
                "stable": {
                    "action": "hold",
                    "reason": "Prices are stable, you can sell",
                    "timeframe": "now"
                }
            }
        }
        
        lang_advice = advice_data.get(language, advice_data["hi"])
        trend_advice = lang_advice[trend_direction]
        
        return MarketAdvice(
            action=trend_advice["action"],
            reason=trend_advice["reason"],
            confidence=0.75,
            expected_change=trend_direction,
            timeframe=trend_advice["timeframe"]
        )
    
    def _get_mock_nearby_markets(self, latitude: float, longitude: float) -> List[Dict]:
        """
        Generate mock nearby markets
        """
        return [
            {
                "name": "Main Vegetable Mandi",
                "name_hindi": "मुख्य सब्जी मंडी",
                "address": "Station Road, City Center",
                "address_hindi": "स्टेशन रोड, सिटी सेंटर",
                "distance": 2.5,
                "contact": "+91 98765 43210",
                "timings": "5:00 AM - 2:00 PM",
                "timings_hindi": "सुबह 5:00 - दोपहर 2:00",
                "latitude": latitude + 0.01,
                "longitude": longitude + 0.01
            },
            {
                "name": "Grain Market",
                "name_hindi": "अनाज मंडी",
                "address": "Agriculture Road, Sector 15",
                "address_hindi": "कृषि रोड, सेक्टर 15",
                "distance": 5.2,
                "contact": "+91 98765 43211",
                "timings": "6:00 AM - 12:00 PM",
                "timings_hindi": "सुबह 6:00 - दोपहर 12:00",
                "latitude": latitude + 0.02,
                "longitude": longitude - 0.01
            }
        ]
    
    def _get_crop_base_price(self, crop_name: str) -> float:
        """
        Get base price for different crops (per kg)
        """
        base_prices = {
            'tomato': 15.0,
            'tomatoes': 15.0,
            'potato': 20.0,
            'potatoes': 20.0,
            'onion': 25.0,
            'onions': 25.0,
            'wheat': 30.0,
            'rice': 35.0,
            'cotton': 55.0,  # per kg
            'sugarcane': 3.0,  # per kg
            'maize': 20.0,
            'barley': 25.0,
            'mustard': 55.0,
            'groundnut': 55.0,
            'soybean': 45.0
        }
        
        return base_prices.get(crop_name.lower(), 20.0)
    
    def _get_crop_name_hindi(self, crop_name: str) -> str:
        """
        Get Hindi name for crops
        """
        hindi_names = {
            'tomato': 'टमाटर',
            'tomatoes': 'टमाटर',
            'potato': 'आलू',
            'potatoes': 'आलू',
            'onion': 'प्याज',
            'onions': 'प्याज',
            'wheat': 'गेहूं',
            'rice': 'चावल',
            'cotton': 'कपास',
            'sugarcane': 'गन्ना',
            'maize': 'मक्का',
            'barley': 'जौ',
            'mustard': 'सरसों',
            'groundnut': 'मूंगफली',
            'soybean': 'सोयाबीन'
        }
        
        return hindi_names.get(crop_name.lower(), crop_name)