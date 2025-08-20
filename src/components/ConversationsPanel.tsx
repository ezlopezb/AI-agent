import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Paper, 
  Typography, 
  Button,
  Box,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Conversation, renameconversation } from '../services/UYWSApi';
import './ConversationsPanel.scss';

interface ConversationsPanelProps {
  conversations: Conversation[];
  selectedSessionId: string;
  onConversationSelect: (sessionId: string, index: number) => void;
  onNewConversation: () => void;
  reloadConversations: () => void; // Callback to refresh conversations list
  loading?: boolean;
  onConversationRenamed?: () => void; // Add callback to refresh conversations
}

export const ConversationsPanel: React.FC<ConversationsPanelProps> = ({
  conversations,
  selectedSessionId,
  onConversationSelect,
  onNewConversation,
  loading = false,
  reloadConversations
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleEditStart = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleEditCancel = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleEditConfirm = async () => {
    if (!editingSessionId || !editingTitle.trim()) return;
    
    setIsRenaming(true);
    try {
      await renameconversation(editingSessionId, editingTitle.trim());
      setEditingSessionId(null);
      setEditingTitle('');
      
      // Only call one reload function, not both
      reloadConversations();
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleEditConfirm();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <Paper 
      elevation={2} 
      className="conversations-panel"
      sx={{
        width: '300px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#191919'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
          Quotes History
        </Typography>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewConversation}
          sx={{
            backgroundColor: '#ea1e21',
            '&:hover': {
              backgroundColor: '#d01419'
            }
          }}
        >
          New Quote
        </Button>
      </Box>
      
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {loading ? (
          <ListItem>
            <ListItemText primary="Cargando conversaciones..." />
          </ListItem>
        ) : conversations.length === 0 ? (
          <ListItem>
            <ListItemText 
              primary="Aún no hay conversaciones" 
              secondary="Comienza a escribir para iniciar una nueva cotización"
            />
          </ListItem>
        ) : (
          conversations.map((conversation, index) => (
            <React.Fragment key={conversation.sessionId}>
              <ListItemButton
                selected={selectedSessionId === conversation.sessionId}
                onClick={() => onConversationSelect(conversation.sessionId, index)}
                sx={{
                  py: 2,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: '#2d2d2d',
                    borderRight: '3px solid #ea1e21'
                  },
                  '&:hover': {
                    backgroundColor: '#f0f0f0'
                  }
                }}
              >
                <ChatIcon sx={{ mr: 2, color: '#666' }} />
                <ListItemText
                  primary={
                    editingSessionId === conversation.sessionId ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          size="small"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={handleKeyPress}
                          variant="outlined"
                          sx={{ 
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              color: "#ffffff",
                              fontSize: '0.875rem'
                            }
                          }}
                          autoFocus
                          disabled={isRenaming}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditConfirm();
                          }}
                          disabled={isRenaming}
                          sx={{ color: '#4caf50' }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCancel();
                          }}
                          disabled={isRenaming}
                          sx={{ color: '#f44336' }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'medium', flex: 1, color: '#ffffff' }}>
                          {conversation.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(conversation.sessionId, conversation.title);
                          }}
                          sx={{ 
                            opacity: 0.6,
                            '&:hover': { opacity: 1 },
                            ml: 1,
                            color: '#ea1e21'
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {formatTimestamp(conversation.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};