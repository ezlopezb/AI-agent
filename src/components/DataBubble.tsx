import React from 'react';
import {FlightBubble} from './FlightsBubble';
import {ReservationBubble} from './ReservationBubble';
import { CarsBubble } from './CarsBubble';
import { MessageBubble } from './MessageBubble';
import { HotelBubble } from './HotelsBubble';

interface DataBubbleProps {
  data: any;
}

const DataBubble: React.FC<DataBubbleProps> = ({ data }) => {
  // Check if data is FlightInfo array
  if (data && typeof data === 'object' && data.flights) {
    return <FlightBubble data={data.flights} />;
  }
  
  // Check if data is PnrCreateInfo (assuming it has a specific property like pnr or confirmation)
  if (data && typeof data === 'object' && (data.pnr || data.reservationId)) {
    // If data has pnr property, pass data.pnr, otherwise pass data directly
    const reservationData = data.pnr || data;
    return <ReservationBubble data={reservationData} />;
  }

  if (data && typeof data === 'object' && data.cars) {
    return <CarsBubble data={data.cars} />;
  }

  if (data && typeof data === 'object' && data.hotels) {
    return <HotelBubble data={data} />;
  }
  
  // Fallback for unknown data types
  return <MessageBubble message='It looks there was no results for that one. Would you like me to try something different?'/>;
};

export default DataBubble;