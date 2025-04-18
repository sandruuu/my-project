import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import NavigationBarComponent from "../components/NavigationBarComponent";
import {
  faSuitcaseRolling,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faUserCheck
} from "@fortawesome/free-solid-svg-icons";

const FlightFare = () => {
  const location = useLocation();
  const flight = location.state?.flight;
  const passengers = location.state?.passengers || [];
  const navigate = useNavigate();
  const [selectedFare, setSelectedFare] = useState<string | null>(null);
  
  const getPassengersByType = () => {
    const result = {
      adults: passengers.filter((p: any) => p.type === 'adult').length,
      children: passengers.filter((p: any) => p.type === 'child').length,
      infants: passengers.filter((p: any) => p.type === 'infant').length,
    };
    return result;
  };
  
  useEffect(() => {
    console.log("FlightFare received state:", location.state);
    console.log("Passengers in FlightFare:", passengers);
    console.log("Passengers by type:", getPassengersByType());
  }, [location.state, passengers]);

  const goBack = () => {
    navigate('/flightSchedule', {
      state: {
        from: flight.departureCity,
        to: flight.arrivalCity,
        departureDate: flight.departureDate,
        passengers: getPassengersByType(),
        isFromSelected: true,
        isToSelected: true
      }
    });
  };
  const goNext = () => {
    if (selectedFare) {
      if (selectedFare === "AIR BASIC") {
        navigate("/passengerDetails", {
          state: {
            flight,
            passengers,
            selectedFare,
            selectedSeats: [] 
          }
        });
      } else {
        navigate("/flightSeats", { 
          state: { 
            flight, 
            passengers, 
            selectedFare 
          } 
        });
      }
    }
  };

  const handleSelectFare = (fare: string) => {
    setSelectedFare(fare);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavigationBarComponent />
      <div className="container mx-auto py-8 flex-grow">
        <div className="mb-12 mx-4 sm:mx-4 md:mx-12 lg:mx-20 overflow-x-auto">
          <ul className="steps steps-horizontal w-full min-w-[600px]">
            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
              Search
            </li>
            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
              Choose flight
            </li>
            <li className="step step-primary text-[#1B3A4B] font-bold" data-content="★">
              Choose fare
            </li>
            <li className="step text-[#455A64]">Choose seat</li>
            <li className="step text-[#455A64]">Passenger details</li>
            <li className="step text-[#455A64]">Payment</li>
            <li className="step text-[#455A64]">Confirmation</li>
          </ul>
        </div>
        <div className="w-full bg-white px-5 md:px-20 bg-center py-10 mx-auto">
          <div className="absolute opacity-40"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 text-[#1B3A4B] mb-10">
              {flight.departureCity} to {flight.arrivalCity}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`border ${
                  selectedFare === "AIR BASIC"
                    ? "border-[#1B3A4B] shadow-xl"
                    : "border-[#B0BEC5]"
                } rounded-lg p-6 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-white bg-opacity-95`}
              >
                <div className="mb-4 border-b border-[#ECEFF1] pb-3">
                  <h2 className="text-xl font-bold text-[#1B3A4B]">AIR BASIC</h2>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free hand baggage
                    </h3>
                    <p className="text-[#455A64] text-sm">
                      (40 cm × 30 cm × 20 cm)
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <MdAirlineSeatReclineNormal
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Seat automatic allocated
                    </h3>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free online check-in
                    </h3>
                    <p className="text-[#455A64] text-sm">
                      Airport check-in costs $40
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center py-3 px-2 border-t border-[#ECEFF1]">
                  <span className="text-2xl font-bold text-[#1B3A4B] mr-auto">
                    ${flight.price}
                  </span>
                  <button
                    onClick={() => handleSelectFare("AIR BASIC")}
                    className="text-[#1B3A4B] h-10 w-20 px-4 py-2 rounded-md transition-all duration-300 flex justify-center items-center hover:scale-110 hover:font-bold"
                  >
                    {selectedFare === "AIR BASIC" ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} />
                      </>
                    ) : (
                      <>
                        Select
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`border ${
                  selectedFare === "AIR ECO"
                    ? "border-[#1B3A4B] shadow-xl"
                    : "border-[#B0BEC5]"
                } rounded-lg p-6 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-[#F5F7F8] bg-opacity-95`}
              >
                <div className="mb-4 border-b border-[#ECEFF1] pb-3">
                  <h2 className="text-xl font-bold text-[#1B3A4B]">AIR ECO</h2>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free hand baggage
                    </h3>
                    <p className="text-[#455A64] text-sm">
                      (40 cm × 30 cm × 20 cm)
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <MdAirlineSeatReclineNormal
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Seat automatic allocated
                    </h3>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Checked baggage 20 kg
                    </h3>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free airport and online check-in
                    </h3>
                    <p className="text-[#455A64] text-sm">
                      Airport check-in costs $40
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center py-3 px-2 border-t border-[#ECEFF1]">
                  <span className="text-2xl font-bold text-[#1B3A4B] mr-auto">
                    ${flight.price + 50}
                  </span>
                  <button
                    onClick={() => handleSelectFare("AIR ECO")}
                    className="text-[#1B3A4B] h-10 w-20 px-4 py-2 rounded-md transition-all duration-300 flex justify-center items-center hover:scale-110 hover:font-bold"
                  >
                    {selectedFare === "AIR ECO" ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} />
                      </>
                    ) : (
                      <>
                        Select
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`border ${
                  selectedFare === "AIR PLUS"
                    ? "border-[#1B3A4B] shadow-xl"
                    : "border-[#B0BEC5]"
                } rounded-lg p-6 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-[#F5F7F8] bg-opacity-95`}
              >
                <div className="mb-4 border-b border-[#ECEFF1] pb-3">
                  <h2 className="text-xl font-bold text-[#1B3A4B]">AIR PLUS</h2>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free hand baggage
                    </h3>
                    <p className="text-[#455A64] text-sm">
                      (40 cm × 30 cm × 20 cm)
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <MdAirlineSeatReclineNormal
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free selection of premium seats or standard seats
                    </h3>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faSuitcaseRolling}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Checked baggage 32 kg
                    </h3>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="mt-1 text-[#1B3A4B] mr-3 w-5 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1B3A4B]">
                      Free airport and online check-in
                    </h3>
                    <p className="text-[#455A64] text-sm">
                      Airport check-in costs $40
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-center py-3 px-2 border-t border-[#ECEFF1]">
                  <span className="text-2xl font-bold text-[#1B3A4B] mr-auto">
                    ${flight.price + 150}
                  </span>
                  <button
                    onClick={() => handleSelectFare("AIR PLUS")}
                    className="text-[#1B3A4B] h-10 w-20 px-4 py-2 rounded-md transition-all duration-300 flex justify-center items-center hover:scale-110 hover:font-bold"
                  >
                    {selectedFare === "AIR PLUS" ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} />
                      </>
                    ) : (
                      <>
                        Select
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full py-4 flex justify-between items-center mt-8 mb-6 px-10">
              <button
                onClick={goBack}
                className="text-[#1B3A4B] font-medium py-2 px-6 rounded-md transition-all duration-300 flex items-center hover:scale-110"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
              </button>
              <button
                onClick={goNext}
                className={`${
                  selectedFare
                    ? "text-[#1B3A4B] hover:scale-110"
                    : "text-[#B0BEC5] cursor-not-allowed"
                } font-medium py-2 px-6 rounded-md transition-all duration-300 flex items-center`}
              >
                Next
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};
export default FlightFare;