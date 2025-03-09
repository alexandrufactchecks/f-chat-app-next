'use client';

import React, { useRef, useEffect } from 'react';
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
                <span className={styles.mirroredF}>F</span>
              </div>
            )}
            <div className={styles.bubbleContainer}>
              {message.type === 'received' && (
                <div className={styles.messageSender}>FactCheck</div>
              )}
              <div
                className={`${styles.message} ${
                  message.type === 'sent' ? styles.sent : styles.received
                }`}
              >
                {message.type === 'sent' ? (
                  message.text
                ) : (
                  <div className={styles.formattedMessage}>
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => <h1 className={styles.heading1} {...props} />,
                        h2: ({ node, ...props }) => <h2 className={styles.heading2} {...props} />,
                        h3: ({ node, children, ...props }) => {
                          // Extract emoji from h3 headings to use as data attributes for styling
                          const content = children?.toString() || '';
                          // Extract the emoji + category prefix
                          const match = content.match(/^([📝🔎📊✅🧐⚖️]\s+[A-Z]+):/);
                          const dataContent = match ? match[1] : '';
                          
                          return (
                            <h3 
                              className={styles.heading3} 
                              data-content={dataContent}
                              {...props}
                            />
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
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
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
              <div className={styles.messageSender}>FactCheck</div>
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