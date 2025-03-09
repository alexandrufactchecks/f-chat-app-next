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

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatMessages}>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.messageWrapper} ${
              message.type === 'sent' ? styles.sentWrapper : styles.receivedWrapper
            }`}
          >
            {message.type === 'received' && (
              <div className={styles.avatar}>
                <span>F</span>
              </div>
            )}
            <div className={styles.bubbleContainer}>
              {message.type === 'received' && (
                <div className={styles.messageSender}>FactChecks.eu</div>
              )}
              <div
                className={`${styles.message} ${
                  message.type === 'sent' ? styles.sent : styles.received
                }`}
              >
                {message.text}
              </div>
              <div className={styles.messageTime}>{formatTime()}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.receivedWrapper}`}>
            <div className={styles.avatar}>
              <span>F</span>
            </div>
            <div className={styles.bubbleContainer}>
              <div className={styles.messageSender}>FactChecks.eu</div>
              <div className={styles.loading}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 