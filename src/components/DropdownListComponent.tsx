import React from 'react';
type City = {
  name: string;
  code: string;
};
type CityGroup = {
  country: string;
  cities: City[];
};

interface DropdownListProps {
  cities: CityGroup[];
  onSelect: (city: City) => void;
}
const DropdownListComponent: React.FC<DropdownListProps> = ({ cities, onSelect }) => {
  return (
    <div className="absolute left-0 z-10 bg-white border border-[#B0BEC5] rounded-md shadow-lg w-full mt-3 max-h-60 overflow-y-auto">
      {cities.length > 0 ? (
        cities.map((group) => (
          <div key={group.country}>
            <div className="px-3 py-2 text-xs font-medium text-[#1B3A4B] bg-[#ECEFF1]">
              {group.country}
            </div>
            {group.cities.map((city) => (
              <div
                key={city.code}
                className="px-4 py-2 cursor-pointer flex justify-between text-[#023047] hover:bg-[#ECEFF1] transition-colors"
                onClick={() => onSelect(city)}
              >
                <span>{city.name}</span>
                <span className="text-[#1B3A4B] font-medium">{city.code}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="px-3 py-2 text-[#455A64]">No results</div>
      )}
    </div>
  );
};

export default DropdownListComponent; 