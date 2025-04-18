import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faArrowLeft, faChevronDown, faChevronUp, faCreditCard, faPlus} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import FooterComponent from "../components/FooterComponent";
import NavigationBarComponent from '../components/NavigationBarComponent';


interface PaymentCard {
  id: number;
  number: string;
  expiry: string;
  isPrimary: boolean;
}

interface PassengerInfo {
    id: number;
    type: string;
    firstName: string;
    lastName: string;
    gender: string;
    specialAssistance: boolean;
    isCompleted: boolean;
    baggage?: {
        checked: number | null;
    };
    seatNumber?: string;
}

const FlightPayment: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { flight, passengers, selectedFare, selectedSeats } = location.state || {};
    
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
    });
    
    const [formErrors, setFormErrors] = useState({
        cardName: false,
        cardNumber: false,
        expiryMonth: false,
        expiryYear: false,
        cvv: false,
    });

    const [savedCards, setSavedCards] = useState<PaymentCard[]>([
        { id: 1, number: '**** **** **** 1234', expiry: '12/25', isPrimary: true },
        { id: 2, number: '**** **** **** 5678', expiry: '03/26', isPrimary: false },
    ]);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [showAddNewCard, setShowAddNewCard] = useState(false);
    const [saveNewCard, setSaveNewCard] = useState(false);
    
    const months = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return { value: month < 10 ? `0${month}` : `${month}`, label: month < 10 ? `0${month}` : `${month}` };
    });
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear + i;
        return { value: year.toString(), label: year.toString() };
    });
    
    useEffect(() => {
        const primaryCard = savedCards.find(card => card.isPrimary);
        if (primaryCard) {
            setSelectedCardId(primaryCard.id);
        }
    }, [savedCards]);

    const getFarePrice = (type: string) => {
        const basePrice = flight ? flight.price : 0;
        
        if (type === 'adult') {
            return basePrice;
        } else if (type === 'child') {
            return basePrice * 0.75;
        } else if (type === 'infant') {
            return basePrice * 0.1;
        }
        return basePrice;
    };

    const getSeatPrice = (seatNumber: string) => {
        if (!seatNumber) return 0;
        
        const row = parseInt(seatNumber.match(/\d+/)?.[0] || '0', 10);
        
        if (row <= 4) {
            return 20;
        }
        
        if (row === 14) {
            return 10;
        }
        
        return 5;
    };

    const getBaggagePrice = (baggageInfo?: { checked: number | null }) => {
        if (!baggageInfo || baggageInfo.checked === null) return 0;
        
        switch (baggageInfo.checked) {
            case 10:
                return 25;
            case 20:
                return 45; 
            case 26:
                return 65; 
            case 32:
                return 85;
            default:
                return 0;
        }
    };

    const getBaggageDescription = (baggageInfo?: { checked: number | null }) => {
        if (!baggageInfo || baggageInfo.checked === null) return 'No checked baggage';
        
        return `${baggageInfo.checked} kg checked baggage`;
    };

    const passengerPrices = passengers?.map((passenger: PassengerInfo) => {
        const seatNumber = selectedSeats ? selectedSeats[passenger.id - 1] : undefined;
        const seatPrice = seatNumber ? getSeatPrice(seatNumber) : 0;
        const farePrice = getFarePrice(passenger.type);
        const baggagePrice = getBaggagePrice(passenger.baggage);
        const baggageDescription = getBaggageDescription(passenger.baggage);
        
        return {
            id: passenger.id,
            name: `${passenger.firstName} ${passenger.lastName}`,
            type: passenger.type,
            price: farePrice,
            seatNumber,
            seatPrice,
            baggagePrice,
            baggageDescription
        };
    }) || [];

    const getRandomSeat = (passengerId: number) => {
        const rows = [5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18];
        const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
        const randomRow = rows[Math.floor(Math.random() * rows.length)];
        const randomColumn = columns[(passengerId + Math.floor(Math.random() * 3)) % columns.length]; // Add some variation based on passenger ID
        return `${randomRow}${randomColumn}`;
    };

    const calculateTotal = () => {
        return passengerPrices.reduce((acc: number, passenger: {price: number, seatPrice?: number, baggagePrice?: number}) => {
            return acc + passenger.price + (passenger.baggagePrice || 0);
        }, 0);
    };

    const validateCardFields = (): boolean => {
        const errors = {
            cardName: !formData.cardName.trim(),
            cardNumber: !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, '')),
            expiryMonth: !formData.expiryMonth,
            expiryYear: !formData.expiryYear,
            cvv: !/^\d{3}$/.test(formData.cvv)
        };
        
        setFormErrors(errors);
        
        return !Object.values(errors).some(error => error);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (showAddNewCard && !validateCardFields()) {
            return;
        }
        
        console.log('Processing payment...', selectedCardId ? 'Using saved card' : formData);
        
        const formattedPaymentInfo = !selectedCardId ? {
            ...formData,
            expirationDate: `${formData.expiryMonth}/${formData.expiryYear.substr(-2)}`,
            saveCard: saveNewCard
        } : { usesSavedCard: true, cardId: selectedCardId };
        
        navigate('/confirmation', {
            state: {
                flight,
                passengers,
                selectedFare,
                selectedSeat: selectedSeats && selectedSeats.length > 0 ? selectedSeats.join(', ') : null,
                paymentInfo: formattedPaymentInfo,
                totalAmount: calculateTotal()
            }
        });
    };

    const goBack = () => {
        navigate(-1);
    };

    const toggleDetails = () => {
        setIsDetailsExpanded(!isDetailsExpanded);
    };


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
                        <li className="step step-primary text-[#455A64]" data-content="✓">Choose seat</li>
                        <li className="step step-primary text-[#455A64]" data-content="✓">Passenger details</li>
                        <li className="step step-primary text-[#1B3A4B] font-bold" data-content="★">Payment</li>
                        <li className="step text-[#455A64]">Confirmation</li>
                    </ul>
                    </div>
                    
                    <h1 className="text-2xl px-5 md:px-20 font-bold mb-6 text-[#0D1B2A]">Payment Details</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-5 md:px-20">
                        {/* Price Details Section */}
                        <div className="md:col-span-1">
                            <div className="bg-white overflow-hidden">
                                <div 
                                    className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={toggleDetails}
                                >
                                    <h2 className="text-xl font-semibold text-[#1B3A4B]">Price Details</h2>
                                    <FontAwesomeIcon 
                                        icon={isDetailsExpanded ? faChevronUp : faChevronDown} 
                                        className="text-[#1B3A4B] transition-transform duration-300"
                                    />
                                </div>

                                <div 
                                    className={`border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
                                        isDetailsExpanded 
                                            ? 'max-h-[1000px] opacity-100' 
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="py-2">
                                        {flight && (
                                            <div className="mb-4 pb-4 border-b border-gray-200">
                                                <div className="text-sm font-medium text-[#1B3A4B]">
                                                    {flight.departureCity} to {flight.arrivalCity}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                {flight.flightNumber} <br /> {flight.departureDate}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Selected fare: <span className="font-medium text-[#1B3A4B]">{selectedFare}</span>
                                                </div>
                                                
                                                {selectedFare === "AIR BASIC" && (
                                                    <div className="mt-2 text-xs bg-[#FFF8E1] text-[#FF9800] p-2 rounded flex items-start">
                                                        <span>Seats automatically allocated!</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="">
                                            {passengerPrices.map((passenger: {
                                                id: number,
                                                name: string, 
                                                price: number, 
                                                type: string,
                                                seatNumber?: string,  
                                                baggageDescription?: string,
                                                baggagePrice?: number
                                            }, index: number) => (
                                                <div key={index} className="border-b border-gray-200 pb-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">{passenger.name}</span>
                                                        <span className="font-medium text-[#1B3A4B]">${passenger.price}</span>
                                                    </div>
                                                    
                                                    {selectedFare === "AIR BASIC" ? (
                                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center">
                                                                <span>Seat {getRandomSeat(passenger.id)}</span>
                                                            </span>
                                                        </div>
                                                    ) : passenger.seatNumber ? (
                                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center">
                                                                <span>Seat {passenger.seatNumber}</span>
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                    
                                                    {passenger.baggageDescription && passenger.baggageDescription !== 'No checked baggage' ? (
                                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center">
                                                                <span>{passenger.baggageDescription}</span>
                                                            </span>
                                                            <span>${passenger.baggagePrice}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center">
                                                                <span>No checked baggage</span>
                                                            </span>
                                                            <span>$0</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <div className="pt-3">
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-[#1B3A4B]">Total</span>
                                                    <span className="text-[#1B3A4B]">${calculateTotal()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form Section */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                                <div className="p-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            {savedCards.length > 0 && (
                                                <div className="mb-6">
                                                    <h3 className="text-lg font-medium text-[#1B3A4B] mb-3">Your Cards</h3>
                                                    <div className="space-y-3">
                                                        {savedCards.map(card => (
                                                            <div 
                                                                key={card.id}
                                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                                    selectedCardId === card.id 
                                                                        ? 'border-[#1B3A4B] bg-gray-50 shadow-sm' 
                                                                        : 'border-gray-300 hover:border-gray-400'
                                                                }`}
                                                                onClick={() => {
                                                                    setSelectedCardId(card.id);
                                                                    setShowAddNewCard(false);
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                type="radio"
                                                                                checked={selectedCardId === card.id}
                                                                                onChange={() => {
                                                                                    setSelectedCardId(card.id);
                                                                                    setShowAddNewCard(false);
                                                                                }}
                                                                                className="form-radio text-[#1B3A4B]"
                                                                            />
                                                                            <div className="ml-3 flex flex-col space-y-2">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <FontAwesomeIcon icon={faCreditCard} className="text-[#1B3A4B]" />
                                                                                    <span className="text-[#1B3A4B]">Visa ending in {card.number.slice(-4)}</span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-gray-500 text-sm">Exp: {card.expiry}</span>
                                                                                    {card.isPrimary && (
                                                                                        <span className="text-xs bg-[#1B3A4B]/10 text-[#1B3A4B] px-2 py-0.5 rounded">
                                                                                            Default
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        
                                                        {/* Add New Card Option */}
                                                        <div 
                                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                                showAddNewCard 
                                                                    ? 'border-[#1B3A4B] bg-gray-50 shadow-sm' 
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                            onClick={() => {
                                                                setShowAddNewCard(true);
                                                                setSelectedCardId(null);
                                                            }}
                                                        >
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    checked={showAddNewCard}
                                                                    onChange={() => {
                                                                        setShowAddNewCard(true);
                                                                        setSelectedCardId(null);
                                                                    }}
                                                                    className="form-radio text-[#1B3A4B]"
                                                                />
                                                                <div className="ml-3 flex items-center space-x-2 text-[#1B3A4B]">
                                                                    <FontAwesomeIcon icon={faPlus} />
                                                                    <span>Add New Card</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* New Card Form */}
                                            {(showAddNewCard || savedCards.length === 0) && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className={`flex-1 border ${
                                                            formErrors.cardName ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-[#B0BEC5] hover:border-[#455A64]'
                                                        } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                                                            <div className="flex-grow">
                                                                <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                                                                    Card Holder Name
                                                                </p>
                                                                <input
                                                                    type="text"
                                                                    name="cardName"
                                                                    value={formData.cardName}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Enter card holder name"
                                                                    className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="h-5 mt-0.5 ml-1">
                                                            {formErrors.cardName && <p className="text-xs text-red-500">Card holder name is required</p>}
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <div className={`flex-1 border ${
                                                            formErrors.cardNumber ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-[#B0BEC5] hover:border-[#455A64]'
                                                        } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                                                            <div className="flex-grow">
                                                                <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                                                                    Card Number
                                                                </p>
                                                                <input
                                                                    type="text"
                                                                    name="cardNumber"
                                                                    value={formData.cardNumber}
                                                                    onChange={handleInputChange}
                                                                    placeholder="1234 5678 9012 3456"
                                                                    maxLength={16}
                                                                    className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="h-5 mt-0.5 ml-1">
                                                            {formErrors.cardNumber && <p className="text-xs text-red-500">Please enter a valid 16-digit card number</p>}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className={`flex-1 border ${
                                                                formErrors.expiryMonth ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-[#B0BEC5] hover:border-[#455A64]'
                                                            } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                                                                <div className="flex-grow">
                                                                    <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                                                                        Expiry Month
                                                                    </p>
                                                                    <select
                                                                        name="expiryMonth"
                                                                        value={formData.expiryMonth}
                                                                        onChange={handleInputChange}
                                                                        className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent appearance-none"
                                                                    >
                                                                        <option value="" className="text-gray-400">Month</option>
                                                                        {months.map(month => (
                                                                            <option key={month.value} value={month.value}>{month.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="h-5 mt-0.5 ml-1">
                                                                {formErrors.expiryMonth && <p className="text-xs text-red-500">Required</p>}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className={`flex-1 border ${
                                                                formErrors.expiryYear ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-[#B0BEC5] hover:border-[#455A64]'
                                                            } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                                                                <div className="flex-grow">
                                                                    <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                                                                        Expiry Year
                                                                    </p>
                                                                    <select
                                                                        name="expiryYear"
                                                                        value={formData.expiryYear}
                                                                        onChange={handleInputChange}
                                                                        className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent appearance-none"
                                                                    >
                                                                        <option value="" className="text-gray-400">Year</option>
                                                                        {years.map(year => (
                                                                            <option key={year.value} value={year.value}>{year.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="h-5 mt-0.5 ml-1">
                                                                {formErrors.expiryYear && <p className="text-xs text-red-500">Required</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className={`flex-1 border ${
                                                            formErrors.cvv ? 'border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-[#B0BEC5] hover:border-[#455A64]'
                                                        } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]`}>
                                                            <div className="flex-grow">
                                                                <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                                                                    CVV
                                                                </p>
                                                                <div className="relative">
                                                                    <input
                                                                        type="text"
                                                                        name="cvv"
                                                                        value={formData.cvv}
                                                                        onChange={handleInputChange}
                                                                        placeholder="123"
                                                                        maxLength={3}
                                                                        className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent"
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faInfoCircle}
                                                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                                        title="3-digit security code on the back of your card"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="h-5 mt-0.5 ml-1">
                                                            {formErrors.cvv && <p className="text-xs text-red-500">Please enter a valid 3-digit CVV</p>}
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                name="saveNewCard"
                                                                checked={saveNewCard}
                                                                onChange={() => setSaveNewCard(!saveNewCard)}
                                                                className="w-4 h-4 text-[#1B3A4B] border-gray-300 rounded focus:ring-[#1B3A4B]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-600">
                                                                Save this card for future purchases
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="bg-[#1B3A4B] text-white py-3 px-10 rounded-md hover:bg-[#0D1B2A] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3A4B]"
                                                >
                                                    Pay ${calculateTotal()}
                                                </button> 
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-8 px-10">
                        <button 
                            onClick={goBack} 
                            className="flex items-center text-[#1B3A4B] hover:text-[#0D1B2A] font-medium py-2 px-6 rounded-md transition-all duration-300 hover:scale-110"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Back
                        </button>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default FlightPayment; 