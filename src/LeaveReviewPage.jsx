// LeaveReviewPage.js

import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
import Nav from './Nav';

const LeaveReviewPage = () => {
  const { eventId } = useParams();
  const { isAuthenticated, userData } = useContext(UserContext);
  const [review, setReview] = useState({ rating: 0, comment: '' });

  const handleLeaveReview = async () => {
    try {
      const token = localStorage.getItem('token');

      const reviewData = {
        eventId,
        userId: userData.userId,
        rating: review.rating,
        comment: review.comment,
      };

      const response = await fetch(`http://localhost/api/leavereview.php`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        const errorMessage = await response.text();
        console.error(errorMessage);
        throw new Error('Error submitting review.');
      }

      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="leave-review-container">
        <h2 className="h2teksti">Leave a Review</h2>
        <div className="review-form">
          {/* Your review form UI */}
          {/* Include fields for rating and comment */}
          <button onClick={handleLeaveReview}>Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewPage;
