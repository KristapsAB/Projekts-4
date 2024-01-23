import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from './UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';
import './style/EventPage.css';

const EventPage = ({ addToCart, unpurchasedCount }) => {
  const { checkAuthStatus, userData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedGenre = searchParams.get('genre');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [sortMode, setSortMode] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;
  const maxPageDisplay = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Token on initialization:', localStorage.getItem('token'));
        const isAuthenticated = checkAuthStatus();

        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          console.log('Redirecting to login...');
          navigate('/login');
          return;
        }

        // Fetch events from the backend
        const response = await fetch('http://localhost/api/getEvents.php');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter events for the future
        const upcomingEvents = data.events.filter((event) => new Date(event.event_date) > new Date());
        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, [navigate, checkAuthStatus]);

  const handleAddToCart = async (event) => {
    try {
      if (!checkAuthStatus) {
        // Redirect to login if not authenticated
        console.log('Redirecting to login from handleAddToCart...');
        await navigate('/login');
        return;
      }
  
      // If authenticated, proceed to add to cart
      addToCart({ ...event, userId: userData.userId });
  
      // Make a request to the backend to add the item to the cart
      const response = await fetch('http://localhost/api/addToCart.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userData.userId}&eventId=${event.id}`,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.text(); // Read the response as text
      console.log(data); // Log the response
  
      // Uncomment the next line if you want to parse the response as JSON
      // const jsonData = JSON.parse(data);
      // console.log(jsonData);
  
    } catch (error) {
      console.error('Error handling Add to Cart:', error);
    }
  };

  const filteredEvents = events.filter((event) => {
    return (
      (event.event_name && event.event_name.toLowerCase().includes(searchInput.toLowerCase())) &&
      (!selectedGenre || (event.genre && event.genre.toLowerCase() === selectedGenre.toLowerCase())) &&
      (!selectedDate || new Date(event.event_date) >= new Date(selectedDate))
    );
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = [...filteredEvents].sort((a, b) => {
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
  }).slice(indexOfFirstEvent, indexOfLastEvent);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredEvents.length / eventsPerPage); i++) {
    pageNumbers.push(i);
  }

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const showArrows = totalPages > maxPageDisplay;

  return (
    <div>
          <Nav unpurchasedCount={unpurchasedCount} />
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
            <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
              <option value="oldest">Oldest</option>
              <option value="newest">Newest</option>
              <option value="cheapest">Cheapest</option>
              <option value="closest">Closest</option>
              <option value="furthest">Furthest</option>
            </select>
          </div>
          <div className="genre-dropdown-container">
            <label>Filter by Genre:</label>
            <select value={selectedGenre} onChange={(e) => navigate(`?genre=${e.target.value}`)}>
              <option value="">All Genres</option>
              <option value="rock">Rock</option>
              <option value="pop">Pop</option>
              <option value="hip-hop">Hip Hop</option>
              <option value="electronic">Electronic</option>
              <option value="country">Country</option>
              <option value="metal">Metal</option>
            </select>
          </div>
        </div>
        <div className="event-info-second">
          {currentEvents.map((event) => (
            <div key={event.id} className="event-info-container" onMouseEnter={() => setHoveredEvent(event.id)} onMouseLeave={() => setHoveredEvent(null)}>
              <div className="event-image-container">
                <img className="event-image" src={event.image_link} alt="Event Image" />
                <button className={`add-to-cart-button ${hoveredEvent === event.id ? 'hovered' : ''}`} onClick={() => handleAddToCart(event)}>
                  <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                </button>
              </div>
              <div className="event-text-container">
              <p className="event-info1">{event.event_name.toUpperCase()}</p>
                <p className="event-info">Location: {event.location}</p>
                <p className="event-info">Date: {event.event_date}</p>
                <p className="event-info">Genre: {event.genre}</p>
                <p className="event-info">Tickets Available: {event.tickets_available}</p>
                <p className="event-info">Price: {event.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {showArrows && currentPage > 1 && (
            <span onClick={() => setCurrentPage(currentPage - 1)}>&lt;</span>
          )}
          {pageNumbers
            .slice(Math.max(currentPage - Math.floor(maxPageDisplay / 2), 0), Math.min(currentPage + Math.ceil(maxPageDisplay / 2), pageNumbers.length))
            .map((number) => (
              <span key={number} onClick={() => setCurrentPage(number)} className={number === currentPage ? 'active' : ''}>
                {number}
              </span>
            ))}
          {showArrows && currentPage < totalPages && (
            <span onClick={() => setCurrentPage(currentPage + 1)}>&gt;</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;
