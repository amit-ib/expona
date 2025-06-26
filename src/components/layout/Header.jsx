import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ProfilePopup from './ProfilePopup';

const Header = ({ setProjectsVisibility, hideSignInButton }) => {
  const { isAuthenticated, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();

  const [isProfilePopupOpen, setIsProfilePopupOpen] = React.useState(false);

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
            <Link
              to="/signin"
              className="text-sm px-4 mr-4 py-2 text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          ) : isLoggedIn ? (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm relative">
              <button onClick={toggleProfilePopup}>AK</button>
              <ProfilePopup isOpen={isProfilePopupOpen} onClose={toggleProfilePopup} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
