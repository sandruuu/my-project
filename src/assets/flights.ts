export type Flight = {
  id: number;
  code: string;
  departureTime: string;
  arrivalTime: string;
  startDate: string;
  endDate: string;
  departureCity: string;
  arrivalCity: string;
  departureCode: string;
  arrivalCode: string;
  duration: string;
  type: string;
  seat: string;
  meal: string;
  aircraft: string;
  price: number;
  transits: number[];
  frequency: "daily" | "weekly";
  flightNumber: string;
  status: "active" | "completed" | "cancelled";
};

export const flights: Flight[] = [
  {
    id: 1,
    code: "SH-LAX-JFK-01",
    departureTime: "06:00",
    arrivalTime: "09:00",
    startDate: "2025-04-05",
    endDate: "same day",
    departureCity: "Los Angeles",
    arrivalCity: "New York",
    departureCode: "LAX",
    arrivalCode: "JFK",
    duration: "3 h",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "No Meal",
    aircraft: "Boeing 737-800",
    price: 200,
    transits: [],
    frequency: "daily",
    flightNumber: "SH-LAX-JFK-01",
    status: "active",
  },
  {
    id: 3,
    code: "AJ-LAX-JFK-03",
    departureTime: "10:00",
    arrivalTime: "12:45",
    startDate: "2025-04-06",
    endDate: "same day",
    departureCity: "Los Angeles",
    arrivalCity: "New York",
    departureCode: "LAX",
    arrivalCode: "JFK",
    duration: "2 hr 45 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "In-Flight Meal",
    aircraft: "Airbus A321",
    price: 400,
    transits: [],
    frequency: "weekly",
    flightNumber: "AJ-LAX-JFK-03",
    status: "active",
  },
  {
    id: 4,
    code: "JS-CDG-DEL-04",
    departureTime: "10:30",
    arrivalTime: "21:00",
    startDate: "2025-04-08",
    endDate: "same day",
    departureCity: "Paris",
    arrivalCity: "New Delhi",
    departureCode: "CDG",
    arrivalCode: "DEL",
    duration: "10 hr 30 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "In-Flight Meal",
    aircraft: "Airbus A320",
    price: 800,
    transits: [],
    frequency: "weekly",
    flightNumber: "JS-CDG-DEL-04",
    status: "active",
  },
  {
    id: 6,
    code: "AJ-IST-BKK-06",
    departureTime: "09:00",
    arrivalTime: "19:00",
    startDate: "2025-04-09",
    endDate: "same day",
    departureCity: "Istanbul",
    arrivalCity: "Bangkok",
    departureCode: "IST",
    arrivalCode: "BKK",
    duration: "10 hours",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "In-Flight Meal",
    aircraft: "Airbus A320",
    price: 770,
    transits: [],
    frequency: "weekly",
    flightNumber: "AJ-IST-BKK-06",
    status: "active",
  },
  {
    id: 7,
    code: "FF-BER-MUC-07",
    departureTime: "01:00",
    arrivalTime: "02:30",
    startDate: "2025-04-05",
    endDate: "same day",
    departureCity: "Berlin",
    arrivalCity: "Munich",
    departureCode: "BER",
    arrivalCode: "MUC",
    duration: "1 hr 30 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "No Meal",
    aircraft: "Boeing 737-700",
    price: 90,
    transits: [],
    frequency: "daily",
    flightNumber: "FF-BER-MUC-07",
    status: "active",
  },
  {
    id: 8,
    code: "SH-OTP-LHR-01",
    departureTime: "08:00",
    arrivalTime: "11:00",
    startDate: "2025-04-05",
    endDate: "same day",
    departureCity: "Bucharest",
    arrivalCity: "London",
    departureCode: "OTP",
    arrivalCode: "LHR",
    duration: "3 hours",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Snack",
    aircraft: "Boeing 737-800",
    price: 200,
    transits: [],
    frequency: "daily",
    flightNumber: "SH-OTP-LHR-01",
    status: "active",
  },
  {
    id: 9,
    code: "SH-LHR-JFK-02",
    departureTime: "01:00",
    arrivalTime: "08:00",
    startDate: "2025-04-05",
    endDate: "same day",
    departureCity: "London",
    arrivalCity: "New York",
    departureCode: "LHR",
    arrivalCode: "JFK",
    duration: "7 hours",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Full Meal",
    aircraft: "Boeing 737-800",
    price: 450,
    transits: [],
    frequency: "daily",
    flightNumber: "SH-LHR-JFK-02",
    status: "active",
  },
  {
    id: 10,
    code: "SH-OTP-JFK-03",
    departureTime: "08:00",
    arrivalTime: "20:00",
    startDate: "2025-04-05",
    endDate: "same day",
    departureCity: "Bucharest",
    arrivalCity: "New York",
    departureCode: "OTP",
    arrivalCode: "JFK",
    duration: "12 hours",
    type: "Transit",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Snack",
    aircraft: "Boeing 737-800",
    price: 650,
    transits: [8, 9],
    frequency: "daily",
    flightNumber: "SH-OTP-JFK-03",
    status: "active",
  },
  {
    id: 11,
    code: "EW-BRU-VIE-11",
    departureTime: "07:30",
    arrivalTime: "09:00",
    startDate: "2025-04-10",
    endDate: "same day",
    departureCity: "Brussels",
    arrivalCity: "Vienna",
    departureCode: "BRU",
    arrivalCode: "VIE",
    duration: "1 hr 30 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "No Meal",
    aircraft: "Airbus A319",
    price: 120,
    transits: [],
    frequency: "daily",
    flightNumber: "EW-BRU-VIE-11",
    status: "active",
  },
  {
    id: 12,
    code: "SH-MUC-AMS-12",
    departureTime: "12:00",
    arrivalTime: "13:30",
    startDate: "2025-04-11",
    endDate: "same day",
    departureCity: "Munich",
    arrivalCity: "Amsterdam",
    departureCode: "MUC",
    arrivalCode: "AMS",
    duration: "1 hr 30 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Snack",
    aircraft: "Boeing 737-800",
    price: 150,
    transits: [],
    frequency: "daily",
    flightNumber: "SH-MUC-AMS-12",
    status: "active",
  },
  {
    id: 13,
    code: "SH-OTP-MAD-13",
    departureTime: "09:00",
    arrivalTime: "14:30",
    startDate: "2025-04-12",
    endDate: "same day",
    departureCity: "Bucharest",
    arrivalCity: "Madrid",
    departureCode: "OTP",
    arrivalCode: "MAD",
    duration: "5 hr 30 m",
    type: "Transit",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Snack",
    aircraft: "Boeing 737-800",
    price: 300,
    transits: [8, 14],
    frequency: "weekly",
    flightNumber: "SH-OTP-MAD-13",
    status: "active",
  },
  {
    id: 14,
    code: "SH-LHR-MAD-14",
    departureTime: "00:00",
    arrivalTime: "02:30",
    startDate: "2025-04-12",
    endDate: "same day",
    departureCity: "London",
    arrivalCity: "Madrid",
    departureCode: "LHR",
    arrivalCode: "MAD",
    duration: "2 hr 30 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "No Meal",
    aircraft: "Airbus A319",
    price: 120,
    transits: [],
    frequency: "daily",
    flightNumber: "SH-LHR-MAD-14",
    status: "active",
  },
  {
    id: 15,
    code: "AJ-ROM-TOK-15",
    departureTime: "08:00",
    arrivalTime: "02:00",
    startDate: "2025-04-13",
    endDate: "next day",
    departureCity: "Rome",
    arrivalCity: "Tokyo",
    departureCode: "FCO",
    arrivalCode: "HND",
    duration: "18 hr",
    type: "Transit",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Full Meal",
    aircraft: "Boeing 787",
    price: 950,
    transits: [],
    frequency: "weekly",
    flightNumber: "AJ-ROM-TOK-15",
    status: "active",
  },
  {
    id: 16,
    code: "AJ-ROM-DXB-16",
    departureTime: "08:00",
    arrivalTime: "13:00",
    startDate: "2025-04-13",
    endDate: "same day",
    departureCity: "Rome",
    arrivalCity: "Dubai",
    departureCode: "FCO",
    arrivalCode: "DXB",
    duration: "5 hr",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Full Meal",
    aircraft: "Airbus A330",
    price: 450,
    transits: [],
    frequency: "weekly",
    flightNumber: "AJ-ROM-DXB-16",
    status: "active",
  },
  {
    id: 17,
    code: "FF-BOM-DEL-17",
    departureTime: "06:00",
    arrivalTime: "07:45",
    startDate: "2025-04-14",
    endDate: "same day",
    departureCity: "Mumbai",
    arrivalCity: "New Delhi",
    departureCode: "BOM",
    arrivalCode: "DEL",
    duration: "1 hr 45 m",
    type: "Direct",
    seat: "Single-aisle 3-3/2-2 configuration",
    meal: "Snack",
    aircraft: "Airbus A320",
    price: 95,
    transits: [],
    frequency: "daily",
    flightNumber: "FF-BOM-DEL-17",
    status: "active",
  },
];

export default flights;
