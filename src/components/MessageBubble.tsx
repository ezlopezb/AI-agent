import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatInterface.scss';

interface MessageBubbleProps {
  message: string;
}

const formatMessage = (message: string) => {
  // Replace literal \n with actual newlines
  const formattedMessage = message.replace(/\\n/g, '\n');
  return (
    <div className="markdown-content">
      <ReactMarkdown>
        {formattedMessage}
      </ReactMarkdown>
    </div>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
  <div className="bubble">
    {formatMessage(message)}
  </div>
);