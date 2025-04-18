import { useNavigate, Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import plane from "../assets/images/plane1.jpg";

function SignUp() {
  const navigate = useNavigate();
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
          <NavLink
            to="/"
            className="flex flex-col items-center justify-center space-y-4 py-6"
          >
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
              <p className="text-[#455A64] text-sm max-w-xs">
                Create your account and start planning your journey with us
              </p>
            </div>
          </NavLink>
        </div>
        <div className="md:w-1/2 w:full flex flex-col items-center py-6 md:py-12 px-10 space-y-4 rounded-lg sm:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:space-x-4 w-full">
            <div className="md:w-1/2 w-full">
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  type="text"
                  className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div className="md:w-1/2 w-full">
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label form="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
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
                className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="w-full">
            <label form="confirmPassword" className="sr-only">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type="pconfirmPassword"
                className="w-full rounded-lg border-[#B0BEC5] p-4 pe-12 text-sm shadow-sm"
                placeholder="Confirm password"
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <button
            className="bg-[#1B3A4B] text-white font-medium text-sm
            border-2 rounded-full mt-5 w-40 h-10 cursor-pointer
            transition-all duration-200 hover:bg-[#0D1B2A]"
          >
            SUBMIT
          </button>

          <p className="text-center text-sm text-[#455A64]">
            Do you have an account?
            <Link to="/login" className="underline px-4 text-[#1B3A4B]">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;