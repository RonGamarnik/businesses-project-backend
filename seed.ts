// seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db";

import User from "./src/models/user-model";
import Business from "./src/models/business-model";
import Review, { IReview } from "./src/models/review-model";
import Like from "./src/models/like-model";

dotenv.config(); // Load environment variables

const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    image:
      "https://images.generated.photos/hduC_c_9RYIUAnQvFf6wh91HGwQ9ch3IceyinaIQcnY/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/MTc0NzA1LmpwZw.jpg",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password456",
    firstName: "Jane",
    lastName: "Smith",
    image:
      "https://images.generated.photos/EaK_N7mp83PlmZ6DVuyIl4YJ5CENKqBP4H43vdSdciw/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDE3MTI5LmpwZw.jpg",
  },
  {
    username: "bob_johnson",
    email: "bob@example.com",
    password: "password789",
    firstName: "Bob",
    lastName: "Johnson",
    image:
      "https://images.generated.photos/GlIHfcM2BOwjqPAenF6dc966Q2mIZjTYWhGr8abF0tI/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/Njk5OTY5LmpwZw.jpg",
  },
  {
    username: "alice_brown",
    email: "alice@example.com",
    password: "passwordabc",
    firstName: "Alice",
    lastName: "Brown",
    image:
      "https://images.generated.photos/UWh0PRW-mL1tJM-ctIYzqYgrvUrK8NPeyZYq1pUM-O4/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NjY0ODU1LmpwZw.jpg",
  },
  {
    username: "charlie_davis",
    email: "charlie@example.com",
    password: "passworddef",
    firstName: "Charlie",
    lastName: "Davis",
    image:
      "https://images.generated.photos/pCKFjaPQSgRIe8cFc8q7n8jFJfw-GXqPKjkg1644Kb0/rs:fit:256:256/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/NDQ3MDQ3LmpwZw.jpg",
  },
  {
    username: "rgam2002",
    email: "rgam2002@gmail.com",
    password: "$2a$10$ROXA92ULPBDXnscRgrcMweP.MS6ivIwb9inb2B3X.r80/XygrWe7K",
    firstName: "Ron",
    lastName: "Gamarnik",
    image:
      "https://cdn.britannica.com/06/150806-050-6AE99C98/Proboscis-monkey.jpg",
  },
];

const businesses = [
  {
    name: "Tech Solutions Inc.",
    description: "IT consulting and services",
    location: "New York, NY",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VGVjaCUyMFNvbHV0aW9ucyUyMEluY3xlbnwwfHwwfHx8MA%3D%3D",
    starsarray: [4, 4, 4, 4, 4],
    stars: 4,
    coordinates: { lat: 40.7128, lng: -74.006 },
    category: "Technology",
  },
  {
    name: "Green Grocers",
    description: "Organic produce market",
    location: "San Francisco, CA",
    image:
      "https://images.unsplash.com/photo-1458917524587-d3236cc8c2c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R3JlZW4lMjBHcm9jZXJzfGVufDB8fDB8fHww",
    starsarray: [5, 5, 5, 5, 5],
    stars: 5,
    coordinates: { lat: 37.7749, lng: -122.4194 },
    category: "Grocery",
  },
  {
    name: "Fitness First",
    description: "24/7 gym and fitness center",
    location: "Los Angeles, CA",
    image:
      "https://plus.unsplash.com/premium_photo-1670505062582-fdaa83c23c9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Rml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D",
    starsarray: [3, 3, 3, 3, 3],
    stars: 3,
    coordinates: { lat: 34.0522, lng: -118.2437 },
    category: "Fitness",
  },
  {
    name: "Bookworm's Paradise",
    description: "Independent bookstore",
    location: "Seattle, WA",
    image:
      "https://images.unsplash.com/photo-1691458593914-e336fa35b84d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Qm9va3dvcm0nc3xlbnwwfHwwfHx8MA%3D%3D",
    starsarray: [4, 4, 4, 4, 4],
    stars: 4,
    coordinates: { lat: 47.6062, lng: -122.3321 },
    category: "Retail",
  },
  {
    name: "Gourmet Bites",
    description: "Fine dining restaurant",
    location: "Chicago, IL",
    image:
      "https://media.istockphoto.com/id/1454475515/photo/a-male-chef-decorating-a-pizza.webp?b=1&s=170667a&w=0&k=20&c=hfsvMhbFXfTbsjOiEsxuinwiQIF5HqN4lFX_R6kYaco=",
    starsarray: [5, 5, 5, 5, 5],
    stars: 5,
    coordinates: { lat: 41.8781, lng: -87.6298 },
    category: "Restaurant",
  },
  {
    name: "Auto Care Pro",
    description: "Car repair and maintenance",
    location: "Houston, TX",
    image:
      "https://images.unsplash.com/photo-1702146715426-2380c6ad54c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QXV0byUyMENhcmV8ZW58MHx8MHx8fDA%3D",
    starsarray: [2, 2, 2, 2, 2],
    stars: 2,
    coordinates: { lat: 29.7604, lng: -95.3698 },
    category: "Automotive",
  },
  {
    name: "Cozy Stays",
    description: "Boutique hotel",
    location: "Miami, FL",
    image:
      "https://plus.unsplash.com/premium_photo-1670360414882-4d4e261afb53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Qm91dGlxdWUlMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D",
    starsarray: [3, 3, 3, 3, 3],
    stars: 3,
    coordinates: { lat: 25.7617, lng: -80.1918 },
    category: "Hospitality",
  },
  {
    name: "Pet Pals",
    description: "Pet supplies and grooming",
    location: "Denver, CO",
    image:
      "https://plus.unsplash.com/premium_photo-1710406095492-7e62eba19745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8UGV0fGVufDB8fDB8fHww",
    starsarray: [4, 4, 4, 4, 4],
    stars: 4,
    coordinates: { lat: 39.7392, lng: -104.9903 },
    category: "Pet Services",
  },
  {
    name: "Home Decor Haven",
    description: "Interior design and furniture",
    location: "Atlanta, GA",
    image:
      "https://plus.unsplash.com/premium_photo-1661928005866-864c961775ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8SW50ZXJpb3IlMjBkZXNpZ24lMjBhbmQlMjBmdXJuaXR1cmV8ZW58MHx8MHx8fDA%3D",
    starsarray: [5, 5, 5, 5, 5],
    stars: 5,
    coordinates: { lat: 33.749, lng: -84.388 },
    category: "Home & Garden",
  },
  {
    name: "Wellness Spa",
    description: "Relaxation and beauty treatments",
    location: "Boston, MA",
    image:
      "https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3BhfGVufDB8fDB8fHww",
    starsarray: [3, 3, 3, 3, 3],
    stars: 3,
    coordinates: { lat: 42.3601, lng: -71.0589 },
    category: "Health & Beauty",
  },
  {
    name: "Byte Bistro",
    description: "Tech-themed restaurant with digital ordering",
    location: "Austin, TX",
    image:
      "https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VGVjaCUyMHRoZW1lZCUyMHJlc3RhdXJhbnQlMjB3aXRoJTIwZGlnaXRhbCUyMG9yZGVyaW5nfGVufDB8fDB8fHww",
    starsarray: [4, 5, 4, 4, 5],
    stars: 4.4,
    coordinates: { lat: 30.2672, lng: -97.7431 },
    category: "Restaurant",
  },
  {
    name: "EcoHome Furnishings",
    description: "Sustainable and eco-friendly home decor",
    location: "Portland, OR",
    image:
      "https://plus.unsplash.com/premium_photo-1691642677915-a0d6d21430e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RWNvSG9tZSUyMEZ1cm5pc2hpbmdzfGVufDB8fDB8fHww",
    starsarray: [5, 4, 5, 4, 5],
    stars: 4.6,
    coordinates: { lat: 45.5155, lng: -122.6789 },
    category: "Home & Garden",
  },
  {
    name: "Rhythm & Brews",
    description: "Live music venue and craft brewery",
    location: "Nashville, TN",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGl2ZSUyMG11c2ljJTIwdmVudWUlMjBhbmQlMjBjcmFmdCUyMGJyZXdlcnl8ZW58MHx8MHx8fDA%3D",
    starsarray: [4, 5, 5, 4, 5],
    stars: 4.6,
    coordinates: { lat: 36.1627, lng: -86.7816 },
    category: "Entertainment",
  },
  {
    name: "Sunset Sips",
    description: "Rooftop bar with panoramic city views",
    location: "San Diego, CA",
    image:
      "https://images.unsplash.com/photo-1644027614757-156915491e36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Um9vZnRvcCUyMGJhcnxlbnwwfHwwfHx8MA%3D%3D",
    starsarray: [4, 5, 4, 4, 5],
    stars: 4.4,
    coordinates: { lat: 32.7157, lng: -117.1611 },
    category: "Nightlife",
  },
  {
    name: "The Fashion Hub",
    description: "Trendy and high-end fashion boutique",
    location: "Dallas, TX",
    image:
      "https://plus.unsplash.com/premium_photo-1664202525979-80d1da46b34b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmFzaGlvbiUyMEh1YnxlbnwwfHwwfHx8MA%3D%3D",
    starsarray: [5, 4, 5, 5, 4],
    stars: 4.6,
    coordinates: { lat: 32.7767, lng: -96.797 },
    category: "Fashion",
  },
  {
    name: "Healthy Harvest",
    description: "Farm-to-table organic restaurant",
    location: "Denver, CO",
    image:
      "https://images.unsplash.com/photo-1570474640932-c5dfbeeb2706?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3JnYW5pYyUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D",
    starsarray: [5, 4, 4, 5, 5],
    stars: 4.6,
    coordinates: { lat: 39.7392, lng: -104.9903 },
    category: "Restaurant",
  },
];

async function seedDB() {
  try {
    console.log("Connecting to database...");
    await connectDB(); // Connect to the database
    console.log("Connected to database successfully.");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Business.deleteMany({});
    await Review.deleteMany({});
    await Like.deleteMany({});
    console.log("Existing data cleared.");

    // Create users
    console.log("Creating users...");
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users.`);

    // Create businesses
    console.log("Creating businesses...");
    const createdBusinesses = await Business.create(businesses);
    console.log(`Created ${createdBusinesses.length} businesses.`);

    // Create reviews and likes
    console.log("Creating reviews...");
    const reviews: IReview[] = [];
    for (let i = 0; i < 50; i++) {
      const user = createdUsers[i % 5]; // Rotate through users
      const business = createdBusinesses[i % 10]; // Rotate through businesses

      const review = new Review({
        content: `Review ${i + 1} for ${business.name}. Great experience!`,
        business: business._id,
        user: user._id,
      });

      await review.save();
      reviews.push(review);

      // Update user's reviews array
      await User.findByIdAndUpdate(user._id, {
        $push: { reviews: review._id },
      });

      // Update business's reviews array
      await Business.findByIdAndUpdate(business._id, {
        $push: { reviews: review._id },
      });
    }
    console.log(`Created ${reviews.length} reviews.`);

    // Create likes
    console.log("Creating likes...");
    let totalLikes = 0;
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const likesCount = (i % 5) + 1; // 1 to 5 likes per review

      for (let j = 0; j < likesCount; j++) {
        const user = createdUsers[(i + j) % 5]; // Ensure each user likes a review only once

        const like = new Like({
          review: review._id,
          user: user._id,
        });

        await like.save();

        // Update user's likes array
        await User.findByIdAndUpdate(user._id, {
          $push: { likes: like._id },
        });

        // Update review's likes count
        await Review.findByIdAndUpdate(review._id, { $inc: { likes: 1 } });

        totalLikes++;
      }
    }
    console.log(`Created ${totalLikes} likes.`);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("An error occurred while seeding the database:");
    console.error(err);
  } finally {
    console.log("Closing database connection...");
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seedDB();
