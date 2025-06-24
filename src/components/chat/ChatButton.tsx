import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  unreadCount: number;
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ 
  onClick, 
  unreadCount, 
  className = '' 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Open chat ${unreadCount > 0 ? `(${unreadCount} unread messages)` : ''}`}
    >
      <MessageCircle size={24} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-secondary-500 text-white text-xs font-bold">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </motion.button>
  );
};

export default ChatButton;