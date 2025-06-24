import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { ChatMessage } from '../../types/shared';

/* 
 * CHANGE: Fixed chat window height and improved layout structure for consistent sizing
 * DATE: 21-06-2025
 */
interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  onClose,
  onMinimize,
  messages,
  onSendMessage
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-24 right-6 w-96 flex flex-col shadow-xl rounded-lg bg-white border border-gray-200 z-50"
          style={{ 
            height: '460px', // Fixed height for consistency
            maxHeight: 'calc(100vh - 120px)' // Ensure it works on smaller screens
          }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <ChatHeader onClose={onClose} onMinimize={onMinimize} />
          
          {/* Message list with flex-grow to fill available space */}
          <div className="flex-grow overflow-hidden relative">
            <ChatMessageList messages={messages} />
          </div>
          
          {/* Input stays fixed at bottom */}
          <ChatInput onSendMessage={onSendMessage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;