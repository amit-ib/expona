import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { projects as initialProjects } from "../../data/projects";
import { fetchTenderSummary, fetchTenderReport } from "../../api/apiHelper";

const ProjectList = ({ tenderList }) => {
  const [projects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTenderList, setFilteredTenderList] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Handler to fetch summary for a project by id
  const handleProjectClick = async (projectId) => {
    try {
      // console.log("Received projectId from ProjectCard:", projectId);
      const response = await fetchTenderSummary();
      // Find the summary for the clicked project

      // const summaryObj = response.data[0].find(item => item.id === projectId);
      if (response) {
        // console.log(`Summary: ${summaryObj.summary}`);
        console.log("TENDER LIST:", response.data[0].id);
      } else {
        console.log("No summary found for this project.");
      }
    } catch (err) {
      console.log("Failed to fetch tender summary.", err);
    }
  };

  // Filter tenderList based on search term
  useEffect(() => {
    if (!Array.isArray(tenderList)) {
      setFilteredTenderList([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredTenderList(tenderList);
    } else {
      const filtered = tenderList.filter((tender) => {
        const titleMatch = tender.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const issuerMatch = tender.issuer
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        return titleMatch || issuerMatch;
      });
      setFilteredTenderList(filtered);
    }
  }, [tenderList, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle search visibility
  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
    // Clear search when hiding
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  // useEffect(() => {
  //   // TEMP: Call fetchTenderReport on mount for testing
  //   const getReport = async () => {
  //     try {
  //       const report = await fetchTenderReport({
  //         filename: "NIELIT Tender Rate Contract for PrintingScanningDesigning Services",
  //         company_id: "82"
  //       });
  //       console.log('fetchTenderReport output (ProjectList):', report);
  //     } catch (err) {
  //       console.error('fetchTenderReport error (ProjectList):', err);
  //     }
  //   };
  //   getReport();
  // }, []);

  return (
    <div className="w-full flex-1  px-0 bg-gray-32 border border-gray-4f rounded-lg">
      <div className="flex flex-col gap-0 bg-transparent">
        <div className="flex justify-between items-center px-6 py-4 mb-5 border-b border-gray-4f">
          <div className="py-1">
            <h2 className="text-xl font-semibold">My projects</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2" onClick={toggleSearchVisibility}>
                <img
                  src="/images/search-icon.svg"
                  alt="Search"
                  width="20"
                  height="20"
                />
              </button>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={` py-2 bg-gray-24 border border-gray-4f rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-all duration-300 ease-in-out ${
                  isSearchVisible
                    ? "opacity-100 w-64 px-3"
                    : "opacity-0 w-0 px-0 border-transparent"
                }`}
              />
            </div>
          </div>
        </div>

        {/* <div className="h-px bg-gray-4f w-full mt-6 mb-0"></div> */}

        {/* Project Cards with border-b except last */}
        <div className="flex flex-col mx-4">
          {Array.isArray(filteredTenderList) &&
            filteredTenderList.map((tender, idx) => (
              <div key={tender.id}>
                <ProjectCard
                  tender={tender}
                  onProjectClick={handleProjectClick}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
