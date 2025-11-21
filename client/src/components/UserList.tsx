import React from 'react';
import type { User } from '../types';

export const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <div style={{ width: 200, borderLeft: '1px solid #eee', padding: 8 }}>
      <div style={{ fontWeight: 600 }}>Users</div>
      {users.map(u => (
        <div key={u.id} style={{ padding: '6px 0', color: u.online ? 'green' : '#888' }}>
          {u.username} {u.typingIn ? '• typing' : ''}
        </div>
      ))}
    </div>
  );
};