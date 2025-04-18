import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

type FiltersProps = {
  selectedTransits: {
    direct: boolean;
    oneTransit: boolean;
    twoPlusTransits: boolean;
  };
  setSelectedTransits: React.Dispatch<
    React.SetStateAction<{
      direct: boolean;
      oneTransit: boolean;
      twoPlusTransits: boolean;
    }>
  >;
  priceRange: {
    min: number;
    max: number;
  };
  setPriceRange: React.Dispatch<
    React.SetStateAction<{ min: number; max: number }>
  >;
};


const FlightFilters: React.FC<FiltersProps> = ({
  selectedTransits,
  setSelectedTransits,
  priceRange,
  setPriceRange,
}) => {
  const [expandedFilters, setExpandedFilters] = useState({
    transit: true,
    priceRange: true,
  });

  return (
    <div className="w-full p-4 bg-white">
      <div className="pb-3 pt-2 flex flex-row items-center justify-between">
        <h3 className="text-lg font-medium text-[#1B3A4B]">Filter Flights</h3>
        <button
          className="text-[#455A64] text-sm hover:text-[#1B3A4B] transition-colors duration-200"
          onClick={() => {
            setSelectedTransits({ direct: true, oneTransit: true, twoPlusTransits: true });
            setPriceRange({ min: 50, max: 1000 });
          }}
        >
          Reset
        </button>
      </div>

      <div className="py-3 border-t border-gray-200">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedFilters(prev => ({ ...prev, transit: !prev.transit }))}>
          <h3 className="text-base font-medium text-[#1B3A4B]">Transit</h3>
          <FontAwesomeIcon icon={faCaretDown} className={`transform transition-transform duration-200 ${expandedFilters.transit ? "rotate-180" : ""} text-[#455A64] hover:text-[#1B3A4B]`} />
        </div>
        {expandedFilters.transit && (
          <div className="mt-3 space-y-2">
            {[
              { id: "direct", label: "Direct", value: "direct" }, 
              { id: "1transit", label: "1 Transit", value: "oneTransit" }, 
              { id: "2transit", label: "2+ Transits", value: "twoPlusTransits" }
            ].map(({ id, label, value }) => (
              <div key={id} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={id} 
                  className="mr-2 h-5 w-5 rounded border-[#B0BEC5] text-[#1B3A4B] focus:ring-[#1B3A4B] accent-[#1B3A4B]" 
                  checked={selectedTransits[value as keyof typeof selectedTransits]} 
                  onChange={() => setSelectedTransits(prev => ({ ...prev, [value]: !prev[value as keyof typeof selectedTransits] }))} 
                />
                <label htmlFor={id} className="text-[#455A64] text-sm">{label}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="py-3 border-t border-gray-200">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedFilters(prev => ({ ...prev, priceRange: !prev.priceRange }))}>
          <h3 className="text-base font-medium text-[#1B3A4B]">Price Range</h3>
          <FontAwesomeIcon icon={faCaretDown} className={`transform transition-transform duration-200 ${expandedFilters.priceRange ? "rotate-180" : ""} text-[#455A64] hover:text-[#1B3A4B]`} />
        </div>
        {expandedFilters.priceRange && (
          <div className="mt-3">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-[#1B3A4B] text-sm">Start</span>
              <span className="font-medium text-[#1B3A4B] text-sm">Up to</span>
            </div>
            <div className="flex justify-between">
              <input 
                type="number" 
                className="px-2 py-1 border border-[#B0BEC5] rounded-lg text-center w-20 focus:ring-[#1B3A4B] focus:border-[#1B3A4B] text-[#1B3A4B] text-sm" 
                value={priceRange.min} 
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.max(50, +e.target.value) }))} 
              />
              <input 
                type="number" 
                className="px-2 py-1 border border-[#B0BEC5] rounded-lg text-center w-20 focus:ring-[#1B3A4B] focus:border-[#1B3A4B] text-[#1B3A4B] text-sm" 
                value={priceRange.max} 
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.min(1000, +e.target.value) }))} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightFilters;