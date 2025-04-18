import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCalendarAlt, faPlaneDeparture, faPlaneArrival, faUsers } from "@fortawesome/free-solid-svg-icons";
import flights from "../assets/flights";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownListComponent from "./DropdownListComponent";

type City = {
  name: string;
  code: string;
};

type CityGroup = {
  country: string;
  cities: City[];
};

type FlightSearchProps = {
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  setPassengers: (value: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
  isFromSelected: boolean;
  setIsFromSelected: (value: boolean) => void;
  isToSelected: boolean;
  setIsToSelected: (value: boolean) => void;
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  departureDate: string;
  setDepartureDate: (value: string) => void;
  cities: CityGroup[];
  onSearch: () => void;
};
const FlightSearchComponent: React.FC<FlightSearchProps> = ({
  passengers,
  setPassengers,
  isFromSelected,
  setIsFromSelected,
  isToSelected,
  setIsToSelected,
  from,
  setFrom,
  to,
  setTo,
  departureDate,
  setDepartureDate,
  cities,
  onSearch,
}) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [filteredCities, setFilteredCities] = useState<CityGroup[]>([]);

  const filterFromCities = (input: string) => {
    if (!input) return cities;
    return cities
      .map((group) => ({
        ...group,
        cities: group.cities.filter(
          (city) =>
            city.name.toLowerCase().includes(input.toLowerCase()) ||
            city.code.toLowerCase().includes(input.toLowerCase())
        ),
      }))
      .filter((group) => group.cities.length > 0);
  };

  const filterToCities = (input: string) => {
    if (!input) return filteredCities;
    return filteredCities
      .map((group) => ({
        ...group,
        cities: group.cities.filter(
          (city) =>
            city.name.toLowerCase().includes(input.toLowerCase()) ||
            city.code.toLowerCase().includes(input.toLowerCase())
        ),
      }))
      .filter((group) => group.cities.length > 0);
  };

  useEffect(() => {
    if (!from) {
      setFilteredCities([{ country: "No City", cities: [] }]);
      return;
    }
    const destinations = flights
      .filter((flight) => flight.departureCity === from)
      .map((flight) => flight.arrivalCode);
    const newFilteredCities = cities
      .map((group) => ({
        ...group,
        cities: group.cities.filter((city) => destinations.includes(city.code)),
      }))
      .filter((group) => group.cities.length > 0);
    setFilteredCities(
      newFilteredCities.length > 0
        ? newFilteredCities
        : [{ country: "No City", cities: [] }]
    );
  }, [from]);

  const filteredFromCities = filterFromCities(from);
  const filteredToCities = filterToCities(to);

  const handleSelectFrom = (city: City) => {
    setFrom(city.name);
    setShowFromDropdown(false);
    setIsFromSelected(true);
  };

  const handleSelectTo = (city: City) => {
    setTo(city.name);
    setShowToDropdown(false);
    setIsToSelected(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromDropdown(false);
        if (!isFromSelected) setFrom("");
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToDropdown(false);
        if (!isToSelected) setTo("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFromSelected, isToSelected]);

  const isDisabled = !from || !to || !departureDate;

  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(passengers.adults);
  const [children, setChildren] = useState(passengers.children);
  const [infants, setInfants] = useState(passengers.infants);   

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPassengersText = () => {
    let text = [];
    if (adults > 0) text.push(`${adults} ${adults === 1 ? "adult" : "adults"}`);
    if (children > 0)
      text.push(`${children} ${children === 1 ? "children" : "childrens"}`);
    if (infants > 0)
      text.push(`${infants} ${infants === 1 ? "baby" : "babies"}`);
    return text.join(" ");
  };

  const increaseCount = (type: string) => {
    if (type === "adults") {
      setAdults(adults + 1);
      setPassengers({ ...passengers, adults: adults + 1 });
    }
    if (type === "children") {
      setChildren(children + 1);
      setPassengers({ ...passengers, children: children + 1 });
    }
    if (type === "infants") {
      setInfants(infants + 1);
      setPassengers({ ...passengers, infants: infants + 1 });
    }
  };

  const decreaseCount = (type: string) => {
    if (type === "adults" && adults > 1) {
      setAdults(adults - 1);
      setPassengers({ ...passengers, adults: adults - 1 });
    }
    if (type === "children" && children > 0) {
      setChildren(children - 1);
      setPassengers({ ...passengers, children: children - 1 });
    }
    if (type === "infants" && infants > 0) {
      setInfants(infants - 1);
      setPassengers({ ...passengers, infants: infants - 1 });
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    departureDate ? new Date(departureDate) : null
  );
  
  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDepartureDate(formattedDate);
    }
  }, [selectedDate, setDepartureDate]);

  return (
    <div className="m-4 md:m-10 shadow-lg rounded-xl p-4 md:p-6 bg-white">
      <div className="p-5 rounded-xl flex flex-col xl:flex-row items-start xl:items-stretch justify-between space-y-5 xl:space-y-0 xl:space-x-3 shadow-sm border border-[#B0BEC5]">
        {/* From */}
        <div className="w-full md:flex-1 relative border border-[#B0BEC5] hover:border-[#455A64] transition-colors rounded-lg p-3 bg-white" ref={fromRef}>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPlaneDeparture} className="text-[#023047] mr-3" />
            <div className="flex-grow">
              <p className="text-xs font-medium text-[#1B3A4B]">Departure city</p>
              <input
                className="text-base text-[#023047] w-full min-w-[190px] focus:outline-none bg-transparent"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFromDropdown(true);
                  setIsFromSelected(false);
                }}
                onFocus={() => setShowFromDropdown(true)}
                placeholder="Select city"
              />
            </div>
          </div>
          {showFromDropdown && (
            <DropdownListComponent
              cities={filteredFromCities}
              onSelect={handleSelectFrom}
            />
          )}
        </div>
        {/* To */}
        <div className="w-full md:flex-1 relative border border-[#B0BEC5] hover:border-[#455A64] transition-colors rounded-lg p-3 bg-white" ref={toRef}>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPlaneArrival} className="text-[#023047] mr-3" />
            <div className="flex-grow">
              <p className="text-xs font-medium text-[#1B3A4B]">Arrival city</p>
              <input
                className="text-base text-[#023047] w-full min-w-[190px] focus:outline-none bg-transparent"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowToDropdown(true);
                  setIsToSelected(false);
                }}
                onFocus={() => setShowToDropdown(true)}
                placeholder="Select city"
              />
            </div>
          </div>
          {showToDropdown && (
            <DropdownListComponent 
              cities={filteredToCities} 
              onSelect={handleSelectTo} 
            />
          )}
        </div>
        {/* Departure Date */}
        <div className="w-full md:flex-1 relative border border-[#B0BEC5] hover:border-[#455A64] transition-colors rounded-lg p-3 bg-white">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-[#023047] mr-3" />
            <div className="flex-grow">
              <p className="text-xs font-medium text-[#1B3A4B]">Departure date</p>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                className="text-base text-[#023047] w-full min-w-[190px] focus:outline-none bg-transparent cursor-pointer"
                placeholderText="Select date"
                wrapperClassName="w-full"
                popperClassName="calendar-popper"
                calendarClassName="custom-calendar"
                minDate={new Date()}
              />
            </div>
          </div>
        </div>
        {/* Passengers (Pasageri) */}
        <div className="w-full md:flex-1 md:flex-shrink-0">
          <div className="relative border border-[#B0BEC5] hover:border-[#455A64] transition-colors rounded-lg p-3 bg-white" ref={dropdownRef}>
            <div
              className="cursor-pointer min-w-[190px] flex items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FontAwesomeIcon icon={faUsers} className="text-[#023047] mr-3" />
              <div>
                <p className="text-xs font-medium text-[#1B3A4B]">Passengers</p>
                <p className="text-base text-[#023047]">{getPassengersText()}</p>
              </div>
            </div>

            {isOpen && (
              <div className="absolute left-0 right-0 mt-3 bg-white rounded-lg shadow-xl border border-[#B0BEC5] z-10 mt-2">
                <div className="p-4">
                  {/* Adults */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-semibold text-[#023047]">Adults</h3>
                      <p className="text-sm text-[#455A64]">14+ years</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECEFF1] text-[#023047] disabled:opacity-50 disabled:bg-gray-50 disabled:text-[#B0BEC5]"
                        onClick={() => decreaseCount("adults")}
                        disabled={adults <= 1}
                      >
                        <span className="text-lg font-bold">
                          -
                        </span>
                      </button>
                      <span className="w-6 text-center font-medium text-[#023047]">{adults}</span>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECEFF1] text-[#023047] hover:bg-[#B0BEC5]"
                        onClick={() => increaseCount("adults")}
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-base font-semibold text-[#023047]">Children</h3>
                      <p className="text-sm text-[#455A64]">2-14 years</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECEFF1] text-[#023047] disabled:opacity-50 disabled:bg-gray-50 disabled:text-[#B0BEC5]"
                        onClick={() => decreaseCount("children")}
                        disabled={children <= 0}
                      >
                        <span className="text-lg font-bold">
                          -
                        </span>
                      </button>
                      <span className="w-6 text-center font-medium text-[#023047]">{children}</span>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECEFF1] text-[#023047] hover:bg-[#B0BEC5]"
                        onClick={() => increaseCount("children")}
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold text-[#023047]">Babies</h3>
                      <p className="text-sm text-[#455A64]">0-2 years</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECEFF1] text-[#023047] disabled:opacity-50 disabled:bg-gray-50 disabled:text-[#B0BEC5]"
                        onClick={() => decreaseCount("infants")}
                        disabled={infants <= 0}
                      >
                        <span className="text-lg font-bold">
                          -
                        </span>
                      </button>
                      <span className="w-6 text-center font-medium text-[#023047]">{infants}</span>
                      <button
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECEFF1] text-[#023047] hover:bg-[#B0BEC5]"
                        onClick={() => increaseCount("infants")}
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Search Button */}
        <button
          className={`w-auto flex items-center justify-center p-3 rounded-lg mt-4 md:mt-0 ${
            isDisabled ? "text-[#B0BEC5]" : "text-[#1B3A4B]"
          } font-medium`}
          onClick={onSearch}
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
};
export default FlightSearchComponent;