/* 
 * CHANGE: Enhanced message persistence and conversation management
 * DATE: 23-06-2025
 */
import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  Search, 
  X, 
  MoreVertical, 
  ArrowLeft,
  Calendar,
  AlertCircle,
  Utensils,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import { ChatMessage, Conversation } from '../../types/shared';

const DietitianMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Store messages for each conversation to preserve them when switching
  const [messageStore, setMessageStore] = useState<Record<string, ChatMessage[]>>({});
  
  // Load mock conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      
      try {
        // Mock delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockConversations: Conversation[] = [
          {
            id: 'conv-1',
            userId: 'user-1',
            userName: 'John Smith',
            userEmail: 'john@example.com',
            lastMessage: 'I need help planning meals for my low-carb diet.',
            lastMessageTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
            unreadCount: 1,
            status: 'active'
          },
          {
            id: 'conv-2',
            userId: 'user-2',
            userName: 'Sarah Johnson',
            userEmail: 'sarah@example.com',
            userAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
            lastMessage: 'Which meal plans would you recommend for someone with diabetes?',
            lastMessageTime: new Date(Date.now() - 55 * 60000), // 55 minutes ago
            unreadCount: 0,
            status: 'active'
          },
          {
            id: 'conv-3',
            userId: 'user-3',
            userName: 'Michael Williams',
            userEmail: 'michael@example.com',
            lastMessage: 'Thanks for the advice on protein intake!',
            lastMessageTime: new Date(Date.now() - 4 * 3600000), // 4 hours ago
            unreadCount: 0,
            status: 'active'
          }
        ];
        
        setConversations(mockConversations);
        
        // Initialize message store with empty arrays for each conversation
        const initialMessageStore: Record<string, ChatMessage[]> = {};
        mockConversations.forEach(conv => {
          initialMessageStore[conv.id] = [];
        });
        setMessageStore(initialMessageStore);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Load messages when selecting a conversation
  useEffect(() => {
    if (!activeConversation) return;
    
    const loadMessages = async () => {
      // If we already have messages for this conversation, use them
      if (messageStore[activeConversation]?.length > 0) {
        setMessages(messageStore[activeConversation]);
        
        // Mark conversation as read
        setConversations(prev => 
          prev.map(c => c.id === activeConversation 
            ? { ...c, unreadCount: 0 } 
            : c
          )
        );
        return;
      }
      
      // Otherwise, generate initial messages
      const selectedConv = conversations.find(c => c.id === activeConversation);
      if (!selectedConv) return;
      
      // Create a conversation history based on the conversation
      const mockMessages: ChatMessage[] = [
        {
          id: `${activeConversation}-msg-1`,
          content: `Hello! I'm interested in getting some nutrition advice for my Bumba Fresh meals.`,
          sender: 'user',
          userId: selectedConv.userId,
          timestamp: new Date(Date.now() - 120 * 60000), // 2 hours ago
          read: true
        },
        {
          id: `${activeConversation}-msg-2`,
          content: `Hi ${selectedConv.userName}! I'd be happy to help with your nutrition questions. What specific goals are you working towards?`,
          sender: 'dietitian',
          timestamp: new Date(Date.now() - 118 * 60000), // 1hr 58min ago
          read: true
        },
        {
          id: `${activeConversation}-msg-3`,
          content: selectedConv.lastMessage,
          sender: 'user',
          userId: selectedConv.userId,
          timestamp: selectedConv.lastMessageTime,
          read: selectedConv.unreadCount === 0
        }
      ];
      
      // Store messages in messageStore and set current messages
      setMessageStore(prev => ({
        ...prev,
        [activeConversation]: mockMessages
      }));
      
      setMessages(mockMessages);
      
      // Mark conversation as read
      if (selectedConv.unreadCount > 0) {
        setConversations(prev => 
          prev.map(c => c.id === activeConversation 
            ? { ...c, unreadCount: 0 } 
            : c
          )
        );
      }
    };
    
    loadMessages();
  }, [activeConversation, conversations, messageStore]);
    // Function to generate contextual replies based on message content
  const generateUserReply = useCallback((dietitianMessage: string): string => {
    const lowerMessage = dietitianMessage.toLowerCase();
    
    if (lowerMessage.includes('meal plan') || lowerMessage.includes('diet plan')) {
      return `Thanks for the information! When can I expect to receive my personalized meal plan?`;
    } else if (lowerMessage.includes('protein') || lowerMessage.includes('carb') || lowerMessage.includes('calorie')) {
      return `I see. I've been trying to maintain a 1800 calorie diet. Do you have any specific Bumba Fresh meals you would recommend?`;
    } else if (lowerMessage.includes('allerg') || lowerMessage.includes('intolerance')) {
      return `Yes, I have a nut allergy. Could you verify which of your meals are completely nut-free?`;
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return `I usually work out 3-4 times a week, mostly strength training. Should I adjust my meal choices on workout days?`;
    } else if (lowerMessage.includes('veggie') || lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
      return `Do you have plant-based protein options available in your meal selections?`;
    } else {
      return `Thank you for the advice! I'll definitely keep that in mind when choosing my next order.`;
    }
  }, []);
  
  // Handle sending a message
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !activeConversation) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: messageInput.trim(),
      sender: 'dietitian',
      timestamp: new Date(),
      read: true
    };
    
    // Update messages in current view and in store
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessageStore(prev => ({
      ...prev,
      [activeConversation]: updatedMessages
    }));
    
    setMessageInput('');
    
    // Update conversation with new last message
    setConversations(prev => 
      prev.map(c => c.id === activeConversation 
        ? {
            ...c,
            lastMessage: messageInput.trim(),
            lastMessageTime: new Date()
          } 
        : c
      )
    );
    
    // Simulate user reply after a delay (70% chance of reply)
    if (Math.random() > 0.3) {
      const selectedConv = conversations.find(c => c.id === activeConversation);
      
      setTimeout(() => {        const replyMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          content: generateUserReply(messageInput),
          sender: 'user',
          userId: selectedConv?.userId,
          timestamp: new Date(),
          read: true
        };
        
        // Update messages in current view and in store
        const messagesWithReply = [...updatedMessages, replyMessage];
        setMessages(messagesWithReply);
        setMessageStore(prev => ({
          ...prev,
          [activeConversation]: messagesWithReply
        }));
        
        // Update conversation with new last message
        setConversations(prev => 
          prev.map(c => c.id === activeConversation 
            ? {
                ...c,
                lastMessage: replyMessage.content,
                lastMessageTime: replyMessage.timestamp
              } 
            : c
          )
        );
      }, 1500 + Math.random() * 3000); // Reply between 1.5-4.5 seconds
    }
  }, [activeConversation, conversations, generateUserReply, messageInput, messages]);
  
  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      conv.userName.toLowerCase().includes(query) || 
      conv.userEmail.toLowerCase().includes(query) ||
      conv.lastMessage.toLowerCase().includes(query)
    );
  });
  
  // Handle keyboard navigation for message input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.trim()) {
        handleSendMessage(e);
      }
    }
  };
  
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <AdminPageHeader 
        title="Nutrition Messaging" 
        description="Provide personalized nutrition advice to customers"
      />
      
      <div className="flex-1 flex overflow-hidden bg-white rounded-lg shadow">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Search and filters */}
          <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 py-1.5 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={14} />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Conversation count indicator without action buttons */}
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-gray-500 font-medium">
                {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start space-x-3 animate-pulse">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-gray-500 mb-2">No conversations found</p>
                <p className="text-sm text-gray-400">Try adjusting your search</p>
              </div>
            ) : (
              <div>
                {filteredConversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversation(conv.id)}
                    className={`py-2.5 px-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors
                      ${activeConversation === conv.id ? 
                        'bg-primary-50 border-l-4 border-l-primary-500' : 
                        'border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                          {conv.userAvatar ? (
                            <img
                              src={conv.userAvatar}
                              alt={conv.userName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            conv.userName.charAt(0)
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{conv.userName}</h3>
                          <span className="text-[10px] font-medium text-gray-500 ml-1 flex-shrink-0">
                            {format(new Date(conv.lastMessageTime), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                        <p className="text-[10px] text-gray-400 truncate">{conv.userEmail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!activeConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Nutrition Consultation</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Select a conversation to start providing personalized nutrition advice to Bumba Fresh customers
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="bg-white border-b border-gray-200 py-2.5 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <button 
                    className="p-1.5 text-gray-500 hover:text-gray-700 md:hidden"
                    onClick={() => setActiveConversation(null)}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                    {conversations.find(c => c.id === activeConversation)?.userAvatar ? (
                      <img 
                        src={conversations.find(c => c.id === activeConversation)?.userAvatar} 
                        alt={conversations.find(c => c.id === activeConversation)?.userName} 
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      conversations.find(c => c.id === activeConversation)?.userName.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-base text-gray-900 truncate">
                        {conversations.find(c => c.id === activeConversation)?.userName || 'User'}
                      </h3>
                      <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {conversations.find(c => c.id === activeConversation)?.userEmail || ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {/* Remove or comment out the shopping bag button below */}
                  {/* 
                  <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors">
                    <ShoppingBag size={16} />
                  </button>
                  */}
                  <button className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              
              {/* Message area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'dietitian' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg shadow-sm
                        ${message.sender === 'dietitian'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-[10px] mt-1 text-right
                          ${message.sender === 'dietitian' ? 'text-primary-100' : 'text-gray-500'}
                        `}
                      >
                        {format(new Date(message.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Type your nutrition advice..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={`px-4 py-2 rounded-full 
                      ${messageInput.trim()
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietitianMessaging;

/* 
 * CHANGE: Fixed icon component usage in customer context tags
 * DATE: 23-06-2025
 */
<div className="px-2 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-thin">
  <div className="shrink-0 px-2 py-0.5 bg-primary-50 border border-primary-100 rounded-full text-[10px] font-medium text-primary-800 flex items-center">
    <ShoppingBag size={10} className="mr-1" /> {/* Changed from ShoppingBag */}
    Family Plan
  </div>
  <div className="shrink-0 px-2 py-0.5 bg-primary-50 border border-primary-100 rounded-full text-[10px] font-medium text-primary-800 flex items-center">
    <Calendar size={10} className="mr-1" />
    Since May 2025
  </div>
  <div className="shrink-0 px-2 py-0.5 bg-green-50 border border-green-100 rounded-full text-[10px] font-medium text-green-800 flex items-center">
    <Utensils size={10} className="mr-1" />
    Vegetarian
  </div>
  <div className="shrink-0 px-2 py-0.5 bg-secondary-50 border border-secondary-100 rounded-full text-[10px] font-medium text-secondary-800 flex items-center">
    <AlertCircle size={10} className="mr-1" />
    Nut Allergy
  </div>
</div>
