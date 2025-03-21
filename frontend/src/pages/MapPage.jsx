import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBus, allBuses, busStops } = location.state || {};
  
  const [selectedBusState, setSelectedBusState] = useState(selectedBus || null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [map, setMap] = useState(null);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'drawing']
  });

  const center = selectedBusState?.location || { lat: 31.1048, lng: 77.1734 }; // Default to Shimla if no bus selected

  const onLoad = useCallback((map) => {
    setMap(map);
    // Set zoom level to focus on the selected bus
    if (selectedBusState) {
      map.panTo(selectedBusState.location);
      map.setZoom(14);
    }
  }, [selectedBusState]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const busOperators = [
    { id: 'hrtc', name: 'HRTC', color: '#34D399' },
    { id: 'private', name: 'Private Operators', color: '#F87171' },
    { id: 'local', name: 'Local Buses', color: '#60A5FA' },
    { id: 'juit', name: 'JUIT', color: '#A78BFA' }
  ];

  // If no data was passed, provide a message
  if (!selectedBus || !allBuses || !busStops) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">No bus data available.</p>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Live Bus Tracking
        </h1>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return to Bus List
        </button>
      </div>

      {selectedBusState && (
        <div className="mb-6 p-4 border-l-4 card" style={{ 
          borderLeftColor: busOperators.find(op => op.id === selectedBusState.operator)?.color || '#34D399' 
        }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              {selectedBusState.name}
            </h2>
            <span 
              className={`px-2 py-1 rounded text-sm ${
                selectedBusState.status === 'On Time' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              }`}
            >
              {selectedBusState.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <span className="font-medium">Route:</span> {selectedBusState.route}
          </p>
          <div className="flex justify-between items-center text-sm">
            <span>Next Stop: {selectedBusState.nextStop}</span>
            <span>ETA: {selectedBusState.eta}</span>
          </div>
        </div>
      )}
      
      <div className="card overflow-hidden mb-6">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#7c93a3" }]
                }
              ],
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: true,
              streetViewControl: true,
              rotateControl: true,
              fullscreenControl: true
            }}
          >
            {/* Bus Markers */}
            {allBuses.map(bus => {
              const operator = busOperators.find(op => op.id === bus.operator);
              return (
                <Marker
                  key={`bus-${bus.id}`}
                  position={bus.location}
                  icon={{
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: operator.color,
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#FFFFFF',
                    rotation: 45
                  }}
                  onClick={() => setSelectedBusState(bus)}
                >
                  {selectedBusState?.id === bus.id && (
                    <InfoWindow
                      position={bus.location}
                      onCloseClick={() => setSelectedBusState(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-semibold">{bus.name}</h3>
                        <p className="text-sm">Route: {bus.route}</p>
                        <p className="text-sm">Next Stop: {bus.nextStop}</p>
                        <p className="text-sm">ETA: {bus.eta}</p>
                        <p className="text-sm">Status: {bus.status}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}

            {/* Bus Stop Markers */}
            {busStops.map(stop => (
              <Marker
                key={`stop-${stop.id}`}
                position={stop.location}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
                onClick={() => setSelectedStop(stop)}
              >
                {selectedStop?.id === stop.id && (
                  <InfoWindow
                    position={stop.location}
                    onCloseClick={() => setSelectedStop(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold">{stop.name}</h3>
                      <p className="text-sm">Routes:</p>
                      <ul className="text-sm list-disc list-inside">
                        {stop.routes.map(route => (
                          <li key={route}>{route}</li>
                        ))}
                      </ul>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Nearby Bus Stops
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {busStops.map(stop => (
            <div key={stop.id} className="card p-4">
              <h3 className="font-semibold text-lg mb-2">{stop.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Available Routes:</p>
              <ul className="list-disc list-inside text-sm">
                {stop.routes.map(route => (
                  <li key={route}>{route}</li>
                ))}
              </ul>
              <button
                className="mt-3 px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm transition-all duration-300"
                onClick={() => {
                  setSelectedStop(stop);
                  if (map) {
                    map.panTo(stop.location);
                    map.setZoom(15);
                  }
                }}
              >
                View on Map
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;