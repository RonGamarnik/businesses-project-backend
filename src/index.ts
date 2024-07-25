import express, { Application, Express } from "express";
import { authRoutes } from "./routes/auth-routes";
import { businessRoute } from "./routes/business.route";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db";
import socketMiddleware from "./middelware/auth-req";

const PORT = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for production to the correct origin
    methods: ["GET", "POST", "PATCH"],
  },
});

async function main() {
  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(cors()); // Configure CORS properly for production
  app.use(socketMiddleware(io));

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/business", businessRoute);

  // Socket.IO connection
  io.on("connection", (socket: Socket) => {
    console.log(`Connection: ${socket.id}`);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Disconnect: ${socket.id}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
