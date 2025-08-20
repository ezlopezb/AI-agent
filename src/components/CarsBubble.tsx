import React from 'react';
import { PnrCreateInfo, FlightInfo, CarOption } from '../services/UYWSApi';
import './ChatInterface.scss';

interface DataBubbleProps {
  data: PnrCreateInfo | FlightInfo[] | CarOption[];
}

export const CarsBubble: React.FC<DataBubbleProps> = ({ data }) => {
  // Check if data is CarOption array
  if (Array.isArray(data) && data.length > 0 && 'vendor' in data[0]) {
    const carOptionsArray = data as CarOption[];    
    return (
      <div className="data-bubble car-data">
        {carOptionsArray.map((carOption, index) => (
          <div key={index} className="car-info-container">
            <div className="car-header">
              <h3>Option {index + 1}</h3>
              <div className="total-price">
                {carOption.totalPrice} {carOption.currency}
              </div>
            </div>

            <div className="car-ticket">
              <div className="vendor-section">
                <img
                  src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH3jsyOk5VVgUIWBUpkW5RTrXZMYNxogcuBQ&s`}
                  alt={carOption.vendorName}
                  className="vendor-logo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64?text=CAR';
                  }}
                />
                <div className="vendor-name">{carOption.vendorName}</div>
              </div>

              <div className="vehicle-section">
                <img
                  src={``}
                  alt={carOption.vehicleModel}
                  className="vehicle-image"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/200x120?text=${carOption.vehicleType}`;
                  }}
                />
                <div className="vehicle-details">
                  <div className="vehicle-model">{carOption.vehicleModel}</div>
                  <div className="vehicle-type">{carOption.vehicleType}</div>
                </div>
              </div>

              <div className="rental-details">
                <div className="pickup-section">
                  <div className="location-label">Pickup</div>
                  <div className="location">{carOption.pickupLocation}</div>
                  <div className="date-time">{new Date(carOption.pickupDate).toLocaleDateString()}</div>
                  <div className="time">{new Date(carOption.pickupDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div className="rental-arrow">
                  <div className="arrow-line"></div>
                  <div className="arrow-head">→</div>
                </div>

                <div className="return-section">
                  <div className="location-label">Dropoff</div>
                  <div className="location">{carOption.returnLocation}</div>
                  <div className="date-time">{new Date(carOption.returnDate).toLocaleDateString()}</div>
                  <div className="time">{new Date(carOption.returnDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <div className="car-features">
                <div className="feature-item">
                  <span className="feature-label">Seats:</span>
                  <span className="feature-value">{carOption.seatBelts}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-label">Doors:</span>
                  <span className="feature-value">{carOption.doors}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-label">Fare base:</span>
                  <span className="feature-value">{carOption.baseRate} {carOption.currency}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-label">Status:</span>
                  <span className={`feature-value status-${carOption.availabilityStatus.toLowerCase()}`}>
                    {carOption.availabilityStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};