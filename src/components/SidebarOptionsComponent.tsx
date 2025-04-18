import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface SidebarOptionsComponentProps {
  title: string;
  options: { value: string; label: string }[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const SidebarOptionsComponent: React.FC<SidebarOptionsComponentProps> = ({
  title,
  options,
  selectedOption,
  onChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="bg-white p-4 mb-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-base font-medium text-[#1B3A4B]">{title}</h3>
        <FontAwesomeIcon 
          icon={faCaretDown} 
          className={`transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} text-[#455A64]`} 
        />
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={option.value}
                name={title.toLowerCase().replace(/\s+/g, '-')}
                className="mr-2 h-5 w-5 rounded-full border-[#B0BEC5] text-[#1B3A4B] focus:ring-[#1B3A4B] accent-[#1B3A4B]"
                checked={selectedOption === option.value}
                onChange={() => onChange(option.value)}
              />
              <label htmlFor={option.value} className="text-[#455A64] text-sm cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarOptionsComponent; 