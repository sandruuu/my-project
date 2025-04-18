export interface Ticket {
    id: string;
    passengerName: string;
    seatNumber: string;
    ticketType: 'adult' | 'child' | 'infant';
    price: number;
    fareType?: 'AIR ECO' | 'AIR BASE' | 'AIR PLUS';
  }
  export interface FlightOrder {
    id: string;
    orderDate: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    totalAmount: number;
    tickets: {
      flight: {
        flightNumber: string;
        departure: {
          city: string;
          airport: string;
          date: string;
          time: string;
        };
        arrival: {
          city: string;
          airport: string;
          date: string;
          time: string;
        };
        aircraft: string;
        meal?: string;
        seatLayout?: string;
        duration?: string;
      };
      transitFlights?: {
        flightNumber: string;
        departure: {
          city: string;
          airport: string;
          date: string;
          time: string;
        };
        arrival: {
          city: string;
          airport: string;
          date: string;
          time: string;
        };
        aircraft: string;
        meal?: string;
        seatLayout?: string;
        duration?: string;
        class?: string;
      }[];
      passengers: Ticket[];
    }[];
  }
const orders: FlightOrder[] = [
    {
      id: "ORD-004",
      orderDate: "2025-03-10",
      status: "upcoming",
      totalAmount: 1000,
      tickets: [
        {
          flight: {
            flightNumber: "RO-OTP-JFK-01",
            departure: {
              city: "Bucharest",
              airport: "Henri Coandă International",
              date: "2025-05-15",
              time: "08:20"
            },
            arrival: {
              city: "New York",
              airport: "John F. Kennedy International",
              date: "2025-05-15",
              time: "18:45"
            },
            aircraft: "Airbus A320",
            duration: "10h 25m",
            meal: "Full Meal",
            seatLayout: "Single-aisle 3-3/2-2 configuration"
          },
          passengers: [
            {
              id: "TKT-008",
              passengerName: "Laura Sandru",
              seatNumber: "2A",
              ticketType: "adult",
              price: 500,
              fareType: "AIR PLUS"
            },
            {
              id: "TKT-009",
              passengerName: "Alex Sandru",
              seatNumber: "2",
              ticketType: "adult",
              price: 500,
              fareType: "AIR PLUS"
            }
          ],
          transitFlights: [
            {
              flightNumber: "RO-OTP-LHR-01",
              departure: {
                city: "Bucharest",
                airport: "Henri Coandă International",
                date: "2025-05-15",
                time: "08:20"
              },
              arrival: {
                city: "London",
                airport: "Heathrow",
                date: "2025-05-15",
                time: "10:15"
              },
              aircraft: "Airbus A320",
              meal: "Snack",
              duration: "1h 55m",
              seatLayout: "Single-aisle 3-3/2-2 configuration"
            },
            {
              flightNumber: "RO-LHR-OTP-02",
              departure: {
                city: "London",
                airport: "Heathrow",
                date: "2025-05-15",
                time: "11:30"
              },
              arrival: {
                city: "New York",
                airport: "John F. Kennedy International",
                date: "2025-05-15",
                time: "18:45"
              },
              aircraft: "Airbus A320",
              meal: "Full Meal",
              duration: "7h 15m",
              seatLayout: "Single-aisle 3-3/2-2 configuration"
            }
          ]
        }
      ]
    },
    {
      id: "ORD-003",
      orderDate: "2025-03-10",
      status: "completed",
      totalAmount: 550,
      tickets: [
        {
          flight: {
            flightNumber: "RO-OTP-PAR-01",
            departure: {
              city: "Bucharest",
              airport: "Henri Coandă International",
              date: "2025-03-20",
              time: "14:30"
            },
            arrival: {
              city: "Paris",
              airport: "Charles de Gaulle",
              date: "2025-03-20",
              time: "16:45"
            },
            aircraft: "Airbus A320",
            duration: "3h 15m",
            meal: "Full Meal",
            seatLayout: "Single-aisle 3-3/2-2 configuration"
          },
          passengers: [
            {
              id: "TKT-007",
              passengerName: "Laura Sandru",
              seatNumber: "4A",
              ticketType: "adult",
              price: 550,
              fareType: "AIR PLUS"
            }
          ]
        }
      ]
    },
    {
      id: "ORD-002",
      orderDate: "2025-02-15",
      status: "cancelled",
      totalAmount: 300,
      tickets: [
        {
          flight: {
            flightNumber: "RO-OTP-BAR-01",
            departure: {
              city: "Bucharest",
              airport: "Henri Coandă International",
              date: "2025-02-28",
              time: "07:45"
            },
            arrival: {
              city: "Barcelona",
              airport: "El Prat",
              date: "2025-02-28",
              time: "10:20"
            },
            aircraft: "Boeing 737-800",
            duration: "3h 35m",
            meal: "Snack",
            seatLayout: "Single-aisle 3-3/2-2 configuration"
          },
          passengers: [
            {
              id: "TKT-005",
              passengerName: "Laura Sandru",
              seatNumber: "18C",
              ticketType: "adult",
              price: 150,
              fareType: "AIR ECO"
            },
            {
              id: "TKT-006",
              passengerName: "Alex Sandru",
              seatNumber: "18D",
              ticketType: "adult",
              price: 150,
              fareType: "AIR ECO"
            }
          ]
        }
      ]
    },
    {
      id: "ORD-001",
      orderDate: "2025-01-05",
      status: "completed",
      totalAmount: 800,
      tickets: [
        {
          flight: {
            flightNumber: "RO-OTP-VIE-01",
            departure: {
              city: "Bucharest",
              airport: "Henri Coandă International",
              date: "2025-01-15",
              time: "10:15"
            },
            arrival: {
              city: "Viena",
              airport: "Vienna International",
              date: "2025-01-15",
              time: "11:30"
            },
            aircraft: "Airbus A319",
            duration: "1h 15m",
            meal: "Snack",
            seatLayout: "Single-aisle 3-3/2-2 configuration"
          },
          passengers: [
            {
              id: "TKT-001",
              passengerName: "Laura Sandru",
              seatNumber: "12B",
              ticketType: "adult",
              price: 400,
              fareType: "AIR BASE"
            },
            {
              id: "TKT-002",
              passengerName: "Mihai Ionescu",
              seatNumber: "12C",
              ticketType: "adult",
              price: 400,
              fareType: "AIR BASE"
            }
          ]
        }
      ]
    }
  ]

export default orders;