import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import CompanyDetail from "./pages/CompanyDetail";
import CompanyProfile from "./pages/CompanyProfile";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [projectsVisibility, setProjectsVisibility] = useState(false);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <AppProvider>
          <AuthProvider>
            <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen home-bg bg-cover bg-center">
                  <Header setProjectsVisibility={setProjectsVisibility} />
                  <main>
                    <Hero setProjectsVisibility={setProjectsVisibility} />
                  </main>
                </div>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    projectsVisibility={projectsVisibility}
                    setProjectsVisibility={setProjectsVisibility}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat setProjectsVisibility={setProjectsVisibility} />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="/company-detail"
              element={
                <ProtectedRoute>
                  <CompanyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-profile"
              element={
                <ProtectedRoute>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
          </AuthProvider>
        </AppProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
