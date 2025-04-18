import React, { useState } from "react";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import plane from "../assets/images/plane1.jpg";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectTo = location.state?.redirectTo || null;
  const flightData = location.state?.flightData || null;

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: false, password: false };

    if (!email.trim()) {
      newErrors.email = true;
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (email === "user@example.com" && password === "password123") {
      localStorage.setItem("authToken", "demo-token-12345");
      
      if (redirectTo === "bookings") {
        navigate("/profile", { state: { section: 'orders' } });
      } else if (redirectTo === "flightFare" && flightData) {
        navigate("/flightFare", { state: flightData });
      } else {
        navigate("/");
      }
    } else {
      setErrorMessage("Invalid email or password. Try with user@example.com and password123");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen p-6 relative">
      <div className="absolute inset-0 z-0">
        <img 
          src={plane} 
          alt="Background" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
      </div>

      <div className="flex flex-col w-full max-w-3xl md:flex-row bg-white rounded-lg p-4 shadow-lg relative z-10">
        <div className="md:w-1/2 flex flex-col w-full justify-center items-center relative">
          <button
            className="absolute top-0 left-0 m-4 p-2 text-[#455A64] hover:text-[#1B3A4B] hover:scale-110 active:scale-95 transition-all duration-200"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <NavLink to="/" className="flex flex-col items-center justify-center space-y-4 py-6">
          <div>
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-black text-3xl font-bold"
              />
              <span className="text-black text-3xl font-bold tracking-wide">
                AIR
              </span>
            </div>
            <div className="text-center mt-2">
              <p className="text-[#455A64] text-sm max-w-xs">Log in to access your account and manage your flight bookings</p>
            </div>
          </NavLink>
        </div>
        <div className="md:w-1/2 w:full flex flex-col items-center py-6 md:py-12 px-10 space-y-4 rounded-lg sm:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:space-x-4 w-full invisible h-0 md:h-auto">
            <div className="md:w-1/2 w-full">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm pointer-events-none"
                  tabIndex={-1}
                />
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative">
                <input
                  type="text"
                  className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm pointer-events-none"
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="w-full text-center bg-red-100 text-red-600 p-2 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="w-full">
            <label form="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                className={`w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-[#455A64]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full">
            <label form="password" className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                className={`w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-[#455A64]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full invisible h-0 md:h-auto">
            <div className="relative">
              <input
                type="password"
                className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm pointer-events-none"
                tabIndex={-1}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="bg-[#1B3A4B] text-white font-medium text-sm
            border-2 rounded-full mt-5 w-40 h-10 cursor-pointer
            transition-all duration-200 hover:bg-[#0D1B2A]"
          >
            SUBMIT
          </button>

          <p className="text-center text-sm text-[#455A64]">
            Don't you have an account?
            <Link to="/signUp" className="underline px-4 text-[#1B3A4B]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
