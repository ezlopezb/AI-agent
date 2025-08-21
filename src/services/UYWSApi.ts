import axios from "axios";
import { HotelOption } from "../components/HotelsBubble";
import CryptoJS from "crypto-js";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export interface LoginResponse {
  token: string;
  providers: any[];
}
export interface AgentResponse {
  role: string;
  content: string;
  data?: {
    pnr: PnrCreateInfo | null;
    flights: FlightInfo[] | null;
    cars: CarOption[];
    hotels: HotelOption[] | null;
  };
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
  role: 'assistant' | 'user' | 'system' | 'tool';
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
    const response = await api.get(`/chat/conversations/`, { headers: { 'authorization': `Bearer ${localStorage.getItem("token")}` || '' } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getConversationMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  try {
    const response = await api.get(`/chat/conversations/messages/${sessionId}`, { headers: { 'authorization': `Bearer ${localStorage.getItem("token")}` || '' } });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const aiAgentRetriveMessage = async (sessionId: string, message: string, conversationTitle?: string): Promise<AgentResponse> => {
  try {
    const response = await api.post(
      "/chat",
      {
      sessionId,
      message,
      title: conversationTitle
      },
      { headers: { 'authorization': `Bearer ${localStorage.getItem("token")}` || '' } }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const renameconversation = async (sessionId: string, title: string): Promise<void> => {
  try {
    await api.post(`/chat/conversations/rename`, { sessionId, title }, { headers: { 'authorization': `Bearer ${localStorage.getItem("token")}` || '' } } );
  } catch (error) {
    throw error; 
  }
}

const encryptPassword = (password: string) => {
  const encryptionKey = import.meta.env.VITE_ENCRIPTION_KEY;

  // Encrypt the password
  const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(encryptionKey), {
    iv: CryptoJS.enc.Utf8.parse(encryptionKey),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Hex)
};

export const login = async(email: string, password: string): Promise<LoginResponse> => {
  try {
    const encryptedPassword = await encryptPassword(password);
    const response = await api.post("/login", { email, password: encryptedPassword });
    if(!response.data.token) {
      throw "Invalid credentials";
    }
    localStorage.setItem("token", response.data.token);
    return response.data; // Return full response instead of just token
  } catch (error) {
    throw error;
  }
}

export const updateSabreCredentials = async (sabreCreds: { pass: string; epr: string; pcc: string }) => {
  try {
    const response = await api.post("/login/update", { sabreCreds }, {
      headers: { 'authorization': `Bearer ${localStorage.getItem("token")}` || '' }
    });
    if(response.status !== 200) {
      throw new Error("Failed to update Sabre credentials");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

