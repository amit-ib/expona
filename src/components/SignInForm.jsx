import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from "react-router-dom";
// import { apiGet } from '../api/api';
// import { fetchAuthStart } from "../api/api";
// import { API_ENDPOINTS } from '../api/apiConfig';
// import { fetchAuthStart } from '../api/apiHelper';
import { useAuth } from "../contexts/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const SignInForm = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  // const [authStartResult, setAuthStartResult] = useState(null);
  // Handler for Google sign-in button
  // const handleGoogleSignIn = async () => {
  //   try {
  //     const response = await fetchAuthStart();
  //     console.log('Google Sign-In API response:', response);
  //     if (response?.data?.redirect_url) {
  //       window.location.href = response.data.redirect_url;
  //     }
  //   } catch (error) {
  //     console.error('Google Sign-In API error:', error);
  //   }
  // };

  const handleGoogleSuccess = async (credentialResponse) => {
    await login(credentialResponse.credential, {});
    // After login, check new_user from userDetail in localStorage
    const userDetailStr = localStorage.getItem("userDetail");
    let newUser = true;
    if (userDetailStr) {
      try {
        const userDetail = JSON.parse(userDetailStr);
        newUser = userDetail.new_user !== false ? true : false;
      } catch (e) {
        newUser = true;
      }
    }
    if (newUser) {
      navigate("/company-detail");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };
  // if (user !== null) {
  //   return <Navigate to="/dashboard" />;
  // }
  // useEffect(() => {
  //   if (!user) {
  //     const storedUserDetail = localStorage.getItem("userDetail");
  //     console.log("Restoring userDetail from localStorage:", storedUserDetail);
  //     if (storedUserDetail) {
  //       setUser(JSON.parse(storedUserDetail));
  //     }
  //   }
  // }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="p-[1px] mb-16 rounded-xl bg-gradient-to-br from-[#FF3C3C]  to-[#3C00FF]  w-[528px]

">
        <div className="sign-in-form relative rounded-xl bg-[#23242B] p-14 w-full mx-auto">
          {/* Content from Figma design for the sign-in form will go here */}
          <h2 className="sr-only">Sign In Form</h2>
          {/* Welcome and Sign in to Tender AI text */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl  mb-1">Welcome</h1>
            <p className="text-gray-ec text-sm">Sign in to Tender AI and start growing businesss</p>
          </div>

          {/* Sign in with Google Button */}
          <div className="mb-6 relative">
            <button className="bg-gray-32  text-white py-4 px-6 rounded w-full flex items-center justify-center space-x-2 mb-6  transition-colors">
              <img
                src="/images/google-icon.svg"
                alt="Google Icon"
                className="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </button>
            <div className="absolute w-full top-2 opacity-0">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                theme="filled_black"
                shape="rectangular"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="text-gray-400 text-xs">or sign in with email</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <form>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                className=" border bg-transparent border-gray-42 text-gray-ae text-base rounded-lg block w-full p-4 outline-none transition-colors placeholder-gray-500"
                placeholder="example@tenderai.com"
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                id="password"
                className=" border bg-transparent  border-gray-42  text-gray-ae text-base rounded-lg block w-full p-4 outline-none transition-colors placeholder-gray-500"
                placeholder="••••••••••••"
              />
            </div>

            {/* Sign In Button */}
            <button className="bg-expona-red text-white py-3 px-6 rounded w-full font-semibold shadow-md hover:opacity-90 transition-opacity" onClick={() => navigate('/company-detail')}>
              Sign in
            </button>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignInForm;