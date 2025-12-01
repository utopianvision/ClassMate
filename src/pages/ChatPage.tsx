import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // Import remarkGfm

interface ChatMessage {
  text: string;
  isUser: boolean;
}

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const userMessage = { text: newMessage, isUser: true };
      setMessages([...messages, userMessage]);
      setNewMessage('');
      setIsLoading(true);

      try {
        const response = await apiClient.sendMessageToChatbot(newMessage);
        const botMessage = { text: response.reply, isUser: false };
        setMessages([...messages, userMessage, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMesssage = {text: "Error communicating with ClassMate AI", isUser: false}
        setMessages([...messages, userMessage, errorMesssage])
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {message.isUser ? (
                <p>{message.text}</p>
              ) : (
                <ReactMarkdown children={message.text} remarkPlugins={[remarkGfm]} /> // Render bot messages in Markdown
              )}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-left"><LoadingSpinner size="sm" /></div>}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg mr-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;