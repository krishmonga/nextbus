import Bus from "../models/Bus.js";

// Get all buses
export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single bus by ID
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new bus
export const addBus = async (req, res) => {
  try {
    const { busNumber, capacity, type, route } = req.body;
    
    const newBus = await Bus.create({
      busNumber,
      capacity,
      type,
      route
    });
    
    res.status(201).json(newBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update bus
export const updateBus = async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    
    res.status(200).json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete bus
export const deleteBus = async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    
    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check seat availability
export const checkSeatAvailability = async (req, res) => {
  try {
    const { busId, date } = req.query;
    const bus = await Bus.findById(busId);
    
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    
    // This is a placeholder - implement your actual availability logic here
    const availableSeats = bus.capacity; // Default to full capacity
    
    res.status(200).json({
      busId,
      date,
      availableSeats,
      capacity: bus.capacity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};