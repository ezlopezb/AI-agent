import { useEffect, useState } from 'react';
import './App.css';
import { Button, Paper } from '@mui/material';
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
      setConversations(prev => {
        // Only update if the conversations have actually changed
        if (JSON.stringify(prev) !== JSON.stringify(conversationsList)) {
          return conversationsList;
        }
        return prev;
      });
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
    setCurrentConversationIndex(conversations.length);
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

      <header style={{ marginLeft: '300px', position: 'relative' }}>
        <Paper
          elevation={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '10px 20px', // Add padding to the header
            position: 'fixed',
            top: 0,
            left: '300px',
            width: 'calc(100vw - 300px)', // Ensure the header fits within the viewport
            boxSizing: 'border-box', // Include padding in width calculation
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.5rem',
                textAlign: 'center',
              }}
            >
              AI Travel Assistant
            </h1>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem('authToken'); // Clear the auth token
              window.location.reload(); // Reload the page to redirect to the login screen
            }}
            style={{
              backgroundColor: '#ea1e21',
              color: '#ffffff',
              textTransform: 'none',
              marginRight: '0', // Remove unnecessary margin
            }}
          >
            Logout
          </Button>
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