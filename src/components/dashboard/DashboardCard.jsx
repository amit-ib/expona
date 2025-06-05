import React from "react";

const DashboardCard = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-gray-32] border border-[#44444F] rounded-lg  shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default DashboardCard; 