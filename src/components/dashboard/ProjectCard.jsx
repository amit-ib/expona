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
      localStorage.removeItem("tenderReport");
      localStorage.removeItem("tenderTitle");
      localStorage.removeItem("tenderId");
      localStorage.setItem("tenderId", id);
      navigate("/chat", { state: { id, filename, title } });
    }
  };

  return (
    <div
      className="rounded-md my-1 px-6 py-[15px] flex justify-between items-center cursor-pointer transition-all duration-500  hover:bg-gray-24 hover:border-gray-32"
      onClick={handleCardClick}
    >
      <div className="flex gap-y-6 gap-x-4 items-center">
        <div className="text-[32px] leading-[1.21] w-10">
          <img src="/images/file-icon.svg" alt="" className="w-10" />
        </div>
        <div className="flex flex-col gap-[7px]">
          <h3
            className="font-lexend  text-[16px] leading-[1.25] text-white max-w-xl truncate"
            title={title}
          >
            {title}
          </h3>
          <p
            className="font-lexend  font-light text-[14px] leading-[1.25] text-white/80"
            title={issuer}
          >
            {truncateWords(issuer, 10)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-lexend font-light text-xs leading-[1.25] text-white/80 text-right bg-gray-24 px-4 py-2 rounded-full">
          {matched_criteria} out of {total_criteria} matched
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
