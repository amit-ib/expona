import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { projects as initialProjects } from "../../data/projects";
import { fetchTenderSummary } from "../../api/apiHelper";
import { fetchTenderList } from '../../api/apiHelper';
const ProjectList = ({ projectsVisibility = true }) => {
  const [projects] = useState(initialProjects);
  const [tenderList, setTenderList] = useState([]);
  useEffect(() => {
    fetchTenderList({})
      .then(data => {
        console.log("Tender list API response:", data);
        setTenderList(data.data || []);
      })
      .catch(() => setTenderList([]));
  }, []);

  if (!projectsVisibility) return null;




  // Handler to fetch summary for a project by id
  const handleProjectClick = async (projectId) => {
    try {
      // console.log("Received projectId from ProjectCard:", projectId);
      const response = await fetchTenderSummary();
      // Find the summary for the clicked project

      // const summaryObj = response.data[0].find(item => item.id === projectId);
      if (response) {
        // console.log(`Summary: ${summaryObj.summary}`);
        console.log("TENDER LIST:", response.data[0].id)
      } else {
        console.log("No summary found for this project.");
      }
    } catch (err) {
      console.log("Failed to fetch tender summary.", err);
    }
  };

  return (
    <div className="w-full flex-1  px-0 bg-gray-32 border border-gray-4f rounded-lg">
      <div className="flex flex-col gap-0 bg-transparent">
        <div className="flex justify-between items-center px-6 py-4 mb-5 border-b border-gray-4f">
          <div className="py-1">
            <h2 className="text-xl font-semibold">My projects</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex">
              <button className="p-3">
                <img src="/images/search-icon.svg" alt="Search" width="20" height="20" />
              </button>
            </div>
          </div>
        </div>

        {/* <div className="h-px bg-gray-4f w-full mt-6 mb-0"></div> */}

        {/* Project Cards with border-b except last */}
        <div className="flex flex-col mx-4">
          {Array.isArray(tenderList) && tenderList.map((tender, idx) => (
            <div key={tender.id}>
              <ProjectCard tender={tender} onProjectClick={handleProjectClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList; 