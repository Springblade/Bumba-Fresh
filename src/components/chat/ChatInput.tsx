import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle auto-growing textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Reset height to auto to properly calculate the new height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // Max height of 120px
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');

      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle Ctrl+Enter or Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-100 bg-white p-3">
      <div className="flex flex-col">
        {/* Message input */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Add files"
          >
            <Paperclip size={16} />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm resize-none py-1 max-h-[120px] min-h-[24px]"
            rows={1}
            aria-label="Message input"
          />

          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Add emoji"
          >
            <Smile size={16} />
          </button>

          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-1.5 rounded-full ${
              message.trim() ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } transition-colors`}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Helper text */}
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-[10px] text-gray-500">
            Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-sans">Ctrl</kbd> + <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-sans">Enter</kbd> to send
          </p>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;