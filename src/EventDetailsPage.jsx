// EventReviewsPage.jsx

import React, { useState, useEffect } from 'react';
import './style/EventReviewsPage.css';
import Nav from './Nav';


const EventReviewsPage = () => {
  const [eventsWithRatings, setEventsWithRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEventsWithRatings = async () => {
    try {
      const response = await fetch('http://localhost/api/getRatedEvents.php');

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error('Error fetching rated events.');
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setEventsWithRatings(data);
      } else {
        console.log('No events with ratings found.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching rated events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsWithRatings();
  }, []);

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); // Get the count of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there is a half-star
  
    // Array to store FontAwesome icons
    const starsArray = [];
  
    // Push full-star icons to the array
    for (let i = 0; i < fullStars; i++) {
      starsArray.push(<i key={i} className="fas fa-star"></i>);
    }
  
    // Add a half-star icon if applicable
    if (hasHalfStar) {
      starsArray.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
  
    return starsArray;
  };
  return (
    <div className="EventReviewPage-container">
      <Nav />
      {loading ? (
        <p className="EventReviewPage-loading">Loading events with ratings...</p>
      ) : (
        <div className="EventReviewPage-events-container">
          {eventsWithRatings.length > 0 ? (
            <ul className="EventReviewPage-event-list">
              {eventsWithRatings.map((event) => (
                <li key={event.event_id} className="EventReviewPage-event-item">
                  <h3 className="EventReviewPage-event-name">{event.event_name}</h3>
                  {event.image_link && (
                    <img src={event.image_link} alt={`${event.event_name} Image`} className="EventReviewPage-event-image" />
                  )}
                  <p className="EventReviewPage-event-rating">Rating: {renderStars(Number(event.average_rating))}</p>
                  {event.reviews && event.reviews.length > 0 ? (
                    <ul className="EventReviewPage-event-reviews-list">
                      {event.reviews.split('|').map((review, index) => {
                        const [username, userRating, comment] = review.split(':');
                        return (
                          <li key={index} className="EventReviewPage-event-review-item">
                            <p className="EventReviewPage-event-review-username">User: {username}</p>
                            <p className="EventReviewPage-event-review-user-rating">User Rating: {renderStars(Number(userRating))}</p>
                            {comment && <p className="EventReviewPage-event-review-comment">User Comment: {comment}</p>}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="EventReviewPage-no-reviews">No user reviews for this event.</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="EventReviewPage-no-events">No events with ratings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventReviewsPage;
