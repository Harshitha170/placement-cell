import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const StudentChatbot = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Career Bridge Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        const userInput = input.toLowerCase();
        setInput('');

        // Bot Logic
        setTimeout(() => {
            let botResponse = "";

            if (userInput.includes('hi') || userInput.includes('hello')) {
                botResponse = `Hi, ${user?.name || 'Student'}! How can I help you?`;
            } else if (
                userInput.includes('email') ||
                userInput.includes('whatsapp') ||
                userInput.includes('contact') ||
                userInput.includes('issue') ||
                userInput.includes('query')
            ) {
                botResponse = (
                    <div>
                        For any issues or queries, you can reach out to us:
                        <br /><br />
                        📧 <strong>Email:</strong> jharshitha28@gmail.com
                        <br />
                        📱 <strong>WhatsApp:</strong> <a href="https://chat.whatsapp.com/GyNva961g9f7IM9Dl79ZSE?mode=gi_t" target="_blank" rel="noopener noreferrer" style={{ color: '#52ab98', textDecoration: 'underline' }}>Join Group</a>
                    </div>
                );
            } else {
                botResponse = "I'm a simple assistant. I can help with contact details (Email/WhatsApp) or just say 'hi' to get started!";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
        }, 500);
    };

    if (!user || user.role !== 'student') return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot Button */}
            <div className="flex items-center gap-3">
                {!isOpen && (
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-premium border border-primary-50 animate-in slide-in-from-right-4 fade-in duration-500">
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest whitespace-nowrap">Assistant</p>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform duration-300"
                >
                    {isOpen ? (
                        <span className="text-2xl">×</span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-primary-50 overflow-hidden flex flex-col max-h-[500px] animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-400 p-4 text-white">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Career Bridge Assistant
                        </h3>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 max-h-80">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-primary-500 text-white rounded-tr-none'
                                    : 'bg-white text-slate-800 shadow-sm border border-primary-50 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                        />
                        <button
                            type="submit"
                            className="p-2 bg-primary-400 text-white rounded-full hover:bg-primary-500 transition-colors shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StudentChatbot;
