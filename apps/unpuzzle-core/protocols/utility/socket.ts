import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { Express } from "express";

export class SocketService {
  private app: Express;
  private io!: SocketIOServer;
  private userSockets: Map<string, Socket> = new Map();

  constructor(app: Express) {
    this.app = app;
  }

  // Initialize Socket.IO and bind to the request object
  async initSocket(server: any) {
    // Get allowed origins from environment
    const allowedOrigins = [
      process.env.CORE_URL_ENDPOINT || "https://dev.nazmulcodes.org",
      process.env.STUDENT_APP_URL || "https://nazmulcodes.org",
      process.env.INSTRUCTOR_APP_URL || "https://instructor.nazmulcodes.org",
      process.env.M1_URL_ENDPOINT || "http://localhost:4000",
      process.env.ROOT_APP_URL || "https://nazmulcodes.org",
      "http://localhost:3000",
      "http://localhost:3003"
    ];

    this.io = new SocketIOServer(server, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
      },
      allowEIO3: true,
      transports: ["websocket", "polling"]
    });
    
    // Handle socket connections
    this.io.on('connection', (socket: Socket) => {
      // console.log('A user connected');

      // Handle user identification
      socket.on('identify', (userId: string) => {
        this.userSockets.set(userId, socket);
        // console.log(`User ${userId} identified`);
      });

      // Handle chat session start
      socket.on('start-chat', (requestId: string) => {
        // Send the requestId back to the client
        socket.emit('chat-started', { requestId });
        // console.log(`Chat session started for requestId ${requestId}`);
      });

      // Handle incoming messages from the client
      socket.on('chat-message', (data: { message: string, requestId: string }) => {
        // console.log('Message from client:', data.message);
        // Send response back to the same socket with the requestId
        socket.emit('chat message', {
          message: data.message,
          requestId: data.requestId
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove user from the map
        for (const [userId, sock] of this.userSockets.entries()) {
          if (sock === socket) {
            this.userSockets.delete(userId);
            // console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });
    
    // Attach io instance to the request object
    this.app.use((req: any, _res: any, next: any) => {
        // Attach Socket.IO instance to all requests
        req.io = this.io;
        next();
    });

    return this.io;
  }

  // Helper method to send message to specific socket
  sendToSocket(socket: Socket, event: string, data: any) {
    socket.emit(event, data);
  }

  // Helper method to broadcast to all users
  broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}
