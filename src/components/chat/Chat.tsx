'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AnimatedBackground from './AnimatedBackground';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import styles from './Chat.module.css';

interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show welcome message after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Add welcome message
      setMessages([
        {
          id: uuidv4(),
          text: 'Welcome to factchecks.eu!',
          type: 'received',
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      type: 'sent',
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        text: 'This is a simulated response. In a real app, this would be an API call to your backend.',
        type: 'received',
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <div className={`${styles.chatScreen} ${isVisible ? styles.visible : ''}`}>
      <AnimatedBackground />
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat; 