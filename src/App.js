import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Nav from './Nav';
import EventPage from './EventPage';
import { UserProvider } from './UserContext';
import NewEvent from './NewEvent';
import PastEvents from './PastEvents';
import OrderPage from './OrderPage';
import HomePage from './MainPage';
// Assuming ReviewPage.jsx is in the same directory as the file where you are importing it
import ReviewPage from './ReviewPage';
import PastEventsPage from './pastEventsPage';
import EventDetailsPage from './EventDetailsPage';
function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (eventData) => {
    setCart([...cart, eventData]);
    console.log('Added to Cart:', eventData);
    // Add logic to update the cart state or perform other actions
  };

  const unpurchasedCount = cart.length;

  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Include Nav component inside Routes to make it visible on all pages */}
          <Route
            path="/*"
            element={<Nav unpurchasedCount={unpurchasedCount} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/eventpage" element={<EventPage addToCart={addToCart} />} />
          <Route path="/pastevents" element={<PastEvents />} />
          <Route path="/newevent" element={<NewEvent />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/mainpage" element={<HomePage />} />
          <Route path="/reviewpage" element={<ReviewPage />} />
          <Route path="/pasteventspage" element={<PastEventsPage />} />
          <Route path="/eventdetails" element={<EventDetailsPage />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
