import React, { useState, useEffect, useRef } from "react";
import cities from "../assets/cities";
import { Flight, flights } from "../assets/flights";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faArrowRight,
  faPlus,
  faTimes,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import FlightSummaryModal from "../components/FlightSummaryModal";
import plane from "../assets/images/plane2.jpg";
import FlightRouteVisualization from "../components/FlightRouteVisualization";
import "./custom-calendar.css";
import TimePickerComponent from "../components/TimePickerComponent";
import SelectComponent from "../components/SelectComponent";
import { useNavigate } from "react-router-dom";

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

type SegmentMode = {
  segmentIndex: number;
  mode: "new" | "existing";
};

const AddFlight: React.FC = () => {
  const [departureCity, setDepartureCity] = useState<string>("");
  const [destinationCity, setDestinationCity] = useState<string>("");
  const [departureCityCode, setDepartureCityCode] = useState<string>("");
  const [destinationCityCode, setDestinationCityCode] = useState<string>("");

  const [transitCities, setTransitCities] = useState<
    { name: string; code: string }[]
  >([]);

  const [showDepartureDropdown, setShowDepartureDropdown] =
    useState<boolean>(false);
  const [showDestinationDropdown, setShowDestinationDropdown] =
    useState<boolean>(false);
  const [showTransitDropdown, setShowTransitDropdown] =
    useState<boolean>(false);

  const [flightSegments, setFlightSegments] = useState<FlightSegment[]>([]);

  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);

  const departureDropdownRef = useRef<HTMLDivElement>(null);
  const destinationDropdownRef = useRef<HTMLDivElement>(null);
  const transitDropdownRef = useRef<HTMLDivElement>(null);

  const [segmentModes, setSegmentModes] = useState<SegmentMode[]>([]);

  const [selectedFlightIds, setSelectedFlightIds] = useState<{
    [segmentIndex: number]: number;
  }>({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string;
  }>({});

  const successModalRef = useRef<HTMLDialogElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        departureDropdownRef.current &&
        !departureDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDepartureDropdown(false);
      }
      if (
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDestinationDropdown(false);
      }
      if (
        transitDropdownRef.current &&
        !transitDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTransitDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = () => {
    setShowSummaryModal(true);
  };

  const closeModal = () => {
    setShowSummaryModal(false);
  };

  const filterCities = (input: string, excludeCities: string[] = []) => {
    if (!input) return cities;
    return cities
      .map((group) => ({
        ...group,
        cities: group.cities.filter(
          (city) =>
            (city.name.toLowerCase().includes(input.toLowerCase()) ||
              city.code.toLowerCase().includes(input.toLowerCase())) &&
            !excludeCities.includes(city.name)
        ),
      }))
      .filter((group) => group.cities.length > 0);
  };

  const handleAddTransit = (city: City) => {
    if (
      transitCities.length < 2 &&
      city.name !== departureCity &&
      city.name !== destinationCity &&
      !transitCities.some((tc) => tc.name === city.name)
    ) {
      setTransitCities([...transitCities, city]);
    }
    setShowTransitDropdown(false);
  };

  const handleRemoveTransit = (index: number) => {
    setTransitCities(transitCities.filter((_, i) => i !== index));
  };

  const handleSelectDeparture = (city: City) => {
    setDepartureCity(city.name);
    setDepartureCityCode(city.code);
    setShowDepartureDropdown(false);

    if (city.name === destinationCity) {
      setDestinationCity("");
      setDestinationCityCode("");
    }

    setTransitCities(transitCities.filter((tc) => tc.name !== city.name));
  };

  const handleSelectDestination = (city: City) => {
    setDestinationCity(city.name);
    setDestinationCityCode(city.code);
    setShowDestinationDropdown(false);

    if (city.name === departureCity) {
      setDepartureCity("");
      setDepartureCityCode("");
    }

    setTransitCities(transitCities.filter((tc) => tc.name !== city.name));
  };

  useEffect(() => {
    if (!departureCity || !destinationCity) {
      setFlightSegments([]);
      return;
    }

    const segments: FlightSegment[] = [];

    if (transitCities.length === 0) {
      segments.push({
        fromCity: departureCity,
        fromCode: departureCityCode,
        toCity: destinationCity,
        toCode: destinationCityCode,
        departureDate: null,
        departureTime: "00:00",
        arrivalTime: "00:00",
        meal: "No Meal",
        price: 0,
        aircraft: "",
        seat: "",
        frequency: "daily",
      });
    } else {
      const cities = [
        { name: departureCity, code: departureCityCode },
        ...transitCities,
        { name: destinationCity, code: destinationCityCode },
      ];

      for (let i = 0; i < cities.length - 1; i++) {
        segments.push({
          fromCity: cities[i].name,
          fromCode: cities[i].code,
          toCity: cities[i + 1].name,
          toCode: cities[i + 1].code,
          departureDate: null,
          departureTime: "00:00",
          arrivalTime: "00:00",
          meal: "No Meal",
          price: 0,
          aircraft: "",
          seat: "",
          frequency: "daily",
        });
      }
    }

    setFlightSegments(segments);
  }, [
    departureCity,
    destinationCity,
    transitCities,
    departureCityCode,
    destinationCityCode,
  ]);

  const handleSegmentChange = (
    index: number,
    field: keyof FlightSegment,
    value: any
  ) => {
    const updatedSegments = [...flightSegments];
    updatedSegments[index] = {
      ...updatedSegments[index],
      [field]: value,
    };
    setFlightSegments(updatedSegments);
  };

  const checkFlightExists = (segment: FlightSegment) => {
    if (!segment.departureDate) return false;

    const formattedDepartureDate = segment.departureDate
      .toISOString()
      .split("T")[0];

    return flights.some(
      (flight) =>
        flight.departureCity === segment.fromCity &&
        flight.arrivalCity === segment.toCity &&
        flight.startDate === formattedDepartureDate &&
        flight.departureTime === segment.departureTime
    );
  };

  const isTimeChronological = (
    departureTime: string,
    arrivalTime: string
  ): boolean => {
    if (!departureTime || !arrivalTime) return true;

    const [departureHour, departureMinute] = departureTime
      .split(":")
      .map(Number);
    const [arrivalHour, arrivalMinute] = arrivalTime.split(":").map(Number);

    const departureInMinutes = departureHour * 60 + departureMinute;
    const arrivalInMinutes = arrivalHour * 60 + arrivalMinute;

    return arrivalInMinutes > departureInMinutes;
  };

  const validateSegment = (
    segment: FlightSegment,
    index: number
  ): { isValid: boolean; errorMessage: string; fieldErrors?: {[key: string]: string} } => {
    const errors: {[key: string]: string} = {};

    if (!isTimeChronological(segment.departureTime, segment.arrivalTime)) {
      errors[`segment-${index}-timeOrder`] = "Arrival time must be after departure time!";
      return {
        isValid: false,
        errorMessage: "Arrival time must be after departure time!",
        fieldErrors: errors
      };
    }

    if (checkFlightExists(segment)) {
      errors[`segment-${index}-flightExists`] = `A flight already exists for this route and time`;
      return {
        isValid: false,
        errorMessage: `A flight from ${segment.fromCity} to ${segment.toCity} on the same date and time already exists`,
        fieldErrors: errors
      };
    }

    if (index > 0) {
      const previousSegment = flightSegments[index - 1];

      if (segment.departureDate && previousSegment.departureDate) {
        const currentDate = new Date(segment.departureDate);
        const prevDate = new Date(previousSegment.departureDate);

        if (currentDate < prevDate) {
          errors[`segment-${index}-transitDate`] = "Transit departure date must be after previous arrival";
          return {
            isValid: false,
            errorMessage: "Transit departure date cannot be earlier than previous arrival",
            fieldErrors: errors
          };
        }
      }

      if (
        segment.departureDate &&
        previousSegment.departureDate &&
        segment.departureDate.toDateString() ===
          previousSegment.departureDate.toDateString()
      ) {
        if (
          !isTimeChronological(
            previousSegment.arrivalTime,
            segment.departureTime
          )
        ) {
          errors[`segment-${index}-transitTime`] = "Transit departure time must be after previous arrival";
          return {
            isValid: false,
            errorMessage: "Transit departure time must be after previous arrival time",
            fieldErrors: errors
          };
        }
      }
    }

    return { isValid: true, errorMessage: "" };
  };

  const validateForm = (): { isValid: boolean; errorMessage: string } => {
    setFieldErrors({});
    
    if (!departureCity || !destinationCity) {
      if (!departureCity) {
        setFieldErrors(prev => ({...prev, "departureCity": "Please select departure city"}));
      }
      if (!destinationCity) {
        setFieldErrors(prev => ({...prev, "destinationCity": "Please select destination city"}));
      }
      return {
        isValid: false,
        errorMessage: "Please select departure and destination cities",
      };
    }

    let allFieldErrors: {[key: string]: string} = {};
    
    for (let i = 0; i < flightSegments.length; i++) {
      const validation = validateSegment(flightSegments[i], i);
      if (!validation.isValid) {
        if (validation.fieldErrors) {
          allFieldErrors = {...allFieldErrors, ...validation.fieldErrors};
        }
        setFieldErrors(allFieldErrors);
        return validation;
      }
    }

    return { isValid: true, errorMessage: "" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});

    const validation = validateForm();
    if (!validation.isValid) {
      if (!departureCity) {
        setFieldErrors(prev => ({...prev, "departureCity": "Please select departure city"}));
      }
      if (!destinationCity) {
        setFieldErrors(prev => ({...prev, "destinationCity": "Please select destination city"}));
      }

      flightSegments.forEach((segment, index) => {
        if (!segment.departureDate) {
          setFieldErrors(prev => ({...prev, [`segment-${index}-departureDate`]: "Please select a departure date"}));
        }

        if (!segment.departureTime) {
          setFieldErrors(prev => ({...prev, [`segment-${index}-departureTime`]: "Please select departure time"}));
        }

        if (!segment.arrivalTime) {
          setFieldErrors(prev => ({...prev, [`segment-${index}-arrivalTime`]: "Please select arrival time"}));
        }

        if (segment.price <= 0) {
          setFieldErrors(prev => ({...prev, [`segment-${index}-price`]: "Price must be greater than 0"}));
        }

        if (segment.departureTime && segment.arrivalTime && 
            !isTimeChronological(segment.departureTime, segment.arrivalTime)) {
          setFieldErrors(prev => ({...prev, [`segment-${index}-timeOrder`]: "Arrival time must be after departure time"}));
        }

        if (segment.departureDate && segment.departureTime && checkFlightExists(segment)) {
          setFieldErrors(prev => ({
            ...prev, 
            [`segment-${index}-flightExists`]: `A flight already exists for this route and time`
          }));
        }

        if (index > 0) {
          const previousSegment = flightSegments[index - 1];

          if (segment.departureDate && previousSegment.departureDate) {
            const currentDate = new Date(segment.departureDate);
            const prevDate = new Date(previousSegment.departureDate);

            if (currentDate < prevDate) {
              setFieldErrors(prev => ({
                ...prev, 
                [`segment-${index}-transitDate`]: "Transit departure date must be after previous arrival"
              }));
            }
          }

          if (
            segment.departureDate &&
            previousSegment.departureDate &&
            segment.departureDate.toDateString() === previousSegment.departureDate.toDateString()
          ) {
            if (
              segment.departureTime && 
              previousSegment.arrivalTime &&
              !isTimeChronological(previousSegment.arrivalTime, segment.departureTime)
            ) {
              setFieldErrors(prev => ({
                ...prev, 
                [`segment-${index}-transitTime`]: "Transit departure time must be after previous arrival"
              }));
            }
          }
        }
      });

      return;
    }

    openModal();
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (
    departureTime: string,
    arrivalTime: string
  ): string => {
    if (!departureTime || !arrivalTime) return "";

    const [departureHour, departureMinute] = departureTime
      .split(":")
      .map(Number);
    const [arrivalHour, arrivalMinute] = arrivalTime.split(":").map(Number);

    let hourDiff = arrivalHour - departureHour;
    let minuteDiff = arrivalMinute - departureMinute;

    if (minuteDiff < 0) {
      hourDiff--;
      minuteDiff += 60;
    }

    if (hourDiff < 0) {
      hourDiff += 24;
    }

    return `${hourDiff} hr ${minuteDiff} min`;
  };

  const handleSaveFlights = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      closeModal();
      return;
    }

    try {
      console.log("Flights saved:", flightSegments);
      
      closeModal();
      
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        
        setDepartureCity("");
        setDestinationCity("");
        setDepartureCityCode("");
        setDestinationCityCode("");
        setTransitCities([]);
        setFlightSegments([]);
        setFieldErrors({});
      }, 3000);

    } catch (error) {
      console.error("Error saving flights:", error);
      closeModal();
    }
  };

  const getDestinationCities = () => {
    const excludedCities = [
      departureCity,
      ...transitCities.map((c) => c.name),
    ].filter(Boolean);

    return cities
      .map((group) => {
        const filteredCities = group.cities.filter(
          (city) =>
            (!destinationCity ||
              city.name.toLowerCase().includes(destinationCity.toLowerCase()) ||
              city.code
                .toLowerCase()
                .includes(destinationCity.toLowerCase())) &&
            !excludedCities.includes(city.name)
        );

        if (filteredCities.length === 0) return null;

        return (
          <div key={group.country}>
            <div className="sticky top-0 bg-[#ECEFF1] px-4 py-2 text-sm font-semibold text-[#1B3A4B]">
              {group.country}
            </div>
            {filteredCities.map((city) => (
              <div
                key={city.code}
                className="px-4 py-3 hover:bg-[#F5F7F8] cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                onClick={() => handleSelectDestination(city)}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-[#78909C] bg-[#ECEFF1] px-2 py-1 rounded">
                  {city.code}
                </span>
              </div>
            ))}
          </div>
        );
      })
      .filter(Boolean); 
  };

  const getDepartureCities = () => {
    const excludedCities = [
      destinationCity,
      ...transitCities.map((c) => c.name),
    ].filter(Boolean);

    return cities
      .map((group) => {
        const filteredCities = group.cities.filter(
          (city) =>
            (!departureCity ||
              city.name.toLowerCase().includes(departureCity.toLowerCase()) ||
              city.code.toLowerCase().includes(departureCity.toLowerCase())) &&
            !excludedCities.includes(city.name)
        );

        if (filteredCities.length === 0) return null;

        return (
          <div key={group.country}>
            <div className="sticky top-0 bg-[#ECEFF1] px-4 py-2 text-sm font-semibold text-[#1B3A4B]">
              {group.country}
            </div>
            {filteredCities.map((city) => (
              <div
                key={city.code}
                className="px-4 py-3 hover:bg-[#F5F7F8] cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                onClick={() => handleSelectDeparture(city)}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-[#78909C] bg-[#ECEFF1] px-2 py-1 rounded">
                  {city.code}
                </span>
              </div>
            ))}
          </div>
        );
      })
      .filter(Boolean);
  };

  const getTransitDropdownContent = () => {
    const excludedCities = [
      departureCity,
      destinationCity,
      ...transitCities.map((c) => c.name),
    ].filter(Boolean);

    return cities
      .map((group) => {
        const filteredCities = group.cities.filter(
          (city) => !excludedCities.includes(city.name)
        );

        if (filteredCities.length === 0) return null;

        return (
          <div key={group.country}>
            <div className="sticky top-0 bg-[#ECEFF1] px-4 py-2 text-sm font-semibold text-[#1B3A4B]">
              {group.country}
            </div>
            {filteredCities.map((city) => (
              <div
                key={city.code}
                className="px-4 py-3 hover:bg-[#F5F7F8] cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                onClick={() => handleAddTransit(city)}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-[#78909C] bg-[#ECEFF1] px-2 py-1 rounded">
                  {city.code}
                </span>
              </div>
            ))}
          </div>
        );
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const modes = flightSegments.map((_, index) => ({
      segmentIndex: index,
      mode: "new" as const,
    }));
    setSegmentModes(modes);
  }, [flightSegments.length]);

  const handleSegmentModeChange = (
    segmentIndex: number,
    mode: "new" | "existing"
  ) => {
    const updatedModes = segmentModes.map((item) =>
      item.segmentIndex === segmentIndex ? { ...item, mode } : item
    );
    setSegmentModes(updatedModes);
  };

  const getSegmentMode = (segmentIndex: number): "new" | "existing" => {
    const segmentMode = segmentModes.find(
      (item) => item.segmentIndex === segmentIndex
    );
    return segmentMode?.mode || "new";
  };

  const handleSelectExistingFlight = (segmentIndex: number, flight: Flight) => {
    setSelectedFlightIds({
      ...selectedFlightIds,
      [segmentIndex]: flight.id,
    });

    const updatedSegment = {
      ...flightSegments[segmentIndex],
      departureDate: new Date(flight.startDate),
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      meal: flight.meal as any,
      price: flight.price,
      aircraft: flight.aircraft,
      seat: flight.seat,
      frequency: flight.frequency,
    };

    const updatedSegments = [...flightSegments];
    updatedSegments[segmentIndex] = updatedSegment;
    setFlightSegments(updatedSegments);
  };

  const mealOptions = [
    { value: "No Meal", label: "No Meal" },
    { value: "Snack", label: "Snack" },
    { value: "Full Meal", label: "Full Meal" },
  ];
  const aircraftOptions = [
    { value: "Boeing 737-700", label: "Boeing 737-700" },
    { value: "Airbus A320", label: "Airbus A320" },
    { value: "Boeing 737-800", label: "Boeing 737-800" },
    { value: "Airbus A321", label: "Airbus A321" },
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
  ];

  useEffect(() => {
    if (showSuccessModal) {
      successModalRef.current?.showModal();
    } else {
      successModalRef.current?.close();
    }
  }, [showSuccessModal]);

  return (
    <div className="min-h-screen bg-white">
      <div
        className="w-full bg-cover bg-center mb-10"
        style={{
          backgroundImage: `url(${plane})`,
          position: "relative",
        }}
      >
        <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
        <div className="flex justify-between items-center px-4 sm:px-8 relative z-10">
          <h1 className="text-2xl mt-10 font-bold text-white">
            Add New Flight
          </h1>
        </div>
        <FlightRouteVisualization
          departureCity={departureCity}
          departureCityCode={departureCityCode}
          destinationCity={destinationCity}
          destinationCityCode={destinationCityCode}
          transitCities={transitCities}
          theme="dark"
          className="mb-5"
        />
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8 border border-gray-100">
              <h2 className="text-xl font-bold text-[#1B3A4B] mb-4 sm:mb-6 flex items-center">
                Select Flight Route
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                {/* Departure City */}
                <div
                  className={`flex-1 border border-[#B0BEC5] hover:border-[#455A64] ${fieldErrors["departureCity"] ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''} rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}
                  ref={departureDropdownRef}
                >
                  <label className="block text-xs font-medium text-[#455A64] mb-2 flex items-center">
                    Departure City
                  </label>
                  <div className="relative">
                    <div className="flex items-center transition-colors rounded-lg">
                      <input
                        className="text-base text-[#023047] w-full focus:outline-none bg-transparent"
                        value={departureCity}
                        onChange={(e) => {
                          setDepartureCity(e.target.value);
                          setShowDepartureDropdown(true);
                          // Clear departure city error
                          setFieldErrors(prev => {
                            const newErrors = {...prev};
                            delete newErrors["departureCity"];
                            return newErrors;
                          });
                        }}
                        onClick={() => setShowDepartureDropdown(true)}
                        placeholder="Select departure city"
                      />
                    </div>

                    {showDepartureDropdown && (
                      <div className="absolute z-50 w-full bg-white border border-[#B0BEC5] rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {getDepartureCities()}
                      </div>
                    )}
                  </div>
                  {fieldErrors["departureCity"] && (
                    <div className="text-red-500 text-sm mt-1">
                      {fieldErrors["departureCity"]}
                    </div>
                  )}
                </div>

                <div
                  className={`flex-1 border border-[#B0BEC5] hover:border-[#455A64] ${fieldErrors["destinationCity"] ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''} rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}
                  ref={destinationDropdownRef}
                >
                  <label className="block text-xs font-medium text-[#455A64] mb-2 flex items-center">
                    Destination City
                  </label>
                  <div className="relative">
                    <div className="flex items-center transition-colors rounded-lg">
                      <input
                        className="text-base text-[#023047] w-full focus:outline-none bg-transparent"
                        value={destinationCity}
                        onChange={(e) => {
                          setDestinationCity(e.target.value);
                          setShowDestinationDropdown(true);
                          setFieldErrors(prev => {
                            const newErrors = {...prev};
                            delete newErrors["destinationCity"];
                            return newErrors;
                          });
                        }}
                        onClick={() => setShowDestinationDropdown(true)}
                        placeholder="Select destination city"
                      />
                    </div>

                    {showDestinationDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-[#B0BEC5] rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {getDestinationCities()}
                      </div>
                    )}
                  </div>
                  {fieldErrors["destinationCity"] && (
                    <div className="text-red-500 text-sm mt-1">
                      {fieldErrors["destinationCity"]}
                    </div>
                  )}
                </div>
              </div>

              {/* Transit Cities */}
              <div className="mb-4 rounded-lg">
                <h3 className="font-bold text-[#1B3A4B] text-xl mb-4">
                  Transit Cities
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {transitCities.map((city, index) => (
                    <div
                      key={city.code}
                      className="rounded-full px-4 py-2 flex items-center border border-[#455A64] bg-[#455A64] text-white"
                    >
                      <span className="font-medium text-white">
                        {city.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTransit(index)}
                        className="ml-2 text-[#455A64] hover:text-[#1B3A4B] w-5 h-5 rounded-full bg-[#ECEFF1] flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                      </button>
                    </div>
                  ))}

                  {transitCities.length < 2 && (
                    <div className="relative" ref={transitDropdownRef}>
                      <button
                        type="button"
                        onClick={() =>
                          setShowTransitDropdown(!showTransitDropdown)
                        }
                        className="bg-white border-2 border-dashed border-[#B0BEC5] hover:border-[#1B3A4B] transition-colors rounded-full px-4 py-2 text-[#1B3A4B] font-medium flex items-center"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="mr-2 text-xs"
                        />
                        Add Transit
                      </button>

                      {showTransitDropdown && (
                        <div className="absolute z-50 mt-2 w-72 bg-white border border-[#B0BEC5] rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {getTransitDropdownContent()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#78909C] italic">
                  Adding transit cities will create multiple flight segments
                </p>
              </div>
            </div>

            {/* Flight Segments */}
            {flightSegments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8 border border-gray-100">
                <h2 className="text-xl font-bold text-[#1B3A4B] flex items-center">
                  Flight Details
                </h2>

                {flightSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="py-2 mb-8 bg-white transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row justify-start items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
                      <div className="flex items-center justify-between p-2 sm:p-4">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="font-medium text-lg text-[#1B3A4B]">
                              {segment.fromCity}
                            </p>
                            <p className="text-xs text-[#78909C]">
                              {segment.fromCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="block md:hidden text-center my-2">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-[#1B3A4B]"
                        />
                      </div>

                      <div className="hidden md:block">
                        <div className="relative">
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-[#1B3A4B]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-4">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="font-medium text-lg text-[#1B3A4B]">
                              {segment.toCity}
                            </p>
                            <p className="text-xs text-[#78909C]">
                              {segment.toCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {transitCities.length >= 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end p-2 sm:p-4 gap-2 sm:gap-4 w-full sm:w-auto">
                        <label className="flex items-center text-sm text-[#455A64] cursor-pointer hover:text-[#1B3A4B]">
                          <input
                            type="radio"
                            name={`flightOption-${index}`}
                            checked={getSegmentMode(index) === "new"}
                            onChange={() =>
                              handleSegmentModeChange(index, "new")
                            }
                            className="mr-2"
                          />
                          Add New Flight
                        </label>

                        <label className="flex items-center text-sm text-[#455A64] cursor-pointer hover:text-[#1B3A4B]">
                          <input
                            type="radio"
                            name={`flightOption-${index}`}
                            checked={getSegmentMode(index) === "existing"}
                            onChange={() =>
                              handleSegmentModeChange(index, "existing")
                            }
                            className="mr-2"
                          />
                          Choose Existing Flight
                        </label>
                      </div>
                      )}
                    </div>

                    {getSegmentMode(index) === "new" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Departure Date */}
                        <div>
                          <div className="relative">
                            <div className={`flex-1 border ${fieldErrors[`segment-${index}-departureDate`] || fieldErrors[`segment-${index}-transitDate`]
                              ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                              : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                              rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                              <div className="flex-grow">
                                <label className="block text-sm font-medium text-[#455A64] mb-2 flex items-center">
                                  <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="text-[#1B3A4B] mr-2"
                                  />
                                  Departure Date
                                </label>
                                <DatePicker
                                  selected={segment.departureDate}
                                  onChange={(date) => {
                                    handleSegmentChange(
                                      index,
                                      "departureDate",
                                      date
                                    );
                                  }}
                                  dateFormat="MMMM d, yyyy"
                                  minDate={new Date()}
                                  className="px-3 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                                  placeholderText="Select date"
                                  wrapperClassName="w-full"
                                  popperClassName="calendar-popper"
                                  calendarClassName="custom-calendar"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Price */}
                        <div>
                          <div className="relative">
                            <div className={`flex-1 border ${fieldErrors[`segment-${index}-price`]
                              ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                              : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                              rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                              <div className="flex-grow">
                                <label className="block text-sm font-medium text-[#455A64] mb-2 flex items-center">
                                  Price
                                </label>
                                <div className="relative px-3">
                                  <span className="absolute pl-3 inset-y-0 left-0 flex items-center text-[#455A64]">
                                    $
                                  </span>
                                  <input
                                    type="number"
                                    min="10"
                                    step="1"
                                    className="text-base text-[#023047] w-full focus:outline-none bg-transparent pl-4"
                                    value={segment.price || ""}
                                    onChange={(e) => {
                                      handleSegmentChange(
                                        index,
                                        "price",
                                        parseInt(e.target.value) || 0
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Departure Time */}
                        <div>
                          <div className="relative">
                            <div className={`flex-1 border ${fieldErrors[`segment-${index}-departureTime`] || fieldErrors[`segment-${index}-timeOrder`] || fieldErrors[`segment-${index}-transitTime`] 
                              ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                              : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                              rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                              <div className="flex-grow">
                                <label className="block text-sm font-medium text-[#455A64] mb-2 flex items-center">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-[#1B3A4B] mr-2"
                                  />
                                  Departure Time
                                </label>
                                <TimePickerComponent 
                                  value={segment.departureTime}
                                  onChange={(time: string) => {
                                    handleSegmentChange(
                                      index,
                                      "departureTime",
                                      time
                                    );
                                    setFieldErrors(prev => {
                                      const newErrors = {...prev};
                                      delete newErrors[`segment-${index}-departureTime`];
                                      delete newErrors[`segment-${index}-timeOrder`];
                                      delete newErrors[`segment-${index}-transitTime`];
                                      return newErrors;
                                    });
                                  }}
                                  className="text-base text-[#023047] w-full focus:outline-none bg-transparent"
                                />
                              </div>
                            </div>
                            {(fieldErrors[`segment-${index}-departureTime`] || fieldErrors[`segment-${index}-timeOrder`] || fieldErrors[`segment-${index}-transitTime`]) && (
                              <div className="text-red-800 text-sm mt-1 ml-1">
                                {fieldErrors[`segment-${index}-departureTime`] || 
                                 fieldErrors[`segment-${index}-timeOrder`] || 
                                 fieldErrors[`segment-${index}-transitTime`]}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Arrival Time */}
                        <div>
                          <div className="relative">
                            <div className={`flex-1 border ${fieldErrors[`segment-${index}-arrivalTime`] || fieldErrors[`segment-${index}-timeOrder`]
                              ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                              : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                              rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                              <div className="flex-grow">
                                <label className="block text-sm font-medium text-[#455A64] mb-2 flex items-center">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="text-[#1B3A4B] mr-2"
                                  />
                                  Arrival Time
                                </label>
                                <TimePickerComponent 
                                  value={segment.arrivalTime || "00:00"}
                                  onChange={(time: string) => {
                                    handleSegmentChange(
                                      index,
                                      "arrivalTime",
                                      time
                                    );
                                  }}
                                  className="text-base text-[#023047] w-full focus:outline-none bg-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Meal */}
                        <div>
                          <div className="relative">
                            <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                              <div className="flex-grow">
                                <SelectComponent
                                  label="Meal Service"
                                  options={mealOptions}
                                  value={segment.meal}
                                  onChange={(value) =>
                                    handleSegmentChange(
                                      index,
                                      "meal",
                                      value as "No Meal" | "Snack" | "Full Meal"
                                    )
                                  }
                                  className="focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="relative">
                            <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                              <div className="flex-grow">
                                <SelectComponent
                                  label="Aircraft"
                                  options={aircraftOptions}
                                  value={segment.aircraft}
                                  onChange={(value) =>
                                    handleSegmentChange(
                                      index,
                                      "aircraft",
                                      value as "Boeing 737-700" | "Airbus A320" | "Boeing 737-800" | "Airbus A321" | "Boeing 777-200" | "Airbus A330-200"
                                    )
                                  }
                                  className="focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Frequency */}
                        <div>
                          <div className="relative">
                            <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                              <div className="flex-grow">
                                <SelectComponent
                                  label="Frequency"
                                  options={frequencyOptions}
                                  value={segment.frequency}
                                  onChange={(value) =>
                                    handleSegmentChange(
                                      index,
                                      "frequency",
                                      value as "daily" | "weekly"
                                    )
                                  }
                                  className="focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {getSegmentMode(index) === "existing" && (
                      <div className="grid grid-cols-1 gap-6 mb-6 border-t border-[#ECEFF1] pt-4 mt-2">
                        <div className="col-span-1">
                          <div className="mb-4">
                            <h3 className="text-[#1B3A4B] font-medium">
                              Available flights from {segment.fromCity} to{" "}
                              {segment.toCity}:
                            </h3>
                          </div>

                          <div className="space-y-3 max-h-60 overflow-y-auto px-2">
                            {flights.filter(
                              (flight) =>
                                flight.departureCity === segment.fromCity &&
                                flight.arrivalCity === segment.toCity &&
                                flight.status === "active"
                            ).length > 0 ? (
                              <>
                                {flights
                                  .filter(
                                    (flight) =>
                                      flight.departureCity ===
                                        segment.fromCity &&
                                      flight.arrivalCity === segment.toCity &&
                                      flight.status === "active"
                                  )
                                  .map((flight) => (
                                    <div
                                      key={flight.id}
                                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                        selectedFlightIds[index] === flight.id
                                          ? "border-[#1B3A4B] bg-[#F5F7F8] shadow-md"
                                          : "border-[#B0BEC5] hover:border-[#1B3A4B] hover:bg-[#F5F7F8]"
                                      }`}
                                      onClick={() =>
                                        handleSelectExistingFlight(
                                          index,
                                          flight
                                        )
                                      }
                                    >
                                      <div className="flex justify-between items-center">
                                        <div>
                                          
                                          <span className="text-sm text-[#78909C] ml-2">
                                            ({flight.flightNumber})
                                          </span>
                                        </div>
                                        <div className="text-sm text-[#78909C]">
                                          {flight.departureTime} -{" "}
                                          {flight.arrivalTime}
                                        </div>
                                      </div>
                                      <div className="mt-2 flex justify-between">
                                        <div className="text-sm">
                                          <span className="text-[#455A64]">
                                            {flight.startDate}
                                          </span>
                                          <span className="mx-2">•</span>
                                          <span className="text-[#455A64]">
                                            {flight.duration}
                                          </span>
                                        </div>
                                        <div className="text-[#1B3A4B] font-medium">
                                          ${flight.price}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </>
                            ) : (
                              <div className="p-6 text-center bg-[#F5F7F8] rounded-lg">
                                <p className="text-[#78909C]">
                                  No existing flights found between{" "}
                                  {segment.fromCity} and {segment.toCity}.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto text-[#455A64] bg-white border-2 border-[#455A64] px-6 py-3 rounded-lg hover:bg-[#ECEFF1] transition-colors"
              >
                Cancel
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={openModal}
                  className="w-full sm:w-auto text-[#455A64] bg-white border-2 border-[#455A64] px-6 py-3 rounded-lg hover:bg-[#ECEFF1] transition-colors"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#1B3A4B] text-white px-6 py-3 rounded-lg hover:bg-[#0D1B2A] transition-colors"
                >
                  Add Flight
                </button>
              </div>
            </div>
          </form>

          <FlightSummaryModal
            isOpen={showSummaryModal}
            onClose={closeModal}
            onConfirm={handleSaveFlights}
            flightSegments={flightSegments}
            departureCity={departureCity}
            departureCityCode={departureCityCode}
            destinationCity={destinationCity}
            destinationCityCode={destinationCityCode}
            transitCities={transitCities}
            formatDate={formatDate}
            calculateDuration={calculateDuration}
          />
          
          {/* Modal de succes */}
          <dialog ref={successModalRef} className="modal">
            <div className="modal-box max-w-md p-0 bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className="p-8">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#ECEFF1] mb-6">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="h-10 w-10 text-[#1B3A4B]"
                    />
                  </div>
                  <h3 className="text-2xl leading-6 font-bold text-[#1B3A4B] mb-3">Flight Added Successfully</h3>
                  <div className="h-0.5 w-20 bg-[#1B3A4B] mx-auto mb-6"></div>
                  <p className="text-md text-[#455A64] mb-4">
                    A new flight has been added to the system and is now available for booking.
                  </p>
                </div>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default AddFlight;