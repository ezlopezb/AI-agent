import React from 'react';
import './ChatInterface.scss';

export interface HotelOption {
  hotelCode: string;
  hotelName: string;
  chainName: string;
  brandName: string;
  distance: number;
  direction: string;
  sabreRating: string;
  address: string;
  cityName: string;
  stateProv: string;
  postalCode: string;
  countryCode: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  minRate: number;
  maxRate: number;
  averageNightlyRate: number;
  totalPrice: number;
  currency: string;
  rateKey: string;
  ratePlanName: string;
  roomType: string;
  bedType: string;
  adults: number;
  children: number;
}

interface DataBubbleProps {
  data: HotelOption[];
}

export const HotelBubble: React.FC<DataBubbleProps> = ({ data }) => {
  // Check if data is HotelOption array
  if (Array.isArray(data) && data.length > 0 && 'hotelCode' in data[0]) {
    const hotelArray = data as HotelOption[];    
    return (
      <div className="data-bubble hotel-data">
        {hotelArray.map((hotel, index) => (
          <div key={index} className="hotel-info-container">
            <div className="hotel-header">
              <div className="hotel-name-section">
                <img
                  src={``}
                  alt={hotel.chainName}
                  className="hotel-logo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64?text=HOTEL';
                  }}
                />
                <div className="hotel-details">
                  <h3>{hotel.hotelName}</h3>
                  <div className="hotel-brand">{hotel.brandName}</div>
                  <div className="hotel-rating">
                    {'★'.repeat(Math.floor(parseFloat(hotel.sabreRating)))} 
                    <span className="rating-number">({hotel.sabreRating})</span>
                  </div>
                </div>
              </div>
              <div className="total-price">
                {hotel.totalPrice} {hotel.currency}
                <div className="price-details">
                  {hotel.averageNightlyRate} {hotel.currency}/night
                </div>
              </div>
            </div>

            <div className="hotel-location">
              <div className="address">
                <strong>Address:</strong> {hotel.address}, {hotel.cityName}, {hotel.stateProv} {hotel.postalCode}
              </div>
              <div className="distance">
                <strong>Distance:</strong> {hotel.distance} miles {hotel.direction}
              </div>
              <div className="phone">
                <strong>Phone:</strong> {hotel.phone}
              </div>
            </div>

            <div className="stay-dates">
              <div className="check-in">
                <div className="date-label">Check-in</div>
                <div className="date">{new Date(hotel.checkInDate).toLocaleDateString()}</div>
                <div className="time">3:00 PM</div>
              </div>

              <div className="stay-duration">
                <div className="duration-line"></div>
                <div className="nights">
                  {Math.ceil((new Date(hotel.checkOutDate).getTime() - new Date(hotel.checkInDate).getTime()) / (1000 * 3600 * 24))} nights
                </div>
              </div>

              <div className="check-out">
                <div className="date-label">Check-out</div>
                <div className="date">{new Date(hotel.checkOutDate).toLocaleDateString()}</div>
                <div className="time">11:00 AM</div>
              </div>
            </div>

            <div className="room-details">
              <div className="room-type">
                <strong>Room:</strong> {hotel.roomType}
              </div>
              <div className="bed-type">
                <strong>Bed:</strong> {hotel.bedType}
              </div>
              <div className="guests">
                <strong>Guests:</strong> {hotel.adults} Adult{hotel.adults > 1 ? 's' : ''}
                {hotel.children > 0 && `, ${hotel.children} Child${hotel.children > 1 ? 'ren' : ''}`}
              </div>
            </div>

            <div className="rate-plan">
              <strong>Rate Plan:</strong> {hotel.ratePlanName}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};