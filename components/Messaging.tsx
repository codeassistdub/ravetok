
import React, { useState } from 'react';
import { MessageCircle, Search, MoreVertical, Send, Shield, Zap, History, User as UserIcon } from 'lucide-react';
import { User, Message, Chat } from '../types';
import { MOCK_USERS } from '../constants';

interface MessagingProps {
  currentUser: User;
}

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_1',
    participants: ['u_1', 'admin_01'],
    messages: [
      { id: 'm1', senderId: 'admin_01', text: 'Welcome to the Nexus. Your frequency is now being archived.', timestamp: '2h ago' },
      { id: 'm2', senderId: 'u_1', text: 'Safe. Glad to be part of the heritage.', timestamp: '1h ago' }
    ],
    lastUpdate: '1h ago'
  }
];

const Messaging: React.FC<MessagingProps> = ({ currentUser }) => {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;
    // Logic to add message would go here
    setNewMessage('');
  };

  return (
    <div className="h-full flex bg-black pt-24">
      {/* Chats List */}
      <div className={`flex-1 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'} border-r border-white/5`}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="rave-font text-2xl text-white italic uppercase tracking-tighter">COMM-LINK</h1>
            <Shield className="w-5 h-5 text-pink-500" />
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search frequencies..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-pink-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
          {MOCK_CHATS.map(chat => {
            const otherParticipantId = chat.participants.find(p => p !== currentUser.id) || 'admin_01';
            const otherUser = MOCK_USERS[otherParticipantId] || MOCK_USERS['admin_01'];
            
            return (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full p-4 rounded-3xl flex items-center space-x-4 transition-all ${activeChat?.id === chat.id ? 'bg-pink-500/10 border border-pink-500/20' : 'hover:bg-zinc-900 border border-transparent'}`}
              >
                <div className="relative">
                  <img src={otherUser.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-white text-xs uppercase italic truncate">{otherUser.displayName}</h4>
                    <span className="text-[8px] text-zinc-600 font-black uppercase">{chat.lastUpdate}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate font-medium">{chat.messages[chat.messages.length - 1].text}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chat */}
      {activeChat ? (
        <div className="flex-[2] flex flex-col bg-zinc-950/50 backdrop-blur-3xl animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-zinc-400">
                <History className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex items-center space-x-3">
                <img src={MOCK_USERS['admin_01'].avatar} className="w-10 h-10 rounded-full object-cover border border-pink-500/30" alt="" />
                <div>
                  <h4 className="font-black text-white text-xs uppercase italic">Resident Authority</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">Active Signal</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="p-2 text-zinc-600"><MoreVertical className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {activeChat.messages.map(msg => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${isMine ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-white/5'}`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <p className={`text-[8px] mt-2 font-black uppercase tracking-widest ${isMine ? 'text-pink-200' : 'text-zinc-600'}`}>{msg.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 pb-32">
            <div className="relative">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Transmit signal..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-5 pl-6 pr-16 text-sm text-white font-medium outline-none focus:border-pink-500/50"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-pink-600 text-white rounded-full shadow-lg active:scale-90 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-[2] items-center justify-center flex-col opacity-20">
          <MessageCircle className="w-20 h-20 text-zinc-700 mb-6" />
          <p className="rave-font text-xl text-white italic uppercase tracking-widest">Select Frequency</p>
        </div>
      )}
    </div>
  );
};

export default Messaging;
