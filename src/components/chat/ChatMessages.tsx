'use client';

import React, { useRef, useEffect } from 'react';
import styles from './ChatMessages.module.css';

interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatMessages}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${styles.message} ${
            message.type === 'sent' ? styles.sent : styles.received
          }`}
        >
          {message.text}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 