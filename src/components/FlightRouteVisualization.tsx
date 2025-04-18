import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";

type FlightRouteVisualizationProps = {
  departureCity: string;
  departureCityCode: string;
  destinationCity: string;
  destinationCityCode: string;
  transitCities: { name: string; code: string }[];
  className?: string;
  theme?: "light" | "dark";
};

const FlightRouteVisualization: React.FC<FlightRouteVisualizationProps> = ({
  departureCity,
  departureCityCode,
  destinationCity,
  destinationCityCode,
  transitCities,
  className = "",
  theme = "light",
}) => {
  const colors = {
    light: {
      iconBg: "bg-[#ECEFF1]",
      icon: "text-[#1B3A4B]",
      cityName: "text-[#1B3A4B]",
      cityCode: "text-[#455A64]",
      line: "bg-gradient-to-r from-[#ECEFF1] to-[#B0BEC5]",
      arrow: "text-[#B0BEC5]",
      arrowBg: "bg-white",
      placeholder: "text-[#B0BEC5]",
    },
    dark: {
      iconBg: "bg-[#263238]",
      icon: "text-white",
      cityName: "text-white",
      cityCode: "text-[#B0BEC5]",
      line: "bg-gradient-to-r from-[#263238] to-[#455A64]",
      arrow: "text-[#78909C]",
      arrowBg: "bg-[#0D1B2A]",
      placeholder: "text-[#78909C]",
    },
  };

  const c = colors[theme];

  return (
    <div
      className={`flex flex-col items-center justify-center max-w-4xl mx-auto ${className}`}
    >
      <div className="flex items-center mb-5 justify-center w-full">
        {/* Departure */}
        <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 flex justify-center items-end transition-shadow duration-300">
            <FontAwesomeIcon
              icon={faLocationPin}
              className={`${departureCity ? c.icon : c.placeholder} text-2xl`}
            />
          </div>
          <div className="text-center">
            <span className={`block font-bold text-lg ${departureCity ? c.cityName : c.placeholder}`}>
              {departureCity || "Departure City"}
            </span>
            {departureCity && departureCityCode ? (
              <span className={`text-sm font-medium ${c.cityCode}`}>
                {departureCityCode}
              </span>
            ) : (
              <span className="text-sm invisible">XXX</span>
            )}
          </div>
        </div>

        {transitCities.length > 0 ? (
          <>
            {transitCities.map((city, index) => (
              <React.Fragment key={index}>
                <div className={`h-[3px] ${c.line} flex-1 mx-3 relative`}>
                  <div className="absolute top-0 left-0 h-full w-full flex items-center">
                    <div
                      className="h-1 bg-white animate-pulse"
                      style={{
                        width: "100%",
                        animationDelay: `${index * 0.2}s`,
                      }}
                    ></div>
                  </div>
                  <div
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${c.arrowBg} px-2 rounded-full`}
                  ></div>
                </div>
                <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 flex justify-center items-end transition-shadow duration-300">
                    <FontAwesomeIcon
                      icon={faLocationPin}
                      className={`${c.icon} text-2xl`}
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <span className={`block font-bold text-lg ${c.cityName}`}>
                      {city.name}
                    </span>
                    <span className={`text-sm font-medium ${c.cityCode}`}>
                      {city.code}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))}
            <div className={`h-[3px] ${c.line} flex-1 mx-3 relative`}>
              <div className="absolute top-0 left-0 h-full w-full flex items-center">
                <div
                  className="h-1 bg-white animate-pulse"
                  style={{
                    width: "100%",
                    animationDelay: `${transitCities.length * 0.2}s`,
                  }}
                ></div>
              </div>
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${c.arrowBg} px-2 rounded-full`}
              ></div>
            </div>
          </>
        ) : (
            <div className={`h-[3px] flex-1 mx-6 relative ${
                departureCity && destinationCity
                  ? `bg-white animate-pulse`
                  : `${c.line} opacity-50`
              }`}>
              </div>              
        )}

        {/* Destination */}
        <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 flex justify-center items-end transition-shadow duration-300">
            <FontAwesomeIcon
              icon={faLocationPin}
              className={`${destinationCity ? c.icon : c.placeholder} text-2xl`}
            />
          </div>
          <div className="text-center">
            <span className={`block font-bold text-lg ${destinationCity ? c.cityName : c.placeholder}`}>
              {destinationCity || "Arrival City"}
            </span>
            {destinationCity && destinationCityCode ? (
              <span className={`text-sm font-medium ${c.cityCode}`}>
                {destinationCityCode}
              </span>
            ) : (
              <span className="text-sm invisible">XXX</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightRouteVisualization;
