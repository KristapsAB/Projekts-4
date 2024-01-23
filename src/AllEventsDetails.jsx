// AllEventsDetails.jsx
import React, { useState, useEffect } from 'react';
import EventDetails from './EventDetails';

const AllEventsDetails = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost/api/getAllEvents.php`);
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          throw new Error('Error fetching events.');
        }

        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      {events.map((event) => (
        <EventDetails key={event.id} eventId={event.id} />
      ))}
    </div>
  );
};

export default AllEventsDetails;
