'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from './ChatMessages.module.css';
import ReactMarkdown from 'react-markdown';

// Define a custom interface for the code component props
interface CodeComponentProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface Message {
  id: string;
  text: string;
  type: 'sent' | 'received';
  model?: string; // Optional model information
  isTyping?: boolean; // Flag for typing animation
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});
  const [typingAnimations, setTypingAnimations] = useState<Record<string, boolean>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle typing animation for new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === 'sent' && lastMessage.isTyping && !typingAnimations[lastMessage.id]) {
      // Set typing animation for the new message
      setTypingAnimations(prev => ({ ...prev, [lastMessage.id]: true }));
      
      // Remove typing animation after it completes
      const typingDuration = Math.min(lastMessage.text.length * 30, 1500); // Cap at 1.5 seconds
      setTimeout(() => {
        setTypingAnimations(prev => ({ ...prev, [lastMessage.id]: false }));
      }, typingDuration);
    }
  }, [messages, typingAnimations]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format model name for display
  const formatModelName = (modelName?: string) => {
    if (!modelName) return '';
    
    return modelName
      .replace('deepseek-', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Copy message text to clipboard
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      // Use the Clipboard API to copy text
      await navigator.clipboard.writeText(text);
      
      // Show success indicator
      setCopyStates(prev => ({ ...prev, [messageId]: true }));
      
      // Hide success indicator after 2 seconds
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [messageId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Extract plain text from markdown
  const extractPlainText = (markdown: string) => {
    // Simple regex to remove markdown formatting
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)') // Links
      .replace(/#{1,6}\s+(.+)/g, '$1') // Headers
      .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
      .replace(/`([^`]+)`/g, '$1')     // Inline code
      .replace(/>\s+(.*)/g, '$1')      // Blockquotes
      .replace(/\n\s*[-*+]\s+(.*)/g, '\n• $1'); // Lists
  };

  // Enhanced emoji mapping for headings
  const getEmojiForHeading = (content: string) => {
    if (content.includes('FACT')) return '📝';
    if (content.includes('SOURCE')) return '🔎';
    if (content.includes('EVIDENCE')) return '📊';
    if (content.includes('CONCLUSION')) return '✅';
    if (content.includes('ASSESSMENT')) return '🧐';
    if (content.includes('VERDICT')) return '⚖️';
    return '';
  };

  // Render message content without typing animation
  const renderMessageContent = (message: Message) => {
    if (message.type === 'sent') {
      return message.text;
    } else {
      return (
        <div className={styles.formattedMessage}>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className={styles.heading1} {...props} />,
              h2: ({ node, ...props }) => <h2 className={styles.heading2} {...props} />,
              h3: ({ node, children, ...props }) => {
                // Get content as string safely
                const content = children ? String(children) : '';
                
                // Create data attribute for styling
                let dataContent = '';
                if (content.includes('FACT')) dataContent = '📝 FACT';
                else if (content.includes('SOURCE')) dataContent = '🔎 SOURCE';
                else if (content.includes('EVIDENCE')) dataContent = '📊 EVIDENCE';
                else if (content.includes('CONCLUSION')) dataContent = '✅ CONCLUSION';
                else if (content.includes('ASSESSMENT')) dataContent = '🧐 ASSESSMENT';
                else if (content.includes('VERDICT')) dataContent = '⚖️ VERDICT';
                
                return (
                  <h3 className={styles.heading3} data-content={dataContent} {...props}>
                    {content}
                  </h3>
                );
              },
              p: ({ node, ...props }) => <p className={styles.paragraph} {...props} />,
              ul: ({ node, ...props }) => <ul className={styles.unorderedList} {...props} />,
              ol: ({ node, ...props }) => <ol className={styles.orderedList} {...props} />,
              li: ({ node, ...props }) => <li className={styles.listItem} {...props} />,
              code: ({ node, inline, ...props }: CodeComponentProps) => 
                inline ? 
                  <code className={styles.inlineCode} {...props} /> : 
                  <div className={styles.codeBlock}><code {...props} /></div>,
              pre: ({ node, ...props }) => <pre className={styles.codeBlockContainer} {...props} />,
              hr: ({ node, ...props }) => <hr className={styles.divider} {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className={styles.blockquote} {...props} />,
              strong: ({ node, ...props }) => <strong className={styles.emphasis} {...props} />,
              a: ({ node, href, children, ...props }) => (
                <a 
                  href={href} 
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                  <span className={styles.linkIcon}>↗</span>
                </a>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      );
    }
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
                <span className={styles.mirroredF}>F</span>
              </div>
            )}
            <div className={styles.bubbleContainer}>
              {message.type === 'received' && (
                <div className={styles.messageSender}>
                  FactCheck AI 🔍
                  {message.model && (
                    <span className={styles.modelIndicator}>
                      {formatModelName(message.model)}
                    </span>
                  )}
                </div>
              )}
              <div
                className={`${styles.message} ${
                  message.type === 'sent' ? styles.sent : styles.received
                }`}
              >
                {message.type === 'sent' ? (
                  renderMessageContent(message)
                ) : (
                  <>
                    {renderMessageContent(message)}
                    <button 
                      className={styles.copyButton}
                      onClick={() => copyToClipboard(extractPlainText(message.text), message.id)}
                      aria-label="Copy message"
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                    <div className={`${styles.copySuccess} ${copyStates[message.id] ? styles.visible : ''}`}>
                      Copied! 👍
                    </div>
                  </>
                )}
              </div>
              <div className={styles.messageTime}>{formatTime()}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.receivedWrapper}`}>
            <div className={styles.avatar}>
              <span className={styles.mirroredF}>F</span>
            </div>
            <div className={styles.bubbleContainer}>
              <div className={styles.messageSender}>FactCheck AI 🔍</div>
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