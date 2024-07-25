import { Router } from "express";
import { verifyToken } from "../middelware/auth-middelware";
import {
  getBusinessById,
  getBusinessReviews,
  getAllBusinesses,
  addReview,
  editReview,
  deleteReview,
  handleReviewLike,
  getTopBusinesses,
} from "../controllers/business.controller";

export const businessRoute = Router();

// Public routes
businessRoute.get("/", getAllBusinesses);
businessRoute.get("/topBusinesses", getTopBusinesses);
businessRoute.get("/:id", getBusinessById);
businessRoute.get("/reviews/:id", getBusinessReviews);

// Protected route for adding reviews
businessRoute.post("/reviews/:id", verifyToken, addReview);
businessRoute.patch("/reviews/:id", verifyToken, editReview);
businessRoute.delete("/reviews/:id", verifyToken, deleteReview);

// like func thats can handle Delete Edit and Add
businessRoute.patch("/reviews/like/:id", verifyToken, handleReviewLike);
