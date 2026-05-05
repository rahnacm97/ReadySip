import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
export declare const initSocket: (httpServer: HttpServer) => SocketServer;
export declare const getIO: () => SocketServer;
