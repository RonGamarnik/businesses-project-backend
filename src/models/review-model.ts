import { Schema, model, Types } from "mongoose";
import { formatDate } from "../helpers/formatDate";

export interface IReview {
  _id: Types.ObjectId;
  content: string;
  business: Types.ObjectId;
  user: Types.ObjectId;
  likes: number;
  time: string;
  rating?: number;


}

const reviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: Number, default: 0 },
  time: { type: String, default: () => formatDate(new Date().getTime()) },
  rating: { type: Number },

});

const Review = model<IReview>("Review", reviewSchema);
export default Review;
