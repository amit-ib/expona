import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Hero from "./components/layout/Hero";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [projectsVisibility, setProjectsVisibility] = useState(true);

  return (
    <Router>
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
          <Route path="/dashboard" element={<Dashboard projectsVisibility={projectsVisibility} />} />
          <Route path="/chat" element={<Chat setProjectsVisibility={setProjectsVisibility} />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
