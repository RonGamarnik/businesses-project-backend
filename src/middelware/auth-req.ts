import { Server } from 'socket.io';
import { Response, NextFunction } from 'express';
import { CustomRequest } from './auth-middelware';

// Extend the Express Request type to include the io property


const socketMiddleware = (io: Server) => (req: CustomRequest, res: Response, next: NextFunction) => {
    req.io = io;
    next();
};

export default socketMiddleware;

