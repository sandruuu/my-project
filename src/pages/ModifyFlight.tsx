import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Flight } from "../assets/flights.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faBan,
  faEdit,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import TimePickerComponent from "../components/TimePickerComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PermanentChangesComponent from "../components/PermanentChangesComponent";

const ModifyFlight: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight as Flight;

  const [activeTab, setActiveTab] = useState<'permanent' | 'delay' | 'cancel'>('permanent');
  
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(flight?.frequency || 'daily');
  const [departureTime, setDepartureTime] = useState(flight?.departureTime || "");
  const [arrivalTime, setArrivalTime] = useState(flight?.arrivalTime || "");
  const [mealType, setMealType] = useState(flight?.meal || "");
  const [price, setPrice] = useState(flight?.price || 0);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [delayDate, setDelayDate] = useState("");
  const [delayTime, setDelayTime] = useState("01:00"); // Default 1 hour delay
  const [selectedDelayDate, setSelectedDelayDate] = useState<Date | null>(null);
  
  const [cancelDate, setCancelDate] = useState("");
  const [selectedCancelDate, setSelectedCancelDate] = useState<Date | null>(null);
  
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!flight) {
      navigate("/admin/schedules");
      return;
    }
    
    setFrequency(flight.frequency);
    setDepartureTime(flight.departureTime);
    setArrivalTime(flight.arrivalTime);
    setMealType(flight.meal);
    setPrice(flight.price);
  }, [flight, navigate]);

  useEffect(() => {
    if (selectedDate) {
      setEffectiveDate(selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDelayDate) {
      setDelayDate(selectedDelayDate.toISOString().split('T')[0]);
    }
  }, [selectedDelayDate]);

  useEffect(() => {
    if (selectedCancelDate) {
      setCancelDate(selectedCancelDate.toISOString().split('T')[0]);
    }
  }, [selectedCancelDate]);

  const isDeparting24hLater = (date: string) => {
    if (!date || !flight?.departureTime) {
      console.error("Missing date or departure time", { date, departureTime: flight?.departureTime });
      return false;
    }
    
    try {
      const now = new Date();
      
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = flight.departureTime.split(':').map(Number);
      
      const flightDateTime = new Date(year, month - 1, day, hours, minutes);
      
      console.log("Current time:", now.toString());
      console.log("Flight departure time:", flightDateTime.toString());
      
      const msDiff = flightDateTime.getTime() - now.getTime();
      const hoursDiff = msDiff / (1000 * 60 * 60);
      
      console.log("Hours difference:", hoursDiff);
      
      return hoursDiff >= 24;
    } catch (error) {
      console.error("Error calculating time difference:", error);
      return false;
    }
  };

  const isDeparting3hLater = (date: string) => {
    const now = new Date();
    const flightDateTime = new Date(`${date}T${flight?.departureTime}`);
    const hoursDiff = (flightDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff >= 3;
  };
  
  const validateTimeFields = () => {
    const errors: Record<string, string> = {};
    
    if (!departureTime) {
      errors.departureTime = "Departure time is required";
    }
    
    if (!arrivalTime) {
      errors.arrivalTime = "Arrival time is required";
    }
    
    if (departureTime && arrivalTime) {
      const [depHours, depMinutes] = departureTime.split(':').map(Number);
      const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
      
      const depTimeInMinutes = depHours * 60 + depMinutes;
      const arrTimeInMinutes = arrHours * 60 + arrMinutes;
      
      if (depTimeInMinutes >= arrTimeInMinutes) {
        errors.arrivalTime = "Arrival time must be after departure time";
      }
    }
    
    if (!effectiveDate) {
      errors.effectiveDate = "Effective date is required";
    }
    
    if (price <= 0) {
      errors.price = "Price must be greater than 0";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateDelayFields = () => {
    const errors: Record<string, string> = {};
    
    if (!delayDate) {
      errors.delayDate = "Date is required";
      setFieldErrors(errors);
      return false;
    }
    
    if (!isDeparting3hLater(delayDate)) {
      errors.delayDate = "Cannot add delay for flights departing in less than 3 hours";
      setFieldErrors(errors);
      return false;
    }
    
    setFieldErrors(errors);
    return true;
  };
  
  const validateCancelFields = () => {
    const errors: Record<string, string> = {};
    
    if (!cancelDate) {
      errors.cancelDate = "Date is required";
      setFieldErrors(errors);
      return false;
    }
    
    try {
      if (!isDeparting24hLater(cancelDate)) {
        
        errors.cancelDate = `Cannot cancel flights departing in less than 24 hours`;
        setFieldErrors(errors);
        return false;
      }
    } catch (error) {
      console.error("Error in date validation:", error);
      errors.cancelDate = "Invalid date format";
      setFieldErrors(errors);
      return false;
    }
    
    setFieldErrors(errors);
    return true;
  };

  const calculateDelayedTimes = () => {
    const [depHours, depMinutes] = flight.departureTime.split(':').map(Number);
    const [delayHours, delayMinutes] = delayTime.split(':').map(Number);
    
    let totalDepMinutes = depHours * 60 + depMinutes + delayHours * 60 + delayMinutes;
    
    const newDepHours = Math.floor(totalDepMinutes / 60) % 24;
    const newDepMinutes = totalDepMinutes % 60;
    
    const newDepartureTime = `${newDepHours.toString().padStart(2, '0')}:${newDepMinutes.toString().padStart(2, '0')}`;
    
    const [arrHours, arrMinutes] = flight.arrivalTime.split(':').map(Number);
    
    let totalArrMinutes = arrHours * 60 + arrMinutes + delayHours * 60 + delayMinutes;
    
    const newArrHours = Math.floor(totalArrMinutes / 60) % 24;
    const newArrMinutes = totalArrMinutes % 60;
    
    const newArrivalTime = `${newArrHours.toString().padStart(2, '0')}:${newArrMinutes.toString().padStart(2, '0')}`;
    
    return { newDepartureTime, newArrivalTime };
  };

  const handlePermanentChanges = () => {
    if (!validateTimeFields()) {
      setError("Please fix the errors in the form");
      return;
    }
    
    const today = new Date();
    const effectiveDateObj = new Date(effectiveDate);
    
    if (effectiveDateObj < today) {
      setFieldErrors({...fieldErrors, effectiveDate: "Effective date cannot be in the past"});
      setError("Effective date cannot be in the past");
      return;
    }
    
    setSuccess(`Flight schedule permanently modified starting from ${effectiveDate}. A new version of the flight has been created.`);
    setError("");
  };

  const handleDelay = () => {
    if (!validateDelayFields()) {
      setError("Please fix the errors in the form");
      return;
    }
    
    const { newDepartureTime, newArrivalTime } = calculateDelayedTimes();
    
    setSuccess(`Flight successfully delayed by ${delayTime}. 
      New departure time: ${newDepartureTime}, New arrival time: ${newArrivalTime} on ${delayDate}`);
    setError("");
  };

  const handleCancel = () => {
    if (!selectedCancelDate) {
      setError("Please select a date for cancellation");
      return;
    }
    
    let formattedCancelDate = cancelDate;
    if (!formattedCancelDate || formattedCancelDate.trim() === '') {
      if (selectedCancelDate) {
        formattedCancelDate = selectedCancelDate.toISOString().split('T')[0];
      } else {
        setError("Invalid date selection");
        return;
      }
    }
    
    console.log("Attempting to cancel flight for date:", formattedCancelDate);
    
    if (!validateCancelFields()) {
      setError("Please fix the errors in the form");
      return;
    }
    
    setSuccess(`Flight successfully cancelled for ${formattedCancelDate}`);
    setError("");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!flight) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Flight Information Card */}
        <div className="bg-white p-6 mb-6 rounded-lg border border-[#ECEFF1] shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPlane} className="text-[#1B3A4B] text-xl mr-2" />
              <h1 className="text-xl font-bold text-[#1B3A4B]">{flight.flightNumber}</h1>
            </div>
          </div>

          {/* Date */}
          <div className="mb-6 flex items-center">
            <span className="text-lg font-medium">From: {formatDate(flight.startDate)}</span>
          </div>

          {/* Horizontal flight timeline */}
          <div className="rounded-lg p-4">
            {/* Departure and Arrival */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-[#1B3A4B]">{flight.departureTime}</div>
                <div className="text-lg text-gray-700">{flight.departureCity} ({flight.departureCode})</div>
              </div>
              
              <div className="flex-grow flex items-center justify-center px-4">
                <div className="h-[2px] flex-grow bg-gray-300"></div>
                <FontAwesomeIcon icon={faPlane} className="mx-4 text-[#1B3A4B]" />
                <div className="h-[2px] flex-grow bg-gray-300"></div>
                </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-[#1B3A4B]">{flight.arrivalTime}</div>
                <div className="text-lg text-gray-700">{flight.arrivalCity} ({flight.arrivalCode})</div>
              </div>
            </div>

            {/* Flight details */}
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Aircraft</p>
                    <p className="font-medium">{flight.aircraft}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Frequency</p>
                    <p className="font-medium">{flight.frequency === 'daily' ? 'Daily' : 'Weekly'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                    <div>
                    <p className="text-sm text-gray-500">Seat Layout</p>
                    <p className="font-medium">Single-aisle 3-3/2-2 configuration</p>
                      </div>
                    </div>
                <div className="flex items-center">
                    <div>
                    <p className="text-sm text-gray-500">Hand Luggage</p>
                    <p className="font-medium">Cabin bag (40×30×20 cm)</p>
                  </div>
                    </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{flight.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Meal</p>
                    <p className="font-medium">{flight.meal}</p>
              </div>
            </div>
                <div className="flex items-center">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${flight.price}</p>
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'permanent'
                  ? 'text-[#1B3A4B] border-b-2 border-[#1B3A4B]'
                  : 'text-gray-500 hover:text-[#1B3A4B]'
              }`}
              onClick={() => setActiveTab('permanent')}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Permanent Changes
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'delay'
                  ? 'text-[#1B3A4B] border-b-2 border-[#1B3A4B]'
                  : 'text-gray-500 hover:text-[#1B3A4B]'
              }`}
              onClick={() => setActiveTab('delay')}
            >
              <FontAwesomeIcon icon={faHourglassHalf} className="mr-2" />
              Add Delay
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'cancel'
                  ? 'text-[#1B3A4B] border-b-2 border-[#1B3A4B]'
                  : 'text-gray-500 hover:text-[#1B3A4B]'
              }`}
              onClick={() => setActiveTab('cancel')}
            >
              <FontAwesomeIcon icon={faBan} className="mr-2" />
              Cancel Flight
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'permanent' && (
              <PermanentChangesComponent
                frequency={frequency}
                setFrequency={setFrequency}
                departureTime={departureTime}
                setDepartureTime={setDepartureTime}
                arrivalTime={arrivalTime}
                setArrivalTime={setArrivalTime}
                mealType={mealType}
                setMealType={setMealType}
                price={price}
                setPrice={setPrice}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                fieldErrors={fieldErrors}
                handlePermanentChanges={handlePermanentChanges}
              />
            )}
            
            {/* Delay Tab */}
            {activeTab === 'delay' && (
              <div>
                <p className="text-gray-500 mb-6">
                  You can add a delay for a specific flight date. This will only affect the selected occurrence. <br />
                  Note: You can only delay flights that are at least 3 hours from departure.
                </p>
                
                <div className="flex justify-center mb-6">
                  <div className="w-full max-w-md">
                    <div className="mb-6">
                      <div className="relative">
                        <div className={`flex-1 border ${fieldErrors.delayTime 
                          ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                          : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                          rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                          <div className="flex-grow">
                            <label className="block text-sm font-medium text-[#455A64] mb-2 flex items-center">
                              Delay Duration
                            </label>
                            <div className="relative">
                              <TimePickerComponent
                                value={delayTime}
                                onChange={(time) => setDelayTime(time)}
                                className="px-3 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                              />
                              {!delayTime && (
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                  <span className="text-gray-400">Select delay duration</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {fieldErrors.delayTime && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.delayTime}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="relative">
                        <div className={`flex-1 border ${fieldErrors.delayDate 
                          ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                          : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                          rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                          <div className="flex-grow">
                            <label className="block text-sm font-medium text-[#455A64] mb-2 flex items-center">
                              Flight Date
                            </label>
                            <DatePicker
                              selected={selectedDelayDate}
                              onChange={(date) => setSelectedDelayDate(date)}
                              dateFormat="MMMM d, yyyy"
                              className="px-6 py-2 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer"
                              placeholderText="Select date"
                              wrapperClassName="w-full"
                              popperClassName="calendar-popper"
                              calendarClassName="custom-calendar"
                              minDate={new Date()}
                            />
                          </div>
                        </div>
                        {fieldErrors.delayDate && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.delayDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                  
                <div className="flex justify-end mt-8">
                  <button
                    className="bg-[#1B3A4B] text-white py-3 px-8 rounded-lg hover:bg-[#023047] transition-colors font-medium"
                    onClick={handleDelay}
                  >
                    Add Delay
                  </button>
                </div>
            </div>
          )}
            
            {/* Cancel Tab */}
            {activeTab === 'cancel' && (
              <div>
                <p className="text-gray-500 mb-5 mt-2">
                  You can cancel a specific flight occurrence. This will only affect the selected date. <br />
                  Note: You can only cancel flights that are at least 24 hours from departure.
                </p>
                
                {/* Fixed height container for messages */}
                <div className="h-14 mb-4">
                  
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="w-full max-w-md">
                    <div className="relative">
                      <div className={`flex-1 border ${fieldErrors.cancelDate 
                        ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                        : 'border-[#B0BEC5] hover:border-[#455A64]'} 
                        rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                        <div className="flex-grow text-center">
                          <label className="block py-2 text-sm font-medium text-[#455A64] mb-2 flex justify-center">
                            Flight Date to Cancel
                          </label>
                          <DatePicker
                            selected={selectedCancelDate}
                            onChange={(date) => setSelectedCancelDate(date)}
                            dateFormat="MMMM d, yyyy"
                            className="px-6 text-base text-[#023047] w-full focus:outline-none bg-transparent cursor-pointer text-center"
                            placeholderText="Select date"
                            wrapperClassName="w-full"
                            popperClassName="calendar-popper"
                            calendarClassName="custom-calendar"
                            minDate={new Date()}
                          />
                        </div>
                      </div>
                      {fieldErrors.cancelDate && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.cancelDate}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    className="bg-[#1B3A4B] text-white py-3 px-8 rounded-lg hover:bg-[#023047] transition-colors font-medium"
                    onClick={handleCancel}
                  >
                    Cancel Flight
                  </button>
                </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyFlight; 