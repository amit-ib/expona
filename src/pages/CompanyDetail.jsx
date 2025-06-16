import React from 'react';
import Header from '../components/layout/Header';
import CompanyDetailForm from '../components/CompanyDetailForm';

const ComapanyDetail = () => {

  return (
    <div className="min-h-screen bg-[#212224] flex flex-col">
      <Header hideSignInButton={true} />
      <div className="flex flex-col items-center justify-center flex-1 w-full px-10">

        <CompanyDetailForm />
      </div>
    </div>
  );
};

export default ComapanyDetail;