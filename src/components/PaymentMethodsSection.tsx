import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';

interface PaymentCard {
  id: number;
  number: string;
  expiry: string;
  isPrimary: boolean;
}

interface PaymentMethodsSectionProps {
  cards: PaymentCard[];
  setPrimaryCard: (cardId: number) => void;
  handleDeleteCard: (cardId: number) => void;
  handleShowAddCard: () => void;
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  cards,
  setPrimaryCard,
  handleDeleteCard,
  handleShowAddCard
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <h2 className="text-3xl font-bold text-[#1B3A4B]">PAYMENT METHODS</h2>
        </div>
        <button
          onClick={handleShowAddCard}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#455A64] transition-colors w-full sm:w-auto"
        >
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
          <span>Add New Card</span>
        </button>
      </div>

      <div className="space-y-4">
        {cards.map(card => (
          <div
            key={card.id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <FontAwesomeIcon icon={faCreditCard} className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="text-gray-800 font-medium mb-1">Visa ending in {card.number.slice(-4)}</h3>
                  <div className="flex flex-col space-y-1">
                    <p className="text-gray-500 text-sm">Expires {card.expiry}</p>
                    {card.isPrimary && (
                      <span className="text-sm text-[#1B3A4B] bg-[#1B3A4B]/10 px-2 py-0.5 rounded w-fit">
                        Default
                      </span>
                    )}
                    {!card.isPrimary && (
                      <button
                        onClick={() => setPrimaryCard(card.id)}
                        className="text-gray-600 hover:text-primary transition-colors text-sm w-fit"
                      >
                        Set as Default  
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="text-red-500 hover:text-red-600 transition-colors mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodsSection; 