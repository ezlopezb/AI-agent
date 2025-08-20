import React, { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { aiAgentRetriveMessage, CarOption, FlightInfo, getConversationMessages, PnrCreateInfo } from '../services/UYWSApi';
import './ChatInterface.scss';
import { MessageBubble } from './MessageBubble';
import DataBubble from './DataBubble';
import loadingGif from '../assets/loading.gif';
import { HotelOption } from './HotelsBubble';

interface ChatMessage {
  role: 'assistant' | 'user';
  sessionId: string;
  message: string;
  timestamp: Date;
  data?: {
    pnr: PnrCreateInfo | null;
    flights: FlightInfo[] | null;
    cars: CarOption[];
    hotels: HotelOption[] | null;
  };
}

interface ChatInterfaceProps {
  sessionId: string;
  index: number;
  onMessageSent: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId,
  index,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const initialMessages = await getConversationMessages(sessionId);
      if (initialMessages && initialMessages.length > 0) {
        const transformedMessages = initialMessages.map((msg: any) => ({
          role: msg.role,
          sessionId: sessionId,
          message: msg.content || msg.message || '',
          timestamp: new Date(msg.timestamp || Date.now()),
          data: msg.data
        }));
        setMessages(transformedMessages);
      } else {
        // Clear messages if no conversation exists
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching initial messages:', error);
      setMessages([]); // Clear messages on error
    }
  };

  // Update messages when initialMessages prop changes
  useEffect(() => {
    if (sessionId && !isFetching) {
      setIsFetching(true);
      fetchMessages().finally(() => setIsFetching(false));
    }
  }, [sessionId]);

  useEffect(() => {}, [messages]);

  useEffect(() => {
    setInputMessage('');
  }, [sessionId]);

  const scrollToBottom = () => {
    // Use setTimeout to debounce the scroll
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      sessionId,
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const agentResponse = await aiAgentRetriveMessage(userMessage.sessionId, userMessage.message, import.meta.env.VITE_USER_NAME, `Conversation #${index+1}` );
      setIsLoading(false);
      onMessageSent();
      if (agentResponse?.content && agentResponse?.content !== "") {
        setMessages(prev => [...prev, {
          role: 'assistant',
          sessionId,
          message: agentResponse.content,
          timestamp: new Date()
        }]);
      } else if (agentResponse?.data) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          sessionId,
          message: "",
          timestamp: new Date(),
          data: agentResponse.data
        }]);
      }

    } catch (error) {
      setIsLoading(false);
      console.error('Error sending message:', error);
    }
  };

  const renderBubble = (msg: ChatMessage) => {
    if (msg.data) {
      return <DataBubble data={msg.data} />;
    } else if(msg.message && msg.message.charAt(0) === '{') {
      return <DataBubble data={JSON.parse(msg.message)} />;
    } else if (msg.message) {
      return <MessageBubble message={msg.message} />
    } else {
      return null
    }
  }

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, i) => {
          if (msg.role !== 'user' && msg.role !== 'assistant') return null; // Skip non-user/assistant messages
          return <div key={i} className={`message ${msg.role}`}>
            {renderBubble(msg)}
          </div>
        })}
        {isLoading && (
          <div className="message assistant">
            <div className="bubble">
              <img src={loadingGif} alt="Loading..." style={{ width: '30px', height: '30px' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          variant="outlined"
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSendMessage} disabled={isLoading}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: '#fff',
            }
          }}
        />
      </div>
    </div>
  );
};