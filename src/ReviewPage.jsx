import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import './style/review.css';

const ReviewPage = ({ eventId }) => {
  const [isExpanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3; // Number of comments to display per page
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const toggleExpand = () => {
    setExpanded(!isExpanded);
  };

  useEffect(() => {
    // Fetch reviews and average rating when the component mounts
    fetchReviewsAndRating();
  }, []);

  const fetchReviewsAndRating = async () => {
    try {
      // Fetch reviews for the event
      const reviewsResponse = await fetch(`localhost/api/getEventReviews.php?eventId=${eventId}`);
      const reviewsData = await reviewsResponse.json();

      // Fetch average rating for the event
      const averageRatingResponse = await fetch(`localhost/api/getAverageRating.php?eventId=${eventId}`);
      const averageRatingData = await averageRatingResponse.json();

      setReviews(reviewsData);
      setAverageRating(averageRatingData);
    } catch (error) {
      console.error('Error fetching reviews and rating:', error);
    }
  };

  // Dummy comments data for testing if API fails
  const comments = [
    { username: 'User1', comment: 'Comment 1' },
    { username: 'User2', comment: 'Comment 2' },
    { username: 'User3', comment: 'Comment 3' },
    // Add more comments as needed
  ];

  // Calculate the index range for the current page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = reviews.slice(indexOfFirstComment, indexOfLastComment);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="review-container">
      <Nav />
      <div className={`review-data ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
        <div className="review-image"></div>
        <label className='review-label'>Event Name</label>
        <div className="review-stars">
          <span className="star">&#9733;</span>
          <span className="star">&#9733;</span>
          <span className="star">&#9733;</span>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-overlay" onClick={toggleExpand}>
          <div className="expanded-container">
            <div className="review-top-container">
              <div className='absolute-image'></div>
              <div className="review-text">
                <h2>Event Name</h2>
                <p className="review-tickets-sold">Tickets Sold:</p>
              </div>
            </div>
            <div className="star-rating-cc">
              <p className="review-review-sold">Reviews:</p>
              <p className="review-star-rating-counter">{averageRating}</p>
              <div className="review-stars">
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                <span className="star">&#9733;</span>
                {/* Add more stars based on the average rating */}
              </div>
            </div>

            {/* Pagination for comments */}
            <div className="pagination">
              {Array.from({ length: Math.ceil(reviews.length / commentsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent container from closing
                    handlePageChange(index + 1);
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Display reviews for the current page */}
            {currentComments.map((review, index) => (
              <div key={index} className="comment-review">
                <div className="user-comment-review">
                  <div className="user-name">{review.user_id}</div>
                  <div className="user-comment">{review.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
