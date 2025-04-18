import React from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import FooterComponent from '../components/FooterComponent';
import NavigationBarComponent from '../components/NavigationBarComponent';
const ConfirmationPage: React.FC = () => {
    const location = useLocation();
    const { flight, selectedFare } = location.state || {};
    

    return (
        <>
            <NavigationBarComponent />
            <div className="min-h-screen bg-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Progress Bar */}
                    <div className="mb-12 mx-4 sm:mx-4 md:mx-12 lg:mx-20 overflow-x-auto">
                        <ul className="steps steps-horizontal w-full min-w-[600px]">
                            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
                                Search
                            </li>
                            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
                                Choose flight
                            </li>
                            <li className="step step-primary text-[#1B3A4B]" data-content="✓">
                                Choose fare
                            </li>
                            <li className="step step-primary text-[#1B3A4B]" data-content="✓">Choose seat</li>
                            <li className="step step-primary text-[#1B3A4B]" data-content="✓">Passenger details</li>
                            <li className="step step-primary text-[#1B3A4B]" data-content="✓">Payment</li>
                            <li className="step step-primary text-[#1B3A4B] font-bold" data-content="★">Confirmation</li>
                        </ul>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white p-8 md:p-12">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#B0BEC5]/30 rounded-full mb-6">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-[#1B3A4B] text-4xl" />
                                </div>
                                <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">Booking Confirmed!</h1>
                                <p className="text-lg text-[#455A64]">Thank you!</p>
                            </div>

                            <div className="border-t border-b border-[#ECEFF1] py-6 mb-8">
                                {flight && (
                                    <div className="text-center">
                                        <div className="text-lg font-medium text-[#1B3A4B]">
                                            {flight.departureCity} to {flight.arrivalCity}
                                        </div>
                                        <div className="text-[#455A64]">
                                            {flight.departureDate} <br /> {flight.flightNumber}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#ECEFF1] rounded-lg p-6 mb-8">
                                <h2 className="text-lg font-semibold mb-4 text-[#1B3A4B]">What's Next?</h2>
                                <ul className="space-y-2 text-[#455A64]">
                                    <li className="flex items-start">
                                        <span className="text-[#1B3A4B] mr-2">•</span>
                                        Please arrive at the airport at least 2 hours before departure
                                    </li>
                                    {selectedFare === "AIR BASIC" && (
                                        <li className="flex items-start">
                                            <span className="text-[#1B3A4B] mr-2">•</span>
                                            Remember that your seat was automatically allocated and may be changed at check-in
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="text-center">
                                <button 
                                    onClick={() => window.location.href = '/'}
                                    className="inline-block bg-[#1B3A4B] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#0D1B2A] transition-colors"
                                >
                                    Return to Homepage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default ConfirmationPage; 