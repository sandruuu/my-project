import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import CustomerReviews from "./pages/CustomerReviews";
import FlightSchedule from "./pages/FlightSchedule";
import "../index.css";
import RootLayout from "./layout/RootLayout";
import AdminLayout from "./layout/AdminLayout";
import FlightFare from "./pages/FlightFare"
import FlightSeats from "./pages/FlightSeats"
import FlightPassengerDetails from "./pages/FlightPassengerDetails"
import FlightPayment from "./pages/FlightPayment"
import ConfirmationPage from "./pages/ConfirmationPage"
import FAQ from "./pages/FAQ"
import Admin from "./pages/Admin"
import AdminSchedules from "./pages/AdminSchedules"
import FlightTracking from "./pages/FlightTracking"
import AddFlight from "./pages/AddFlight"
import AdminProfile from "./pages/AdminProfile"
import ModifyFlight from "./pages/ModifyFlight"
import UserProfile from './pages/UserProfile';
import Contacts from './pages/Contacts';
import { sampleReviews } from "./assets/reviews";
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}>
        <Route index element={<Home />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="logIn" element={<LogIn />} />
        <Route path="customerReviews" element={<CustomerReviews reviews={sampleReviews} />}/>
        <Route path="faq" element={<FAQ />}/>
        <Route path="profile" element={<UserProfile />} />
        <Route path="contacts" element={<Contacts />} />
        
        <Route path="flightSchedule" element={<FlightSchedule/>}/>
        <Route path="flightFare" element={<FlightFare/>}/>
        <Route path="flightSeats" element={<FlightSeats />} />
        <Route path="passengerDetails" element={<FlightPassengerDetails />} />
        <Route path="payment" element={<FlightPayment />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="flightsTracking" element={<FlightTracking />} />
          <Route path="addFlight" element={<AddFlight />} />
          <Route path="adminProfile" element={<AdminProfile />} />
          <Route path="modify/:id" element={<ModifyFlight />} />
        </Route>
      </Route>
    )
  )
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
