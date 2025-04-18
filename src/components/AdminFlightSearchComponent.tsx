import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCalendarAlt, faPlaneDeparture, faPlaneArrival} from "@fortawesome/free-solid-svg-icons";
import { flights, Flight } from "../assets/flights";
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
  setFilteredFlights: (flights: Flight[]) => void;
};

const AdminFlightSearchComponent: React.FC<FlightSearchProps> = ({
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
  setFilteredFlights
}) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [filteredCities, setFilteredCities] = useState<CityGroup[]>([]);

  // Add state for DatePicker
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    departureDate ? new Date(departureDate) : null
  );

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

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setDepartureDate(formattedDate);
    }
  }, [selectedDate, setDepartureDate]);

  const isDisabled = !from || !to || !departureDate;

  const handleSearch = () => {
    onSearch();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Container */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-full p-4 sm:p-5 shadow-lg">
        {/* Mobile Title - visible only on small screens */}
        <h2 className="text-white text-lg font-semibold mb-4 md:hidden">
          Search Flights
        </h2>
        
        {/* Search Fields Container */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-3">
          {/* From */}
          <div 
            className="relative flex-1 min-w-0" 
            ref={fromRef}
          >
            <div className="border border-white/20 hover:border-white/40 transition-colors rounded-xl md:rounded-full p-3 bg-white/10 backdrop-blur-md">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPlaneDeparture} className="text-white text-lg mr-3" />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium text-white/80">Departure city</p>
                  <input
                    className="text-base text-white w-full min-w-0 focus:outline-none bg-transparent placeholder-white/60"
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
            </div>
            {showFromDropdown && (
              <div className="absolute top-12 left-0 right-0 z-20">
                <DropdownListComponent
                  cities={filteredFromCities}
                  onSelect={handleSelectFrom}
                />
              </div>
            )}
          </div>
          
          {/* To */}
          <div 
            className="relative flex-1 min-w-0" 
            ref={toRef}
          >
            <div className="border border-white/20 hover:border-white/40 transition-colors rounded-xl md:rounded-full p-3 bg-white/10 backdrop-blur-md">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPlaneArrival} className="text-white text-lg mr-3" />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium text-white/80">Arrival city</p>
                  <input
                    className="text-base text-white w-full min-w-0 focus:outline-none bg-transparent placeholder-white/60"
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
            </div>
            {showToDropdown && (
              <div className="absolute top-12 left-0 right-0 z-20">
                <DropdownListComponent
                  cities={filteredToCities}
                  onSelect={handleSelectTo}
                />
              </div>
            )}
          </div>
          
          {/* Departure Date */}
          <div className="relative flex-1 min-w-0">
            <div className="border border-white/20 hover:border-white/40 transition-colors rounded-xl md:rounded-full p-3 bg-white/10 backdrop-blur-md">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-lg mr-3" />
                <div className="flex-grow min-w-0">
                  <p className="text-xs font-medium text-white/80">Departure date</p>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="text-base text-white w-full min-w-0 focus:outline-none bg-transparent cursor-pointer placeholder-white/60"
                    placeholderText="Select date"
                    wrapperClassName="w-full"
                    popperClassName="calendar-popper z-30"
                    calendarClassName="custom-calendar"
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Search Button */}
          <div className="flex-none">
            <button
              className={`w-full md:w-auto px-6 py-3 rounded-xl md:rounded-full 
              ${
                isDisabled
                  ? "bg-white/20 cursor-not-allowed text-white/50"
                  : "bg-white cursor-pointer text-[#0D1B2A] hover:bg-white/90 transition-colors"
              } font-medium text-center flex items-center justify-center`}
              onClick={handleSearch}
              disabled={isDisabled}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFlightSearchComponent;