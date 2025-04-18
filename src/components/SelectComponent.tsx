import { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectComponentProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export default function SelectComponent({
  options,
  value = '',
  onChange,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  className = '',
  label = ''
}: SelectComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const handleOptionHover = (optionValue: string | null) => {
    setHoveredOption(optionValue);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-[#455A64] mb-2">
          {label}
        </label>
      )}
      <div 
        className="flex items-center justify-between rounded px-3 py-2 cursor-pointer transition-all duration-200"
        onClick={toggleDropdown}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex-1 text-base ${value ? 'text-[#023047]' : 'text-gray-500'}`}>
          {displayValue}
        </div>
        <div className={`ml-2 transition-transform duration-200 ${isHovered ? 'text-[#1B3A4B]' : 'text-[#455A64]'}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-[#B0BEC5] rounded shadow-lg z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`py-2 px-3 cursor-pointer transition-all duration-150 ${
                  option.value === value 
                    ? 'bg-[#ECEFF1] text-[#1B3A4B] font-medium' 
                    : hoveredOption === option.value
                      ? 'bg-[#F5F7F8] text-[#1B3A4B] border-l-2 border-[#1B3A4B] pl-3'
                      : 'text-[#455A64] hover:bg-[#F5F7F8]'
                }`}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => handleOptionHover(option.value)}
                onMouseLeave={() => handleOptionHover(null)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {required && (
        <input 
          type="hidden" 
          value={value || ''} 
          required={required} 
        />
      )}
    </div>
  );
}