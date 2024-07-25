import mongoose, { Schema, model, Document } from "mongoose";

interface IBusiness extends Document {
  name: string;
  description: string;
  location: string;
  stars: number;
  starsarray: number[];
  reviews: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  category: string;
}

const businessSchema = new Schema<IBusiness>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: String },
  stars: { type: Number, default: 0, required: true },
  starsarray: { type: [], default: [], required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  image: { type: String, required: true },
  coordinates: { type: Object, required: true },
  category: { type: String, required: true },
});

const Business = model<IBusiness>("Business", businessSchema);

export default Business;
