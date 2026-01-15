import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import "../types/socket";
import { verifyToken } from "../utils/jwt";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

interface SocketUser {
  userId: string;
  email: string;
  role: string;
  socketId: string;
}

export class SocketService {
  private io: Server;
  private connectedUsers: Map<string, SocketUser> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    // JWT Authentication middleware for Socket.IO
    this.io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace("Bearer ", "");

        if (!token) {
          return next(new Error("Authentication token required"));
        }

        // Verify JWT token
        const payload = verifyToken(token);

        // Attach user info to socket
        socket.userId = payload.userId;
        socket.userEmail = payload.email;
        socket.userRole = payload.role;

        // Verify user exists in database
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });

        if (!user) {
          return next(new Error("User not found"));
        }

        next();
      } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Authentication failed"));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on("connection", (socket: AuthenticatedSocket) => {
      console.log(`✓ User connected: ${socket.userEmail} (${socket.id})`);

      // Register user connection
      if (socket.userId && socket.userEmail && socket.userRole) {
        this.connectedUsers.set(socket.userId, {
          userId: socket.userId,
          email: socket.userEmail,
          role: socket.userRole,
          socketId: socket.id,
        });

        // Join user-specific room
        socket.join(`user:${socket.userId}`);

        // Join role-specific room
        socket.join(`role:${socket.userRole}`);

        // Emit connection success
        socket.emit("authenticated", {
          userId: socket.userId,
          email: socket.userEmail,
          role: socket.userRole,
        });
      }

      // Handle user registration for notifications
      socket.on("register:notifications", async () => {
        if (socket.userId) {
          socket.join("notifications");
          console.log(`User ${socket.userEmail} registered for notifications`);
          socket.emit("notifications:registered", { success: true });
        }
      });

      // Handle user typing events
      socket.on("typing:start", (data: { conversationId: string }) => {
        if (socket.userId) {
          socket.to(data.conversationId).emit("user:typing", {
            userId: socket.userId,
            email: socket.userEmail,
          });
        }
      });

      socket.on("typing:stop", (data: { conversationId: string }) => {
        if (socket.userId) {
          socket.to(data.conversationId).emit("user:stopped-typing", {
            userId: socket.userId,
          });
        }
      });

      // Handle payment status updates subscription
      socket.on("subscribe:payment", (data: { paymentId: string }) => {
        socket.join(`payment:${data.paymentId}`);
        console.log(
          `User ${socket.userEmail} subscribed to payment ${data.paymentId}`
        );
      });

      socket.on("unsubscribe:payment", (data: { paymentId: string }) => {
        socket.leave(`payment:${data.paymentId}`);
      });

      // Handle transaction updates subscription
      socket.on("subscribe:transactions", () => {
        if (socket.userId) {
          socket.join(`transactions:${socket.userId}`);
          console.log(
            `User ${socket.userEmail} subscribed to transaction updates`
          );
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`✗ User disconnected: ${socket.userEmail} (${socket.id})`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
      });

      // Handle errors
      socket.on("error", (error) => {
        console.error(`Socket error for user ${socket.userEmail}:`, error);
      });
    });
  }

  // Emit notification to specific user
  public emitToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Emit notification to all users with specific role
  public emitToRole(role: string, event: string, data: any): void {
    this.io.to(`role:${role}`).emit(event, data);
  }

  // Emit notification to all connected users
  public emitToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Emit payment update
  public emitPaymentUpdate(paymentId: string, data: any): void {
    this.io.to(`payment:${paymentId}`).emit("payment:update", data);
  }

  // Emit transaction update to user
  public emitTransactionUpdate(userId: string, data: any): void {
    this.io.to(`transactions:${userId}`).emit("transaction:update", data);
  }

  // Emit notification
  public emitNotification(userId: string, notification: any): void {
    this.io.to(`user:${userId}`).emit("notification:new", notification);
  }

  // Broadcast to notifications room
  public broadcastNotification(notification: any): void {
    this.io.to("notifications").emit("notification:new", notification);
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get connected user by userId
  public getConnectedUser(userId: string): SocketUser | undefined {
    return this.connectedUsers.get(userId);
  }

  // Check if user is connected
  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get Socket.IO instance
  public getIO(): Server {
    return this.io;
  }
}

let socketService: SocketService | null = null;

export function initializeSocketService(httpServer: HTTPServer): SocketService {
  if (!socketService) {
    socketService = new SocketService(httpServer);
    console.log("✓ Socket.IO service initialized with authentication");
  }
  return socketService;
}

export function getSocketService(): SocketService {
  if (!socketService) {
    throw new Error(
      "Socket service not initialized. Call initializeSocketService first."
    );
  }
  return socketService;
}
