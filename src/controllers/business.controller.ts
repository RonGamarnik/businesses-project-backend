import { Request, Response } from "express";
import Business from "../models/business-model"; // Adjust the path as needed
import Review from "../models/review-model"; // Adjust the path as needed
import Like from "../models/like-model";
import User from "../models/user-model";
import { io } from "..";
import { Server } from "socket.io";
import { CustomRequest } from "../middelware/auth-middelware";
// import { CustomRequest } from "../middelware/auth-middelware";

function makeFilter(q: {
  search?: string;
  category?: string;
  location?: string;
}) {
  const res: {
    name?: { $regex: string; $options: string };
    category?: { $regex: string; $options: string };
    location?: { $regex: string; $options: string };
  } = {};

  if (q.search) {
    res.name = { $regex: q.search, $options: "i" }; // "i" for case-insensitive
  }
  if (q.category) {
    res.category = { $regex: q.category, $options: "i" }; // "i" for case-insensitive
  }
  if (q.location) {
    res.location = { $regex: q.location, $options: "i" }; // "i" for case-insensitive
  }
  return res;
}

export async function getAllBusinesses(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const sort = (req.query.sort as string) || "name";
    const search = req.query.search as string;
    const filter = makeFilter(req.query);

    const skip = (page - 1) * limit;

    const totalCount = await Business.countDocuments(filter);

    const businesses = await Business.find(filter)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      businesses,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching businesses, business.controller:", error);
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .json({ message: "Validation error", error: error.message });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export async function getBusinessById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(business);
  } catch (error) {
    console.log("Error fetching business, business.controller:", error);
    if (error instanceof Error) {
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid ID", error: error.message });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export async function getBusinessReviews(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const reviews = await Review.find({ business: id }).populate(
      "user",
      "username image"
    );
    // populate : replase the user field inside the business object to the user DOCUMENT from the USERS collection
    res.json(reviews);
  } catch (error) {
    console.log("Error fetching reviews, business.controller:", error);
    if (error instanceof Error) {
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid  ID", error: error.message });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export async function getTopBusinesses(req: Request, res: Response) {
  try {
    console.log("getTopBusinesses");

    const topBusinesses = await Business.find().sort({ stars: -1 }).limit(7); // find the top 4 ranking businesses

    res.status(200).json(topBusinesses);
  } catch (error) {
    console.log(
      "getTopBusinesses Error fetching top Businesses, business.controller:",
      error
    );
    if (error instanceof Error) {
      if (error.name === "CastError") {
        res.status(400).json({
          message: "getTopBusinesses cant fide top businesses",
          error: error.message,
        });
      } else {
        res.status(500).json({
          message: "getTopBusinesses An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res
        .status(500)
        .json({ message: "getTopBusinesses An unknown error occurred" });
    }
  }
}
export async function addReview(req: CustomRequest, res: Response) {
  const userId = req.userId;
  const { id } = req.params;
  try {
    const { content, rating } = req.body;
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    const newReview = new Review({
      content,
      business: id,
      user: userId,
      rating,
    });
    await newReview.save();
    const user = await User.findById(userId);

    if (rating !== undefined) {
      business.starsarray.push(rating);
      let totalStars = 0;
      for (const star of business.starsarray) {
        totalStars += star;
      }
      business.stars = totalStars / business.starsarray.length;
      await business.save();
    }

    const populatedReview = await Review.findById(newReview._id).populate(
      "user",
      "username image"
    );

    // Emit socket event for new review
    io.emit("newReview", populatedReview);

    res.status(201).json(newReview);
  } catch (error) {
    console.log("Error adding review, business.controller:", error);
    if (error instanceof Error) {
      if (error.name === "CastError") {
        res.status(400).json({
          message: "Invalid ID",
          error: error.message,
        });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export async function editReview(req: CustomRequest, res: Response) {
  const userId = req.userId;
  const { id } = req.params;
  const newContent = req.body.content;

  try {
    const updatedReview = await Review.findOneAndUpdate(
      { _id: id, user: userId },
      { content: newContent },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    io.emit("updateReviewContent", updatedReview);

    res.status(200).json(updatedReview);
  } catch (error: any) {
    console.log("Error updating review, business.controller:", error);
    if (error) {
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid ID", error: error.message });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export async function deleteReview(req: CustomRequest, res: Response) {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const reviewToDelete = await Review.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!reviewToDelete) {
      return res.status(404).json({
        message: "Review not found / You dont have access to this Review",
      });
    }

    const business = await Business.findOne({ _id: reviewToDelete.business });


    if (business) {
      const indexToRemove = business.starsarray.findIndex((rating: number) => rating === reviewToDelete.rating);
      if (indexToRemove !== -1) {
        business.starsarray.splice(indexToRemove, 1);
      }


      let totalRating = 0;
      for (const rating of business.starsarray) {
        totalRating += rating;
      }
      business.stars = business.starsarray.length
        ? totalRating / business.starsarray.length
        : 0;

      await business.save();
    }

    io.emit("reviewToDelete", reviewToDelete);

    res.status(200).json({ message: "Review Deleted Succssfully" });
  } catch (error: any) {
    console.log("Error deleting review, business.controller:", error);
    if (error) {
      if (error.name === "CastError") {
        res.status(400).json({ message: "Invalid ID", error: error.message });
      } else {
        res.status(500).json({
          message: "An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

export async function handleReviewLike(req: CustomRequest, res: Response) {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const like = await Like.findOne({ review: id, user: userId });

    if (!like) {
      const newLike = new Like({
        review: id,
        user: userId,
      });
      await newLike.save();

      const updatedReview = await Review.findById(id).populate(
        "user",
        "username image"
      );
      if (updatedReview) {
        updatedReview.likes += 1;
        await updatedReview.save();

        io.emit("reviewUpdated", updatedReview);

        return res.status(200).json(updatedReview);
      } else {
        return res.status(404).json({ message: "Review not found" });
      }
    } else {
      await Like.findOneAndDelete({ review: id, user: userId });

      const updatedReview = await Review.findById(id).populate(
        "user",
        "username image"
      );
      if (updatedReview) {
        updatedReview.likes -= 1;
        await updatedReview.save();

        io.emit("reviewUpdated", updatedReview);

        return res.status(200).json(updatedReview);
      }

      return res.status(404).json({ message: "Review not found" });
    }
  } catch (error: any) {
    console.error("Error liking/unliking review:", error);
    if (error.name === "CastError") {
      res.status(400).json({ message: "Invalid ID", error: error.message });
    } else {
      res.status(500).json({
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
}
