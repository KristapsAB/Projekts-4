import React, { useState, useContext } from 'react';
import './style/Login.css';
import Nav from './Nav';
import { UserContext } from './UserContext';

function Newevent() {
  const { userData } = useContext(UserContext);
  console.log('Logged-in user:', userData);
  const [eventData, setEventData] = useState({
    event_name: '',
    genre: '',
    event_date: '',
    location: '',
    tickets_available: '',
    price: '',
    image_link: '',
  });

  const [errors, setErrors] = useState({
    event_name: '',
    genre: '',
    event_date: '',
    location: '',
    tickets_available: '',
    price: '',
    image_link: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate if the input is a number and not negative for 'tickets_available' and 'price'
    if ((name === 'tickets_available' || name === 'price') && (isNaN(value) || value < 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} must be a non-negative number.`,
      }));
    } else {
      setEventData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const newErrors = {};

    if (!eventData.event_name) {
      newErrors.event_name = 'Event Name is required.';
    }

    if (!eventData.genre) {
      newErrors.genre = 'Genre is required.';
    }

    if (!eventData.event_date) {
      newErrors.event_date = 'Event Date is required.';
    } else if (eventData.event_date < currentDate) {
      newErrors.event_date = 'Event Date must be in the future.';
    }

    if (!eventData.location) {
      newErrors.location = 'Location is required.';
    }

    if (!eventData.tickets_available) {
      newErrors.tickets_available = 'Tickets Available is required.';
    }

    if (!eventData.price) {
      newErrors.price = 'Price is required.';
    }

    if (!eventData.image_link) {
      newErrors.image_link = 'Image Link is required.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleAddEvent = () => {
    if (!validateForm()) {
      return;
    }

    fetch('http://localhost/api/EventApi.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...eventData,
        genre: eventData.genre,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        setSuccessMessage('Event added successfully!');
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (!userData || userData.role !== '1') {
    return (
      <div>
        <Nav />
        <div className="galvana-kaste">
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="galvana-kaste">
        <div className="otra-kaste">
          <label className='new-event-label'>Event Name</label>
          <input
            className='new-event-input'
            name='event_name'
            value={eventData.event_name}
            onChange={handleInputChange}
          />
          {errors.event_name && (
            <div className="error-message">
              {errors.event_name}
            </div>
          )}
        </div>

        <div className="otra-kaste">
          <label className='new-event-label'>Genre</label>
          <select
            className='new-event-input'
            name='genre'
            value={eventData.genre}
            onChange={handleInputChange}
          >
            <option value=''>Select Genre</option>
            <option value='rock'>Rock</option>
            <option value='pop'>Pop</option>
            <option value='hip-hop'>Hip Hop</option>
            <option value='electronic'>Electronic</option>
            <option value='country'>Country</option>
            <option value='metal'>Metal</option>
            <option value='rock'>Rock</option>
          </select>
          {errors.genre && (
            <div className="error-message">
              {errors.genre}
            </div>
          )}
        </div>

        <div className="otra-kaste">
          <label className='new-event-label'>Event Date</label>
          <input
            className='new-event-input'
            name='event_date'
            type='date'
            value={eventData.event_date}
            onChange={handleInputChange}
          />
          {errors.event_date && (
            <div className="error-message">
              {errors.event_date}
            </div>
          )}
        </div>

        <div className='otra-kaste'>
          <label className='new-event-label'>Location</label>
          <input
            className='new-event-input'
            name='location'
            value={eventData.location}
            onChange={handleInputChange}
          />
          {errors.location && (
            <div className="error-message">
              {errors.location}
            </div>
          )}
        </div>

        <div className="otra-kaste">
          <label className='new-event-label'>Tickets Available</label>
          <input
            className='new-event-input'
            name='tickets_available'
            type='number'
            value={eventData.tickets_available}
            onChange={handleInputChange}
          />
          {errors.tickets_available && (
            <div className="error-message">
              {errors.tickets_available}
            </div>
          )}
        </div>

        <div className="otra-kaste">
          <label className='new-event-label'>Price</label>
          <input
            className='new-event-input'
            name='price'
            type='number'
            value={eventData.price}
            onChange={handleInputChange}
          />
          {errors.price && (
            <div className="error-message">
              {errors.price}
            </div>
          )}
        </div>

        <div className="otra-kaste">
          <label className='new-event-label'>Image Link</label>
          <input
            className='new-event-input'
            name='image_link'
            value={eventData.image_link}
            onChange={handleInputChange}
          />
          {errors.image_link && (
            <div className="error-message">
              {errors.image_link}
            </div>
          )}
        </div>

        <div className='new-event-button'>
          <button className='new-event-button-style' onClick={handleAddEvent}>
            Add Event
          </button>
        </div>
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Newevent;
