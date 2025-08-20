import React from 'react';
import { PnrCreateInfo } from '../services/UYWSApi';
import './ChatInterface.scss';

interface ReservationBubbleProps {
  data: PnrCreateInfo;
}

export const ReservationBubble: React.FC<ReservationBubbleProps> = ({ data }) => {
  const handlePayment = () => {
    window.open(data.paymentUrl, '_blank');
  };

  return (
    <div className="data-bubble reservation-data">
      <div className="reservation-container">
        <div className="reservation-header">
          <h3>Reservation confirmed</h3>
          <div className="reservation-id">
            ID: {data.reservationId}
          </div>
        </div>

        <div className="reservation-details">
          <div className="reservation-message">
            Reservation confirmed successfully. The agency will contact the provider to finalize the booking.
          </div>
          
          <div className="reservation-type">
            <span className="type-label">Type:</span>
            <span className="type-value">{data.type}</span>
          </div>

          <div className="price-section">
            <div className="total-price">
              <span className="price-label">Total fare:</span>
              <span className="price-amount">${data.price}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <button 
            className="payment-button"
            onClick={handlePayment}
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};