import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import { projects as initialProjects } from "../../data/projects";

const ProjectList = ({ projectsVisibility = true }) => {
  const [projects] = useState(initialProjects);

  if (!projectsVisibility) return null;

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
          {projects.map((project, idx) => (
            <div
              key={project.id}
            // className={
            //   idx !== projects.length - 1
            //     ? "border-b border-[#44444F]"
            //     : ""
            // }
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList; 