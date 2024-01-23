import React, { useState, useEffect } from 'react';
import './style/EventPage.css';
import Nav from './Nav';

const PastEvents = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [pastDates, setPastDates] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortMode, setSortMode] = useState('asc');

  useEffect(() => {
    const numberOfYears = 1;
    const currentYear = new Date().getFullYear();
    const pastDatesArray = [];

    for (let year = currentYear; year > currentYear - numberOfYears; year--) {
      for (let month = 11; month >= 0; month--) {
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        const dateString = `${year}-${month + 1 < 10 ? '0' : ''}${month + 1} ${monthName}`;
        pastDatesArray.push(dateString);
      }
    }

    setPastDates(pastDatesArray);

    // Fetch events from the backend
    fetch('http://localhost/api/getEvents.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched events:', data.events);
        // Filter events for the past
        const pastEvents = data.events.filter((event) => new Date(event.event_date) < new Date());
        setEvents(pastEvents);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleSortChange = (e) => {
    setSortMode(e.target.value);
  };

  const filteredEvents = events.filter((event) => {
    return (
      (event.event_name && event.event_name.toLowerCase().includes(searchInput.toLowerCase())) &&
      (!selectedGenre || (event.genre && event.genre.toLowerCase() === selectedGenre.toLowerCase()))
    );
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortMode) {
      case 'asc':
        return new Date(a.event_date) - new Date(b.event_date);
      case 'desc':
        return new Date(b.event_date) - new Date(a.event_date);
      case 'oldest':
        return a.id - b.id;
      case 'newest':
        return b.id - a.id;
      case 'cheapest':
        return a.price - b.price;
      case 'closest':
        return Math.abs(new Date(a.event_date) - new Date()) - Math.abs(new Date(b.event_date) - new Date());
      case 'furthest':
        return Math.abs(new Date(b.event_date) - new Date()) - Math.abs(new Date(a.event_date) - new Date());
      default:
        return 0;
    }
  });

  return (
    <div>
      <Nav />
      <div className="event-page-main-container">
        <div className="search-container">
          <div className="date-dropdown-container"></div>
          <div className="search-input-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search events"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="genre-dropdown-container">
            <label>Filter by Genre:</label>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="">All Genres</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="hip-hop">Hip Hop</option>
              <option value="electronic">Electronic</option>
              <option value="country">Country</option>
              <option value="metal">Metal</option>
            </select>
          </div>
          <div className="sort-dropdown-container">
            <label>Sort By:</label>
            <select value={sortMode} onChange={handleSortChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="cheapest">Cheapest</option>
              <option value="closest">Closest</option>
              <option value="furthest">Furthest</option>
            </select>
          </div>
        </div>
        <div className="event-info-second">
          {sortedEvents.map((event) => (
            <div key={event.id} className="event-info-container">
              <div className="event-image-container">
                <img className="event-image" src={event.image_link} alt="Event Image" />
              </div>
              <div className="event-text-container">
                <p className="event-info">Location: {event.location}</p>
                <p className="event-info">Date: {event.event_date}</p>
                <p className="event-info">Concert Name: {event.event_name}</p>
                <p className="event-info">Genre: {event.genre}</p>
                <p className="event-info">Price: {event.price}</p>
                <p className="event-info">Status: Sold</p>
              </div>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default PastEvents;
