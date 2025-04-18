import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { Flight } from '../assets/flights.tsx';

interface AdminFlightCardProps {
  flight: Flight;
  onModify?: () => void;
}

const AdminFlightCardComponent: React.FC<AdminFlightCardProps> = ({ flight, onModify }) => {
  const handleModifyFlight = () => {
    if (onModify) {
      onModify();
    }
  };

  const formatDepartureDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    const dateParts = dateStr.split('-');
    if (dateParts.length !== 3) return dateStr;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    const date = new Date(Date.UTC(year, month, day));
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <div className="p-6 border border-gray-100 rounded-lg shadow-md bg-white w-full mx-auto hover:shadow-lg transition-shadow duration-300">
      <div className="text-[#1B3A4B] font-medium text-sm mb-4">
        {formatDepartureDate(flight.startDate)}
      </div>

      {/* Flight Details */}
      <div className="flex flex-col space-y-4">
        {/* Cities and Times */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-xl font-bold text-[#1B3A4B]">{flight.departureTime}</div>
            <div className="text-sm font-medium text-[#1B3A4B]">{flight.departureCity}</div>
            <div className="text-xs text-gray-500">({flight.departureCode})</div>
          </div>

          {/* Flight Path */}
          <div className="flex flex-col items-center mx-4 flex-1">
            <div className="text-xs text-gray-500">{flight.duration}</div>
            <div className="w-full flex items-center my-2">
              <div className="flex-1 border-t-2 border-gray-300 border-dashed"></div>
              <FontAwesomeIcon icon={faPlane} className="mx-4 text-[#1B3A4B]" />
              <div className="flex-1 border-t-2 border-gray-300 border-dashed"></div>
            </div>
            <div className="text-xs text-gray-500">
              {flight.transits && flight.transits.length === 0 ? 'Direct Flight' : 
               flight.transits ? `${flight.transits.length -1} Transit${flight.transits.length > 1 ? 's' : ''}` : 'Direct Flight'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-xl font-bold text-[#1B3A4B]">{flight.arrivalTime}</div>
            <div className="text-sm font-medium text-[#1B3A4B]">{flight.arrivalCity}</div>
            <div className="text-xs text-gray-500">({flight.arrivalCode})</div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="text-xl font-bold text-[#1B3A4B]">${flight.price}</div>
          <button 
            onClick={handleModifyFlight}
            className="bg-[#1B3A4B] text-white px-4 py-2 rounded-lg hover:bg-[#0D1B2A] transition-colors text-sm"
          >
            Modify Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFlightCardComponent; 