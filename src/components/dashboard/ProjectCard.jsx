import React from "react";
import { useNavigate } from "react-router-dom";
import { truncateWords } from "../../utils";

const ProjectCard = ({ tender, onProjectClick }) => {
  const navigate = useNavigate();
  if (!tender) return null;
  const { id, filename, title, issuer, matched_criteria, total_criteria } =
    tender;

  const handleCardClick = () => {
    if (onProjectClick) {
      localStorage.removeItem("TENDER_REPORT");
      localStorage.removeItem("TENDER_TITLE");
      localStorage.removeItem("TENDER_ID");
      localStorage.setItem("TENDER_ID", id);
      navigate("/chat", { state: { id, filename, title } });
    }
  };

  return (
    <div
      className="rounded-md my-1 px-6 py-[15px] lg:flex justify-between items-center cursor-pointer transition-all duration-500 hover:bg-gray-24 hover:border-gray-32"
      onClick={handleCardClick}
    >
      <div className="flex gap-x-4 items-center w-full">
        <div className="text-[32px] leading-[1.21] w-10 shrink-0">
          <img src="/images/file-icon.svg" alt="" className="w-10" />
        </div>

        <div className="flex flex-col gap-[7px] min-w-0 w-full">
          <h3
            className="leading-[1.25] text-white truncate w-full"
            title={title}
          >
            {title}
          </h3>
          <p
            className="font-light text-sm leading-[1.25] text-white/80 truncate w-full"
            title={issuer}
          >
            {truncateWords(issuer, 8)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:shrink-0 mt-3 lg:mt-0">
        <span className="font-lexend lg:w-auto w-full text-center font-light text-xs leading-[1.25] text-white/80  bg-gray-24 px-4 py-2 rounded-full whitespace-nowrap">
          {matched_criteria} out of {total_criteria} matched
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
