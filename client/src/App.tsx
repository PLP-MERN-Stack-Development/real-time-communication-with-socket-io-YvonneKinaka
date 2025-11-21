import React, { useState } from 'react';
import { SocketProvider } from './context/SocketContext';
import { Chat } from './components/Chat';

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  if (!username) {
    const name = prompt('Enter username') || `User${Math.floor(Math.random() * 1000)}`;
    setUsername(name);
    return null;
  }

  return (
    <SocketProvider>
      <Chat username={username} />
    </SocketProvider>
  );
};

export default App;