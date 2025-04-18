import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Tooltip,
} from "react-leaflet";
import { latLngBounds, DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, 
  faPlane, 
  faClock, 
  faCalendarAlt,
  faCheckCircle,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { Flight } from "../assets/flights";
import { flights } from "../assets/flights";
import plane from "../assets/images/plane2.jpg";
import airportCoordinates from "../assets/airportCoordonates";

interface FlightWithCoordinates extends Flight {
  departureCoordinates: [number, number];
  arrivalCoordinates: [number, number];
  transitCoordinates?: [number, number][];
  transitCities?: string[];
  transitCodes?: string[];
  dynamicStatus: "upcoming" | "active" | "completed" | "cancelled";
  nextFlightDate?: string;
}

const getTransitInfo = (
  flight: Flight
): { coordinates: [number, number][]; cities: string[]; codes: string[] } => {
  if (!flight.transits || flight.transits.length === 0) {
    return { coordinates: [], cities: [], codes: [] };
  }

  const transitFlights = flight.transits
    .map((transitId) => flights.find((f) => f.id === transitId))
    .filter((f): f is Flight => f !== undefined);

  const coordinates: [number, number][] = [];
  const cities: string[] = [];
  const codes: string[] = [];

  transitFlights.forEach((transitFlight) => {
    coordinates.push(airportCoordinates[transitFlight.arrivalCode]);
    cities.push(transitFlight.arrivalCity);
    codes.push(transitFlight.arrivalCode);
  });

  return { coordinates, cities, codes };
};

const calculateNextFlightDate = (flight: Flight): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const departureDateObj = new Date(flight.startDate);
  departureDateObj.setHours(0, 0, 0, 0);
  
  if (departureDateObj > today) {
    return flight.startDate;
  }
  
  if (flight.frequency === "daily") {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1); 
    return nextDate.toISOString().split('T')[0];
  } else if (flight.frequency === "weekly") {
    const originalDay = departureDateObj.getDay();
    let daysToAdd = originalDay - today.getDay();
    
    if (daysToAdd <= 0) {
      daysToAdd += 7; 
    }
    
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate.toISOString().split('T')[0];
  }
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const calculateDynamicStatus = (flight: Flight): { status: "upcoming" | "active" | "completed" | "cancelled", nextFlightDate: string } => {
  if (flight.status === "cancelled") {
    return { status: "cancelled", nextFlightDate: flight.startDate };
  }
  
  const nextFlightDate = calculateNextFlightDate(flight);
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  
  const [departureHour, departureMinute] = flight.departureTime
    .split(':')
    .map(part => parseInt(part.trim(), 10));
    
  const [arrivalHour, arrivalMinute] = flight.arrivalTime
    .split(':')
    .map(part => parseInt(part.trim(), 10));
  
  const departureTotalMinutes = (departureHour * 60) + departureMinute;
  const arrivalTotalMinutes = (arrivalHour * 60) + arrivalMinute;
  
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();
  const currentTotalMinutes = (currentHour * 60) + currentMinute;
  
  const threeHoursInMinutes = 3 * 60;
  
  if (nextFlightDate === todayString) {
    if (currentTotalMinutes < departureTotalMinutes && 
        departureTotalMinutes - currentTotalMinutes <= threeHoursInMinutes) {
      return { status: "upcoming", nextFlightDate };
    }
    
    if (currentTotalMinutes >= departureTotalMinutes && 
        currentTotalMinutes <= arrivalTotalMinutes) {
      return { status: "active", nextFlightDate };
    }
    
    if (currentTotalMinutes > arrivalTotalMinutes) {
      return { status: "completed", nextFlightDate };
    }
    
    return { status: "completed", nextFlightDate };
  }
  
  if (nextFlightDate > todayString) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    if (nextFlightDate === tomorrowString) {
      const minutesToMidnight = 24 * 60 - currentTotalMinutes;
      
      const totalMinutesUntilFlight = minutesToMidnight + departureTotalMinutes;
      
      if (totalMinutesUntilFlight <= threeHoursInMinutes) {
        return { status: "upcoming", nextFlightDate };
      }
    }
    
    return { status: "completed", nextFlightDate };
  }
  
  return { status: "completed", nextFlightDate };
};

const getFlightsWithDynamicStatus = (): FlightWithCoordinates[] => {
  return flights.map((flight: Flight) => {
    const {
      coordinates: transitCoordinates,
      cities: transitCities,
      codes: transitCodes,
    } = getTransitInfo(flight);
    
    const { status, nextFlightDate } = calculateDynamicStatus(flight);

    return {
      ...flight,
      departureCoordinates: airportCoordinates[flight.departureCode],
      arrivalCoordinates: airportCoordinates[flight.arrivalCode],
      transitCoordinates,
      transitCities,
      transitCodes,
      dynamicStatus: status,
      nextFlightDate
    };
  });
};

const getStatusColor = (status: "upcoming" | "active" | "completed" | "cancelled") => {
  switch (status) {
    case "upcoming":
      return "#FFD54F"; 
    case "active":
      return "#A8DCAB"; 
    case "completed":
      return "#455A64";
    case "cancelled":
      return "#E57373"; 
    default:
      return "#455A64";
  }
};

const getStatusText = (status: "upcoming" | "active" | "completed" | "cancelled") => {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

const FitBoundsToRoute: React.FC<{ coordinates: [number, number][] }> = ({
  coordinates,
}) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = latLngBounds(coordinates);
      const extendedBounds = bounds.pad(0.1); 

      map.fitBounds(extendedBounds, {
        padding: [10, 10],
        maxZoom: 8,
        duration: 0.5,
      });
    }
  }, [coordinates, map]);

  return null;
};

const createCurvedPath = (
  start: [number, number],
  end: [number, number]
): [number, number][] => {
  const latlngs: [number, number][] = [];
  const offsetX = end[1] - start[1];
  const offsetY = end[0] - start[0];

  const center: [number, number] = [
    start[0] + offsetY * 0.5,
    start[1] + offsetX * 0.5,
  ];

  const distance = Math.sqrt(
    Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
  );

  const curveHeight = distance * 0.15;

  const midPoint: [number, number] = [
    center[0] + curveHeight * Math.cos(Math.atan2(offsetX, offsetY)),
    center[1] - curveHeight * Math.sin(Math.atan2(offsetX, offsetY)),
  ];

  const numPoints = 100;
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    const lat =
      Math.pow(1 - t, 2) * start[0] +
      2 * (1 - t) * t * midPoint[0] +
      Math.pow(t, 2) * end[0];
    const lng =
      Math.pow(1 - t, 2) * start[1] +
      2 * (1 - t) * t * midPoint[1] +
      Math.pow(t, 2) * end[1];

    latlngs.push([lat, lng]);
  }

  return latlngs;
};

const createCustomIcon = (color: string) => {
  return new DivIcon({
    className: "custom-dot",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
};

const departureIcon = createCustomIcon("#1B3A4B");
const arrivalIcon = createCustomIcon("#1B3A4B");

const FlightTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dynamicFlights, setDynamicFlights] = useState<FlightWithCoordinates[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightWithCoordinates | null>(null);
  
  useEffect(() => {
    const initialFlights = getFlightsWithDynamicStatus();
    setDynamicFlights(initialFlights);
    if (initialFlights.length > 0) {
      setSelectedFlight(initialFlights[0]);
    }
    
    const intervalId = setInterval(() => {
      const updatedFlights = getFlightsWithDynamicStatus();
      setDynamicFlights(updatedFlights);
      
      if (selectedFlight) {
        const updatedSelectedFlight = updatedFlights.find(f => f.id === selectedFlight.id);
        if (updatedSelectedFlight) {
          setSelectedFlight(updatedSelectedFlight);
        }
      }
    }, 60000); 
    
    return () => clearInterval(intervalId);
  }, []); 

  const filteredFlights = dynamicFlights.filter(
    (flight) => {
      const matchesSearch = 
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.departureCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.arrivalCity.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" || 
        flight.dynamicStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="min-h-screen bg-white">

      <div className="container mx-auto">
        <div
          className="w-full bg-cover bg-center mb-10 py-12"
          style={{
            backgroundImage: `url(${plane})`,
            position: "relative",
          }}
        >
          <div className="absolute inset-0 bg-[#0D1B2A] opacity-60"></div>
          <div className="flex justify-between items-center px-8 relative z-10">
            <h1 className="text-2xl font-bold text-white">
              Flights Tracking
            </h1>
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search by flight number or city..."
                className="w-full p-3 pl-10 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-white/50 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
              />
            </div>
          </div>
        </div>
        <div className="px-8 pb-10">
          {/* Status filter buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium min-w-[140px] text-center ${
                statusFilter === "all" 
                  ? "bg-[#1B3A4B] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setStatusFilter("all");
                if (dynamicFlights.length > 0) {
                  setSelectedFlight({...dynamicFlights[0]});
                }
              }}
            >
              All Flights
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium min-w-[140px] text-center flex items-center justify-center ${
                statusFilter === "upcoming" 
                  ? "bg-[#FFD54F] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setStatusFilter("upcoming");
                const firstUpcomingFlight = dynamicFlights.find(f => f.dynamicStatus === "upcoming");
                if (firstUpcomingFlight) {
                  setSelectedFlight({...firstUpcomingFlight});
                }
              }}
            >
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              Upcoming
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium min-w-[140px] text-center flex items-center justify-center ${
                statusFilter === "active" 
                  ? "bg-[#A8DCAB] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setStatusFilter("active");
                const firstActiveFlight = dynamicFlights.find(f => f.dynamicStatus === "active");
                if (firstActiveFlight) {
                  setSelectedFlight({...firstActiveFlight});
                }
              }}
            >
              <FontAwesomeIcon icon={faPlane} className="mr-2" />
              Active
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium min-w-[140px] text-center flex items-center justify-center ${
                statusFilter === "completed" 
                  ? "bg-[#455A64] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setStatusFilter("completed");
                const firstCompletedFlight = dynamicFlights.find(f => f.dynamicStatus === "completed");
                if (firstCompletedFlight) {
                  setSelectedFlight({...firstCompletedFlight});
                }
              }}
            >
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Completed
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium min-w-[140px] text-center flex items-center justify-center ${
                statusFilter === "cancelled" 
                  ? "bg-[#E57373] text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setStatusFilter("cancelled");
                const firstCancelledFlight = dynamicFlights.find(f => f.dynamicStatus === "cancelled");
                if (firstCancelledFlight) {
                  setSelectedFlight({...firstCancelledFlight});
                }
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancelled
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="h-[400px] lg:h-[600px] overflow-y-auto">
                <div className="space-y-4 p-4">
                  {filteredFlights.length > 0 ? (
                    filteredFlights.map((flight) => (
                      <div
                        key={flight.id}
                        className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 ${
                          selectedFlight?.id === flight.id
                            ? "bg-[#ECEFF1]"
                            : "bg-white hover:bg-[#ECEFF1]"
                        }`}
                        onClick={() => setSelectedFlight({...flight})}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faPlane} className="mr-2" />
                            <span className="font-bold">{flight.flightNumber}</span>
                          </div>
                          <div className="flex items-center">
                            <span style={{ color: getStatusColor(flight.dynamicStatus) }}>
                              {getStatusText(flight.dynamicStatus)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between mb-2">
                          <div>
                            <div className="font-semibold">{flight.departureCity}</div>
                            <div className="text-sm text-[#78909C]">{flight.departureCode}</div>
                            <div className="text-sm text-[#1B3A4B] font-medium mt-1">{flight.departureTime}</div>
                          </div>
                          <div className="text-center flex items-center">
                            <div className="text-[#78909C] text-xs">{flight.duration}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{flight.arrivalCity}</div>
                            <div className="text-sm text-[#78909C]">{flight.arrivalCode}</div>
                            <div className="text-sm text-[#1B3A4B] font-medium mt-1">{flight.arrivalTime}</div>
                          </div>
                        </div>
                        <div className="text-[#455A64] text-sm flex items-center mt-2">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                          Next flight: {flight.nextFlightDate} ({flight.frequency})
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 text-[#455A64]">
                      No flights match your search criteria
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white shadow-lg rounded-lg overflow-hidden h-[600px]">
              {selectedFlight ? (
                <MapContainer
                  key={`map-${selectedFlight.id}`}
                  style={{ height: "100%", width: "100%" }}
                  center={[0, 0]}
                  zoom={2}
                  zoomControl={true}
                  attributionControl={true}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

                  <Marker
                    position={selectedFlight.departureCoordinates}
                    icon={departureIcon}
                  >
                    <Tooltip permanent>
                      <div className="font-bold">{selectedFlight.departureCode}</div>
                      <div className="text-xs">{selectedFlight.departureCity}</div>
                    </Tooltip>
                  </Marker>

                  <Marker
                    position={selectedFlight.arrivalCoordinates}
                    icon={arrivalIcon}
                  >
                    <Tooltip permanent>
                      <div className="font-bold">{selectedFlight.arrivalCode}</div>
                      <div className="text-xs">{selectedFlight.arrivalCity}</div>
                    </Tooltip>
                  </Marker>

                  {selectedFlight.transitCoordinates &&
                    selectedFlight.transitCoordinates.map(
                      (coord, index) => (
                        <Marker
                          key={`transit-${index}`}
                          position={coord}
                          icon={createCustomIcon("#78909C")}
                        >
                          <Tooltip permanent>
                            <div className="font-bold">
                              {selectedFlight.transitCodes &&
                                selectedFlight.transitCodes[index]}
                            </div>
                            <div className="text-xs">
                              {selectedFlight.transitCities &&
                                selectedFlight.transitCities[index]}
                            </div>
                          </Tooltip>
                        </Marker>
                      )
                    )}

                  {/* Flight route */}
                  {selectedFlight.transitCoordinates &&
                  selectedFlight.transitCoordinates.length > 0 ? (
                    <>
                      <Polyline
                        positions={createCurvedPath(
                          selectedFlight.departureCoordinates,
                          selectedFlight.transitCoordinates[0]
                        )}
                        color={getStatusColor(selectedFlight.dynamicStatus)}
                        weight={3}
                        dashArray={selectedFlight.dynamicStatus === "upcoming" ? "5, 5" : undefined}
                      />
                      {selectedFlight.transitCoordinates.map((coord, i) => {
                        if (
                          i <
                          selectedFlight.transitCoordinates!.length - 1
                        ) {
                          return (
                            <Polyline
                              key={`transit-line-${i}`}
                              positions={createCurvedPath(
                                coord,
                                selectedFlight.transitCoordinates![i + 1]
                              )}
                              color={getStatusColor(selectedFlight.dynamicStatus)}
                              weight={3}
                              dashArray={selectedFlight.dynamicStatus === "upcoming" ? "5, 5" : undefined}
                            />
                          );
                        }
                        return null;
                      })}
                      <Polyline
                        positions={createCurvedPath(
                          selectedFlight.transitCoordinates[
                            selectedFlight.transitCoordinates.length - 1
                          ],
                          selectedFlight.arrivalCoordinates
                        )}
                        color={getStatusColor(selectedFlight.dynamicStatus)}
                        weight={3}
                        dashArray={selectedFlight.dynamicStatus === "upcoming" ? "5, 5" : undefined}
                      />
                    </>
                  ) : (
                    <Polyline
                      positions={createCurvedPath(
                        selectedFlight.departureCoordinates,
                        selectedFlight.arrivalCoordinates
                      )}
                      color={getStatusColor(selectedFlight.dynamicStatus)}
                      weight={3}
                      dashArray={selectedFlight.dynamicStatus === "upcoming" ? "5, 5" : undefined}
                    />
                  )}

                  <FitBoundsToRoute
                    coordinates={[
                      selectedFlight.departureCoordinates,
                      ...(selectedFlight.transitCoordinates || []),
                      selectedFlight.arrivalCoordinates,
                    ]}
                  />
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full p-10 text-[#455A64]">
                  Select a flight to view on map
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.textContent = `
  .custom-tooltip {
    background: white !important;
    border: none !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
    padding: 4px 8px !important;
    font-size: 14px !important;
    border-radius: 4px !important;
  }
  .custom-tooltip::before {
    display: none !important;
  }
  .custom-dot {
    background: none;
    border: none;
  }
  .custom-dot div {
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  }
`;
document.head.appendChild(style);

export default FlightTracking;
