import React from "react";
import DatePicker from "react-datepicker";
import TimePickerComponent from "./TimePickerComponent";
import SidebarOptionsComponent from "./SidebarOptionsComponent";

interface PermanentChangesProps {
  frequency: 'daily' | 'weekly';
  setFrequency: (frequency: 'daily' | 'weekly') => void;
  departureTime: string;
  setDepartureTime: (time: string) => void;
  arrivalTime: string;
  setArrivalTime: (time: string) => void;
  mealType: string;
  setMealType: (mealType: string) => void;
  price: number;
  setPrice: (price: number) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  fieldErrors: Record<string, string>;
  handlePermanentChanges: () => void;
}

const PermanentChangesComponent: React.FC<PermanentChangesProps> = ({
  frequency,
  setFrequency,
  departureTime,
  setDepartureTime,
  arrivalTime,
  setArrivalTime,
  mealType,
  setMealType,
  price,
  setPrice,
  selectedDate,
  setSelectedDate,
  fieldErrors,
  handlePermanentChanges
}) => {
  return (
    <div>
      <p className="text-gray-500 mb-6">
        Changes will apply to all future instances of this flight starting from the selected date.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SidebarOptionsComponent
            title="Flight Frequency"
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' }
            ]}
            selectedOption={frequency}
            onChange={(value: string) => setFrequency(value as 'daily' | 'weekly')}
          />
          
          <SidebarOptionsComponent
            title="Meal Type"
            options={[
              { value: 'No Meal', label: 'No Meal' },
              { value: 'Snack', label: 'Snack' },
              { value: 'Full Meal', label: 'Full Meal' }
            ]}
            selectedOption={mealType}
            onChange={(value: string) => setMealType(value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="mb-6">
            <div className="relative">
              <div className={`flex-1 border ${fieldErrors.departureTime 
                ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                rounded-lg  p-2 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-2 text-[#455A64] flex items-center">
                    Departure Time
                  </label>
                  <TimePickerComponent
                    value={departureTime}
                    onChange={(time) => setDepartureTime(time)}
                    className="px-3 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                  />
                </div>
              </div>
              {fieldErrors.departureTime && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.departureTime}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <div className={`flex-1 border ${fieldErrors.arrivalTime 
                ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                rounded-lg p-2 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-2 text-[#455A64] flex items-center">
                    Arrival Time
                  </label>
                  <TimePickerComponent
                    value={arrivalTime}
                    onChange={(time) => setArrivalTime(time)}
                    className="px-3 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                  />
                </div>
              </div>
              {fieldErrors.arrivalTime && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.arrivalTime}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <div className={`flex-1 border ${fieldErrors.price 
                ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                  rounded-lg p-2 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-2 text-[#455A64] flex items-center">
                    Ticket Price
                  </label>
                  <input
                    type="number"
                    className="px-6 py-2 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={0}
                  />
                </div>
              </div>
              {fieldErrors.price && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.price}</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <div className={`flex-1 border ${fieldErrors.effectiveDate 
                ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                rounded-lg p-2 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                <div className="flex-grow">
                  <label className="block text-sm font-medium py-2 text-[#455A64] flex items-center">
                    From
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="px-6 text-base mb-2 text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                    placeholderText="Select date"
                    wrapperClassName="w-full"
                    popperClassName="calendar-popper"
                    calendarClassName="custom-calendar"
                    minDate={new Date()}
                  />
                </div>
              </div>
              {fieldErrors.effectiveDate && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.effectiveDate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Changes will apply to all flights from this date forward
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button
              className="bg-[#1B3A4B] text-white py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              onClick={handlePermanentChanges}
            >
              Save Permanent Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermanentChangesComponent; 