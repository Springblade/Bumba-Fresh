import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import { ChatMessage } from '../../types/shared';

/* 
 * CHANGE: Created new ChatWidget component for customer support
 * DATE: 20-06-2025
 */
const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      content: 'Hello! How can we help you with your Bumba Fresh order today?',
      sender: 'agent',
      timestamp: new Date(),
      read: false
    }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  // Handle opening and closing the chat window
  const toggleChat = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
    if (!isOpen) {
      // Mark all messages as read when opening the chat
      setMessages(prev => 
        prev.map(msg => ({ ...msg, read: true }))
      );
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Handle sending a new message
  const handleSendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
      read: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      // In a real app, this would come from your backend/chat service
      const agentMessage: ChatMessage = {
        id: uuidv4(),
        content: "Thanks for your message! Our team will get back to you shortly.",
        sender: 'agent',
        timestamp: new Date(),
        read: isOpen // Only mark as read if chat is open
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1000);
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close chat with Escape key
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <ChatButton 
        onClick={toggleChat} 
        unreadCount={unreadCount} 
      />
      <ChatWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onMinimize={() => setIsOpen(false)} 
        messages={messages}
        onSendMessage={handleSendMessage} 
      />
    </>
  );
};

export default ChatWidget;