import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "./expona-animate.json"; // Adjust the path as needed

const Hero = ({ setProjectsVisibility }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-20 flex  items-center justify-between min-h-[calc(100vh-88px)]">
      <div className="max-w-screen-sm flex flex-col items-left gap-10">
        <h1 className="text-4xl !leading-[120%] md:text-5xl lg:text-[56px] text-white font-normal ">
          Tenders don't have <br />to be confusing.
        </h1>
        <p className="text-lg md:text-xl text-white font-light max-w-[737px] !leading-[160%]">
          Ask questions, find key info, and decide faster<br /> with the help of AI.
        </p>
        <div>
          <button
            onClick={() => {
              setProjectsVisibility(false);
              navigate("/dashboard");
            }}
            className=" px-5 py-3.5 bg-expona-red text-white rounded-md hover:bg-opacity-90 transition-colors font-semibold"
          >
            Try Expona Now
          </button>
        </div>
      </div>
      {/* <div><img src="/images/home-animate.png" alt="Hero" /></div> */}
      {/* <div className="animate-bg"><Lottie animationData={animationData} loop={true} style={{ height: 305 }} /></div> */}
      <div className="animate-bg relative"><Lottie animationData={animationData} loop={true} style={{ height: 520 }} />
        {/* <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,_rgba(44,44,52,0)_40%,_rgba(37,37,40,0.9)_95%)]" /> */}
        {/* <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,_#2c2c34_-20%,_transparent_90%,_#252528_100%)]" /> */}
        {/* <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,_#2c2c34_0%,_transparent_35%,_transparent_60%,_#252527_100%)]" /> */}
      </div>


    </div>
  );
};

export default Hero;
