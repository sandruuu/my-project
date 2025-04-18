import React, { useRef, useState } from "react";
import { FaClock, FaPlane, FaCalendarAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcaseRolling, faTicketAlt, faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { GiMeal } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import flights from "../assets/flights";
import type { Flight } from "../assets/flights";

type PassengersType = {
  adults?: number;
  children?: number;
  infants?: number;
};

type Props = {
  flight: Flight;
  passengers?: PassengersType;
};

const FlightDetailsModal: React.FC<Props> = ({ flight, passengers }) => {
  const navigate = useNavigate();
  const [isAuthenticated] = useState(true);
  const passengersData = passengers || {
    adults: 1,
    children: 0,
    infants: 0,
  };
  
  const isValidDate = (dateStr: string): boolean => {
    if (!dateStr || dateStr.trim() === '') return false;
    
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) return false;
    
    return true;
  };
  
  const formatDate = (dateStr: string): string => {
    if (!isValidDate(dateStr)) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };
  
  const createPassengersList = () => {
    const list = [];
    
    for (let i = 0; i < (passengersData.adults || 1); i++) {
      list.push({
        name: `Adult ${i + 1}`,
        type: 'adult'
      });
    }
    
    for (let i = 0; i < (passengersData.children || 0); i++) {
      list.push({
        name: `Child ${i + 1}`,
        type: 'child'
      });
    }
    
    for (let i = 0; i < (passengersData.infants || 0); i++) {
      list.push({
        name: `Infant ${i + 1}`,
        type: 'infant'
      });
    }
    
    return list;
  };
  
  const passengersList = createPassengersList();
  
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = () => {
    modalRef.current?.showModal();
  };
  
  const handleBookNow = () => {
    modalRef.current?.close();
    
    if (isAuthenticated) {
      navigate("/flightFare", { state: { flight: flight, passengers: passengersList } });
    } else {
      navigate("/logIn", { 
        state: { 
          redirectTo: "flightFare",
          flightData: { flight: flight, passengers: passengersList } 
        } 
      });
    }
  };

  const getFlightSegments = (flight: Flight): Flight[] => {
    if (flight.transits.length === 0) {
      return [flight];
    }

    const transitFlights = flight.transits.map((transitId) =>
      flights.find((f) => f.id === transitId)
    ) as Flight[];

    if (transitFlights.some((f) => !f)) {
      return [flight];
    }

    const segments: Flight[] = [];

    segments.push({
      ...transitFlights[0],
      departureCity: flight.departureCity,
      departureCode: flight.departureCode,
      departureTime: flight.departureTime,
      startDate: flight.startDate,
    });

    if (flight.transits.length === 2) {
      segments.push({
        ...transitFlights[1],
        departureCity: transitFlights[0].arrivalCity,
        departureCode: transitFlights[0].arrivalCode,
        departureTime: transitFlights[1].departureTime,
        startDate: flight.startDate,
      });
    }
    const lastSegment = segments[segments.length - 1];
    lastSegment.arrivalCity = flight.arrivalCity;
    lastSegment.arrivalCode = flight.arrivalCode;
    lastSegment.arrivalTime = flight.arrivalTime;

    return segments;
  };

  const calculateLayover = (arrivalTime: string, departureTime: string) => {
    const parseTime = (timeStr: string) => {
      let [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };
    
    const arrivalParsed = parseTime(arrivalTime);
    const departureParsed = parseTime(departureTime);
    
    const arrivalInMinutes = arrivalParsed.hours * 60 + arrivalParsed.minutes;
    const departureInMinutes = departureParsed.hours * 60 + departureParsed.minutes;
    
    let layoverMinutes = departureInMinutes - arrivalInMinutes;
    if (layoverMinutes < 0) {
      layoverMinutes += 24 * 60;
    }
    
    const hours = Math.floor(layoverMinutes / 60);
    const minutes = layoverMinutes % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <>
      <button 
        className="bg-[#1B3A4B] text-white px-4 py-2 rounded-md hover:bg-[#0D1B2A] transition-colors duration-200" 
        onClick={openModal}
      >
        View Details
      </button>
      <dialog id="flight_details_modal" className="modal" ref={modalRef}>
        <div className="modal-box max-h-[500px] flex flex-col p-0 overflow-hidden">
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-[#1B3A4B]">Flight Details</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-[#455A64] hover:text-[#1B3A4B]">
                ✕
              </button>
            </form>
          </div>
          
          <div className="overflow-y-auto p-6">
            <div className="space-y-4 text-sm text-[#455A64]">
              <div className="flex flex-col items-start">
                {getFlightSegments(flight).map((segment, index) => (
                  <div key={index}>
                    <div className="flex relative">
                      <div className="absolute left-4 top-8 w-[1px] h-[270px] bg-[#B0BEC5] z-0"></div>
                      
                      <div className="flex flex-col z-10">
                          <div className="flex mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <FaCalendarAlt className="text-[#1B3A4B]" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-[#1B3A4B] mt-1">
                              {isValidDate(segment.startDate) && ( formatDate(segment.startDate) )}
                              </p>
                            </div>
                          </div>
                        
                        <div className="flex mb-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <FaPlane className="text-[#1B3A4B]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-semibold text-[#1B3A4B]">
                              {segment.departureTime}
                            </p>
                            <p className="text-sm text-[#455A64]">
                              {segment.departureCity} ({segment.departureCode})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="ml-12 mb-4 p-4 bg-white w-full border border-gray-100 rounded-md shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-[#455A64] flex items-center">
                                <FontAwesomeIcon icon={faTicketAlt} className="text-[#1B3A4B] mr-2 w-5" />
                                Flight code: {segment.code}
                              </p>
                            </div>
                            <div className="mb-2">
                              <p className="text-sm text-[#455A64] flex items-center">
                                <FontAwesomeIcon icon={faPlaneDeparture} className="text-[#1B3A4B] mr-2 w-5" />
                                Aircraft type: {segment.aircraft}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-[#455A64] flex items-center">
                                <FontAwesomeIcon icon={faSuitcaseRolling} className="text-[#1B3A4B] mr-2 w-5" />
                                Free hand luggage (40 x 30 x 20 cm)
                              </p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-[#455A64] flex items-center">
                                  <MdAirlineSeatReclineNormal className="text-[#1B3A4B] mr-2 w-5" />
                                {segment.seat}
                              </p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-[#455A64] flex items-center">
                                <GiMeal className="text-[#1B3A4B] mr-2 w-5" />
                                {segment.meal}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start mb-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <FaPlane className="text-[#1B3A4B]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-semibold text-[#1B3A4B]">
                              {segment.arrivalTime}
                            </p>
                            <p className="text-sm text-[#455A64]">
                              {segment.arrivalCity} ({segment.arrivalCode})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < getFlightSegments(flight).length - 1 && (
                      <div className="flex items-start mb-6">
                        <div className="ml-12 text-sm text-[#455A64]">
                          <div className="flex items-center">
                          <FaClock className="text-[#1B3A4B] mr-2" />
                          <p>
                            Layover in {segment.arrivalCity}:{" "}
                            <span className="font-medium text-[#1B3A4B]">
                              {calculateLayover(
                                segment.arrivalTime,
                                getFlightSegments(flight)[index + 1].departureTime
                              )}
                            </span>
                          </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={handleBookNow}
                className="text-white bg-[#1B3A4B] px-6 py-2 rounded-lg hover:bg-[#0D1B2A] transition-colors duration-200"
              >
                Book now from ${flight.price}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default FlightDetailsModal;
