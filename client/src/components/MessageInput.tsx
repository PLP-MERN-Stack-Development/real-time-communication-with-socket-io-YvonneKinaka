import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

export const MessageInput: React.FC<{ username: string }> = ({ username }) => {
  const socket = useSocket();
  const [text, setText] = useState('');
  const typingTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  const send = () => {
    if (!text.trim() || !socket) return;
    socket.emit('send-message', { text: text.trim(), sender: username });
    setText('');
    socket.emit('stop-typing', { username });
  };

  const onChange = (v: string) => {
    setText(v);
    if (!socket) return;
    socket.emit('typing', { username });
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      socket.emit('stop-typing', { username });
    }, 800);
  };

  return (
    <div style={{ display: 'flex', padding: 8, borderTop: '1px solid #ddd' }}>
      <input value={text} onChange={e => onChange(e.target.value)} style={{ flex: 1, padding: 8 }} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
      <button onClick={send} style={{ marginLeft: 8 }}>Send</button>
    </div>
  );
};