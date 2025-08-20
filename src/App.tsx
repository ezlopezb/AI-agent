import { useEffect, useState } from 'react';
import './App.css';
import { Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { ChatInterface } from './components/ChatInterface';
import { ConversationsPanel } from './components/ConversationsPanel';
import { getConversations, Conversation } from './services/UYWSApi';
import styled from 'styled-components';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [currentConversationIndex, setCurrentConversationIndex] = useState<number>(0);

  const ChatContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 300px; /* Account for conversations panel width */
    right: 0;
    width: calc(100% - 300px);
  `;

  const loadConversations = async () => {
    try {
      setConversationsLoading(true);
      const conversationsList = await getConversations();
      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setConversationsLoading(false);
    }
  };

  const handleConversationSelect = (sessionId: string, conversationIndex: number) => {
    setCurrentSessionId(sessionId);
    setCurrentConversationIndex(conversationIndex);
  };

  const handleNewConversation = () => {
    const newSessionId = Math.random().toString(36);
    setCurrentSessionId(newSessionId);
  };

  const handleFirstMessageSent = async () => {
    const hasExistingMessages = conversations.some(conv => conv.sessionId === currentSessionId);
    if (!hasExistingMessages) {
      await loadConversations();
    }
  };

  useEffect(() => {
    // Initialize with a new conversation on app start
    handleNewConversation();
    // Load existing conversations
    loadConversations();
  }, []);

  return (
    <>
      <ConversationsPanel
        conversations={conversations}
        selectedSessionId={currentSessionId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        loading={conversationsLoading}
        reloadConversations={loadConversations}
      />
      
      <header style={{ marginLeft: '300px' }}>
        <Paper
          elevation={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '10px',
            position: 'fixed',
            top: 0,
            left: '300px',
            width: 'calc(100% - 300px)',
            zIndex: 1000,
          }}
        >
          <img
            src="https://uywebsolutionslanding.s3.us-east-2.amazonaws.com/img/icons/logo.png"
            alt="Logo"
            style={{ height: '40px', marginRight: '10px' }}
          />
          <span style={{ fontWeight: 'bold', color: '#ea1e21', marginRight: '10px' }}>
            UY Web Solutions
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: '1.5rem',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            AI Travel Assistant
          </h1>
        </Paper>
      </header>
      
      <ChatContainer>
        <ChatInterface 
          sessionId={currentSessionId} 
          onMessageSent={handleFirstMessageSent}
          index={currentConversationIndex}
        />
      </ChatContainer>
      
      <ToastContainer />
    </>
  );
}

export default App;