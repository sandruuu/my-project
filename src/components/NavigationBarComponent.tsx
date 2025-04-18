import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faBars,
  faTimes,
  faChevronDown,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const aboutButtonRef = useRef<HTMLButtonElement>(null);
  const mobileAboutDropdownRef = useRef<HTMLDivElement>(null);
  const mobileAboutButtonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const mobileProfileButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsConnected(false);
    navigate("/");
  };

  const handleBookingsClick = () => {
    if (isConnected) {
      navigate("/profile", { state: { section: 'orders' } });
    } else {
      navigate("/logIn", { state: { redirectTo: "bookings" } });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAboutOpen && 
          aboutDropdownRef.current && 
          aboutButtonRef.current && 
          !aboutDropdownRef.current.contains(event.target as Node) &&
          !aboutButtonRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
      
      if (isAboutOpen && 
          mobileAboutDropdownRef.current && 
          mobileAboutButtonRef.current && 
          !mobileAboutDropdownRef.current.contains(event.target as Node) &&
          !mobileAboutButtonRef.current.contains(event.target as Node)) {
        setIsAboutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAboutOpen]);

  useEffect(() => {
    const handleProfileClickOutside = (event: MouseEvent) => {
      if (isProfileOpen && 
          profileDropdownRef.current && 
          profileButtonRef.current && 
          !profileDropdownRef.current.contains(event.target as Node) &&
          !profileButtonRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      
      if (isProfileOpen && 
          profileDropdownRef.current && 
          mobileProfileButtonRef.current && 
          !profileDropdownRef.current.contains(event.target as Node) &&
          !mobileProfileButtonRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleProfileClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleProfileClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav className="bg-transparent p-6 mx-0 md:mx-10 z-10">
      <div className="flex justify-between items-center">
        <NavLink to="/" className="hidden md:flex items-center space-x-2">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="text-black text-xl font-bold"
          />
          <span className="text-black text-xl font-bold">AIR</span>
        </NavLink>

        <div className="md:hidden flex items-center justify-between w-full">
          {isConnected && (
            <button
              ref={mobileProfileButtonRef}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity"
            >
              <FontAwesomeIcon icon={faUser} className="w-full h-full" />
            </button>
          )}

          <NavLink to="/" className="flex items-center space-x-2">
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="text-black text-xl font-bold"
            />
            <span className="text-black text-xl font-bold">AIR</span>
          </NavLink>

          <button
            className="text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        <ul className="hidden md:flex space-x-6 text-gray-700">
          <li className="relative">
            <button
              ref={aboutButtonRef}
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="hover:text-gray-500 transition flex items-center"
            >
              About
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`ml-2 text-xs transition-transform ${
                  isAboutOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isAboutOpen && (
              <div 
                ref={aboutDropdownRef} 
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <Link
                  to="/customerReviews"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsAboutOpen(false)}
                >
                  Reviews
                </Link>
                <Link
                  to="/faq"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsAboutOpen(false)}
                >
                  FAQ
                </Link>
              </div>
            )}
          </li>
          <li>
            <button
              onClick={() => navigate("/flightSchedule")}
              className="hover:text-gray-500 transition"
            >
              Schedule
            </button>
          </li>
          <li>
            <button
              onClick={handleBookingsClick}
              className="hover:text-gray-500 transition"
            >
              Bookings
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/contacts")}
              className="hover:text-gray-500 transition"
            >
              Contact
            </button>
          </li>
        </ul>

        <div className="hidden md:flex space-x-2">
          {!isConnected ? (
            <>
              <button
                className="font-bold px-3 py-1 rounded text-sm w-20 h-10"
                onClick={() => navigate("/logIn")}
              >
                Log in
              </button>
              <button
                className="border-2 border-black px-3 py-1 rounded text-sm w-20 h-10"
                onClick={() => navigate("/signUp")}
              >
                Sign up
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity"
              >
                <FontAwesomeIcon icon={faUser} className="w-full h-full" />
              </button>

              {isProfileOpen && (
                <div 
                  ref={profileDropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white/30 backdrop-blur-md rounded-3xl shadow-lg py-4 z-50 border border-white/20"
                >
                  <button
                    onClick={() => {
                      const userRole = localStorage.getItem("userRole");
                      navigate(userRole === "admin" ? "/admin/adminProfile" : "/profile");
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-6 py-2 text-left text-white flex items-center text-sm transition-transform hover:scale-105 duration-200"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-6 py-2 text-left text-white flex items-center text-sm transition-transform hover:scale-105 duration-200"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 bg-white/30 backdrop-blur-md rounded-3xl p-4 border border-white/20">
          <ul className="space-y-3">
            <li className="relative">
              <button
                ref={mobileAboutButtonRef}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="hover:text-gray-500 transition flex items-center text-gray-700 hover:bg-gray-100 w-full justify-between"
              >
                About
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-2 text-xs transition-transform ${
                    isAboutOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isAboutOpen && (
                <div
                  ref={mobileAboutDropdownRef}
                  className="mt-2 space-y-2"
                >
                  <Link
                    to="/customerReviews"
                    className="block text-gray-700 hover:bg-gray-100 pl-4"
                    onClick={() => {setIsAboutOpen(false); setIsOpen(false);}}
                  >
                    Reviews
                  </Link>
                  <Link
                    to="/faq"
                    className="block text-gray-700 hover:bg-gray-100 pl-4"
                    onClick={() => {setIsAboutOpen(false); setIsOpen(false);}}
                  >
                    FAQ
                  </Link>
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/flightSchedule");
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleBookingsClick();
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  navigate("/contacts");
                  setIsOpen(false);
                }}
                className="text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Contact
              </button>
            </li>
            {!isConnected && (
              <>
                <li className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      navigate("/logIn");
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Log in
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/signUp");
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Sign up
                  </button>
                </li>
              </>
            )}
            {isConnected && (
              <>
                <li className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
