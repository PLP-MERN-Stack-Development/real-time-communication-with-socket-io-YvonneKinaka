import React from 'react';
import type { Message } from '../types';

export const MessageList: React.FC<{ messages: Message[]; onReact?: (id: string, reaction: string) => void }> = ({ messages, onReact }) => {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 8 }}>
      {messages.map(m => (
        <div key={m.id} style={{ marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 6 }}>
          <div style={{ fontSize: 12, color: '#666' }}>{m.sender} • {new Date(m.timestamp).toLocaleTimeString()}</div>
          <div style={{ fontSize: 16 }}>{m.text}</div>
          <div style={{ marginTop: 6 }}>
            {Object.entries(m.reactions).map(([r, users]) => (
              <button key={r} onClick={() => onReact?.(m.id, r)} style={{ marginRight: 6 }}>{r} {users.length}</button>
            ))}
            <span style={{ fontSize: 12, color: '#999', marginLeft: 8 }}>{m.readBy.length} read</span>
          </div>
        </div>
      ))}
    </div>
  );
};