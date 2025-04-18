import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faXmark,
  faInfo,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import FooterComponent from "../components/FooterComponent";
import NavigationBarComponent from "../components/NavigationBarComponent";

const FlightSeats = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, passengers, selectedFare } = location.state || {};

  const getPassengersByType = () => {
    const result = {
      adults: passengers?.filter((p: any) => p.type === "adult").length || 0,
      children: passengers?.filter((p: any) => p.type === "child").length || 0,
      infants: passengers?.filter((p: any) => p.type === "infant").length || 0,
    };
    return result;
  };

  const passengersByType = getPassengersByType();
  const totalPassengers = passengersByType.adults + passengersByType.children;

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const businessRows = 4;
  const economyRows = 21;
  const rows = businessRows + economyRows;
  const cols = 6;

  const [seatMap, setSeatMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialSeatMap: Record<string, string> = {};

    for (let row = 1; row <= businessRows; row++) {
      for (let col = 0; col < cols; col++) {
        const colLetter = String.fromCharCode(65 + col);
        if (row <= businessRows && (colLetter === "C" || colLetter === "D")) {
          continue;
        }
        initialSeatMap[`${row}${colLetter}`] =
          row <= businessRows ? "business" : "available";
      }
    }

    for (let col = 0; col < cols; col++) {
      const colLetter = String.fromCharCode(65 + col);
      initialSeatMap[`14${colLetter}`] = "premium";
    }

    const economySeats = (rows - businessRows) * cols;
    const takenSeatsCount = Math.floor(economySeats * 0.3);

    const randomUnavailableSeats = new Set<string>();
    while (randomUnavailableSeats.size < takenSeatsCount) {
      const randomRow =
        Math.floor(Math.random() * (rows - businessRows)) + businessRows + 1;
      const randomCol = String.fromCharCode(
        65 + Math.floor(Math.random() * cols)
      );
      const seatId = `${randomRow}${randomCol}`;
      if (!initialSeatMap[seatId]) {
        randomUnavailableSeats.add(seatId);
      }
    }

    randomUnavailableSeats.forEach((seatId) => {
      initialSeatMap[seatId] = "unavailable";
    });

    setSeatMap(initialSeatMap);
  }, [rows, cols, businessRows]);

  const getSeatStatus = (row: number, col: string) => {
    const seatId = `${row}${col}`;
    if (selectedSeats.includes(seatId)) {
      return "selected";
    }
    return seatMap[seatId] || "available";
  };

  const getSeatPrice = (row: number, col: string) => {
    const status = getSeatStatus(row, col);
    if (status === "business") {
      return 100;
    }
    if (status === "premium") {
      return 35;
    }
    return 15;
  };

  const handleSeatClick = (row: number, col: string) => {
    const seatId = `${row}${col}`;
    const status = getSeatStatus(row, col);

    if (status === "unavailable") {
      return;
    }

    if (
      (status === "business" || status === "premium") &&
      selectedFare !== "AIR PLUS"
    ) {
      return;
    }

    if (status === "selected") {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      if (selectedSeats.length < totalPassengers) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        const newSelectedSeats = [...selectedSeats];
        newSelectedSeats.shift();
        newSelectedSeats.push(seatId);
        setSelectedSeats(newSelectedSeats);
      }
    }
  };

  const goBack = () => {
    navigate("/flightFare", { state: { flight, passengers } });
  };

  const goNext = () => {
    if (selectedFare === "AIR BASIC" || 
        (selectedFare === "AIR ECO" && selectedSeats.length === 0)) {
      navigate('/passengerDetails', {
        state: {
          flight,
          passengers,
          selectedFare,
          selectedSeats: selectedFare === "AIR BASIC" ? [] : selectedSeats,
        }
      });
    } else if (selectedSeats.length === totalPassengers) {
      navigate('/passengerDetails', {
        state: {
          flight,
          passengers,
          selectedFare,
          selectedSeats
        }
      });
    }
  };

  const renderSeat = (row: number, col: string) => {
    if (row <= businessRows && (col === "C" || col === "D" || col === " ")) {
      return (
        <div className="w-10 h-10 flex items-center justify-center text-[#B0BEC5]">
          ⋮
        </div>
      );
    }

    if (col === " ") {
      return (
        <div className="w-10 h-10 flex items-center justify-center text-[#B0BEC5]">
          ⋮
        </div>
      );
    }

    const status = getSeatStatus(row, col);
    const seatId = `${row}${col}`;
    const price = getSeatPrice(row, col);

    let bgColor = "bg-[#DEDEDE]"; 
    let textColor = "text-white";
    let icon = null;
    let isDisabled = status === "unavailable";
    let seatClass = "";

    if (
      (status === "business" || status === "premium") &&
      selectedFare !== "AIR PLUS"
    ) {
      bgColor = "bg-[#DEDEDE]";
      textColor = "text-white";
      isDisabled = true;
    } else {
      switch (status) {
        case "selected":
          bgColor = "bg-[#A8DCAB]"; 
          textColor = "text-[#1B3A4B]";
          icon = <FontAwesomeIcon icon={faCheck} size="xs" />;
          break;
        case "unavailable":
          bgColor = "bg-[#DEDEDE]";
          textColor = "text-white";
          icon = <FontAwesomeIcon icon={faXmark} size="xs" />;
          break;
        case "business":
          bgColor = "bg-[#0D1B2A]";
          textColor = "text-white";
          seatClass = "business";
          icon = selectedSeats.includes(seatId) ? (
            <FontAwesomeIcon icon={faCheck} size="xs" />
          ) : null;
          break;
         default:
          bgColor = "bg-white";
          textColor = "text-[#1B3A4B]";
          seatClass = "available";
          break;
      }
    }
    let specialIcon = null;
    return (
      <button
        onClick={() => handleSeatClick(row, col)}
        disabled={isDisabled}
        className={`w-8 sm:w-10 h-8 sm:h-10 ${bgColor} ${textColor} rounded-md m-0.5 flex flex-col items-center justify-center shadow-sm ${
          !isDisabled
            ? "hover:opacity-80 hover:shadow-md transition-all duration-200"
            : ""
        } ${seatClass === "business" ? "" : seatClass === "available" ? "border border-[#B0BEC5]" : ""}`}
        title={`Seat ${seatId} - ${
          status === "business"
            ? "Business"
            : status === "premium"
            ? "Premium"
            : "Standard"
        } - $${price} ${
          (status === "business" || status === "premium") &&
          selectedFare !== "AIR PLUS"
            ? "- Only available with AIR PLUS fare"
            : ""
        }`}
      >
        <span className="text-[11px] font-semibold">{seatId}</span>
        {icon && <div className="mt-0.5">{icon}</div>}
        {specialIcon}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBarComponent />
      <div className="container mx-auto py-8 flex-grow">
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
            <li className="step text-[#1B3A4B] step-primary font-bold" data-content="★">Choose seat</li>
            <li className="step text-[#455A64]">Passenger details</li>
            <li className="step text-[#455A64]">Payment</li>
            <li className="step text-[#455A64]">Confirmation</li>
          </ul>
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="bg-white">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 text-[#1B3A4B] px-10 pt-5">
                {flight?.departureCity} to {flight?.arrivalCity}
              </h1>
            </div>
          </div>

          {selectedFare === "AIR BASIC" && (
            <div className="mb-5 bg-[#FFF4E5] border-l-4 border-[#FF9800] p-4 rounded shadow-sm">
              <div className="flex text-[#FF9800]">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-1 mr-2" />
                <div>
                  <p className="font-semibold">AIR BASIC fare doesn't include seat selection</p>
                  <p className="text-sm">Seats will be automatically assigned at check-in</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white mb-8">
            <div className="flex items-center justify-between mb-4">
              {selectedFare === "AIR BASIC" && (
                <div className="py-1 bg-[#fff8e1] rounded-lg border border-[#ffecb3] flex items-center">
                  <FontAwesomeIcon
                    icon={faInfo}
                    className="text-[#ffa000] mr-2"
                  />
                  <span className="text-xs text-[#bf360c]">
                    Random seat assignment at check-in
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center mt-4 mb-6">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="flex items-center justify-start bg-white/50 rounded-lg p-3">
                  <div className="w-5 h-5 bg-white border border-[#B0BEC5] rounded-md mr-3 shadow-sm"></div>
                  <span className="text-xs text-[#455A64] font-medium">
                    Available
                  </span>
                </div>
                <div className="flex items-center justify-start bg-white/50 rounded-lg p-3">
                  <div className="w-5 h-5 bg-[#A8DCAB] rounded-md mr-3 shadow-sm"></div>
                  <span className="text-xs text-[#455A64] font-medium">
                    Selected
                  </span>
                </div>
                <div className="flex items-center justify-start bg-white/50 rounded-lg p-3">
                  <div className="w-5 h-5 bg-[#0D1B2A] border-2 rounded-md mr-3 shadow-sm"></div>
                  <span className="text-xs text-[#455A64] font-medium">
                    Business Class
                  </span>
                </div>
                <div className="flex items-center justify-start bg-white/50 rounded-lg p-3">
                  <div className="w-5 h-5 bg-[#DEDEDE] rounded-md mr-3 shadow-sm"></div>
                  <span className="text-xs text-[#455A64] font-medium">
                    Unavailable
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-10">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-md p-6 top-4">
                <h2 className="text-lg font-bold text-[#1B3A4B] mb-4 flex items-center">
                  Selected Seats
                </h2>

                <div className="mb-6">
                  {selectedSeats.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSeats.map((seatId, index) => {
                        const status = getSeatStatus(
                          parseInt(seatId.match(/\d+/)?.[0] || "0"),
                          seatId.slice(-1)
                        );

                        return (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-[#f5f5f5] p-3 rounded-lg transition-colors"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-9 h-9 ${
                                  status === "business"
                                    ? "bg-[#0D1B2A] border-2 border-amber-400"
                                    : status === "premium"
                                    ? "bg-[#1B3A4B]"
                                    : "bg-[#A8DCAB]"
                                } rounded-md flex items-center justify-center text-white shadow-sm`}
                              >
                                <span className="text-xs font-bold">
                                  {seatId}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-bold text-[#1B3A4B]">
                                  Seat {seatId}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : selectedFare === "AIR BASIC" ? (
                    <div className="bg-[#fff8e1] p-4 rounded-lg text-center border border-[#ffecb3]">
                      <p className="text-sm text-[#bf360c]">
                        Random seat assignment will be provided at check-in
                      </p>
                    </div>
                  ) : (
                    <div className="bg-[#f5f5f5] p-4 rounded-lg text-center">
                      <p className="text-sm text-[#455A64]">
                        No seats selected yet
                      </p>
                    </div>
                  )}
                </div>

                {selectedFare !== "AIR BASIC" && (
                  <div className="my-6 p-4 bg-[#f5f5f5] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#1B3A4B] font-bold">
                        {selectedSeats.length} selected
                      </span>
                      <span className="text-xs text-[#1B3A4B]">
                        {totalPassengers} required
                      </span>
                    </div>
                    <div className="w-full bg-[#B0BEC5]/30 rounded-full h-2.5">
                      <div
                        className={`${
                          selectedSeats.length === totalPassengers
                            ? "bg-[#A8DCAB]"
                            : "bg-[#1B3A4B]"
                        } h-2.5 rounded-full transition-all duration-500`}
                        style={{
                          width: `${
                            (selectedSeats.length / totalPassengers) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seat map */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
                <div className="relative text-center">
                  <div className="overflow-x-auto pb-4">
                    <div className="inline-block min-w-[340px] w-full max-w-[600px] mx-auto">
                      {/* Seating chart */}
                      <div className="mb-4 text-center">
                        <div className="flex justify-center mb-4 sticky top-0 bg-white py-2 z-10">
                          <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-medium text-[#1B3A4B]"></div>
                          {["A", "B", "C", " ", "D", "E", "F"].map((col) => (
                            <div
                              key={col}
                              className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-semibold text-[#1B3A4B]"
                            >
                              {col}
                            </div>
                          ))}
                        </div>

                        <div className="text-sm font-bold text-[#1B3A4B] mb-3 mt-6 text-left pl-2 sm:pl-4 flex items-center pb-2 sticky bg-white z-10">
                          <div className="h-5 w-1 bg-[#0D1B2A] mr-2 sm:ml-32 md:ml-40 rounded-sm"></div>
                          Business Class
                        </div>

                        {Array.from(
                          { length: businessRows },
                          (_, i) => i + 1
                        ).map((row) => (
                          <div
                            key={row}
                            className="flex justify-center my-1 rounded-lg py-1"
                          >
                            <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-semibold text-[#0D1B2A] rounded-md mr-1">
                              {row}
                            </div>
                            {["A", "B", "C", " ", "D", "E", "F"].map((col) => (
                              <div
                                key={col}
                                className="flex items-center justify-center"
                              >
                                {renderSeat(row, col)}
                              </div>
                            ))}
                          </div>
                        ))}

                        <div className="text-sm font-bold text-[#1B3A4B] mb-3 mt-8 text-left pl-2 sm:pl-4 flex items-center pb-2 sticky bg-white z-10">
                          <div className="h-5 w-1 bg-[#1B3A4B] mr-2 sm:ml-32 md:ml-40 rounded-sm"></div>
                          Economy Class
                        </div>

                        {Array.from(
                          { length: economyRows },
                          (_, i) => i + businessRows + 1
                        ).map((row) => {
                          if (row === 15) {
                            return (
                              <>
                                <div key="empty-row" className="h-6"></div>
                                <div
                                  key={row}
                                  className="flex justify-center my-1"
                                >
                                  <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-semibold text-[#0D1B2A] rounded-md mr-1">
                                    {row}
                                  </div>
                                  {["A", "B", "C", " ", "D", "E", "F"].map(
                                    (col) => (
                                      <div
                                        key={col}
                                        className="flex items-center justify-center"
                                      >
                                        {renderSeat(row, col)}
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            );
                          }

                          return (
                            <div key={row} className="flex justify-center my-1">
                              <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center font-semibold text-[#0D1B2A] rounded-md mr-1">
                                {row}
                              </div>
                              {["A", "B", "C", " ", "D", "E", "F"].map(
                                (col) => (
                                  <div
                                    key={col}
                                    className="flex items-center justify-center"
                                  >
                                    {renderSeat(row, col)}
                                  </div>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center px-20 mb-10">
            <button
              onClick={goBack}
              className="flex items-center text-[#1B3A4B] font-medium hover:text-[#0D1B2A] transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </button>

            <div className="flex flex-col items-end">
              <button
                onClick={goNext}
                className={`flex items-center font-medium ${
                  selectedFare === "AIR BASIC" ||
                  selectedSeats.length === totalPassengers
                    ? "text-[#1B3A4B] hover:text-[#0D1B2A]"
                    : "text-[#B0BEC5] cursor-not-allowed"
                } transition-colors`}
                disabled={
                  selectedFare !== "AIR BASIC" &&
                  selectedSeats.length !== totalPassengers
                }
              >
                Next
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default FlightSeats;