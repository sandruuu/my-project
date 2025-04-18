import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import FlightDetailsModal from "./FlightDetailsModalComponent";
import type { Flight } from "../assets/flights"
import { useLocation } from "react-router-dom";

type PassengersType = {
  adults: number;
  children: number;
  infants: number;
};

type FlightCardProps = {
  flight: Flight;
  passengersData?: PassengersType;
};

const FlightCardComponent: React.FC<FlightCardProps> = ({ flight, passengersData }) => {
  const location = useLocation();
  const locationState = location.state || {};
  const passengers = passengersData || locationState.passengers || {
    adults: 1,
    children: 0,
    infants: 0
  };
  
  const shouldShowDate = () => {
    if (!flight.startDate || flight.startDate === '') return false;
    
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(flight.startDate)) return false;
    
    return true;
  };
  
  const formatDepartureDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    const dateParts = dateStr.split('-');
    if (dateParts.length !== 3) return dateStr;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; 
    const day = parseInt(dateParts[2]);
    
    const date = new Date(Date.UTC(year, month, day));
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC' 
    });
  };
  
  return (
    <div className="p-5 border border-gray-100 rounded-lg shadow-md bg-white w-full mx-auto hover:shadow-lg transition-shadow duration-300">
      {shouldShowDate() && (
        <div className="mb-3">
          <p className="text-[#455A64]">{formatDepartureDate(flight.startDate)}</p>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row w-full py-5 items-center space-y-5 md:space-y-0 md:space-x-5">
            {/* Departure */}
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-bold text-[#1B3A4B]">
                {flight.departureTime}
              </p>
              <p className="text-xs text-[#455A64]">{flight.departureCity}</p>
              <p className="text-xs text-[#B0BEC5]">({flight.departureCode})</p>
            </div>

            {/* Flight Path */}
            <div className="flex flex-col items-center w-full md:w-auto">
              <div className="flex items-center space-x-2">
                <div className="relative flex items-center w-24 sm:w-36 md:w-60">
                  <div className="w-full border-t-2 border-dashed border-[#B0BEC5]"></div>
                  <FontAwesomeIcon
                    icon={faPlane}
                    className="absolute left-1/2 -translate-x-1/2 text-[#1B3A4B] text-sm sm:text-base"
                  />
                </div>
              </div>
              <p className="text-xs text-[#455A64] mt-1 text-center">
                {flight.duration} • {flight.transits.length > 0 ? flight.transits.length -1: 0} Transits
              </p>
            </div>

            {/* Arrival */}
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-bold text-[#1B3A4B]">
                {flight.arrivalTime}
              </p>
              <p className="text-xs text-[#455A64]">{flight.arrivalCity}</p>
              <p className="text-xs text-[#B0BEC5]">({flight.arrivalCode})</p>
            </div>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex flex-col items-center justify-center space-y-3 min-w-[120px]">
          <p className="text-2xl font-bold text-[#1B3A4B]">${flight.price}</p>
          <FlightDetailsModal key={JSON.stringify(passengers)} flight={flight} passengers={passengers} />
        </div>
      </div>
    </div>
  );
};

export default FlightCardComponent;
