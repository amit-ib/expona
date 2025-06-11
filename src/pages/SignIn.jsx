import React from 'react';
import Header from '../components/layout/Header';
import SignInForm from '../components/common/SignInForm';
import { Link } from 'react-router-dom';

const SignIn = () => {

  return (
    <div className="min-h-screen bg-[#212224] flex flex-col">
      <Header hideSignInButton={true} />
      <div className="flex flex-col items-center w-full px-10">
        <Link
          to="/"
          className="flex items-center text-white text-sm font-light pl-2 pr-4 py-2 mb-8 rounded-md bg-gray-2d hover:bg-gray-42 transition-colors"
          style={{ alignSelf: 'flex-start' }}
        >
          <img src="/images/back-arrow.svg" alt="Back" className="w-4  mr-2" />
          <span >Back</span>
        </Link>
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;