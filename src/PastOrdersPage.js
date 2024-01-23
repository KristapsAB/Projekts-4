import React from 'react';

const PastOrdersPage = ({ pastPurchases }) => {
  return (
    <div className="past-orders-container">
      <h2>Past Orders</h2>
      <ul>
        {pastPurchases.map((purchase) => (
          <li key={purchase.id}>
            <p>Event ID: {purchase.event_id}</p>
            <p>Status: {purchase.status}</p>
            {/* Add other details you want to display */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastOrdersPage;
