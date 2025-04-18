import React from 'react';

interface PersonalDataProps {
  isEditing: boolean;
  formData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
  };
  personalDataErrors: {
    email: boolean;
    phone: boolean;
  };
  setIsEditing: (isEditing: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSave: () => void;
  setShowChangePassword: (showChangePassword: boolean) => void;
}

const PersonalDataSection: React.FC<PersonalDataProps> = ({
  isEditing,
  formData,
  personalDataErrors,
  setIsEditing,
  handleInputChange,
  handleSave,
  setShowChangePassword
}) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B3A4B]">PERSONAL DATA</h2>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-[#1B3A4B] rounded-xl hover:text-[#455A64] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          <span className="font-medium">{isEditing ? 'SAVE' : 'EDIT'}</span>
        </button>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-3 sm:p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
            <div className="flex-grow">
              <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                First Name
              </p>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent"
                />
              ) : (
                <span className="text-[#1B3A4B] text-sm sm:text-base">{formData.firstName}</span>
              )}
            </div>
          </div>
          <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-3 sm:p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
            <div className="flex-grow">
              <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                Last Name
              </p>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent"
                />
              ) : (
                <span className="text-[#1B3A4B] text-sm sm:text-base">{formData.lastName}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-3 sm:p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
          <div className="flex-grow">
            <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                Email
            </p>
            {isEditing ? (
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent ${personalDataErrors.email ? 'border-red-500' : ''}`}
                />
                {personalDataErrors.email && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                )}
              </div>
            ) : (
              <span className="text-[#1B3A4B] text-sm sm:text-base break-words">{formData.email}</span>
            )}
          </div>
        </div>

        <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-3 sm:p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
          <div className="flex-grow">
            <p className="text-xs font-medium text-[#1B3A4B] pb-1">
              Phone Number
            </p>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent ${personalDataErrors.phone ? 'border-red-500' : ''}`}
                />
                {personalDataErrors.phone && (
                  <p className="text-xs text-red-500 mt-1">Please enter a valid phone number (07xxxxxxxx)</p>
                )}
              </div>
            ) : (
              <span className="text-[#1B3A4B] text-sm sm:text-base">{formData.phone}</span>
            )}
          </div>
        </div>

        <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-3 sm:p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
          <div className="flex-grow">
            <p className="text-xs font-medium text-[#1B3A4B] pb-1">
              Address
            </p>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent"
              />
            ) : (
              <span className="text-[#1B3A4B] text-sm sm:text-base break-words">{formData.address}</span>
            )}
          </div>
        </div>

        <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-3 sm:p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                  Password
              </p>
              <span className="text-[#1B3A4B] text-sm sm:text-base">**********</span>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              className="text-[#1B3A4B] hover:text-[#455A64] transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDataSection; 