import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarFlightFiltersComponent from "../components/SidebarFlightFiltersComponent";
import plane from "../assets/images/plane2.jpg";
import { flights, Flight } from "../assets/flights";
import cities from "../assets/cities";
import AdminFlightSearchComponent from "../components/AdminFlightSearchComponent";
import AdminFlightCardComponent from "../components/AdminFlightCardComponent";
import SelectComponent from "../components/SelectComponent";

const AdminSchedules: React.FC = () => {
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
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(flights);
  const navigate = useNavigate();

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

  const location = useLocation();
  const searchParams = location.state || {};
  const [from, setFrom] = useState(searchParams.from || "");
  const [to, setTo] = useState(searchParams.to || "");
  const [departureDate, setDepartureDate] = useState(
    searchParams.departureDate || ""
  );

  const [isFromSelected, setIsFromSelected] = useState(
    searchParams.isFromSelected || false
  );
  const [isToSelected, setIsToSelected] = useState(
    searchParams.isToSelected || false
  );

  const [baseFilteredFlights, setBaseFilteredFlights] = useState<Flight[]>(flights);

  const applySecondaryFilters = (flights: Flight[]) => {
    const transitFiltered = flights.filter(
      (flight) =>
        (selectedTransits.direct && flight.transits.length === 0) ||
        (selectedTransits.oneTransit && (flight.transits.length -1) === 1) ||
        (selectedTransits.twoPlusTransits && (flight.transits.length -1) >= 2)
    );

    const priceFiltered = transitFiltered.filter(
      (flight) =>
        flight.price >= priceRange.min && flight.price <= priceRange.max
    );

    if (filter === "Cheapest") {
      return [...priceFiltered].sort((a, b) => a.price - b.price);
    } else if (filter === "Earliest") {
      return [...priceFiltered].sort((a, b) =>
        a.departureTime.localeCompare(b.departureTime)
      );
    }

    return priceFiltered;
  };

  useEffect(() => {
    const filteredResults = applySecondaryFilters(baseFilteredFlights);
    setFilteredFlights(filteredResults);
  }, [selectedTransits, priceRange, filter, baseFilteredFlights]);

  const filterFlights = () => {
    console.log("Search triggered with:", { from, to, departureDate });
    
    if (!from && !to && !departureDate) {
      setBaseFilteredFlights(flights);
      return;
    }
    
    const filtered = flights.filter((flight) => {
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
    
    const flightsWithUpdatedDates = filtered.map(flight => {
      if (flight.startDate !== departureDate && departureDate) {
        return {
          ...flight,
          originalDepartureDate: flight.startDate,
          departureDate: departureDate
        };
      }
      return flight;
    });
    
    setBaseFilteredFlights(flightsWithUpdatedDates);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full relative">
        <div
          className="w-full bg-cover bg-center py-6"
          style={{
            backgroundImage: `url(${plane})`,
            position: "relative",
          }}
        >
          <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
          <div className="px-8 relative z-10">
            <h1 className="text-2xl font-bold text-white mb-4">
              Flights Schedule
            </h1>
            <div className="max-w-5xl mx-auto">
              <div className="p-2">
                <AdminFlightSearchComponent
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
                  setFilteredFlights={setFilteredFlights}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-10 flex-grow bg-white">
        <div className="flex flex-col gap-4">
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
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 px-4 gap-4">
                  <h2 className="text-lg font-medium text-[#1B3A4B]">
                    Flights List{" "}
                    <span className="text-sm font-normal text-gray-500">
                      ({filteredFlights.length} flights)
                    </span>
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <SelectComponent
                      options={[
                        { value: "Cheapest", label: "Cheapest" },
                        { value: "Earliest", label: "Earliest" }
                      ]}
                      value={filter}
                      onChange={(value) => setFilter(value)}
                      className="w-full sm:w-40 border-[#B0BEC5]"
                    />
                    <button
                      onClick={() => navigate("/admin/addFlight")}
                      className="bg-[#1B3A4B] text-white px-2 py-2 w-full sm:w-44 rounded-md hover:bg-[#0D1B2A] transition-colors duration-200"
                    >
                      + Add Flight
                    </button>
                  </div>
                </div>

                {/* Flight Cards */}
                <div className="space-y-4 p-4">
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight) => (
                      <AdminFlightCardComponent
                        key={flight.id}
                        flight={flight}
                        onModify={() => navigate(`/admin/modify/${flight.id}`, { state: { flight } })}
                      />
                    ))
                  ) : (
                    <div className="text-center p-10">
                      <p className="text-lg text-gray-500">
                        No flights found. Please modify your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedules;
