import React from 'react';
import { X, Minimize2 } from 'lucide-react';

/* 
 * CHANGE: Updated header background to match the Family Plan card color scheme
 * DATE: 21-06-2025
 */
interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose, onMinimize }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-primary-500 text-white rounded-t-lg relative overflow-hidden">
      {/* Background circles for visual effect */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary-400/20 -mr-8 -mt-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-primary-400/20 -ml-6 -mb-6"></div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <span className="font-semibold text-base">BF</span>
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-300 rounded-full border-2 border-primary-500"></span>
        </div>
        <div>
          <h3 className="font-semibold text-base text-white">Bumba Fresh Support</h3>
          <div className="flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-300 mr-1.5"></span>
            <p className="text-xs text-white/90">Typically replies in minutes</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 relative z-10">
        <button
          onClick={onMinimize}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Minimize chat window"
        >
          <Minimize2 size={16} />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Close chat window"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;