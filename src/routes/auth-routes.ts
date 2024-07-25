import { Router } from "express";
import {
  register,
  logIn,
  getUserById,
  getAllUsers,
} from "../controllers/auth-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", logIn);

// get user/users for development
authRoutes.get("/loggedInUser", verifyToken, getUserById);
// authRoutes.get("/", verifyToken, getAllUsers);
