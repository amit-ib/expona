import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import UploadAction from "../components/dashboard/UploadAction";
import ProjectList from "../components/dashboard/ProjectList";
import { fetchGoogleSessionData } from "../api/apiHelper";
// import DashboardCard from "../components/dashboard/DashboardCard";

const Dashboard = ({ projectsVisibility }) => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Get token from URL query string ('scope' param)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("scope");
    if (token) {
      fetchGoogleSessionData(token)
        .then(data => {
          setSessionData(data);
          console.log("Google session data:", data);
        })
        .catch(err => {
          console.error("Failed to fetch Google session data:", err);
        });
    }
  }, []);

  console.log(projectsVisibility, "projectsVisibility")
  return (
    <div className="min-h-screen bg-gray-2d text-white">
      {/* Using the Header component */}
      <Header projectsVisibility={projectsVisibility} />

      {/* Main Content */}
      <main className="flex justify-center items-start w-full px-10 py-6">
        <div className={`flex flex-row gap-4 w-full  min-h-[calc(100vh-180px)] ${!projectsVisibility ? "pt-24 pb-32 px-48" : ""}`}>{/* 96px header, 48px py-12 */}
          {/* Left Card: Upload + Info */}

          <UploadAction projectsVisibility={projectsVisibility} />

          {/* Right Card: Project Listing */}

          <ProjectList projectsVisibility={projectsVisibility} />

        </div>
      </main>
    </div>
  );
};

export default Dashboard; 