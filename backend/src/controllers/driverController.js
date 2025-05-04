import Bus from '../models/Bus.js';
import User from '../models/User.js';

export const updateLocation = async (req, res) => {
    try {
      const { latitude, longitude, busId, nextStop, status } = req.body;
      const driverId = req.user._id;
      
      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }
      
      // If busId is provided, update that specific bus
      if (busId) {
        const bus = await Bus.findById(busId);
        
        if (!bus) {
          return res.status(404).json({
            success: false,
            message: 'Bus not found'
          });
        }
        
        // Check if the driver is assigned to this bus
        if (bus.driver && bus.driver.toString() !== driverId.toString()) {
          return res.status(403).json({
            success: false,
            message: 'You are not authorized to update this bus location'
          });
        }
        
        // Update the bus location
        bus.location.coordinates = [longitude, latitude];
        bus.lastLocationUpdate = Date.now();
        if (nextStop) bus.nextStop = nextStop;
        if (status) bus.status = status;
        
        await bus.save();
        
        return res.status(200).json({
          success: true,
          message: 'Bus location updated successfully'
        });
      }
      
      // If no busId, find buses assigned to this driver
      const buses = await Bus.find({ driver: driverId, active: true });
      
      if (buses.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No active buses assigned to this driver'
        });
      }
      
      // Update the first active bus (most drivers will only have one active bus)
      const bus = buses[0];
      bus.location.coordinates = [longitude, latitude];
      bus.lastLocationUpdate = Date.now();
      if (nextStop) bus.nextStop = nextStop;
      if (status) bus.status = status;
      
      await bus.save();
      
      // Also update the driver's location in User model if you track that
      await User.findByIdAndUpdate(driverId, {
        $set: {
          'location.coordinates': [longitude, latitude],
          lastLocationUpdate: Date.now()
        }
      });
      
      res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        bus: {
          id: bus._id,
          name: bus.name,
          route: bus.route
        }
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update location'
      });
    }
};