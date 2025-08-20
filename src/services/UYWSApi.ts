import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export interface AgentResponse {
  role: string;
  content: string;
  data?: PnrCreateInfo | FlightInfo[] | CarOption[];
}

export interface PnrCreateInfo {
  reservationId: string;
  message: string;
  price: number;
  paymentUrl: string;
  type: string;
}

export interface Flight {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  flightNumber: number;
}

export interface FlightInfo {
  flights: Flight[];
  totalFare: number;
  currency: string;
  passengerCounts: {
    type: string;
    count: number;
  }[];
}

export interface CarOption {
  vendor: string;
  vendorName: string;
  vehicleType: string;
  vehicleModel: string;
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  returnDate: string;
  baseRate: number;
  totalPrice: number;
  currency: string;
  rateKey: string;
  availabilityStatus: string;
  seatBelts: number;
  doors: number;
}

export interface ChatMessage {
  role: 'assistant' | 'user';
  sessionId: string;
  message: string;
  timestamp: Date;
  data?: PnrCreateInfo | FlightInfo[] | CarOption[];
}

export interface Conversation {
  sessionId: string;
  title: string;
  timestamp: Date;
}

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await api.get("/chat/conversations/sonar");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConversationMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/chat/conversations/messages/${sessionId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const aiAgentRetriveMessage = async (sessionId: string, message: string, user: string, conversationTitle?: string): Promise<AgentResponse> => {
  try {
    const response = await api.post(
      "/chat",
      {
      sessionId,
      message,
      title: conversationTitle,
      user
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const renameconversation = async (sessionId: string, title: string): Promise<void> => {
  try {
    await api.post(`/chat/conversations/rename`, { sessionId, title });
  } catch (error) {
    throw error; 
  }
}
