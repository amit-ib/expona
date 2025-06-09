import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from '../common/Modal';
import UploadAction from '../dashboard/UploadAction';
import ProfilePopup from './ProfilePopup';

const Header = ({ setProjectsVisibility, hideSignInButton }) => {
  const { isAuthenticated, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleProfilePopup = () => setIsProfilePopupOpen(!isProfilePopupOpen);

  return (
    <header className="w-full py-5">
      <div className="px-10 mx-auto  flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/images/expona-logo.svg"
            alt="Expona"

            className="cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex items-center" id="header-buttons">
          {!isAuthenticated && !hideSignInButton ? (
            <button
              className="text-sm px-4 mr-4 py-2 text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
            >
              Sign In
            </button>
          ) : isLoggedIn ? (
            <>
              {location.pathname !== "/dashboard" && (
                <button className="text-sm px-3 mr-4 py-2 text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1"
                  onClick={() => {
                    openModal();
                  }}
                >
                  <img src="/images/add2-icon.svg" alt="New Tender" /> New Tender
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm relative">
                <button onClick={toggleProfilePopup}>AK</button>
                <ProfilePopup isOpen={isProfilePopupOpen} onClose={toggleProfilePopup} />
              </div>
            </>
          ) : null}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="large">
        <UploadAction projectsVisibility={false} fullHeight={true} onFileSelect={closeModal} />
      </Modal>
    </header>
  );
};

export default Header;
