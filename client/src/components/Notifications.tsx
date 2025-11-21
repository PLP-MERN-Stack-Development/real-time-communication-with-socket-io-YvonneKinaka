import React from 'react';

export const Notifications: React.FC<{ text?: string }> = ({ text }) => {
  if (!text) return null;
  return <div style={{ position: 'fixed', right: 12, top: 12, background: '#222', color: '#fff', padding: 8, borderRadius: 4 }}>{text}</div>;
};