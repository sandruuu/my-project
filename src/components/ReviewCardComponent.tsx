import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

interface ReviewProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

const ReviewCardComponent: React.FC<ReviewProps> = ({ name, date, rating, comment }) => {
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-shadow duration-300 hover:shadow-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 rounded-full bg-[#B0BEC5] text-white flex items-center justify-center font-bold text-lg">
            {firstLetter}
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-[#1B3A4B]">{name}</h3>
              <p className="text-sm text-[#B0BEC5]">{date}</p>
            </div>
            <div className="flex">
              {[...Array(rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
              {[...Array(5 - rating)].map((_, i) => (
                <svg
                  key={i + rating}
                  className="w-5 h-5 text-[#ECEFF1]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
          </div>

          <div className="relative mt-4">
            <FontAwesomeIcon 
              icon={faQuoteLeft} 
              className="absolute top-0 left-0 text-[#ECEFF1] text-lg transform -translate-x-1 -translate-y-2" 
            />
            <p className="pl-6 text-[#455A64] leading-relaxed">{comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCardComponent;