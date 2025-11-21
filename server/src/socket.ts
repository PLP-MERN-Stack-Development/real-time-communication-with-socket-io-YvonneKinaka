import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { messages, users } from './messages';
import type { Message, User } from './types';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', ({ username }: { username: string }) => {
      const user: User = {
        id: socket.id,
        username,
        socketId: socket.id,
        online: true
      };
      users.set(socket.id, user);

      socket.broadcast.emit('user-joined', { username });
      io.emit('users-update', Array.from(users.values()));
      socket.emit('messages', messages.slice(-100));
    });

    socket.on('send-message', (payload: { text: string; sender: string; room?: string }) => {
      const msg: Message = {
        id: uuidv4(),
        text: payload.text,
        sender: payload.sender,
        timestamp: Date.now(),
        room: payload.room || 'global',
        type: 'text',
        readBy: [],
        reactions: {}
      };
      messages.push(msg);
      io.emit('message', msg);
    });

    socket.on('typing', ({ username, room }: { username: string; room?: string }) => {
      const u = users.get(socket.id);
      if (u) {
        u.typingIn = room || 'global';
        users.set(socket.id, u);
      }
      socket.broadcast.emit('typing', { username, room: room || 'global' });
    });

    socket.on('stop-typing', ({ username, room }: { username: string; room?: string }) => {
      const u = users.get(socket.id);
      if (u) {
        u.typingIn = undefined;
        users.set(socket.id, u);
      }
      socket.broadcast.emit('stop-typing', { username, room: room || 'global' });
    });

    socket.on('mark-read', ({ messageId, userId }: { messageId: string; userId: string }) => {
      const msg = messages.find(m => m.id === messageId);
      if (msg && !msg.readBy.includes(userId)) {
        msg.readBy.push(userId);
        io.emit('message-updated', msg);
      }
    });

    socket.on('reaction', ({ messageId, reaction, username }: { messageId: string; reaction: string; username: string }) => {
      const msg = messages.find(m => m.id === messageId);
      if (!msg) return;
      if (!msg.reactions[reaction]) msg.reactions[reaction] = [];
      if (!msg.reactions[reaction].includes(username)) msg.reactions[reaction].push(username);
      io.emit('message-updated', msg);
    });

    socket.on('disconnect', (reason) => {
      const u = users.get(socket.id);
      if (u) {
        u.online = false;
        users.set(socket.id, u);
        socket.broadcast.emit('user-left', { username: u.username });
        io.emit('users-update', Array.from(users.values()));
      }
      console.log('User disconnected:', socket.id, reason);
      users.delete(socket.id);
    });
  });
};