import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowLeft,
  faArrowRight,
  faPerson,
  faChild,
  faBaby,
  faWheelchair,
  faCheck,
  faPercent,
  faChevronDown,
  faChevronUp,
  faSuitcaseRolling,
} from "@fortawesome/free-solid-svg-icons";
import NavigationBarComponent from "../components/NavigationBarComponent";

const styles = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; max-height: 0; }
      to { opacity: 1; max-height: 9999px; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-in-out forwards;
      overflow: visible;
      position: relative;
      z-index: 1;
    }
  `,
};

interface PassengerInfo {
  id: number;
  type: string;
  firstName: string;
  lastName: string;
  gender: string;
  specialAssistance: boolean;
  isCompleted: boolean;
  baggage?: {
    checked: number | null;
  };
}

const FlightPassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers, selectedFare, selectedSeats } =
    location.state || {};
  const passengersContainerRef = useRef<HTMLDivElement>(null);

  const [passengerDetails, setPassengerDetails] = useState<PassengerInfo[]>([]);
  const [expandedPassengers, setExpandedPassengers] = useState<Set<number>>(
    new Set()
  );
  const [formValues, setFormValues] = useState<{
    [key: number]: {
      firstName: string;
      lastName: string;
      gender: string;
      specialAssistance: boolean;
      baggage: {
        checked: number | null;
      };
    };
  }>({});

  useEffect(() => {
    if (passengers && passengers.length > 0) {
      const initialPassengers = passengers.map(
        (passenger: any, index: number) => ({
          id: index + 1,
          type: passenger.type || "adult",
          firstName: "",
          lastName: "",
          gender: "",
          specialAssistance: false,
          isCompleted: false,
          baggage: {
            checked: null,
          },
        })
      );

      setPassengerDetails(initialPassengers);

      const initialFormValues = initialPassengers.reduce(
        (acc: typeof formValues, passenger: PassengerInfo) => {
          acc[passenger.id] = {
            firstName: "",
            lastName: "",
            gender: "",
            specialAssistance: false,
            baggage: {
              checked: null,
            },
          };
          return acc;
        },
        {} as typeof formValues
      );

      setFormValues(initialFormValues);
    }
  }, [passengers]);

  const handleInputChange = (
    passengerId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [passengerId]: {
        ...prevValues[passengerId],
        [name]: value,
      },
    }));
  };

  const handleGenderSelect = (passengerId: number, gender: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [passengerId]: {
        ...prevValues[passengerId],
        gender,
      },
    }));
  };

  const handleSpecialAssistanceSelect = (
    passengerId: number,
    value: boolean
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [passengerId]: {
        ...prevValues[passengerId],
        specialAssistance: value,
      },
    }));
  };

  const handleBaggageSelect = (passengerId: number, size: number | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [passengerId]: {
        ...prevValues[passengerId],
        baggage: {
          ...prevValues[passengerId].baggage,
          checked: size,
        },
      },
    }));
  };

  const validatePassenger = (passengerId: number) => {
    const values = formValues[passengerId];
    return (
      values.firstName.trim() !== "" &&
      values.lastName.trim() !== "" &&
      values.gender !== ""
    );
  };

  const savePassenger = (passengerId: number) => {
    if (validatePassenger(passengerId)) {
      const updatedPassengers = passengerDetails.map((passenger) => {
        if (passenger.id === passengerId) {
          return {
            ...passenger,
            firstName: formValues[passengerId].firstName.trim(),
            lastName: formValues[passengerId].lastName.trim(),
            gender: formValues[passengerId].gender,
            specialAssistance: formValues[passengerId].specialAssistance,
            isCompleted: true,
            baggage: formValues[passengerId].baggage,
          };
        }
        return passenger;
      });

      setPassengerDetails(updatedPassengers);

      const newExpandedPassengers = new Set(expandedPassengers);
      newExpandedPassengers.delete(passengerId);
      setExpandedPassengers(newExpandedPassengers);

      if (passengersContainerRef.current) {
        const yOffset = -100;
        const y =
          passengersContainerRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const goToNextStep = () => {
    const allPassengersCompleted = passengerDetails.every((p) => p.isCompleted);
    if (allPassengersCompleted) {
      navigate("/payment", {
        state: {
          flight,
          passengers: passengerDetails,
          selectedFare,
          selectedSeats,
        },
      });
    }
  };

  const goBack = () => {
    if (selectedFare === "AIR BASIC") {
      navigate("/flightFare", {
        state: {
          flight,
          passengers,
        },
      });
    } else {
      navigate("/flightSeats", {
        state: {
          flight,
          passengers,
          selectedFare,
        },
      });
    }
  };

  const getPassengerIcon = (type: string) => {
    switch (type) {
      case "adult":
        return faPerson;
      case "child":
        return faChild;
      case "infant":
        return faBaby;
      default:
        return faPerson;
    }
  };

  const togglePassengerDetails = (passengerId: number) => {
    const newExpandedPassengers = new Set(expandedPassengers);
    if (newExpandedPassengers.has(passengerId)) {
      newExpandedPassengers.delete(passengerId);
    } else {
      newExpandedPassengers.add(passengerId);
      setTimeout(() => {
        const passengerDiv = document.getElementById(
          `passenger-${passengerId}`
        );
        if (passengerDiv) {
          const yOffset = -50;
          const y =
            passengerDiv.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
    }
    setExpandedPassengers(newExpandedPassengers);
  };

  const renderPassengerForm = (passenger: PassengerInfo) => {
    const isExpanded = expandedPassengers.has(passenger.id);
    const values = formValues[passenger.id] || {
      firstName: "",
      lastName: "",
      gender: "",
      specialAssistance: false,
      baggage: {
        checked: null,
      },
    };

    return (
      <div
        id={`passenger-${passenger.id}`}
        key={passenger.id}
        className="bg-white rounded-lg shadow-sm mb-4 transition-all duration-300 hover:shadow-md border border-[#ECEFF1] relative"
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#B0BEC5]/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={getPassengerIcon(passenger.type)}
                  className="text-[#0D1B2A] text-xl"
                />
              </div>
              <div>
                <div className="text-lg font-semibold text-[#0D1B2A]">
                  {passenger.id}.{" "}
                  {passenger.isCompleted
                    ? `${values.firstName} ${values.lastName}`
                    : "Passenger"}{" "}
                  ({passenger.type.toUpperCase()})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => togglePassengerDetails(passenger.id)}
                className="text-[#455A64] hover:text-[#0D1B2A] transition-colors duration-300"
                aria-label={isExpanded ? "Collapse details" : "Expand details"}
              >
                <FontAwesomeIcon
                  icon={isExpanded ? faChevronUp : faChevronDown}
                  className="text-xl"
                />
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="animate-fadeIn px-4 pb-12 overflow-visible">
            <div className="border-t border-[#ECEFF1] pt-4 mt-2">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                      First Name
                    </p>
                    <input
                      className="text-base text-[#1B3A4B] w-full min-w-[190px] focus:outline-none bg-transparent"
                      type="text"
                      name="firstName"
                      placeholder="Insert First Name"
                      value={values.firstName}
                      onChange={(e) => handleInputChange(passenger.id, e)}
                    />
                  </div>
                </div>

                <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                      Last Name
                    </p>
                    <input
                      className="text-base text-[#1B3A4B] w-full min-w-[190px] focus:outline-none bg-transparent"
                      type="text"
                      name="lastName"
                      placeholder="Insert Last Name"
                      value={values.lastName}
                      onChange={(e) => handleInputChange(passenger.id, e)}
                    />
                  </div>
                </div>
              </div>

              {/* Gender selection */}
              <div className="mb-6">
                <h3 className="font-bold text-[#1B3A4B] text-lg mb-4">
                  Gender selection
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <button
                      type="button"
                      onClick={() =>
                        handleGenderSelect(passenger.id, "feminine")
                      }
                      className={`w-full mt-1 py-3 border ${
                        values.gender === "feminine"
                          ? "bg-[#455A64] text-white"
                          : "bg-[#ECEFF1] border-[#B0BEC5] text-[#1B3A4B] hover:bg-[#B0BEC5]"
                      } rounded-md flex justify-center items-center transition-all duration-300`}
                    >
                      {values.gender === "feminine" && (
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      )}
                      Female
                    </button>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <button
                      type="button"
                      onClick={() =>
                        handleGenderSelect(passenger.id, "masculine")
                      }
                      className={`w-full mt-1 py-3 border ${
                        values.gender === "masculine"
                          ? "bg-[#455A64] text-white"
                          : "bg-[#ECEFF1] border-[#B0BEC5] text-[#1B3A4B] hover:bg-[#B0BEC5]"
                      } rounded-md flex justify-center items-center transition-all duration-300`}
                    >
                      {values.gender === "masculine" && (
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      )}
                      Male
                    </button>
                  </div>
                </div>
              </div>

              {/* Special assistance */}
              <div className="mb-6 bg-[#ECEFF1] p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon
                    icon={faWheelchair}
                    className="text-[#455A64] mr-2 text-xl"
                  />
                  <span className="font-medium text-[#1B3A4B]">
                    Do you need special assistance at the airport?
                  </span>
                </div>

                <p className="text-sm text-[#455A64] mb-4">
                  Declare if you need special assistance at the airport to
                  continue the booking process.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSpecialAssistanceSelect(passenger.id, true)
                      }
                      className={`w-full py-3 border ${
                        values.specialAssistance
                          ? "bg-[#455A64] text-white"
                          : "bg-white border-[#B0BEC5] text-[#1B3A4B] hover:bg-[#B0BEC5]"
                      } rounded-md flex justify-center items-center transition-all duration-300`}
                    >
                      {values.specialAssistance && (
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      )}
                      Yes
                    </button>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSpecialAssistanceSelect(passenger.id, false)
                      }
                      className={`w-full py-3 border ${
                        values.specialAssistance === false
                          ? "bg-[#455A64] text-white"
                          : "bg-white border-[#B0BEC5] text-[#1B3A4B] hover:bg-[#B0BEC5]"
                      } rounded-md flex justify-center items-center transition-all duration-300`}
                    >
                      {values.specialAssistance === false && (
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      )}
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Baggage selection */}
              {passenger.type !== "infant" && (
                <div className="mb-6 bg-[#ECEFF1] rounded-lg p-4">
                  <h3 className="font-bold text-[#1B3A4B] text-lg mb-3">
                    Checked Baggage
                  </h3>

                  <p className="text-sm text-[#455A64] mb-4">
                    <FontAwesomeIcon icon={faPercent} className="mr-2" />
                    It's cheaper to add baggage now.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {/* No baggage option */}
                    <button
                      className={`w-full text-left p-4 border border-[#B0BEC5] rounded-lg ${
                        values.baggage.checked === null
                          ? "bg-[#455A64] text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleBaggageSelect(passenger.id, null)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faSuitcaseRolling}
                          className={`mr-3 ${
                            values.baggage.checked === null
                              ? "text-white"
                              : "text-[#455A64]"
                          }`}
                        />
                        <div>
                          <div className="font-medium">No baggage</div>
                          <div className="text-xs">$0</div>
                        </div>
                      </div>
                    </button>

                    {/* 10 kg option */}
                    <button
                      className={`w-full text-left p-4 border border-[#B0BEC5] rounded-lg ${
                        values.baggage.checked === 10
                          ? "bg-[#455A64] text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleBaggageSelect(passenger.id, 10)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faSuitcaseRolling}
                          className={`mr-3 ${
                            values.baggage.checked === 10
                              ? "text-white"
                              : "text-[#455A64]"
                          }`}
                        />
                        <div>
                          <div className="font-medium">10 kg</div>
                          <div className="text-xs">$25</div>
                        </div>
                      </div>
                    </button>

                    {/* 20 kg option */}
                    <button
                      className={`w-full text-left p-4 border border-[#B0BEC5] rounded-lg ${
                        values.baggage.checked === 20
                          ? "bg-[#455A64] text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleBaggageSelect(passenger.id, 20)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faSuitcaseRolling}
                          className={`mr-3 ${
                            values.baggage.checked === 20
                              ? "text-white"
                              : "text-[#455A64]"
                          }`}
                        />
                        <div>
                          <div className="font-medium">20 kg</div>
                          <div className="text-xs">$45</div>
                        </div>
                      </div>
                    </button>

                    {/* 26 kg option */}
                    <button
                      className={`w-full text-left p-4 border border-[#B0BEC5] rounded-lg ${
                        values.baggage.checked === 26
                          ? "bg-[#455A64] text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleBaggageSelect(passenger.id, 26)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faSuitcaseRolling}
                          className={`mr-3 ${
                            values.baggage.checked === 26
                              ? "text-white"
                              : "text-[#455A64]"
                          }`}
                        />
                        <div>
                          <div className="font-medium">26 kg</div>
                          <div className="text-xs">$65</div>
                        </div>
                      </div>
                    </button>

                    {/* 32 kg option */}
                    <button
                      className={`w-full text-left p-4 border border-[#B0BEC5] rounded-lg ${
                        values.baggage.checked === 32
                          ? "bg-[#455A64] text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleBaggageSelect(passenger.id, 32)}
                    >
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faSuitcaseRolling}
                          className={`mr-3 ${
                            values.baggage.checked === 32
                              ? "text-white"
                              : "text-[#455A64]"
                          }`}
                        />
                        <div>
                          <div className="font-medium">32 kg</div>
                          <div className="text-xs">$85</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="absolute bottom-3 right-4">
                <button
                  onClick={() => savePassenger(passenger.id)}
                  disabled={!validatePassenger(passenger.id)}
                  className={`${
                    validatePassenger(passenger.id)
                      ? "bg-[#455A64] text-white hover:bg-[#1B3A4B]"
                      : "bg-[#B0BEC5] text-white cursor-not-allowed opacity-70"
                  } font-medium py-3 px-8 rounded-md transition-all duration-300 flex items-center shadow-md hover:shadow-lg`}
                >
                  <span className="text-base">Save</span>
                  <FontAwesomeIcon icon={faCheck} size="lg" className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBarComponent />
      <style>{styles.fadeIn}</style>
      <div className="container py-8 px-4 md:px-4 lg:px-16 xl:px-24 flex-grow">
        <div className="mb-8 overflow-x-auto">
          <ul className="steps steps-horizontal w-full min-w-[600px]">
            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
              Search
            </li>
            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
              Choose flight
            </li>
            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
              Choose fare
            </li>
            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
              Choose seat
            </li>
            <li
              className="step step-primary text-[#455A64] font-bold"
              data-content="★"
            >
              Passenger details
            </li>
            <li className="step text-[#455A64]">Payment</li>
            <li className="step text-[#455A64]">Confirmation</li>
          </ul>
        </div>

        <div className="bg-cover bg-center py-4 md:px-6 lg:px-12 xl:px-20">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#1B3A4B]">
              {flight?.departureCity} to {flight?.arrivalCity}
            </h1>
          </div>

          {/* Passenger forms */}
          <div ref={passengersContainerRef} className="mb-8">
            {passengerDetails.map(renderPassengerForm)}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={goBack}
              className="text-[#1B3A4B] font-medium py-2 px-6 rounded-md transition-all duration-300 flex items-center hover:scale-110"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </button>

            <button
              onClick={goToNextStep}
              disabled={!passengerDetails.every((p) => p.isCompleted)}
              className={`${
                passengerDetails.every((p) => p.isCompleted)
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
      <FooterComponent />
    </div>
  );
};

export default FlightPassengerDetails;
