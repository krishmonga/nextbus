import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { useSearchParams } from 'react-router-dom';
import { useBusStore } from '../stores/busstore';
import { useGeolocation } from '../hooks/usegeolocation';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Custom icons for map markers
const busIcon = new Icon({
  iconUrl: '/icons/bus-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const busStopIcon = new Icon({
  iconUrl: '/icons/bus-stop.png',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

const userIcon = new Icon({
  iconUrl: '/icons/user-location.png',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11]
});

// Create a clustered bus icon with route number
const createBusClusterIcon = (route) => {
  return divIcon({
    html: `<div class="bus-cluster">${route}</div>`,
    className: 'custom-bus-cluster',
    iconSize: [40, 40]
  });
};

// Component to follow user location
const LocationMarker = ({ setUserLocation }) => {
  const map = useMap();
  const { coordinates, loaded, error } = useGeolocation({ 
    enableHighAccuracy: true,
    watch: true
  });

  useEffect(() => {
    if (loaded && coordinates.lat && coordinates.lng && !error) {
      setUserLocation(coordinates);
      // Only initially center on user (don't keep re-centering)
      if (!map.userLocationInitialized) {
        map.flyTo([coordinates.lat, coordinates.lng], 14);
        map.userLocationInitialized = true;
      }
    }
  }, [coordinates, loaded, error, map, setUserLocation]);

  if (error || !loaded || !coordinates.lat || !coordinates.lng) {
    return null;
  }

  return (
    <Marker position={[coordinates.lat, coordinates.lng]} icon={userIcon}>
      <Popup>
        <div>
          <h3 className="font-bold">Your Location</h3>
          <p>Lat: {coordinates.lat.toFixed(6)}</p>
          <p>Lng: {coordinates.lng.toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  );
};

// Auto refresh component
const AutoRefresh = ({ interval = 30000, onRefresh }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      onRefresh();
    }, interval);
    return () => clearInterval(timer);
  }, [interval, onRefresh]);
  
  return null;
};

// Zoom control component
const MapController = ({ selectedBusId }) => {
  const map = useMap();
  const { buses } = useBusStore();
  
  // Focus on selected bus
  useEffect(() => {
    if (selectedBusId) {
      const bus = buses.find(b => b.id === selectedBusId);
      if (bus) {
        map.flyTo([bus.location.lat, bus.location.lng], 15);
      }
    }
  }, [selectedBusId, buses, map]);
  
  return null;
};

const MapPage = () => {
  const [searchParams] = useSearchParams();
  const selectedBusParam = searchParams.get('bus');
  const { buses, busStops, fetchBuses, fetchBusStops, isLoading } = useBusStore();
  const [center] = useState([30.9762, 77.0727]); // Waknaghat area
  const [showBuses, setShowBuses] = useState(true);
  const [showStops, setShowStops] = useState(true);
  const [selectedBusId, setSelectedBusId] = useState(selectedBusParam);
  const [userLocation, setUserLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchBuses(),
        fetchBusStops()
      ]);
    };
    
    loadData();
    
    // Set up refresh interval
    const refreshInterval = setInterval(() => {
      fetchBuses();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, [fetchBuses, fetchBusStops]);
  
  // Refresh data handler
  const handleRefresh = useCallback(async () => {
    try {
      await fetchBuses();
      toast.success('Bus locations updated');
    } catch (error) {
      toast.error('Failed to update bus locations');
    }
  }, [fetchBuses]);
  
  // Move to user's location
  const moveToUserLocation = useCallback(() => {
    if (mapInstance && userLocation) {
      mapInstance.flyTo([userLocation.lat, userLocation.lng], 15);
    } else if (!userLocation) {
      toast.error('Unable to get your location');
    }
  }, [mapInstance, userLocation]);

  return (
    <div className="relative flex flex-col h-screen">
      {/* Top controls */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">NextBus Live Map</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-buses"
                checked={showBuses}
                onChange={() => setShowBuses(!showBuses)}
                className="mr-2"
              />
              <label htmlFor="show-buses" className="text-sm text-gray-700 dark:text-gray-300">Buses</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-stops"
                checked={showStops}
                onChange={() => setShowStops(!showStops)}
                className="mr-2"
              />
              <label htmlFor="show-stops" className="text-sm text-gray-700 dark:text-gray-300">Stops</label>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 
                       transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Map container */}
      <div className="flex-1 z-0">
        <MapContainer 
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={setMapInstance}
          attributionControl={false}
        >
          {/* OpenStreetMap tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          
          {/* User location marker */}
          <LocationMarker setUserLocation={setUserLocation} />
          
          {/* Bus markers */}
          {showBuses && buses.map(bus => (
            <Marker 
              key={bus.id}
              position={[bus.location.lat, bus.location.lng]}
              icon={bus.routeNumber ? createBusClusterIcon(bus.routeNumber) : busIcon}
              eventHandlers={{
                click: () => {
                  setSelectedBusId(bus.id);
                }
              }}
            >
              <Popup>
                <div className="bus-popup">
                  <h3 className="font-bold text-lg">{bus.name}</h3>
                  <p className="font-medium">Route: {bus.route}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bus.status === 'On Time' ? 'bg-green-100 text-green-800' :
                      bus.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bus.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p>Next Stop: {bus.nextStop}</p>
                    <p>ETA: {bus.eta}</p>
                  </div>
                  {bus.occupancy !== undefined && (
                    <div className="mt-2">
                      <p>Occupancy: {bus.occupancy}/{bus.capacity || 40}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{width: `${(bus.occupancy / (bus.capacity || 40)) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Bus stop markers */}
          {showStops && busStops.map(stop => (
            <Marker 
              key={stop.id}
              position={[stop.location.lat, stop.location.lng]}
              icon={busStopIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{stop.name}</h3>
                  <p className="text-sm mt-1">Routes: {stop.routes.join(", ")}</p>
                  {stop.facilities && stop.facilities.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-600">Facilities:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {stop.facilities.map(facility => (
                          <span key={facility} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs">
                            {facility.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapController selectedBusId={selectedBusId} />
          <AutoRefresh interval={30000} onRefresh={handleRefresh} />
        </MapContainer>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex">
        <button 
          onClick={moveToUserLocation}
          className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Go to my location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* CSS for bus clusters */}
      <style jsx>{`
        .bus-cluster {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #3b82f6;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
        }
        
        .bus-popup {
          min-width: 180px;
        }
        
        /* Fix Leaflet default icon paths */
        .leaflet-default-icon-path {
          background-image: url("https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png");
        }
      `}</style>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-800 dark:text-gray-200">Loading map data...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;