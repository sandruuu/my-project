import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FooterComponent from "../components/FooterComponent";
import plane from "../assets/images/plane2.jpg" 
import ReviewCardComponent from "../components/ReviewCardComponent";
import FlightSearchComponent from "../components/FlightSearchComponent";
import { reviews } from "../assets/reviews";
import popularDestinations from "../assets/popularDestinations";
import cities from "../assets/cities";
import NavigationBarComponent from "../components/NavigationBarComponent";

const Home = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [isFromSelected, setIsFromSelected] = useState(false);
  const [isToSelected, setIsToSelected] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  return (
    <div>
      <NavigationBarComponent />
      {/* Search Form */}
      <div className="min-h-screen flex flex-col w-100hv relative">
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url(${plane})` }}
        />
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        
        <div className="flex flex-1 relative">
          <div className="w-full p-8 flex flex-col items-center relative">
            <div className="text-center mt-10">
              <h1 className="text-2xl md:text-4xl font-bold mt-4 md:mt-6 text-white drop-shadow-lg">
                GET YOUR TICKET TO
                <br />
                EXPLORE THE WORLD
              </h1>
            </div>

            <div className="w-full mt-5">
              <FlightSearchComponent
                passengers={passengers}
                setPassengers={setPassengers}
                isFromSelected={isFromSelected}
                setIsFromSelected={setIsFromSelected}
                isToSelected={isToSelected}
                setIsToSelected={setIsToSelected}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                departureDate={departureDate}
                setDepartureDate={setDepartureDate}
                cities={cities}
                onSearch={() => navigate("/flightSchedule", {state: { from, to, departureDate, passengers, isFromSelected, isToSelected },})}
              />
            </div>
          </div>
        </div>
      </div>
      {/*Popular destinations*/}
      <div className="py-16 md:py-24 w-full bg-gradient-to-b to-[#ECEFF1] from-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A4B]">
              POPULAR DESTINATIONS
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div 
                key={index} 
                className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative h-72 sm:h-64 cursor-pointer"
                onClick={() => navigate("/flightSchedule", {
                  state: { 
                    to: destination.city, 
                    isToSelected: true,
                    departureDate: today
                  }
                })}
              >
                <img 
                  src={destination.imageUrl} 
                  alt={destination.city} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                  <h3 className="text-xl font-bold">{destination.city}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm font-medium opacity-90">{destination.country}</p>
                    <p className="text-sm font-semibold px-2 py-1 rounded-full">
                      From ${destination.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-25">
            <div className="flex flex-col items-center text-center group">
              <div className="mb-4 transform transition-all duration-300 group-hover:scale-110">
                <div className="w-20 h-20 bg-[#455A64] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-[#1B3A4B] group-hover:shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />                  </svg>
                </div>
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-y-1">
                <h3 className="text-xl font-semibold text-[#1B3A4B] mb-2">Guarantee of the best price</h3>
                <p className="text-[#455A64] max-w-sm">We offer only the best deals, if you find the same flight cheaper elsewhere, contact us!</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-4 transform transition-all duration-300 group-hover:scale-110">
                <div className="w-20 h-20 bg-[#455A64] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-[#1B3A4B] group-hover:shadow-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-y-1">
                <h3 className="text-xl font-semibold text-[#1B3A4B] mb-2">Refunds & cancellations</h3>
                <p className="text-[#455A64] max-w-sm">Your flight got cancelled? We have you covered with our instant refund services.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Customer Reviews Section */}
      <div className="py-10 md:pt-5 md:pb-20 w-full bg-gradient-to-b from-[#ECEFF1] to-white relative overflow-hidden">        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            <div className="md:w-1/3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A4B] leading-tight">
                CUSTOMERS REVIEWS
              </h2>
              <p className="mt-4 text-[#455A64] max-w-md">
                See what our passengers say about their experience with our airline services and why they choose to fly with us again.
              </p>
              <Link
                to="/customerReviews"
                className="inline-flex items-center mt-6 py-2 px-6 bg-[#1B3A4B] text-white font-medium rounded-md hover:bg-[#0D1B2A] transition-colors"
              >
                <span>See All Reviews</span>
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>

            <div className="md:w-2/3">
              <div className="space-y-6 md:grid lg:grid-cols-2 md:gap-6 md:space-y-0">
                {reviews.map((review, index) => (
                  <ReviewCardComponent
                    key={index}
                    name={review.name}
                    date={review.date}
                    rating={review.rating}
                    comment={review.comment}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Home;
