import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeCompanyDetail } from '../api/apiHelper';
import { AUTH_TOKEN } from "../api/authToken";
const CompanyDetailForm = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetStarted = async () => {
    if (!companyName.trim() || !websiteUrl.trim()) {
      setError('Both fields are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Using a hardcoded token, consistent with other tender-related API calls
      const token = { AUTH_TOKEN };
      await storeCompanyDetail({ name: companyName, url: websiteUrl }, token);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while saving details.');
      console.error("Failed to store company details:", err);
    } finally {
      setLoading(false);
    }
  };

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

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="company-name" className="block text-white text-sm font-medium mb-2">Company Name </label>
          <input
            type="text"
            id="company-name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className=" border bg-transparent border-gray-42 text-gray-ae text-base rounded-lg block w-full p-4 outline-none transition-colors placeholder-gray-500"
            placeholder="Ex: ABC COMPANY"
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="mb-7">
          <label htmlFor="web-url" className="block text-white text-sm font-medium mb-2">Website URL</label>
          <input
            type="text"
            id="web-url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className=" border bg-transparent  border-gray-42  text-gray-ae text-base rounded-lg block w-full p-4 outline-none transition-colors placeholder-gray-500"
            placeholder="Ex: https://www.abccompany.com"
            disabled={loading}
          />
        </div>

        {/* Sign In Button */}
        <div className='text-center'>
          <button
            className="bg-expona-red text-white py-3 px-6 rounded w-full font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            onClick={handleGetStarted}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Get started'}
          </button>
          <button className='text-white mt-4' onClick={() => navigate('/chat')} disabled={loading}>
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailForm;