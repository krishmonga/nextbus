import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authroutes from "./routes/authroutes.js";
import busroutes from "./routes/busroutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import protect from "./middleware/authmiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";

import Booking from "./models/Booking.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authroutes);
app.use("/api/buses", busroutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/bookings", protect, bookingRoutes); 
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

