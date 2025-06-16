import React from "react";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const { title, type, date, emoji } = project;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/chat");
  };

  return (
    <div
      className="rounded-md my-1 px-6 py-[15px] flex justify-between items-center cursor-pointer transition-all duration-500  hover:bg-gray-24 hover:border-gray-32"
      onClick={handleCardClick}
    >
      <div className="flex gap-6 items-center">
        <div className="text-[32px] leading-[1.21]">{emoji}</div>
        <div className="flex flex-col gap-[7px]">
          <h3 className="font-lexend  text-[16px] leading-[1.25] text-white max-w-xl truncate" title={title}>{title}</h3>
          <p className="font-lexend font-light text-[14px] leading-[1.25] text-white/80">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-lexend font-light text-xs leading-[1.25] text-white/80 text-right bg-gray-24 px-4 py-2 rounded-full">{date}</span>

      </div>
    </div>
  );
};

export default ProjectCard; 