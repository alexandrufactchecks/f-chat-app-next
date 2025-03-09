'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import styles from './Chat.module.css';

interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  model?: string; // Optional model information
}

interface ExamplePrompt {
  title: string;
  prompt: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState<string>('deepseek-reasoner');
  const [showWelcome, setShowWelcome] = useState(true);

  // Example prompts for users to try
  const examplePrompts: ExamplePrompt[] = [
    {
      title: "Fact-check a claim",
      prompt: "Is it true that drinking lemon water every morning boosts your immune system?"
    },
    {
      title: "Analyze a news headline",
      prompt: "Can you analyze this headline: 'Scientists discover new planet that could support life'"
    },
    {
      title: "Verify a statistic",
      prompt: "Is it accurate that electric cars produce 50% less emissions than gas cars?"
    },
    {
      title: "Explain a complex topic",
      prompt: "What is quantum computing and how does it differ from classical computing?"
    }
  ];

  useEffect(() => {
    console.log('Chat component mounted');
    
    // Show welcome screen
    const timer = setTimeout(() => {
      console.log('Setting chat to visible');
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (text: string) => {
    console.log('Sending message:', text);
    setError(null);
    
    // Hide welcome screen on first message
    if (showWelcome) {
      setShowWelcome(false);
    }
    
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
      
      // Update current model if provided in the response
      if (data.model) {
        setCurrentModel(data.model);
      }
      
      // Add AI response to the chat
      const botMessage: Message = {
        id: uuidv4(),
        text: data.text,
        type: 'received',
        model: data.model || currentModel,
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err: any) {
      console.error('Error sending message to DeepSeek:', err);
      setError(err.message || 'An error occurred while getting a response');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        text: `Sorry, I encountered an error: ${err.message || 'Failed to get a response. Please try again.'}`,
        type: 'received',
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className={`${styles.chatScreen} ${isVisible ? styles.visible : ''} animate-fade-in`}>
      <div className={styles.chatMain}>
        <ChatHeader model={currentModel} />
        <div className={styles.chatContent}>
          {showWelcome ? (
            <div className={styles.welcomeContainer}>
              <div className={styles.welcomeContent}>
                <div className={styles.welcomeHeader}>
                  <div className={styles.welcomeIcon}>
                    <span className={styles.mirroredF}>F</span>
                  </div>
                  <h1 className={styles.welcomeTitle}>Welcome to FactCheck</h1>
                </div>
                <p className={styles.welcomeSubtitle}>
                  I can help you verify information, analyze claims, and provide evidence-based answers.
                </p>
                
                <div className={styles.examplesContainer}>
                  <h2 className={styles.examplesTitle}>Try asking about:</h2>
                  <div className={styles.examplePrompts}>
                    {examplePrompts.map((example, index) => (
                      <div 
                        key={index} 
                        className={styles.examplePrompt}
                        onClick={() => handleExampleClick(example.prompt)}
                      >
                        <span className={styles.exampleTitle}>{example.title}</span>
                        <span className={styles.exampleText}>{example.prompt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ChatMessages messages={messages} isLoading={isLoading} />
          )}
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading} 
            placeholder={showWelcome ? "Ask me anything..." : "Type your message..."}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat; 