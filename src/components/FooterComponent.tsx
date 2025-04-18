import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import './FooterComponent.css'

const FooterComponent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden mt-auto">
      <div className="mx-auto max-w-screen-xl px-4 pb-8 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full news flex flex-col items-center">
          <strong className="block text-center text-xl pt-10 md:pt-16 font-bold text-[#1B3A4B] sm:text-3xl">
            Want us to email you with the <br className="hidden sm:block" /> latest news?
          </strong>

          <form className="mt-4 md:mt-6 pb-10 md:pb-16 w-full max-w-md mx-auto">
            <div className="relative">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-full border-[#B0BEC5] bg-white p-3 md:p-4 pe-24 md:pe-32 text-sm font-medium text-[#455A64] focus:outline-none focus:ring-2 focus:ring-[#1B3A4B] focus:border-transparent shadow-sm"
                id="email"
                type="email"
                placeholder="john@doe.com"
              />
              <button className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-[#1B3A4B] px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium text-white transition hover:bg-[#0D1B2A]">
                Subscribe
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-4 md:mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-32">
          <div className="mx-auto max-w-sm lg:max-w-none">
            <div className="flex justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/admin')}
                className="bg-transparent border-2 border-[#1B3A4B] hover:bg-[#1B3A4B] hover:text-white transition-colors duration-300 px-4 py-2 rounded-md text-sm md:text-base"
              >
                ADMIN
              </button>
            </div>
            <p className="mt-4 text-center text-sm md:text-base text-[#455A64] lg:text-left lg:text-lg">
              AIR - Where your journey begins with comfort and confidence.
              Flying safely, soaring beyond expectations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-3 lg:text-left">
            <div>
              <strong className="font-medium text-[#1B3A4B]"> Services </strong>

              <ul className="mt-4 md:mt-6 space-y-1">
                <li>
                  <Link to="/flightSchedule"
                    className="text-[#455A64] text-sm md:text-base transition hover:text-[#1B3A4B]"
                  >
                    Schedule
                  </Link>
                </li>
                <li>
                  <Link to="/profile"
                    className="text-[#455A64] text-sm md:text-base transition hover:text-[#1B3A4B]"
                  >
                    Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/contacts"
                    className="text-[#455A64] text-sm md:text-base transition hover:text-[#1B3A4B]"
                  >
                    Contacts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <strong className="font-medium text-[#1B3A4B]"> About </strong>

              <ul className="mt-4 md:mt-6 space-y-1">
                <li>
                  <Link
                    className="text-[#455A64] text-sm md:text-base transition hover:text-[#1B3A4B]"
                    to="/reviews"
                  >
                    Reviews
                  </Link>
                </li>

                <li>
                  <Link
                    className="text-[#455A64] text-sm md:text-base transition hover:text-[#1B3A4B]"
                    to="/faq"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 border-t border-[#B0BEC5] pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <span className="text-xs text-[#455A64]">
              © AIR Airlines 2024. All rights reserved.
            </span>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center md:justify-start space-x-4 md:space-x-6">
                <li>
                  <a href="#" className="text-xs text-[#455A64] hover:text-[#1B3A4B]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#455A64] hover:text-[#1B3A4B]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#455A64] hover:text-[#1B3A4B]">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;