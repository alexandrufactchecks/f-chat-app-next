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
  isLoading?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading = false }) => {
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
      
      {isLoading && (
        <div className={`${styles.message} ${styles.received} ${styles.loading}`}>
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 