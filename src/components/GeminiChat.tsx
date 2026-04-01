import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Trash2, Sparkles, Cpu, Zap, Rocket } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  text: string;
}

type ModelType = 'gemini-3.1-pro-preview' | 'gemini-3-flash-preview' | 'gemini-3.1-flash-lite-preview';

export default function GeminiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini-3-flash-preview');
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const session = ai.chats.create({
        model: selectedModel,
        config: {
          systemInstruction: "You are the ProxyDiamond AI Expert. You help users manage their proxy infrastructure, troubleshoot connection issues, and provide advice on web scraping and data extraction. You are professional, technical, and helpful. Keep responses concise and actionable.",
        },
        history: history
      });

      const result = await session.sendMessage({ message: input });
      const modelResponse: Message = { role: 'model', text: result.text || 'Sorry, I couldn\'t process that.' };
      setMessages(prev => [...prev, modelResponse]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to my neural network. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const models = [
    { id: 'gemini-3.1-pro-preview', name: 'Pro 3.1', icon: <Cpu className="w-3 h-3" />, desc: 'Complex reasoning' },
    { id: 'gemini-3-flash-preview', name: 'Flash 3', icon: <Zap className="w-3 h-3" />, desc: 'General tasks' },
    { id: 'gemini-3.1-flash-lite-preview', name: 'Flash Lite', icon: <Rocket className="w-3 h-3" />, desc: 'Fastest response' },
  ];

  return (
    <div className="flex flex-col h-[650px] bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col gap-4 bg-slate-900/80 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold">ProxyDiamond AI Expert</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Multi-turn Intelligence</p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Model Selector */}
        <div className="flex gap-2">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id as ModelType)}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${selectedModel === m.id ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-1.5">
                {m.icon}
                <span className="text-[10px] font-bold uppercase tracking-tighter">{m.name}</span>
              </div>
              <span className="text-[8px] opacity-60">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <Bot className="w-12 h-12 text-slate-600" />
            <div className="max-w-xs">
              <p className="text-sm font-medium text-slate-400">Hello! I'm your ProxyDiamond assistant. How can I help you with your proxy infrastructure today?</p>
            </div>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/20 text-slate-100' : 'bg-slate-800/50 border border-slate-700 text-slate-300'}`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 items-center text-slate-500 text-xs font-medium bg-slate-800/30 px-4 py-2 rounded-full border border-slate-800">
              <Loader2 className="w-3 h-3 animate-spin" />
              AI Expert is thinking...
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about proxy rotation, scraping tips, or setup..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-6 pr-14 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:hover:bg-cyan-500"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-600 mt-3 text-center">
          AI can make mistakes. Verify important proxy configurations.
        </p>
      </div>
    </div>
  );
}
