'use client'

import React, { useState, useEffect, useRef } from 'react';
import Groq from "groq-sdk";
import { db } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { SendFill, Robot, XLg, ChatRightDotsFill } from 'react-bootstrap-icons';
import { FALLBACK_SYSTEM_PROMPT } from '@/constant/chatbot';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const botStyle = `
  @keyframes pulse-green {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(40, 167, 69, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
  }
  @keyframes float-hint {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .online-indicator {
    width: 8px; height: 8px;
    background-color: #28a745;
    border-radius: 50%;
    display: inline-block;
    animation: pulse-green 2s infinite;
    margin-right: 6px;
    border: 1px solid white;
  }
  .ai-hint-bubble {
    animation: float-hint 3s ease-in-out infinite;
    border-radius: 20px;
    font-size: 0.85rem;
    white-space: nowrap;
    pointer-events: none;
    background: white;
    border: 1px solid #dee2e6;
  }
`;

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '안녕하세요! 김도한에 대해 궁금한 점이 있으시면 물어봐주세요! 😊' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  // ✅ 포커스 제어를 위한 Ref 추가
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      setIsMobile(window.innerWidth <= 768);
      try {
        const docRef = doc(db, "dohan-prompt", "current");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSystemPrompt(docSnap.data().content);
          setIsOnline(true);
        } else {
          throw new Error("No prompt found");
        }
      } catch (err) { 
        console.error(err); 
        setIsOnline(false);
        setSystemPrompt(FALLBACK_SYSTEM_PROMPT);
      }
    };
    init();
  }, []);

  // ✅ 채팅창 열릴 때 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMsg }],
        model: "llama-3.1-8b-instant", 
        temperature: 0.6,
      });
      setMessages(prev => [...prev, { role: 'bot', text: chatCompletion.choices[0]?.message?.content || "" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: '잠시 후 다시 시도해주세요.' }]);
    } finally { 
      setIsLoading(false); 
      // ✅ 전송 완료 후 자동으로 포커스 이동
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <>
      <style>{botStyle}</style>
      <div className="fixed-bottom p-3 d-flex flex-column align-items-center" 
           style={{ zIndex: 10000, bottom: '0', left: '50%', transform: 'translateX(-50%)', width: 'auto' }}>
        
        {isOpen && (
          <div className="card shadow-lg border-0 mb-3" 
              style={{ width: isMobile ? '90vw' : '80vw', height: '550px', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            <div className="card-header border-0 py-3 text-white" 
                 style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded-circle me-3 d-flex align-items-center justify-content-center shadow-sm" style={{width: '40px', height: '40px'}}>
                    <Robot size={24} className="text-primary" />
                  </div>
                  <div className="text-start">
                    <h6 className="mb-0 fw-bold" style={{ fontSize: '1rem', letterSpacing: '-0.5px' }}>Dohan AI Assistant</h6>
                    <div className="d-flex align-items-center mt-1">
                      {/* ✅ 온라인/오프라인 상태에 따른 표시 분기 */}
                      <span className="online-indicator" style={{ backgroundColor: isOnline ? '#28a745' : '#6c757d', animation: isOnline ? 'pulse-green 2s infinite' : 'none' }}></span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e0e0e0' }}>
                        {isOnline ? 'online' : 'offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="btn border-0 p-1 text-white opacity-75 shadow-none" onClick={() => setIsOpen(false)}>
                  <XLg size={20} />
                </button>
              </div>
            </div>

            <div className="card-body overflow-auto p-3 bg-white" ref={scrollRef} style={{ flex: 1 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-2 px-3 shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary text-white rounded-start-4 rounded-top-4' 
                    : 'bg-light text-dark border-0 rounded-end-4 rounded-top-4 text-start'
                  }`} style={{ maxWidth: '85%', fontSize: '0.88rem' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-light p-2 px-3 rounded-end-4 rounded-top-4 shadow-sm">
                    <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer p-3 bg-white border-top-0">
              <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                <input 
                  ref={inputRef} // ✅ Ref 연결
                  type="text" 
                  className="form-control border-0 bg-transparent shadow-none p-2" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  placeholder="메시지를 입력하세요..." 
                  disabled={isLoading}
                  style={{ fontSize: '0.9rem' }}
                />
                <button 
                  className={`btn p-0 border-0 ms-2 d-flex align-items-center justify-content-center ${input.trim() ? 'text-primary' : 'text-secondary opacity-50'}`}
                  onClick={handleSend} 
                  disabled={isLoading || !input.trim()}
                >
                  <SendFill size={22} />
                </button>
              </div>
            </div>
          </div>
        )}

        {!isOpen && (
          <div className="ai-hint-bubble text-primary px-3 py-2 shadow-sm mb-2 fw-bold shadow-sm">
            <Robot className="me-2" />
            도한님에 대해 무엇이든 물어보세요!
          </div>
        )}

        <button 
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center border-0 p-0" 
          style={{ 
            width: '60px', height: '60px', 
            transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isOpen ? 'rotate(180deg)' : 'scale(1)'
          }} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XLg size={24} /> : <ChatRightDotsFill size={28} />}
        </button>
      </div>
    </>
  );
};

export default AIChatBot;