import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import type { Message, User } from '../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { UserList } from './UserList';
import { Notifications } from './Notifications';

export const Chat: React.FC<{ username: string }> = ({ username }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typing, setTyping] = useState<string[]>([]);
  const [notif, setNotif] = useState<string | undefined>();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join', { username });

    socket.on('messages', (msgs: Message[]) => setMessages(msgs));
    socket.on('message', (msg: Message) => setMessages(prev => [...prev, msg]));
    socket.on('message-updated', (msg: Message) => setMessages(prev => prev.map(m => m.id === msg.id ? msg : m)));
    socket.on('users-update', (list: User[]) => setUsers(list));
    socket.on('user-joined', ({ username: u }: { username: string }) => setNotif(`${u} joined`));
    socket.on('user-left', ({ username: u }: { username: string }) => setNotif(`${u} left`));
    socket.on('typing', ({ username: u }: { username: string }) => setTyping(prev => Array.from(new Set([...prev, u]))));
    socket.on('stop-typing', ({ username: u }: { username: string }) => setTyping(prev => prev.filter(x => x !== u)));

    return () => {
      socket.off('messages');
      socket.off('message');
      socket.off('message-updated');
      socket.off('users-update');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('typing');
      socket.off('stop-typing');
    };
  }, [socket, username]);

  useEffect(() => {
    if (!notif) return;
    const t = setTimeout(() => setNotif(undefined), 2500);
    return () => clearTimeout(t);
  }, [notif]);

  const handleReact = (id: string, reaction: string) => {
    socket?.emit('reaction', { messageId: id, reaction, username });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
          <strong>Room: global</strong> • {username}
        </div>
        <MessageList messages={messages} onReact={handleReact} />
        <TypingIndicator usersTyping={typing.filter(u => u !== username)} />
        <MessageInput username={username} />
      </div>
      <UserList users={users} />
      <Notifications text={notif} />
    </div>
  );
};