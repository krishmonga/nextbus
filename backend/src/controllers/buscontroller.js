import Bus from "../models/Bus.js";
import Booking from "../models/Booking.js";  
 

export const getBuses = async (req, res) => {
  try {
    console.log("Fetching buses...");   
    const buses = await Bus.find({});
    console.log("Buses found:", buses); 
    res.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addBus = async (req, res) => {
  const { name, time } = req.body;

  if (!name || !time) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBus = new Bus({ name, time });
    await newBus.save();
    console.log("Bus added successfully:", newBus);
    res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error("Error adding bus:", error);
    res.status(500).json({ message: "Error adding bus", error: error.message });
  }
};export const checkSeatAvailability = async (req, res) => {
  const { busId, date } = req.query;

  try {
    // Check if the bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Use the current date if no date is provided
    const queryDate = date ? new Date(date) : new Date();

    // Get booked seats for the given date
    const bookedSeats = await Booking.find({ bus: busId, date: queryDate }).select("seatNumber");

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