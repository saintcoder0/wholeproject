import React, { useState } from 'react';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am your Ayurvedic guide. How can I assist you with your Prakriti or well-being today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');

    // Simulated Bot Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `This is a simulated response to: "${currentInput}". To get real Ayurvedic insight, please integrate with the backend API.` 
      }]);
    }, 1000);
  };

  return (
    <div className="ana-card" style={{ display: 'flex', flexDirection: 'column', height: '400px', padding: '1rem' }}>
      <div className="card-head" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
         <h3 className="card-title" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>Ayurvedic Chatbot</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingRight: '0.5rem', marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'var(--gold)' : 'var(--surface2)',
            color: msg.role === 'user' ? '#fff' : 'var(--ink)',
            padding: '0.6rem 1rem',
            borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
            maxWidth: '85%',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            boxShadow: 'var(--shadow)'
          }}>
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="bmi-input"
          style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '20px' }}
        />
        <button type="submit" className="btn btn--gold" style={{ padding: '0.6rem 1.2rem', borderRadius: '20px' }}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
