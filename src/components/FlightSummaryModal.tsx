import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, 
  faArrowRight,
  faLocationPin
} from "@fortawesome/free-solid-svg-icons";
import { FaPlane } from "react-icons/fa";

type City = {
  name: string;
  code: string;
};

type FlightSegment = {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureDate: Date | null;
  departureTime: string;
  arrivalTime: string;
  meal: "No Meal" | "Snack" | "In-Flight Meal" | "Full Meal";
  price: number;
  aircraft: string;
  seat: string;
  frequency: "daily" | "weekly";
};

type FlightSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  departureCity: string;
  departureCityCode: string;
  destinationCity: string;
  destinationCityCode: string;
  transitCities: City[];
  flightSegments: FlightSegment[];
  formatDate: (date: Date | null) => string;
  calculateDuration: (departureTime: string, arrivalTime: string) => string;
};

const FlightSummaryModal: React.FC<FlightSummaryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  departureCity,
  departureCityCode,
  destinationCity,
  destinationCityCode,
  transitCities,
  flightSegments,
  formatDate,
  calculateDuration
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-4xl max-h-[90vh] p-0 bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="sticky top-0 z-10 px-6 py-5 flex justify-between items-center">
          <h3 className="font-bold text-xl text-[#1B3A4B] flex items-center">
            Flight Summary
          </h3>
          <form method="dialog">
            <button 
              className="btn btn-sm btn-ghost text-[#1B3A4B] hover:bg-transparent hover:border-none"
              onClick={onClose}
            >
              ✕
            </button>
          </form>
        </div>
        
        <div className="px-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="flex items-center justify-center py-4 mb-8 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center">
                <FontAwesomeIcon icon={faLocationPin} className="text-[#1B3A4B] text-xl" />
              </div>
              <div className="text-center">
                <span className="block text-[#1B3A4B] font-bold text-lg">{departureCity}</span>
                <span className="text-sm text-[#455A64] font-medium">{departureCityCode}</span>
              </div>
            </div>
            
            {transitCities.length > 0 ? (
              <>
                {transitCities.map((city, index) => (
                  <React.Fragment key={index}>
                    <div className="h-[2px] bg-gradient-to-r from-[#ECEFF1] to-[#B0BEC5] flex-1 mx-3 relative">
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLocationPin} className="text-[#1B3A4B] text-xl" />
                      </div>
                      <div className="text-center">
                        <span className="block text-[#1B3A4B] font-bold text-lg">{city.name}</span>
                        <span className="text-sm text-[#455A64] font-medium">{city.code}</span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                <div className="h-[2px] bg-gradient-to-r from-[#B0BEC5] to-[#ECEFF1] flex-1 mx-3 relative">
                </div>
              </>
            ) : (
              <div className="h-[2px] bg-gradient-to-r from-[#B0BEC5] to-[#1B3A4B] flex-1 mx-6 relative">
              </div>
            )}
            
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center">
                <FontAwesomeIcon icon={faLocationPin} className="text-[#1B3A4B] text-xl" />
              </div>
              <div className="text-center">
                <span className="block text-[#1B3A4B] font-bold text-lg">{destinationCity}</span>
                <span className="text-sm text-[#455A64] font-medium">{destinationCityCode}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {flightSegments.map((segment, index) => (
              <div key={index} className="bg-white rounded-xl border border-[#ECEFF1] shadow-md overflow-hidden">
                <div className="text-[#1B3A4B] px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium">{segment.fromCity} ({segment.fromCode})</span>
                    <FontAwesomeIcon icon={faArrowRight} className="mx-3 text-xs" />
                    <span className="font-medium">{segment.toCity} ({segment.toCode})</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white px-3 py-1">
                      ${segment.price}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 mb-4 md:mb-0 md:border-r border-[#ECEFF1] md:pr-5">
                      <div className="flex mb-4">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-[#455A64]" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-[#78909C]">Date</p>
                          <p className="font-medium text-[#1B3A4B]">
                            {formatDate(segment.departureDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex mb-4">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                          <FaPlane className="text-[#455A64]" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-[#78909C]">Departure</p>
                          <p className="text-lg font-semibold text-[#1B3A4B]">
                            {segment.departureTime}
                          </p>
                          <p className="text-sm text-[#455A64]">
                            {segment.fromCity} ({segment.fromCode})
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                          <FaPlane className="text-[#455A64]" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-[#78909C]">Arrival</p>
                          <p className="text-lg font-semibold text-[#1B3A4B]">
                            {segment.arrivalTime}
                          </p>
                          <p className="text-sm text-[#455A64]">
                            {segment.toCity} ({segment.toCode})
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/2 md:pl-5">
                      <div className="grid grid-cols-2 gap-4">
                        
                        <div>
                          <p className="text-sm text-[#78909C]">Aircraft</p>
                          <p className="font-medium text-[#1B3A4B]">{segment.aircraft}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-[#78909C]">Seating</p>
                          <p className="font-medium text-[#1B3A4B]">Single-aisle 3-3/2-2 configuration</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-[#78909C]">Duration</p>
                          <p className="font-medium text-[#1B3A4B]">
                            {calculateDuration(segment.departureTime, segment.arrivalTime)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-[#78909C]">Meal</p>
                          <p className="font-medium text-[#1B3A4B]">{segment.meal}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-[#78909C]">Frequency</p>
                          <p className="font-medium text-[#1B3A4B] capitalize">{segment.frequency}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 py-6 border-t border-[#ECEFF1]">
            <div className="flex justify-between items-center bg-[#F5F7F8] p-4 rounded-lg">
              <p className="text-lg font-medium text-[#1B3A4B]">Total Price:</p>
              <p className="text-2xl font-bold text-[#1B3A4B]">
                ${flightSegments.reduce((sum, segment) => sum + segment.price, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white px-6 py-5 flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#0D1B2A] transition-colors font-medium shadow-md hover:shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>
      
      {/* Modal backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default FlightSummaryModal; 