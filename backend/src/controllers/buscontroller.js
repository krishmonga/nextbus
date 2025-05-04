import Bus from '../models/Bus.js';
import BusStop from '../models/BusStop.js';
import User from '../models/User.js';

// Get all active buses with location data
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ active: true })
      .select('name routeNumber route operator status location nextStop eta')
      .lean();
    
    // Transform the data to match frontend expectations
    const transformedBuses = buses.map(bus => ({
      id: bus._id,
      name: bus.name,
      route: bus.route,
      operator: bus.operator,
      status: bus.status,
      nextStop: bus.nextStop,
      eta: bus.eta || 'Unknown',
      location: {
        lat: bus.location.coordinates[1],
        lng: bus.location.coordinates[0]
      }
    }));
    
    res.status(200).json({
      success: true,
      count: transformedBuses.length,
      buses: transformedBuses
    });
  } catch (error) {
    console.error('Error getting buses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bus data'
    });
  }
};

// Get all bus stops
export const getBusStops = async (req, res) => {
  try {
    const stops = await BusStop.find({ active: true }).lean();
    
    // Transform the data to match frontend expectations
    const transformedStops = stops.map(stop => ({
      id: stop._id,
      name: stop.name,
      routes: stop.routes,
      location: {
        lat: stop.location.coordinates[1],
        lng: stop.location.coordinates[0]
      },
      facilities: stop.facilities || []
    }));
    
    res.status(200).json({
      success: true,
      count: transformedStops.length,
      stops: transformedStops
    });
  } catch (error) {
    console.error('Error getting bus stops:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bus stop data'
    });
  }
};

// Get a single bus by ID
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).lean();
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }
    
    // Transform to match frontend expectations
    const transformedBus = {
      id: bus._id,
      name: bus.name,
      route: bus.route,
      operator: bus.operator,
      status: bus.status,
      nextStop: bus.nextStop,
      eta: bus.eta || 'Unknown',
      location: {
        lat: bus.location.coordinates[1],
        lng: bus.location.coordinates[0]
      }
    };
    
    res.status(200).json({
      success: true,
      bus: transformedBus
    });
  } catch (error) {
    console.error('Error getting bus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bus data'
    });
  }
};

// Update bus location (for driver app)
export const updateBusLocation = async (req, res) => {
  try {
    const { busId, latitude, longitude, nextStop, status } = req.body;
    
    if (!busId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Bus ID, latitude and longitude are required'
      });
    }
    
    const updateData = {
      'location.coordinates': [longitude, latitude],
      lastLocationUpdate: Date.now()
    };
    
    // Optional fields
    if (nextStop) updateData.nextStop = nextStop;
    if (status) updateData.status = status;
    
    const bus = await Bus.findByIdAndUpdate(
      busId,
      { $set: updateData },
      { new: true }
    );
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Bus location updated',
      location: {
        lat: bus.location.coordinates[1],
        lng: bus.location.coordinates[0]
      }
    });
  } catch (error) {
    console.error('Error updating bus location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bus location'
    });
  }
};

// Get buses near a location
export const getBusesNearLocation = async (req, res) => {
  try {
    const { latitude, longitude, distance = 5000 } = req.query; // distance in meters, default 5km
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const buses = await Bus.find({
      active: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    }).lean();
    
    // Transform the data
    const transformedBuses = buses.map(bus => ({
      id: bus._id,
      name: bus.name,
      route: bus.route,
      operator: bus.operator,
      status: bus.status,
      nextStop: bus.nextStop,
      eta: bus.eta || 'Unknown',
      location: {
        lat: bus.location.coordinates[1],
        lng: bus.location.coordinates[0]
      }
    }));
    
    res.status(200).json({
      success: true,
      count: transformedBuses.length,
      buses: transformedBuses
    });
  } catch (error) {
    console.error('Error getting nearby buses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get nearby buses'
    });
  }
};

// Admin: Create a new bus
export const createBus = async (req, res) => {
  try {
    const {
      name,
      routeNumber,
      route,
      operator,
      nextStop,
      latitude,
      longitude,
      driverId
    } = req.body;
    
    // Create the bus
    const bus = new Bus({
      name,
      routeNumber,
      route,
      operator,
      nextStop,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    });
    
    // If driver ID is provided, assign the driver
    if (driverId) {
      const driver = await User.findById(driverId);
      if (!driver || driver.role !== 'driver') {
        return res.status(400).json({
          success: false,
          message: 'Invalid driver ID'
        });
      }
      bus.driver = driverId;
    }
    
    await bus.save();
    
    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      bus: {
        id: bus._id,
        name: bus.name,
        route: bus.route
      }
    });
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bus'
    });
  }
};

// Admin: Create a new bus stop
export const createBusStop = async (req, res) => {
  try {
    const {
      name,
      routes,
      latitude,
      longitude,
      facilities
    } = req.body;
    
    // Create the bus stop
    const busStop = new BusStop({
      name,
      routes,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      facilities: facilities || []
    });
    
    await busStop.save();
    
    res.status(201).json({
      success: true,
      message: 'Bus stop created successfully',
      busStop: {
        id: busStop._id,
        name: busStop.name
      }
    });
  } catch (error) {
    console.error('Error creating bus stop:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bus stop'
    });
  }
};