import React, { useState, useEffect } from "react";
import { useLocation  } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import FlightCardComponent from "../components/FlightCardComponent";
import SidebarFlightFiltersComponent from "../components/SidebarFlightFiltersComponent";
import FlightSearchComponent from "../components/FlightSearchComponent";
import SelectComponent from "../components/SelectComponent";
import cities from "../assets/cities";
import plane from "../assets/images/plane2.jpg";
import flights from "../assets/flights";
import NavigationBarComponent from "../components/NavigationBarComponent";

const FlightSchedule: React.FC = () => {
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);
  const toggleFilters = (): void => {
    setFiltersVisible(!filtersVisible);
  };
  const [selectedTransits, setSelectedTransits] = useState({
    direct: true,
    oneTransit: true,
    twoPlusTransits: true,
  });
  const [priceRange, setPriceRange] = useState({ min: 50, max: 1000 });
  const [filter, setFilter] = useState("Cheapest");
  
  const initialFlights = flights.map(flight => {
    const flightCopy = JSON.parse(JSON.stringify(flight));
    flightCopy.startDate = '';
    return flightCopy;
  });
  
  const [filteredFlights, setFilteredFlights] = useState(initialFlights);
  
  const location = useLocation();
  const searchParams = location.state || {};
  const [from, setFrom] = useState(searchParams.from || "");
  const [to, setTo] = useState(searchParams.to || "");
  const [departureDate, setDepartureDate] = useState(searchParams.departureDate || "");
  const [passengers, setPassengers] = useState(searchParams.passengers || {
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [isFromSelected, setIsFromSelected] = useState(searchParams.isFromSelected || false);
  const [isToSelected, setIsToSelected] = useState(searchParams.isToSelected || false);
  
  const [searchResults, setSearchResults] = useState(initialFlights);
  
  useEffect(() => {
    if (filter === "Cheapest") {
      setFilteredFlights(
        [...filteredFlights].sort((a, b) => a.price - b.price)
      );
    } else if (filter === "Earliest") {
      setFilteredFlights(
        [...filteredFlights].sort((a, b) =>
          a.departureTime.localeCompare(b.departureTime)
        )
      );
    }
  }, [filter]);
  
  useEffect(() => {
    if (location.state && location.state.passengers) {
      setPassengers(location.state.passengers);
    }
  }, [location.state]);
  
  useEffect(() => {
    const filtered = searchResults.filter(
      (flight) =>
        (selectedTransits.direct && flight.transits.length === 0) ||
        (selectedTransits.oneTransit && (flight.transits.length -1)=== 1) ||
        (selectedTransits.twoPlusTransits && (flight.transits.length -1)>= 2)
    ).filter(
      (flight) =>
        flight.price >= priceRange.min && flight.price <= priceRange.max
    );
    
    let sortedResults;
    if (filter === "Cheapest") {
      sortedResults = [...filtered].sort((a, b) => a.price - b.price);
    } else if (filter === "Earliest") {
      sortedResults = [...filtered].sort((a, b) =>
        a.departureTime.localeCompare(b.departureTime)
      );
    } else {
      sortedResults = filtered;
    }
    
    setFilteredFlights(sortedResults);
  }, [selectedTransits, priceRange, filter, searchResults]);
  
  const filterFlights = () => {
    const filteredByBase = flights.filter((flight) => {
      const matchesFrom = from ? flight.departureCity === from : true;
      const matchesTo = to ? flight.arrivalCity === to : true;
      
      let matchesDate = true;
      if (departureDate) {
        if (flight.startDate === departureDate) {
          matchesDate = true;
        } else {
          const dateParts = flight.startDate.split('-');
          const searchDateParts = departureDate.split('-');
          
          if (dateParts.length === 3 && searchDateParts.length === 3) {
            const flightDate = new Date(Date.UTC(
              parseInt(dateParts[0]), 
              parseInt(dateParts[1]) - 1, 
              parseInt(dateParts[2])
            ));
            
            const searchDate = new Date(Date.UTC(
              parseInt(searchDateParts[0]), 
              parseInt(searchDateParts[1]) - 1, 
              parseInt(searchDateParts[2])
            ));
            
            if (flight.frequency === "daily") {
              matchesDate = searchDate >= flightDate;
            } else if (flight.frequency === "weekly") {
              matchesDate = searchDate >= flightDate && 
                         searchDate.getDay() === flightDate.getDay();
            }
          }
        }
      }
      
      return matchesFrom && matchesTo && matchesDate;
    });
    
    const modifiedFlights = filteredByBase.map(flight => {
      const modifiedFlight = JSON.parse(JSON.stringify(flight));
      
      if (departureDate && departureDate.trim() !== '') {
        modifiedFlight.departureDate = departureDate;
        modifiedFlight.startDate = departureDate;    
      } else {
        modifiedFlight.startDate = '';
      }
      
      return modifiedFlight;
    });
    
    setSearchResults(modifiedFlights);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBarComponent />
      <div className="w-full relative">
        <div className="absolute inset-0 z-0">
          <img 
            src={plane} 
            alt="Background" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
        </div>
        <div className="relative py-6">
          <p className="px-4 md:ml-10 text-xl md:text-2xl font-bold mt-4 mb-2 text-white">Flights Schedule</p>
          <div className="mx-2 md:mx-4">
            <FlightSearchComponent
              passengers={passengers}
              setPassengers={setPassengers}
              isFromSelected={isFromSelected}
              setIsFromSelected={setIsFromSelected}
              isToSelected={isToSelected}
              setIsToSelected={setIsToSelected}
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              cities={cities}
              onSearch={filterFlights}
            />
          </div>
        </div>
      </div>
      <div className="w-full px-10 mb-10 md:mb-20 flex-grow bg-white">
        <div className="flex flex-col gap-4">
          {/* Layout container */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:hidden w-full py-4 bg-white z-10 border-b border-[#B0BEC5]">
              <button
                onClick={toggleFilters}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-[#455A64] bg-white hover:bg-[#ECEFF1] border border-[#B0BEC5] rounded-md transition-colors duration-200 w-full"
              >
                {filtersVisible ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-[#1B3A4B]"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span>Hide Filters</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-[#1B3A4B]"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    <span>Show Filters</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Sidebar Filters */}
            {filtersVisible && (
              <div className="lg:w-1/4 flex-shrink-0">
                <SidebarFlightFiltersComponent
                  selectedTransits={selectedTransits}
                  setSelectedTransits={setSelectedTransits}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            )}
            
            {/* Flight Results */}
            <div className="flex-grow">
              <div className="hidden lg:block mb-4">
                <button
                  onClick={toggleFilters}
                  className="inline-flex items-center pt-10 px-3 py-2 text-sm font-medium text-[#455A64] hover:text-[#1B3A4B] transition-colors duration-200"
                >
                  {filtersVisible ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1.5 text-[#1B3A4B]"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      <span>Hide Filters</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1.5 text-[#1B3A4B]"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      <span>Show Filters</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="overflow-y-auto custom-scrollbar">
                {/* Sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-lg p-2 sm:p-4 font-medium text-[#1B3A4B]">
                    Flights List{" "}
                    <span className="text-[#455A64] text-sm">
                      ({filteredFlights.length} results)
                    </span>
                  </h2>
                  <div className="flex items-center space-x-2 pl-2 sm:pl-0 sm:space-x-4">
                    <SelectComponent
                      options={[
                        { value: "Cheapest", label: "Cheapest" },
                        { value: "Earliest", label: "Earliest" }
                      ]}
                      value={filter}
                      onChange={(value) => setFilter(value)}
                      className="p-2 text-sm focus:outline-none focus:ring-0 mr-2 sm:mr-4 bg-transparent"
                    />
                  </div>
                </div>
                
                {/* Flight Cards */}
                <div className="flex flex-col space-y-6 py-6 px-4">
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight) => (
                      <FlightCardComponent
                        key={`${flight.id}-${JSON.stringify(passengers)}`} 
                        flight={flight} 
                        passengersData={passengers}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#455A64]">
                      No flights found matching your criteria. Try adjusting your filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};
export default FlightSchedule;