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
  isTyping?: boolean; // Flag for typing animation
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
    
    // Add user message without typing animation
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
        // Add timeout for fetch request
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });
      
      // First try to get the response as text
      const responseText = await response.text();
      
      // Then try to parse it as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error(`Failed to parse response: ${responseText.substring(0, 100)}...`);
      }
      
      // Check for errors
      if (!response.ok) {
        const errorMessage = data.error || 'Failed to get a response';
        console.error('API error:', data);
        throw new Error(errorMessage);
      }
      
      // Update current model if provided in the response
      if (data.model) {
        setCurrentModel(data.model);
      }
      
      // Validate response format
      if (!data.response) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }
      
      // Add AI response message
      const aiMessage: Message = {
        id: uuidv4(),
        text: data.response,
        type: 'received',
        model: data.model || 'AI Assistant',
      };
      
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('Error sending message to DeepSeek:', err);
      
      // Handle different error types
      let errorMessage = 'Failed to get a response. Please try again.';
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try a shorter message or try again later.';
      } else if (err.message.includes('JSON')) {
        errorMessage = 'Error processing response. Please try again.';
      } else if (typeof err.message === 'string') {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
            <ChatMessages 
              messages={messages} 
              isLoading={isLoading}
            />
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