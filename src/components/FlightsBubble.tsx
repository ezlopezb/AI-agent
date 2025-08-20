import React from 'react';
import { PnrCreateInfo, FlightInfo, CarOption } from '../services/UYWSApi';
import './ChatInterface.scss';

interface DataBubbleProps {
  data: PnrCreateInfo | FlightInfo[] | CarOption[];
}

export const FlightBubble: React.FC<DataBubbleProps> = ({ data }) => {
  // Check if data is FlightInfo array
  if (Array.isArray(data) && data.length > 0 && 'flights' in data[0]) {
    const flightInfoArray = data as FlightInfo[];
    console.log("Flight Info Array:", flightInfoArray);
    return (
      <div className="data-bubble flight-data">
        {flightInfoArray.map((flightInfo, index) => (
          <div key={index} className="flight-info-container">
            <div className="flight-header">
              <h3>Opción {index + 1}</h3>
              <div className="total-fare">
                {flightInfo.totalFare} {flightInfo.currency}
              </div>
            </div>

            {flightInfo.flights.map((flight, flightIndex) => (
              <div key={flightIndex} className="flight-ticket">
                <div className="airline-section">
                  <img
                    src={`https://images.kiwi.com/airlines/64/${flight.airline}.png`}
                    alt={flight.airline}
                    className="airline-logo"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64x64?text=AL';
                    }}
                  />
                  <div className="flight-number">{flight.airline} {flight.flightNumber}</div>
                </div>

                <div className="route-section">
                  <div className="departure">
                    <div className="city">{flight.origin}</div>
                    <div className="time">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="date">{new Date(flight.departureTime).toLocaleDateString()}</div>
                  </div>

                  <div className="route-arrow">
                    <div className="arrow-line"></div>
                    <div className="arrow-head">→</div>
                  </div>

                  <div className="arrival">
                    <div className="city">{flight.destination}</div>
                    <div className="time">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="date">{new Date(flight.arrivalTime).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}

            {flightInfo.passengerCounts.length > 0 && (
              <div className="passenger-info">
                <strong>Pasajeros: </strong>
                {flightInfo.passengerCounts.map((pc, i) => (
                  <span key={i}>{pc.count} {pc.type}{i < flightInfo.passengerCounts.length - 1 ? ', ' : ''}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};