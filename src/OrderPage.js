import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import './style/OrderPage.css';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const OrdersPage = () => {
  const { isAuthenticated, userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReviewedEvents, setUserReviewedEvents] = useState([]);
  const [unpurchasedCount, setUnpurchasedCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [pastPurchases, setPastPurchases] = useState([]);
  const [showPastPurchases, setShowPastPurchases] = useState(false);
  const pdfRef = useRef();
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [alreadyReviewedMessage, setAlreadyReviewedMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token || !isAuthenticated || !userData || !userData.userId) {
          console.error('Invalid authentication. Redirecting to login.');
          navigate('/login');
          return;
        }

        const responseCart = await fetch(`http://localhost/api/getCartItems.php?userId=${userData.userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responseCart.ok) {
          console.error(`Error fetching cart items. Status: ${responseCart.status}`);
          throw new Error('Error fetching cart items.');
        }

        const dataCart = await responseCart.json();
        const unpurchasedItems = dataCart.cartItems.filter((item) => item.status !== 'purchased');
        setUnpurchasedCount(unpurchasedItems.length);
        setCart(dataCart.cartItems);

        const responsePastPurchases = await fetch(`http://localhost/api/getPastPurchases.php?userId=${userData.userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responsePastPurchases.ok) {
          console.error(`Error fetching past purchases. Status: ${responsePastPurchases.status}`);
          throw new Error('Error fetching past purchases.');
        }

        const dataPastPurchases = await responsePastPurchases.json();
        setPastPurchases(dataPastPurchases.pastPurchases);

        const responseEvents = await fetch('http://localhost/api/getEvents.php', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!responseEvents.ok) {
          console.error(`Error fetching events. Status: ${responseEvents.status}`);
          throw new Error('Error fetching events.');
        }

        const dataEvents = await responseEvents.json();
        const futureEvents = dataEvents.events.filter((event) => !eventHasPassed(event.event_date));
        setEvents(futureEvents);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, isAuthenticated, userData]);

  const handlePurchase = async (cartItemId, event) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost/api/updateCartItemStatus.php?cartItemId=${cartItemId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Error updating cart item status. Status: ${response.status}`);
        throw new Error('Error updating cart item status.');
      }

      const updatedEvents = events.map((e) => (e.id === event.id ? { ...e, tickets_available: e.tickets_available - 1 } : e));
      setEvents(updatedEvents);

      const updatedCart = cart.map((item) =>
        item.id === cartItemId ? { ...item, status: 'purchased' } : item
      );

      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item status:', error);
    }
  };

  const qrCodeImageFilename = 'qrcode.png';
  const qrCodeImagePath = `${process.env.PUBLIC_URL}/images/${qrCodeImageFilename}`;

  const handleDownloadPDF = async (eventData) => {
    try {
      const purchaseDate = new Date().toLocaleString();
      const randomCode = generateRandomCode();

      // Generate QR code
      const qrCodeDataUrl = await generateQRCode(randomCode);

      // Generate PDF
      generatePDF(eventData, purchaseDate, qrCodeDataUrl, randomCode);
    } catch (error) {
      console.error('Error handling PDF download:', error);
    }
  };

  const generateQRCode = async (text) => {
    try {
      const canvas = await QRCode.toCanvas(text, { errorCorrectionLevel: 'H' });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const generatePDF = (eventData, purchaseDate, qrCodeDataUrl, randomCode) => {
    try {
      const pdf = new jsPDF();

      // Title
      pdf.setFont('Poppins', 'normal');
      pdf.setFontSize(20);
      pdf.setTextColor(42, 87, 141); // Blueish color
      pdf.text('Eventus Concerts', 20, 20);

      // User Name
      pdf.setFontSize(14);
      pdf.text(`Username: ${userData.username}`, 20, 30);

      // Concert Details
      pdf.text(`Concert Name: ${eventData.event_name}`, 20, 40);
      pdf.text(`Price: $${eventData.price}`, 20, 50);
      pdf.text(`Concert Date: ${eventData.event_date}`, 20, 60);
      pdf.text(`Location: ${eventData.location}`, 20, 70);

      // QR Code
      pdf.addImage(qrCodeDataUrl, 'PNG', 150, 80, 40, 40);

      // Random Code
      pdf.text(`Ticket code: ${randomCode}`, 20, 130);

      pdf.save(`ticket_${eventData.id}_${purchaseDate}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const convertDataURLToUint8Array = async (dataURL) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const data = ctx.getImageData(0, 0, img.width, img.height).data;

        const uint8Array = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
          uint8Array[i] = data[i];
        }

        resolve(uint8Array);
      };
      img.src = dataURL;
    });
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;
    let randomCode = '';

    for (let i = 0; i < length; i++) {
      randomCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomCode;
  };

  const handleLeaveReview = async (eventId) => {
    try {
      const token = localStorage.getItem('token');

      if (userReviewedEvents.includes(eventId)) {
        setAlreadyReviewedMessage('User has already submitted a review for this event.');
        return;
      }

      const reviewData = {
        eventId,
        userId: userData.userId,
        rating: review.rating,
      };

      const response = await fetch('http://localhost/api/leavereview.php', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        console.error(`Error submitting review. Status: ${response.status}`);
        const errorMessage = await response.text();
        console.error(errorMessage);
        throw new Error('Error submitting review.');
      }

      setUserReviewedEvents([...userReviewedEvents, eventId]);
      setAlreadyReviewedMessage('Review submitted successfully.');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const eventHasPassed = (eventDate) => {
    const currentDate = new Date();
    const eventDateTime = new Date(eventDate);
    return currentDate > eventDateTime;
  };

  const moveExpiredToPastPurchases = (cartItem) => {
    const currentDate = new Date();
    const eventDateTime = new Date(cartItem.event_date);
    return currentDate > eventDateTime;
  };

  const togglePastPurchases = () => {
    setShowPastPurchases(!showPastPurchases);
  };

  const upcomingOrders = cart.filter((item) => item.status !== 'purchased' && !moveExpiredToPastPurchases(item));
  const upcomingEvents = events.filter((event) => !eventHasPassed(event.event_date));

  return (
    <div>
      <Nav unpurchasedCount={unpurchasedCount} />
      <div className="orders-page-main-container">
        <div className="orders-container">
          {upcomingOrders.map((item) => (
            <div key={item.id} className="order-item-container">
              <div className="order-details">
                <p className="order-info">Event Name: {item.event_name}</p>
                <p className="order-info">Location: {item.location}</p>
                <p className="order-info">Price: ${item.price}</p>
                <p className="order-info">Tickets Amount: {item.tickets_amount}</p>
              </div>
              <div className="order-actions">
                <button className="purchase-button" onClick={() => handlePurchase(item.id, item)}>
                  Purchase
                </button>
                <button className="download-pdf-button" onClick={() => handleDownloadPDF(item)}>
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="toggle-past-purchases-button"
        onClick={togglePastPurchases}
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        PAST PURCHASES
      </button>
      {showPastPurchases && (
        <div className="past-orders-container">
          {cart
            .filter((item) => item.status === 'purchased' && moveExpiredToPastPurchases(item))
            .map((item) => (
              <div key={item.id} className="order-item-container past-order-item-container">
                <div className="order-details event-details">
                  <p className="order-info event-info">Event Name: {item.event_name}</p>
                  <p className="order-info event-info">Location: {item.location}</p>
                  <p className="order-info event-info">Price: ${item.price}</p>
                </div>
                {/* Add other elements if needed */}
              </div>
            ))}
        </div>
      )}
      <div className="orders-page-main-container ">
        {upcomingEvents.map((event) => (
          <div key={event.id} className="order-item-container">
            <div className="event-details">
              <p className="event-info">Event Name: {event.event_name}</p>
              <p className="event-info">Location: {event.location}</p>
              <p className="event-info">Event Date: {event.event_date}</p>
              <p className="event-info">Tickets Available: {event.tickets_available}</p>
            </div>
            
            <div className="event-actions">
              <button className="download-pdf-button" onClick={() => handleDownloadPDF(event)}>
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
