import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  required?: boolean;
  className?: string;
}

export default function TimePickerComponent({ value = '', onChange, required = false, className = '' }: TimePickerProps) {
  const normalizeTimeValue = (val: string): string => {
    if (!val) return '00:00';
    if (val.includes(':')) {
      const [hours, minutes] = val.split(':');
      if (hours && minutes) return val;
    }
    return '00:00';
  };

  const normalizedValue = normalizeTimeValue(value);
  
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(normalizedValue);
  const [hours, setHours] = useState(normalizedValue.split(':')[0]);
  const [minutes, setMinutes] = useState(normalizedValue.split(':')[1]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const hourOptions = Array.from({ length: 24 }, (_, i) => 
    i < 10 ? `0${i}` : `${i}`
  );
  
  const minuteOptions = Array.from({ length: 12 }, (_, i) => 
    i * 5 < 10 ? `0${i * 5}` : `${i * 5}`
  );

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

  useEffect(() => {
    const newValue = normalizeTimeValue(value);
    if (newValue !== internalValue) {
      setInternalValue(newValue);
      const [newHours, newMinutes] = newValue.split(':');
      setHours(newHours);
      setMinutes(newMinutes);
    }
  }, [value, internalValue]);

   useEffect(() => {
    const newValue = `${hours}:${minutes}`;
    if (newValue !== internalValue) {
      setInternalValue(newValue);
      if (onChange && newValue !== normalizedValue) {
        onChange(newValue);
      }
    }
  }, [hours, minutes, internalValue, normalizedValue, onChange]);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectTime = (type: 'hour' | 'minute', val: string) => {
    if (type === 'hour') {
      setHours(val);
    } else {
      setMinutes(val);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center justify-between rounded px-3 py-2 bg-transparent cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex-1 text-base text-[#023047]">
          {hours}:{minutes}
        </div>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-[#455A64] rounded shadow-lg z-50">
          <div className="p-2">
            <div className="flex">
              <div className="w-1/2 pr-1">
                <div className="text-sm text-[#1B3A4B] mb-1 font-medium">Ore</div>
                <div className="h-48 overflow-y-auto scrollbar-thin">
                  {hourOptions.map((hour) => (
                    <div
                      key={hour}
                      className={`py-1 px-2 cursor-pointer rounded ${
                        hours === hour ? 'bg-[#ECEFF1] text-[#1B3A4B] font-medium' : 'hover:bg-[#F5F7F8]'
                      }`}
                      onClick={() => selectTime('hour', hour)}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="w-1/2 pl-1">
                <div className="text-sm text-[#1B3A4B] mb-1 font-medium">Minute</div>
                <div className="h-48 overflow-y-auto scrollbar-thin">
                  {minuteOptions.map((minute) => (
                    <div
                      key={minute}
                      className={`py-1 px-2 cursor-pointer rounded ${
                        minutes === minute ? 'bg-[#ECEFF1] text-[#1B3A4B] font-medium' : 'hover:bg-[#F5F7F8]'
                      }`}
                      onClick={() => selectTime('minute', minute)}
                    >
                      {minute}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {required && (
        <input 
          type="hidden" 
          value={internalValue} 
          required={required} 
        />
      )}
    </div>
  );
}