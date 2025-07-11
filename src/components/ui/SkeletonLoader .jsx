import React from "react";

const SkeletonLoader = () => {
    return (
        <div className="flex flex-col gap-2  ">
            <div className="shimmer-bar w-24" />
            <div className="shimmer-bar w-64" />
            <div className="shimmer-bar w-48" />
        </div>
    );
};

export default SkeletonLoader;
