import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";
import HomePage from "./pages/HomePage";
import CropDiagnosisPage from "./pages/CropDiagnosisPage";
import MarketPricesPage from "./pages/MarketPricesPage";
import GovernmentSchemesPage from "./pages/GovernmentSchemesPage";
import MyFarmPage from "./pages/MyFarmPage";
import "./styles/global.css";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/crop-diagnosis" element={<CropDiagnosisPage />} />
            <Route path="/market-prices" element={<MarketPricesPage />} />
            <Route path="/government-schemes" element={<GovernmentSchemesPage />} />
            <Route path="/my-farm" element={<MyFarmPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;