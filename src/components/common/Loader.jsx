import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-expona-red"></div>
    </div>
  );
};

export default Loader;
