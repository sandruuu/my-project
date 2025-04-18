import React, { useState } from "react";
import { FlightOrder } from "../assets/orders";

interface OrdersSectionProps {
  orders: FlightOrder[];
  selectedStatus: FlightOrder["status"] | "all";
  setSelectedStatus: (status: FlightOrder["status"] | "all") => void;
  getStatusCount: (status: FlightOrder["status"]) => number;
  getStatusColor: (status: FlightOrder["status"]) => string;
  formatDate: (date: string) => string;
  formatTime: (time: string) => string;
  formatPrice: (price: number) => string;
  openReviewModal: (
    flightNumber: string,
    departure: string,
    arrival: string
  ) => void;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  selectedStatus,
  setSelectedStatus,
  getStatusCount,
  getStatusColor,
  formatDate,
  formatTime,
  formatPrice,
  openReviewModal,
}) => {
  const filteredOrders = orders.filter((order) =>
    selectedStatus === "all" ? true : order.status === selectedStatus
  );

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: {
      details: boolean;
      segments: boolean;
      passengers: boolean;
    };
  }>({});

  const toggleSection = (
    orderId: string,
    ticketIndex: number,
    section: "details" | "segments" | "passengers"
  ) => {
    const orderKey = `${orderId}-${ticketIndex}`;
    setExpandedSections((prev) => ({
      ...prev,
      [orderKey]: {
        ...prev[orderKey],
        [section]: !prev[orderKey]?.[section],
      },
    }));
  };

  const isSectionExpanded = (
    orderId: string,
    ticketIndex: number,
    section: "details" | "segments" | "passengers"
  ) => {
    const orderKey = `${orderId}-${ticketIndex}`;
    return expandedSections[orderKey]?.[section] !== false;
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-start md:justify-between overflow-x-auto mb-8 bg-white p-3 sm:p-4 rounded-lg">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            selectedStatus === "all"
              ? "bg-[#1B3A4B] text-white shadow-md"
              : "bg-[#ECEFF1] text-[#1B3A4B] hover:bg-[#B0BEC5]"
          }`}
        >
          <span>All Orders</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
            {orders.length}
          </span>
        </button>
        <button
          onClick={() => setSelectedStatus("upcoming")}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            selectedStatus === "upcoming"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          <span>Upcoming</span>
          <span
            className={`${
              selectedStatus === "upcoming" ? "bg-white/20" : "bg-blue-100"
            } px-2 py-0.5 rounded-full text-sm`}
          >
            {getStatusCount("upcoming")}
          </span>
        </button>
        <button
          onClick={() => setSelectedStatus("completed")}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            selectedStatus === "completed"
              ? "bg-green-600 text-white shadow-md"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          <span>Completed</span>
          <span
            className={`${
              selectedStatus === "completed" ? "bg-white/20" : "bg-green-100"
            } px-2 py-0.5 rounded-full text-sm`}
          >
            {getStatusCount("completed")}
          </span>
        </button>
        <button
          onClick={() => setSelectedStatus("cancelled")}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
            selectedStatus === "cancelled"
              ? "bg-red-600 text-white shadow-md"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          <span>Cancelled</span>
          <span
            className={`${
              selectedStatus === "cancelled" ? "bg-white/20" : "bg-red-100"
            } px-2 py-0.5 rounded-full text-sm`}
          >
            {getStatusCount("cancelled")}
          </span>
        </button>
      </div>

      <div className="space-y-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Order Header */}
              <div className="flex flex-wrap md:flex-nowrap justify-between items-center p-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    <p className="text-sm mt-3 text-gray-500">
                      Order ID:{" "}
                      <span className="font-medium text-gray-700">
                        {order.id}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Ordered on {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-xl font-bold text-[#1B3A4B]">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Tickets */}
              <div className="p-4">
                {order.tickets.map((ticket, index) => {
                  const fareType = ticket.passengers[0].fareType;

                  return (
                    <div key={index} className="mb-6 sm:mb-8 last:mb-0 overflow-hidden">
                      <div className="p-3 sm:p-5 mb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] sm:items-center gap-4 px-2">
                          <div className="flex flex-col items-center justify-center w-full text-center mb-6 sm:mb-0 sm:w-24 md:w-32 mx-auto">
                            <div className="mb-1">
                              <p className="font-bold text-lg text-[#1B3A4B]">
                                {formatTime(ticket.flight.departure.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-[#455A64]">
                                {ticket.flight.departure.city}
                              </p>
                              <p className="text-xs text-[#455A64]">
                                {ticket.flight.departure.airport}
                              </p>
                              <p className="text-xs text-[#455A64]">
                                {formatDate(ticket.flight.departure.date)}
                              </p>
                            </div>
                          </div>

                          <div className="hidden sm:flex relative h-12 flex-1 items-center justify-center">
                            <div className="h-0.5 bg-[#1B3A4B] w-full absolute top-1/2 -translate-y-1/2"></div>

                            <div className="relative z-10 bg-white px-3 py-1 text-center">
                              <p className="text-xs text-[#455A64] leading-snug">
                                <span className="block font-medium">
                                  {ticket.flight.flightNumber}
                                </span>
                                <span className="block">
                                  {ticket.transitFlights &&
                                  ticket.transitFlights.length > 0
                                    ? `${
                                        ticket.transitFlights.length - 1
                                      } Transit`
                                    : "Direct"}
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="sm:hidden flex justify-center items-center w-full mb-6 mx-auto">
                            <div className="bg-white px-4 py-2 text-center border border-[#ECEFF1] rounded-md shadow-sm w-40 mx-auto">
                              <p className="text-xs text-[#455A64] leading-snug">
                                <span className="block font-medium">
                                  {ticket.flight.flightNumber}
                                </span>
                                <span className="block">
                                  {ticket.transitFlights &&
                                  ticket.transitFlights.length > 0
                                    ? `${
                                        ticket.transitFlights.length - 1
                                      } Transit`
                                    : "Direct"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center w-full text-center sm:w-24 md:w-32 mx-auto">
                            <div className="mb-1">
                              <p className="font-bold text-lg text-[#1B3A4B]">
                                {formatTime(ticket.flight.arrival.time)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-[#455A64]">
                                {ticket.flight.arrival.city}
                              </p>
                              <p className="text-xs text-[#455A64]">
                                {ticket.flight.arrival.airport}
                              </p>
                              <p className="text-xs text-[#455A64]">
                                {formatDate(ticket.flight.arrival.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {(!ticket.transitFlights ||
                        ticket.transitFlights.length === 0) && (
                        <div className="bg-white mb-4 overflow-hidden border-t border-[#B0BEC5] pt-4">
                          <div
                            className="flex items-center justify-between p-3 sm:p-4 cursor-pointer transition-colors duration-200"
                            onClick={() =>
                              toggleSection(order.id, index, "details")
                            }
                          >
                            <div className="flex items-center mb-0 justify-between w-full">
                              <div className="flex items-center">
                                <h4 className="font-medium text-[#1B3A4B]">
                                  Flight Details
                                </h4>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-5 w-5 ml-2 text-[#455A64] transition-transform duration-200 ${
                                    isSectionExpanded(
                                      order.id,
                                      index,
                                      "details"
                                    )
                                      ? "transform rotate-180"
                                      : ""
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {isSectionExpanded(order.id, index, "details") && (
                            <div className="p-3 sm:p-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm mb-4">
                                <div>
                                  <p className="text-[#455A64] mb-1">
                                    Duration
                                  </p>
                                  <p className="font-medium text-[#1B3A4B]">
                                    {ticket.flight.duration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[#455A64] mb-1">
                                    Aircraft
                                  </p>
                                  <p className="font-medium text-[#1B3A4B]">
                                    {ticket.flight.aircraft}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[#455A64] mb-1">
                                    Seat Layout
                                  </p>
                                  <p className="font-medium text-[#1B3A4B]">
                                    {ticket.flight.seatLayout || "N/A"}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                <div>
                                  <p className="text-[#455A64] mb-1">Meal</p>
                                  <p className="font-medium text-[#1B3A4B]">
                                    {ticket.flight.meal || "No meal"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Transit Flights */}
                      {ticket.transitFlights &&
                        ticket.transitFlights.length > 0 && (
                          <div className="bg-white mb-4 overflow-hidden border-t border-[#B0BEC5] pt-4">
                            <div
                              className="flex items-center justify-between p-3 sm:p-4 cursor-pointer transition-colors duration-200"
                              onClick={() =>
                                toggleSection(order.id, index, "segments")
                              }
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <h4 className="font-medium text-[#1B3A4B]">
                                    Flight Segments
                                  </h4>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 ml-2 text-[#455A64] transition-transform duration-200 ${
                                      isSectionExpanded(
                                        order.id,
                                        index,
                                        "segments"
                                      )
                                        ? "transform rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {isSectionExpanded(order.id, index, "segments") && (
                              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-x-auto">
                                {ticket.transitFlights.map(
                                  (transit, segmentIndex) => (
                                    <div
                                      key={segmentIndex}
                                      className="bg-white rounded-lg p-3 sm:p-4 border border-[#B0BEC5] shadow-sm"
                                    >
                                      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] sm:items-center gap-4 mb-4 sm:mb-6 px-2">
                                        {/* Oraș plecare */}
                                        <div className="flex flex-col items-center justify-center w-full text-center mb-6 sm:mb-0 sm:w-24 md:w-32 mx-auto">
                                          <div className="mb-1">
                                            <p className="font-bold text-lg text-[#1B3A4B]">
                                              {formatTime(transit.departure.time)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-[#455A64]">
                                              {transit.departure.city}
                                            </p>
                                            <p className="text-xs text-[#455A64]">
                                              {transit.departure.airport}
                                            </p>
                                            <p className="text-xs text-[#455A64]">
                                              {formatDate(transit.departure.date)}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="hidden sm:flex relative h-12 flex-1 items-center justify-center">
                                          <div className="h-0.5 bg-[#1B3A4B] w-full absolute top-1/2 -translate-y-1/2"></div>

                                          <div className="relative z-10 bg-white px-2 py-0.5 text-xs text-[#455A64]">
                                            {transit.flightNumber}
                                          </div>
                                        </div>
                                        
                                        <div className="sm:hidden flex justify-center items-center w-full mb-6 mx-auto">
                                          <div className="bg-white px-4 py-2 text-center border border-[#ECEFF1] rounded-md shadow-sm w-40 mx-auto">
                                            <p className="text-xs text-[#455A64]">
                                              {transit.flightNumber}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center w-full text-center sm:w-24 md:w-32 mx-auto">
                                          <div className="mb-1">
                                            <p className="font-bold text-lg text-[#1B3A4B]">
                                              {formatTime(transit.arrival.time)}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-sm text-[#455A64]">
                                              {transit.arrival.city}
                                            </p>
                                            <p className="text-xs text-[#455A64]">
                                              {transit.arrival.airport}
                                            </p>
                                            <p className="text-xs text-[#455A64]">
                                              {formatDate(
                                                transit.arrival.date ||
                                                  transit.departure.date
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-4">
                                        <div>
                                          <p className="text-[#455A64] mb-1">
                                            Duration
                                          </p>
                                          <p className="font-medium text-[#1B3A4B]">
                                            {transit.duration || "N/A"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-[#455A64] mb-1">
                                            Aircraft
                                          </p>
                                          <p className="font-medium text-[#1B3A4B]">
                                            {transit.aircraft}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-[#455A64] mb-1">
                                            Meal
                                          </p>
                                          <p className="font-medium text-[#1B3A4B]">
                                            {transit.meal || "No meal"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-[#455A64] mb-1">
                                            Seat Layout
                                          </p>
                                          <p className="font-medium text-[#1B3A4B]">
                                            {transit.seatLayout || "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )}

                      {/* Passengers List */}
                      <div className="bg-white overflow-hidden mt-4 border-t border-[#B0BEC5] pt-3 sm:pt-4">
                        <div
                          className="px-3 sm:px-4 py-2 sm:py-3 cursor-pointer transition-colors duration-200"
                          onClick={() =>
                            toggleSection(order.id, index, "passengers")
                          }
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
                            <div className="flex items-center">
                              <h4 className="font-medium text-[#1B3A4B]">
                                Passengers
                              </h4>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ml-2 text-[#455A64] transition-transform duration-200 ${
                                  isSectionExpanded(
                                    order.id,
                                    index,
                                    "passengers"
                                  )
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                            <div className="text-sm text-[#455A64]">
                              <span className="whitespace-nowrap">Ticket Type: </span>
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-sm ${
                                  fareType === "AIR PLUS"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : fareType === "AIR ECO"
                                    ? "bg-teal-100 text-teal-800"
                                    : fareType === "AIR BASE"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {fareType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isSectionExpanded(order.id, index, "passengers") && (
                          <div className="overflow-x-auto">
                            {ticket.passengers.map((passenger) => (
                              <div
                                key={passenger.id}
                                className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0"
                              >
                                <div>
                                  <p className="font-medium text-[#1B3A4B]">
                                    {passenger.passengerName}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="inline-block bg-[#ECEFF1] px-2 py-0.5 rounded text-sm text-[#455A64]">
                                      Seat {passenger.seatNumber}
                                    </span>
                                    <span className="inline-block bg-[#ECEFF1] px-2 py-0.5 rounded text-sm text-[#455A64] capitalize">
                                      {passenger.ticketType}
                                    </span>
                                  </div>
                                </div>
                                <p className="font-bold text-base sm:text-lg text-[#1B3A4B] mt-1 sm:mt-0">
                                  {formatPrice(passenger.price)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {order.status === "completed" && (
                        <div className="mt-3 sm:mt-4 flex justify-end px-3 sm:px-4 pb-3 sm:pb-4">
                          <button
                            onClick={() =>
                              openReviewModal(
                                ticket.flight.flightNumber,
                                ticket.flight.departure.city,
                                ticket.flight.arrival.city
                              )
                            }
                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#1B3A4B] text-[#1B3A4B] rounded-lg hover:bg-[#1B3A4B] hover:text-white transition-colors shadow-sm"
                          >
                            <span>Leave Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg border border-gray-200 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-300 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              No {selectedStatus !== "all" ? selectedStatus : ""} orders found.
            </p>
            <p className="text-gray-400 mt-1">
              Your booked flights will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersSection;
