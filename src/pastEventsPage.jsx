// PastCartEventsPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import './style/PastEventsStyle.css';

const PastCartEventsPage = () => {
  const { isAuthenticated, userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [pastCartEvents, setPastCartEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the review popup
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // State for the review alert
  const [showReviewAlert, setShowReviewAlert] = useState(false);

  // State for the review success or duplicate message
  const [reviewMessage, setReviewMessage] = useState('');

  // Define fetchData function outside useEffect
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost/api/getPastCartEvents.php?userId=${userData.userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error('Error fetching past cart events.');
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPastCartEvents(data);
      } else {
        console.log('No past cart events found.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching past cart events:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate, isAuthenticated, userData]);

  const hasUserReviewedEvent = (event) => {
    if (event.reviews && Array.isArray(event.reviews)) {
      return event.reviews.some((review) => review.userId === userData.userId);
    } else {
      return false;
    }
  };
  const handleLeaveReview = (event) => {
    const userHasReviewed = hasUserReviewedEvent(event);
  
    if (userHasReviewed) {
      setShowReviewAlert(true);
      setReviewMessage('You have already reviewed this product.'); // Set the review message here
      return;
    }
  
    setPastCartEvents((prevEvents) =>
      prevEvents.map((prevEvent) =>
        prevEvent.id === event.id ? { ...prevEvent, hasUserReviewed } : prevEvent
      )
    );
  
    setSelectedEvent(event);
    setShowReviewPopup(true);
  };
  

  const handleReviewSubmit = async () => {
    try {
      // Check if rating and comment are not empty
      if (rating === 0 || comment.trim() === '') {
        // Show an alert or handle empty fields
        console.error('Rating and comment cannot be empty');
        return;
      }

      const token = localStorage.getItem('token');

      // Check if the user has already reviewed the product
      if (hasUserReviewedEvent(selectedEvent)) {
        // Show an alert or handle the case where the user has already reviewed the product
        setShowReviewAlert(true);
        return;
      }

      const response = await fetch('http://localhost/api/submitReview.php', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.userId,
          eventId: selectedEvent.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        throw new Error('Error submitting review.');
      }

      setShowReviewPopup(false);
      setReviewMessage('Review submitted successfully!');
      fetchData();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="past-cart-events-page">
      <Nav />

      <div className="past-cart-events-page-main-container">
        <h8>Your Past Cart Events</h8>
        <div className="past-cart-events-container">
          {loading ? (
            <p className="loading-message">Loading...</p>
          ) : pastCartEvents.length > 0 ? (
            pastCartEvents.map((event) => (
              <div key={event.id} className="past-cart-event-item-container">
                <p className="event-info">Event Name: {event.event_name}</p>
                <p className="event-info">Location: {event.location}</p>
                <p className="event-info">Price: ${event.price}</p>
                <p className="event-info">Event Date: {event.event_date}</p>
                <img src={event.image_link} alt={event.event_name} className="event-image" />

                {hasUserReviewedEvent(event) ? (
                  <p className="already-reviewed-message">You have already reviewed this product.</p>
                ) : (
                  <button className="review-button" onClick={() => handleLeaveReview(event)}>
                    Leave a Review
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="no-events-message">No past cart events found.</p>
          )}
        </div>
      </div>

      {showReviewPopup && (
        <div className="review-popup">
          <h69>{hasUserReviewed ? 'Update' : 'Leave'} a Review for {selectedEvent?.event_name}</h69>
          <label className="review-label1">
            Rating:
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
            />
          </label>
          <label className="review-label1">
            Comment:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="review-textarea"
            />
          </label>
          <button className="submit-review-button" onClick={handleReviewSubmit}>
            {hasUserReviewed ? 'Update Review' : 'Submit Review'}
          </button>
          <button className="close-button" onClick={() => setShowReviewPopup(false)}>
            Close
          </button>
        </div>
      )}

      {showReviewAlert && (
        <div className="review-alert">
          <p>You have already reviewed this product.</p>
          <button onClick={() => setShowReviewAlert(false)}>Close</button>
        </div>
      )}

      {reviewMessage && (
        <div className="review-message">
          <p className='review-message'>{reviewMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PastCartEventsPage;
