import React, { useEffect, useRef } from 'react';

const ChatArea = ({ convo }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [convo]);

  // ✅ Add this to debug convo updates
  useEffect(() => {
    console.log("ChatArea convo updated:", convo);
  }, [convo]);

  return (
    <div className="chat-area">
      <div className="messages" id="messages">
        {convo.map((m, index) => (
          <div key={index} className={`bubble ${m.role === 'user' ? 'me' : 'bot'}`}>
            <div className="bubble-text">
              {m.text}
            </div>
            <div className="bubble-meta">
              {m.role === 'user' ? 'You' : 'ALA Assistant'} • {m.when}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
