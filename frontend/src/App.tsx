import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { PredictPage } from "./pages/PredictPage";
import { AssistantPage } from "./pages/AssistantPage";
import { HistoryPage } from "./pages/HistoryPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

export const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/predict" element={<PredictPage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
