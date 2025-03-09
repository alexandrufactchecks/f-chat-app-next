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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Chat component mounted');
    
    // Show welcome message after a delay
    const timer = setTimeout(() => {
      console.log('Setting chat to visible');
      setIsVisible(true);
      
      // Add welcome message
      setMessages([
        {
          id: uuidv4(),
          text: 'Welcome to factchecks.eu! Ask me anything for a fact check.',
          type: 'received',
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (text: string) => {
    console.log('Sending message:', text);
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      type: 'sent',
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Call our backend API that interfaces with DeepSeek
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });
      
      const data = await response.json();
      
      // Check for errors
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response');
      }
      
      // Add AI response to the chat
      const botMessage: Message = {
        id: uuidv4(),
        text: data.text,
        type: 'received',
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err: any) {
      console.error('Error sending message to DeepSeek:', err);
      setError(err.message || 'An error occurred while getting a response');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        text: `Error: ${err.message || 'Failed to get a response. Please try again.'}`,
        type: 'received',
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log('Rendering Chat component, isVisible:', isVisible);
  console.log('Current messages:', messages);

  return (
    <div className={`${styles.chatScreen} ${isVisible ? styles.visible : ''}`}>
      <AnimatedBackground />
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat; 