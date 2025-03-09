'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Focus input on iOS when keyboard appears
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS && inputRef.current) {
      const handleFocus = () => {
        // Small delay to ensure the keyboard has appeared
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      };
      
      inputRef.current.addEventListener('focus', handleFocus);
      
      return () => {
        inputRef.current?.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  return (
    <div className={styles.chatInputContainer}>
      <form onSubmit={handleSubmit} className={styles.chatInputWrapper}>
        <input
          ref={inputRef}
          type="text"
          id="message-input"
          className={styles.messageInput}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
          disabled={disabled}
        />
        <button 
          type="submit" 
          className={styles.sendButton}
          aria-label="Send message"
          disabled={!message.trim() || disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput; 