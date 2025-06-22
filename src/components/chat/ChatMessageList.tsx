import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChatMessage } from '../../types/shared';

/* 
 * CHANGE: Fixed height scrolling and improved message grouping with date separators
 * DATE: 21-06-2025
 */
interface ChatMessageListProps {
  messages: ChatMessage[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      // Check if user is already near bottom (within 100px)
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom) {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Group messages by date
  const groupedByDate = messages.reduce((groups: Record<string, ChatMessage[]>, message) => {
    const day = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(message);
    return groups;
  }, {});

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center">
        <p className="mb-1 text-gray-700 font-medium">Start a conversation</p>
        <p className="text-xs">We're here to help with your meal orders</p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="absolute inset-0 overflow-y-auto p-4 scrollbar-thin"
    >
      {Object.entries(groupedByDate).map(([date, dateMessages], groupIndex) => (
        <div key={date} className="mb-4">
          {/* Date separator */}
          <div className="flex justify-center my-3">
            <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
              {format(new Date(date), 'EEEE, MMMM d')}
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-3">
            {dateMessages.map((message, index) => {
              const isLastMessage = 
                groupIndex === Object.entries(groupedByDate).length - 1 && 
                index === dateMessages.length - 1;
              
              return (
                <div 
                  key={message.id}
                  ref={isLastMessage ? lastMessageRef : undefined}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] p-3 shadow-sm
                      ${message.sender === 'user' 
                        ? 'bg-primary-600 text-white rounded-t-lg rounded-bl-lg' 
                        : 'bg-gray-100 text-gray-800 rounded-t-lg rounded-br-lg'}
                    `}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p 
                      className={`
                        text-[10px] mt-1 text-right
                        ${message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'}
                      `}
                    >
                      {format(new Date(message.timestamp), 'h:mm a')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;