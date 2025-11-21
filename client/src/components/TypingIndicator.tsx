import React from 'react';

export const TypingIndicator: React.FC<{ usersTyping: string[] }> = ({ usersTyping }) => {
  if (!usersTyping.length) return null;
  return <div style={{ padding: 6, fontSize: 12, color: '#444' }}>{usersTyping.join(', ')} typing...</div>;
};