import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";

// Create new booking
export const bookBus = async (req, res) => {
  try {
    const { busId, seatNumber, travelDate } = req.body;
    const userId = req.user.id;

    // Check bus availability
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Check if seat is already booked
    const existingBooking = await Booking.findOne({
      bus: busId,
      seatNumber,
      travelDate,
      status: { $ne: "cancelled" }
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This seat is already booked" });
    }

    // Create new booking
    const booking = new Booking({
      user: userId,
      bus: busId,
      seatNumber,
      travelDate,
      status: "confirmed"
    });

    await booking.save();

    // Update bus occupancy
    await Bus.findByIdAndUpdate(busId, {
      $inc: { occupancy: 1 }
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error("Error booking bus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book bus"
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('bus', 'name route operator')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Decrement bus occupancy
    await Bus.findByIdAndUpdate(booking.bus, {
      $inc: { occupancy: -1 }
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully"
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking"
    });
  }
};