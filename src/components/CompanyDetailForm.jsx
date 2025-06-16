import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyDetailForm = () => {
  const navigate = useNavigate();

  return (
    <div className="p-[1px] mb-16 rounded-xl bg-gradient-to-br from-[#FF3C3C]  to-[#3C00FF]  w-[528px]

">
      <div className="sign-in-form relative rounded-xl bg-[#23242B] p-10 pb-9 w-full mx-auto">
        {/* Content from Figma design for the sign-in form will go here */}
        <h2 className="sr-only">Sign In Form</h2>


        {/* Form Header */}
        <div className="flex flex-col   mb-6 ">
          <h2 className='text-white text-2xl'>Enter Your Company Detais</h2>
          <div className='text-gray-ae mt-3 text-sm'>We'll use your company name and website to auto-fetch public records like your business type and incorporation date.</div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="company-name" className="block text-white text-sm font-medium mb-2">Company Name </label>
          <input
            type="text"
            id="company-name"
            className=" border bg-transparent border-gray-42 text-gray-ae text-base rounded-lg block w-full p-4 outline-none transition-colors placeholder-gray-500"
            placeholder="Ex: ABC COMPANY"
          />
        </div>

        {/* Password Input */}
        <div className="mb-7">
          <label htmlFor="web-url" className="block text-white text-sm font-medium mb-2">Website URL</label>
          <input
            type="text"
            id="web-url"
            className=" border bg-transparent  border-gray-42  text-gray-ae text-base rounded-lg block w-full p-4 outline-none transition-colors placeholder-gray-500"
            placeholder="Ex: India"
          />
        </div>

        {/* Sign In Button */}
        <div className='text-center'>
          <button
            className="bg-expona-red text-white py-3 px-6 rounded w-full font-semibold shadow-md hover:opacity-90 transition-opacity"
            onClick={() => navigate('/chat')}
          >
            Get started
          </button>
          <button className='text-white mt-4' onClick={() => navigate('/chat')}>I'll this later</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailForm;