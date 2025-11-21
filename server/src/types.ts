export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: number;
  room: string;
  type: 'text' | 'image';
  readBy: string[];
  reactions: Record<string, string[]>;
}

export interface User {
  id: string;
  username: string;
  socketId: string;
  online: boolean;
  typingIn?: string;
}