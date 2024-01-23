// YourPastPurchasesPage.jsx
import React from 'react';

const YourPastPurchasesPage = ({ pastPurchases }) => {
  console.log('All past purchases:', pastPurchases);

  // Filter past purchases where the event date has passed
  const pastPurchasesToShow = pastPurchases.filter((purchase) => {
    const eventDateTime = new Date(purchase.event_date);
    const currentDate = new Date();
    return currentDate > eventDateTime;
  });

  console.log('Filtered past purchases:', pastPurchasesToShow);

  return (
    <div className="your-past-purchases-container">
      <h2>Your Past Purchases</h2>
      {pastPurchasesToShow.length > 0 ? (
        <ul>
          {pastPurchasesToShow.map((purchase) => (
            <li key={purchase.id}>
              <p>Event Name: {purchase.event_name}</p>
              <p>Location: {purchase.location}</p>
              <p>Price: ${purchase.price}</p>
              <p>Event Date: {purchase.event_date}</p>
              {/* Add other details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No past purchases found.</p>
      )}
    </div>
  );
};

export default YourPastPurchasesPage;
