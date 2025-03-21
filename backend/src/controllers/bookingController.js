import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import mongoose from "mongoose";

// Constants
const MIN_SEAT_NUMBER = 1;

// Book a bus
export const bookBus = async (req, res) => {
  const { busId, seatNumber, date } = req.body;
  const userId = req.user.id;

  try {
    // Validate busId
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    // Check if the bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Validate seat number
    if (seatNumber < MIN_SEAT_NUMBER || seatNumber > bus.totalSeats) {
      return res.status(400).json({ message: "Invalid seat number" });
    }

    // Validate booking date
    const bookingDate = new Date(date);
    const currentDate = new Date();
    if (bookingDate < currentDate) {
      return res.status(400).json({ message: "Booking date cannot be in the past" });
    }

    // Check if the seat is already booked
    const seatTaken = await Booking.findOne({ bus: busId, seatNumber, date });
    if (seatTaken) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    // Create a new booking
    const booking = new Booking({
      user: userId,
      bus: busId,
      seatNumber,
      date,
    });

    await booking.save();
    res.status(201).json({ message: "Bus booked successfully", booking });
  } catch (error) {
    console.error("Error booking bus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all bookings for the logged-in user
export const getUserBookings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("bus")
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments({ user: req.user.id });

    res.status(200).json({
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check seat availability
export const checkSeatAvailability = async (req, res) => {
  const { busId, date } = req.query;

  try {
    // Validate busId
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ message: "Invalid bus ID" });
    }

    // Check if the bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Get booked seats for the given date
    const bookedSeats = await Booking.find({ bus: busId, date }).select("seatNumber");

    // Calculate available seats
    const availableSeats = Array.from({ length: bus.totalSeats }, (_, i) => i + 1).filter(
      (seat) => !bookedSeats.some((booked) => booked.seatNumber === seat)
    );

    res.status(200).json({ availableSeats });
  } catch (error) {
    console.error("Error checking seat availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  try {
    // Validate bookingId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    // Find and delete the booking
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Booking.deleteOne({ _id: bookingId });
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};