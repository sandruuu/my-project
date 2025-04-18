import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import EditProfileModal from "../components/EditProfileModal";

interface AdminProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  birthDate: string;
  profileImage: string;
  country: string;
  city: string;
  postalCode: string;
}

const AdminProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<AdminProfileData>({
    firstName: "Sandru",
    lastName: "Laura",
    email: "admin@gmail.com",
    phone: "0745 123 456",
    role: "Admin",
    birthDate: "2003-07-10",
    profileImage: "/images/admin.jpg",
    country: "Romania",
    city: "Bucharest",
    postalCode: "123456"
  });

  const [modalType, setModalType] = useState<"personal" | "address" | null>(null);
  const [tempProfileData, setTempProfileData] = useState<AdminProfileData>({...profileData});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (name: string, value: string) => {
    setTempProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileData(prev => ({
            ...prev,
            profileImage: e.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileData({...tempProfileData});
    setModalType(null);
  };

  const handleOpenModal = (type: "personal" | "address") => {
    setTempProfileData({...profileData});
    setModalType(type);
  };

  const getModalFields = () => {
    if (modalType === "personal") {
      return [
        { name: "firstName", label: "First Name", type: "text", value: tempProfileData.firstName },
        { name: "lastName", label: "Last Name", type: "text", value: tempProfileData.lastName },
        { name: "birthDate", label: "Date of Birth", type: "date", value: tempProfileData.birthDate },
        { name: "email", label: "Email Address", type: "email", value: tempProfileData.email },
        { name: "phone", label: "Phone Number", type: "tel", value: tempProfileData.phone }
      ];
    } else {
      return [
        { name: "country", label: "Country", type: "text", value: tempProfileData.country },
        { name: "city", label: "City", type: "text", value: tempProfileData.city },
        { name: "postalCode", label: "Postal Code", type: "text", value: tempProfileData.postalCode }
      ];
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        <div className="bg-white rounded-lg shadow-sm mb-8 p-6 flex items-center">
          <div className="relative mr-6">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img 
                src={profileData.profileImage} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 text-[#1B3A4B] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#ECF0F1] transition-colors"
            >
              <FontAwesomeIcon icon={faPencilAlt} size="xs" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </div>
          
          <div>
            <h2 className="text-xl font-medium text-[#1B3A4B]">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-[#455A64]">{profileData.role}</p>
            <p className="text-[#78909C] text-sm mt-1">{profileData.city}, {profileData.country}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-lg font-medium text-[#1B3A4B]">Personal Information</h2>
            <button 
              onClick={() => handleOpenModal("personal")}
              className="flex items-center px-4 py-2 text-[#1B3A4B] rounded-md hover:bg-[#ECF0F1] transition-colors text-sm"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
              Edit
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="text-sm text-[#78909C] block mb-1">First Name</label>
                <div className="text-[#1B3A4B] font-medium">{profileData.firstName}</div>
              </div>
              
              <div>
                <label className="text-sm text-[#78909C] block mb-1">Last Name</label>
                <div className="text-[#1B3A4B] font-medium">{profileData.lastName}</div>
              </div>
              
              <div>
                <label className="text-sm text-[#78909C] block mb-1">Date of Birth</label>
                <div className="text-[#1B3A4B] font-medium">
                  {new Date(profileData.birthDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-')}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-[#78909C] block mb-1">Email Address</label>
                <div className="text-[#1B3A4B] font-medium">{profileData.email}</div>
              </div>
              
              <div>
                <label className="text-sm text-[#78909C] block mb-1">Phone Number</label>
                <div className="text-[#1B3A4B] font-medium">{profileData.phone}</div>
              </div>
              
              <div>
                <label className="text-sm text-[#78909C] block mb-1">User Role</label>
                <div className="text-[#1B3A4B] font-medium">{profileData.role}</div>
              </div>
            </div>
          </div>
        </div>

        <EditProfileModal
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          onSave={handleSave}
          title={modalType === "personal" ? "Edit Personal Information" : "Edit Address"}
          fields={getModalFields()}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default AdminProfile; 