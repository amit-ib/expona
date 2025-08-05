import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import UploadAction from "../components/dashboard/UploadAction";
import ProjectList from "../components/dashboard/ProjectList";
import { fetchGoogleSessionData, fetchTenderList } from "../api/apiHelper";
// import DashboardCard from "../components/dashboard/DashboardCard";

const Dashboard = () => {
  const [sessionData, setSessionData] = useState(null);
  const [projectsVisibility, setProjectsVisibility] = useState(false);
  const [tenderList, setTenderList] = useState([]);

  useEffect(() => {
    // Check localStorage for tenderList
    const storedTenderList = localStorage.getItem("tenderList");
    if (storedTenderList) {
      try {
        const parsedList = JSON.parse(storedTenderList);
        setTenderList(parsedList);
        setProjectsVisibility(parsedList.length > 0);
      } catch (e) {
        // If parsing fails, clear the corrupted data
        localStorage.removeItem("tenderList");
      }
    }

    // Get token from URL query string ('scope' param)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("scope");
    if (token) {
      fetchGoogleSessionData(token)
        .then((data) => {
          setSessionData(data);
          console.log("Google session data:", data);
        })
        .catch((err) => {
          console.error("Failed to fetch Google session data:", err);
        });
    }
    // Fetch tender list (will update state and localStorage)
    const fetchAndUpdateTenderList = () => {
      fetchTenderList({})
        .then((data) => {
          const list = data.data || [];
          setTenderList(list);
          setProjectsVisibility(list.length > 0);
          localStorage.setItem("tenderList", JSON.stringify(list));
        })
        .catch(() => setTenderList([]));
    };
    fetchAndUpdateTenderList();

    localStorage.removeItem("TENDER_REPORT");
    localStorage.removeItem("TENDER_TITLE");
    localStorage.removeItem("TENDER_ID");

    // Polling for updates every 30 seconds
    const interval = setInterval(fetchAndUpdateTenderList, 10000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="min-h-screen bg-gray-2d text-white">
      {/* Using the Header component */}
      <Header projectsVisibility={projectsVisibility} />

      {/* Main Content */}
      <main className="flex justify-center items-start w-full px-10 py-6">
        <div
          className={`flex flex-row gap-4 w-full  min-h-[calc(100vh-180px)] ${
            !projectsVisibility ? "pt-24 pb-32 px-48" : ""
          }`}
        >
          {/* 96px header, 48px py-12 */}
          {/* Left Card: Upload + Info */}

          <UploadAction projectsVisibility={projectsVisibility} />

          {/* Right Card: Project Listing */}
          {projectsVisibility && <ProjectList tenderList={tenderList} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
