import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import plane from "../assets/images/plane1.jpg";
import NavigationBarComponent from "../components/NavigationBarComponent";
function Contacts() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBarComponent />
      <div className="flex justify-center items-center w-full min-h-screen p-6 relative">
        <div className="absolute inset-0 z-0">
          <img
            src={plane}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
        </div>

        <div className="flex flex-col w-full max-w-3xl bg-white rounded-lg p-6 shadow-lg relative z-10 my-20">
          <div className="flex flex-col w-full justify-center items-center relative">
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
              <div className="text-center mt-2 mb-6">
                <h1 className="text-[#1B3A4B] text-2xl font-bold mb-2">
                  Contact Us
                </h1>
                <p className="text-[#455A64] text-sm max-w-lg">
                  We're here to help with any questions about your flight
                  bookings or travel plans.
                </p>
              </div>
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-4">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#ECEFF1] p-3 rounded-full mr-4">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-[#1B3A4B] text-lg"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B3A4B] mb-1">
                    Our Office
                  </h3>
                  <p className="text-[#455A64] text-sm">
                    123 Aviation Avenue, Bucharest
                  </p>
                  <p className="text-[#455A64] text-sm">Romania, 010101</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#ECEFF1] p-3 rounded-full mr-4">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-[#1B3A4B] text-lg"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B3A4B] mb-1">Phone</h3>
                  <p className="text-[#455A64] text-sm">+40 700 123 456</p>
                  <p className="text-[#455A64] text-sm">+40 800 987 654</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#ECEFF1] p-3 rounded-full mr-4">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-[#1B3A4B] text-lg"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B3A4B] mb-1">Email</h3>
                  <p className="text-[#455A64] text-sm">
                    support@airtravel.com
                  </p>
                  <p className="text-[#455A64] text-sm">
                    bookings@airtravel.com
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#455A64]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border-[#B0BEC5] p-3 text-sm shadow-sm focus:border-[#1B3A4B] focus:ring-[#1B3A4B]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#455A64]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border-[#B0BEC5] p-3 text-sm shadow-sm focus:border-[#1B3A4B] focus:ring-[#1B3A4B]"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#455A64]"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full rounded-lg border-[#B0BEC5] p-3 text-sm shadow-sm focus:border-[#1B3A4B] focus:ring-[#1B3A4B]"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button
                className="bg-[#1B3A4B] text-white font-medium text-sm
              border-2 rounded-full mt-3 w-40 h-10 cursor-pointer
              transition-all duration-200 hover:bg-[#0D1B2A]"
              >
                SEND MESSAGE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
