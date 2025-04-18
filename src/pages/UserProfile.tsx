import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingBag,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import FooterComponent from "../components/FooterComponent";
import { useLocation } from "react-router-dom";
import NavigationBarComponent from "../components/NavigationBarComponent";
import OrdersSection from "../components/OrdersSection";
import PersonalDataSection from "../components/PersonalDataSection";
import PaymentMethodsSection from "../components/PaymentMethodsSection";
import plane from "../assets/images/plane2.jpg";
import SelectComponent from "../components/SelectComponent";
import orders, { FlightOrder } from "../assets/orders";
import card, { PaymentCard } from "../assets/payment";
type Section = "orders" | "personal" | "payment";
const UserProfile: React.FC = () => {
  const location = useLocation();
  const initialSection = location.state?.section || "orders";
  const [selectedSection, setSelectedSection] =
    useState<Section>(initialSection);
  const [cards, setCards] = useState<PaymentCard[]>(card);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "laura.maris104121@gmail.com",
    phone: "0757831208",
    firstName: "Laura",
    lastName: "Sandru",
    address: "Strada Viilor, Nr. 1, București",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    passwordMatch: false,
  });

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardData, setNewCardData] = useState({
    holderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<
    FlightOrder["status"] | "all"
  >("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedFlightForReview, setSelectedFlightForReview] = useState<{
    flightNumber: string;
    route: string;
  } | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const [formErrors, setFormErrors] = useState({
    holderName: false,
    cardNumber: false,
    expiryMonth: false,
    expiryYear: false,
    cvv: false,
  });
  const HARDCODED_PASSWORD = "parola123";
  const [personalDataErrors, setPersonalDataErrors] = useState({
    email: false,
    phone: false,
  });

  const filteredOrders = orders.filter((order) =>
    selectedStatus === "all" ? true : order.status === selectedStatus
  );

  const getStatusCount = (status: FlightOrder["status"]) => {
    return orders.filter((order) => order.status === status).length;
  };

  const setPrimaryCard = (cardId: number) => {
    setCards(
      cards.map((card) => ({
        ...card,
        isPrimary: card.id === cardId,
      }))
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email" || name === "phone") {
      setPersonalDataErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!validatePersonalData()) {
      return;
    }
    setIsEditing(false);
  };

  const validatePasswordFields = (): boolean => {
    const errors = {
      currentPassword: !passwordData.currentPassword.trim(),
      newPassword: !passwordData.newPassword.trim(),
      confirmPassword: !passwordData.confirmPassword.trim(),
      passwordMatch: passwordData.newPassword !== passwordData.confirmPassword,
    };

    setPasswordErrors(errors);

    if (
      !errors.currentPassword &&
      passwordData.currentPassword !== HARDCODED_PASSWORD
    ) {
      setPasswordErrors((prev) => ({
        ...prev,
        currentPassword: true,
      }));
      return false;
    }

    return !Object.values(errors).some((error) => error);
  };

  const handlePasswordSave = () => {
    if (!validatePasswordFields()) {
      return;
    }

    setShowChangePassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
      passwordMatch: false,
    });
  };

  const handleNewCardChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    fieldName?: string
  ) => {
    if (typeof e === "string" && fieldName) {
      setNewCardData((prev) => ({
        ...prev,
        [fieldName]: e,
      }));
    } else if (typeof e !== "string") {
      const { name, value } = e.target;
      setNewCardData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateCardFields = (): boolean => {
    const errors = {
      holderName: !newCardData.holderName.trim(),
      cardNumber: !/^\d{16}$/.test(newCardData.cardNumber.replace(/\s/g, "")),
      expiryMonth: !newCardData.expiryMonth,
      expiryYear: !newCardData.expiryYear,
      cvv: !/^\d{3}$/.test(newCardData.cvv),
    };

    setFormErrors(errors);

    return !Object.values(errors).some((error) => error);
  };

  const handleAddCard = () => {
    if (!validateCardFields()) {
      return; // Don't proceed if validation fails
    }
    const newCard: PaymentCard = {
      id: cards.length + 1,
      number: `**** **** **** ${newCardData.cardNumber.slice(-4)}`,
      expiry: `${newCardData.expiryMonth}/${newCardData.expiryYear.slice(-2)}`,
      isPrimary: cards.length === 0,
    };

    setCards((prev) => [...prev, newCard]);
    setShowAddCard(false);
    setNewCardData({
      holderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setFormErrors({
      holderName: false,
      cardNumber: false,
      expiryMonth: false,
      expiryYear: false,
      cvv: false,
    });
  };

  const handleDeleteCard = (cardId: number) => {
    setCardToDelete(cardId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      setCards(cards.filter((card) => card.id !== cardToDelete));
    }
    setShowDeleteConfirm(false);
    setCardToDelete(null);
  };

  const getStatusColor = (status: FlightOrder["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleReviewSubmit = () => {
    console.log("Review submitted:", {
      flightNumber: selectedFlightForReview?.flightNumber,
      ...reviewData,
    });
    setShowReviewModal(false);
    setReviewData({ rating: 5, comment: "" });
    setSelectedFlightForReview(null);
  };

  const openReviewModal = (
    flightNumber: string,
    departure: string,
    arrival: string
  ) => {
    setSelectedFlightForReview({
      flightNumber,
      route: `${departure} - ${arrival}`,
    });
    setShowReviewModal(true);
  };

  const handleShowAddCard = () => {
    setNewCardData({
      holderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setFormErrors({
      holderName: false,
      cardNumber: false,
      expiryMonth: false,
      expiryYear: false,
      cvv: false,
    });
    setShowAddCard(true);
  };

  const validatePersonalData = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid =
      formData.email.trim() !== "" && emailRegex.test(formData.email);

    const phoneRegex = /^(07[0-9]{8}|\\+407[0-9]{8})$/;
    const isPhoneValid = phoneRegex.test(formData.phone.replace(/\s/g, ""));

    const errors = {
      email: !isEmailValid,
      phone: !isPhoneValid,
    };

    setPersonalDataErrors(errors);

    return !Object.values(errors).some((error) => error);
  };

  const handleCloseAddCard = () => {
    setShowAddCard(false);
    setNewCardData({
      holderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setFormErrors({
      holderName: false,
      cardNumber: false,
      expiryMonth: false,
      expiryYear: false,
      cvv: false,
    });
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
      passwordMatch: false,
    });
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setReviewData({ rating: 5, comment: "" });
    setSelectedFlightForReview(null);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "orders":
        return (
          <OrdersSection
            orders={orders}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            getStatusCount={getStatusCount}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            formatTime={formatTime}
            formatPrice={formatPrice}
            openReviewModal={openReviewModal}
          />
        );
      case "personal":
        return (
          <PersonalDataSection
            isEditing={isEditing}
            formData={formData}
            personalDataErrors={personalDataErrors}
            setIsEditing={setIsEditing}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            setShowChangePassword={setShowChangePassword}
          />
        );
      case "payment":
        return (
          <PaymentMethodsSection
            cards={cards}
            setPrimaryCard={setPrimaryCard}
            handleDeleteCard={handleDeleteCard}
            handleShowAddCard={handleShowAddCard}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const isModalOpen =
      showReviewModal || showAddCard || showDeleteConfirm || showChangePassword;

    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showReviewModal, showAddCard, showDeleteConfirm, showChangePassword]);

  return (
    <div className="min-h-screen relative">
      <NavigationBarComponent />
      <div
        className="absolute w-full h-72 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${plane})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      <div className="relative z-1 pt-20 px-6 sm:px-10 md:px-10 lg:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
          <p className="text-white opacity-90">
            Manage your account details, bookings, and saved payment methods
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-40 shrink-0">
            <div className="bg-white shadow-md rounded-2xl overflow-hidden top-24">
              <div className="flex flex-row md:flex-col">
                <button
                  onClick={() => setSelectedSection("orders")}
                  className={`flex items-center py-4 px-6 w-1/3 md:w-full justify-center md:justify-start ${
                    selectedSection === "orders"
                      ? "bg-[#1B3A4B] text-white"
                      : "text-[#455A64] hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="w-5 h-5" />
                  <span className="hidden md:inline-block ml-3">Orders</span>
                </button>
                <button
                  onClick={() => setSelectedSection("personal")}
                  className={`flex items-center py-4 px-6 w-1/3 md:w-full justify-center md:justify-start ${
                    selectedSection === "personal"
                      ? "bg-[#1B3A4B] text-white"
                      : "text-[#455A64] hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                  <span className="hidden md:inline-block ml-3">Personal</span>
                </button>
                <button
                  onClick={() => setSelectedSection("payment")}
                  className={`flex items-center py-4 px-6 w-1/3 md:w-full justify-center md:justify-start ${
                    selectedSection === "payment"
                      ? "bg-[#1B3A4B] text-white"
                      : "text-[#455A64] hover:bg-gray-50"
                  }`}
                >
                  <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5" />
                  <span className="hidden md:inline-block ml-3">Payment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-md transform transition-all shadow-xl mx-2">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#1B3A4B]">
                Change Password
              </h3>
              <button
                onClick={handleCloseChangePassword}
                className="text-gray-400 hover:text-[#1B3A4B] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`flex-1 border ${
                  passwordErrors.currentPassword
                    ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "border-[#B0BEC5] hover:border-[#455A64]"
                } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
              >
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    Current Password
                  </p>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="w-full text-[#1B3A4B] placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div
                className={`flex-1 border ${
                  passwordErrors.newPassword
                    ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "border-[#B0BEC5] hover:border-[#455A64]"
                } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
              >
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    New Password
                  </p>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="w-full text-[#1B3A4B] placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div
                className={`flex-1 border ${
                  passwordErrors.confirmPassword || passwordErrors.passwordMatch
                    ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "border-[#B0BEC5] hover:border-[#455A64]"
                } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
              >
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    Confirm New Password
                  </p>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="w-full text-[#1B3A4B] placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {passwordErrors.passwordMatch && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2 sm:space-x-4 mt-6">
              <button
                onClick={handleCloseChangePassword}
                className="px-3 sm:px-4 py-2 text-[#1B3A4B] hover:text-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSave}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-md transform transition-all shadow-xl mx-2">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#1B3A4B]">
                Add New Card
              </h3>
              <button
                onClick={handleCloseAddCard}
                className="text-gray-400 hover:text-[#1B3A4B] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div
                className={`flex-1 border ${
                  formErrors.holderName
                    ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "border-[#B0BEC5] hover:border-[#455A64]"
                } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
              >
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    Card Holder Name
                  </p>
                  <input
                    type="text"
                    name="holderName"
                    value={newCardData.holderName}
                    onChange={handleNewCardChange}
                    placeholder="Enter card holder name"
                    className="w-full text-[#1B3A4B] placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div
                className={`flex-1 border ${
                  formErrors.cardNumber
                    ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "border-[#B0BEC5] hover:border-[#455A64]"
                } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
              >
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    Card Number
                  </p>
                  <input
                    type="text"
                    name="cardNumber"
                    value={newCardData.cardNumber}
                    onChange={handleNewCardChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full text-[#1B3A4B] placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`flex-1 border ${
                    formErrors.expiryMonth || formErrors.expiryYear
                      ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      : "border-[#B0BEC5] hover:border-[#455A64]"
                  } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
                >
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                      Expiry Month
                    </p>
                    <SelectComponent
                      options={Array.from({ length: 12 }, (_, i) => ({
                        value: String(i + 1).padStart(2, "0"),
                        label: String(i + 1).padStart(2, "0"),
                      }))}
                      value={newCardData.expiryMonth}
                      onChange={(value) =>
                        handleNewCardChange(value, "expiryMonth")
                      }
                      placeholder="Month"
                      className="w-full bg-transparent"
                    />
                  </div>
                </div>

                <div
                  className={`flex-1 border ${
                    formErrors.expiryMonth || formErrors.expiryYear
                      ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      : "border-[#B0BEC5] hover:border-[#455A64]"
                  } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
                >
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                      Expiry Year
                    </p>
                    <SelectComponent
                      options={Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return {
                          value: String(year),
                          label: String(year),
                        };
                      })}
                      value={newCardData.expiryYear}
                      onChange={(value) =>
                        handleNewCardChange(value, "expiryYear")
                      }
                      placeholder="Year"
                      className="w-full bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 border ${
                  formErrors.cvv
                    ? "border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : "border-[#B0BEC5] hover:border-[#455A64]"
                } rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300`}
              >
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">CVV</p>
                  <input
                    type="text"
                    name="cvv"
                    value={newCardData.cvv}
                    onChange={handleNewCardChange}
                    placeholder="XXX"
                    className="w-full text-[#1B3A4B] placeholder-gray-400 bg-transparent focus:outline-none"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 sm:space-x-4 mt-6">
              <button
                onClick={handleCloseAddCard}
                className="px-3 sm:px-4 py-2 text-[#1B3A4B] hover:text-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Card Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-md transform transition-all shadow-xl mx-2">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-[#1B3A4B]">
                Delete Card
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-[#1B3A4B] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this card? This action cannot be
              undone.
            </p>

            <div className="flex justify-end space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 sm:px-4 py-2 text-[#1B3A4B] hover:text-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCard}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedFlightForReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-md transform transition-all shadow-xl mx-2">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1B3A4B]">
                  Flight Review
                </h3>
                <p className="text-xs sm:text-sm text-[#455A64] mt-1">
                  Flight {selectedFlightForReview.flightNumber}
                  <br />
                  {selectedFlightForReview.route}
                </p>
              </div>
              <button
                onClick={handleCloseReviewModal}
                className="text-gray-400 hover:text-[#1B3A4B] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    Rating
                  </p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setReviewData((prev) => ({ ...prev, rating: star }))
                        }
                        className="text-2xl focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={star <= reviewData.rating ? "#FFD700" : "none"}
                          stroke={
                            star <= reviewData.rating
                              ? "#FFD700"
                              : "currentColor"
                          }
                          className="w-6 h-6 sm:w-8 sm:h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 border border-[#B0BEC5] hover:border-[#455A64] rounded-lg p-4 bg-[#ECEFF1] transition-all duration-300 hover:bg-[#B0BEC5]">
                <div className="flex-grow">
                  <p className="text-xs font-medium text-[#1B3A4B] pb-1">
                    Your Review
                  </p>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Share your experience..."
                    className="w-full h-32 text-[#1B3A4B] placeholder-gray-400 transition-colors focus:outline-none bg-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 sm:space-x-4 mt-6">
              <button
                onClick={handleCloseReviewModal}
                className="px-3 sm:px-4 py-2 text-[#1B3A4B] hover:text-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#455A64] transition-colors font-medium text-sm sm:text-base"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterComponent />
    </div>
  );
};
export default UserProfile;
