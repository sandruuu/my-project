import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import plane from "../assets/images/plane2.jpg";
import SelectComponent from "../components/SelectComponent";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
import { ticketSalesData, ticketSalesOptions, flightsScheduleData, flightsScheduleOptions } from "../assets/admin";
const Admin: React.FC = () => {
  const [ticketPeriod, setTicketPeriod] = useState("this_week");
  const [flightPeriod, setFlightPeriod] = useState("last_8_months");

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto pb-12 max-w-[1400px]">
        <div>
        <div
          className="w-full bg-cover bg-center mb-10 py-12"
          style={{
            backgroundImage: `url(${plane})`,
            position: "relative",
          }}
        >
          <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
          <div className="flex justify-between items-center px-8 relative z-10">
            <h1 className="text-2xl font-bold text-white">
              Dashboard
            </h1>
          </div>
        </div>

          {/* Stats Cards */}
          <div className="grid mx-4 sm:mx-6 md:mx-8 lg:mx-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Total Flights</p>
                <p className="text-2xl font-bold text-[#1B3A4B] mt-2">1,284</p>
                <div className="flex items-center mt-2 text-[#457B9D]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium ml-1">12.5%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#1B3A4B] mt-2">$52,389</p>
                <div className="flex items-center mt-2 text-[#457B9D]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium ml-1">23.8%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-[#1B3A4B] mt-2">3,427</p>
                <div className="flex items-center mt-2 text-[#457B9D]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium ml-1">8.3%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-[#1B3A4B] mt-2">892</p>
                <div className="flex items-center mt-2 text-[#457B9D]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium ml-1">15.6%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-10">
            {/* Ticket Sales Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A4B]">Ticket Sales</h2>
                  <p className="text-xl md:text-2xl font-bold text-[#1B3A4B] mt-2">
                    12,500 <span className="text-xs md:text-sm text-gray-600 font-normal">Tickets Sold</span>
                  </p>
                </div>
                <div>
                <SelectComponent
                  options={[
                    { value: "this_week", label: "This Week" },
                    { value: "last_week", label: "Last Week" }
                  ]}
                  value={ticketPeriod}
                  onChange={setTicketPeriod}
                  className="w-28 sm:w-32"
                />
                </div>
              </div>
              <div className="h-64 md:h-80">
                <Bar data={ticketSalesData} options={ticketSalesOptions} />
              </div>
            </div>

            {/* Flights Schedule Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1B3A4B]">Flights Schedule</h2>
                  <div className="flex flex-wrap items-center mt-2 gap-2">
                    <span className="bg-[#0D1B2A] text-white px-3 py-1 rounded-lg text-xs md:text-sm">
                      May 2024
                    </span>
                    <p className="text-xl md:text-2xl font-bold text-[#1B3A4B] md:ml-3">
                      170 <span className="text-xs md:text-sm text-gray-600 font-normal">Flights</span>
                    </p>
                  </div>
                </div>
                <div>
                <SelectComponent
                  options={[
                    { value: "last_8_months", label: "Last 8 Months" },
                    { value: "last_6_months", label: "Last 6 Months" }
                  ]}
                  value={flightPeriod}
                  onChange={setFlightPeriod}
                  className="w-36 sm:w-40"
                />
                </div>
              </div>
              <div className="h-64 md:h-80">
                <Line data={flightsScheduleData} options={flightsScheduleOptions} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;