import React, { useState } from 'react';

const EventForm = ({ addEvent }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    ticketsAvailable: 0,
    price: 0,
    imageLink: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent(formData);
  };

  return (
    <div className="event-form-container">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name:</label>
          <input type="text" name="eventName" value={formData.eventName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Event Date:</label>
          <input type="text" name="eventDate" value={formData.eventDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Tickets Available:</label>
          <input
            type="number"
            name="ticketsAvailable"
            value={formData.ticketsAvailable}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Image Link:</label>
          <input type="text" name="imageLink" value={formData.imageLink} onChange={handleChange} />
        </div>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default EventForm;
