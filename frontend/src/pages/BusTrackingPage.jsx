import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const busOperators = [
  { id: 'hrtc', name: 'HRTC', color: '#34D399' },  // Green for HRTC
  { id: 'private', name: 'Private Operators', color: '#F87171' }, // Red for private
  { id: 'local', name: 'Local Buses', color: '#60A5FA' },  // Blue for local
  { id: 'juit', name: 'JUIT', color: '#A78BFA' }  // Purple for JUIT
];

const busRoutes = [
  {
    id: 1,
    operator: 'hrtc',
    name: 'Shimla-Manali Express',
    route: 'Shimla → Mandi → Kullu → Manali',
    status: 'On Time',
    nextStop: 'Mandi',
    eta: '25 min',
    location: { lat: 31.0782, lng: 77.1789 }
  },
  {
    id: 2,
    operator: 'hrtc',
    name: 'Dharamshala-McLeodganj Shuttle',
    route: 'Dharamshala → McLeodganj',
    status: 'Delayed',
    nextStop: 'McLeodganj',
    eta: '10 min',
    location: { lat: 32.2190, lng: 76.3234 }
  },
  {
    id: 3,
    operator: 'private',
    name: 'Dalhousie Express',
    route: 'Pathankot → Dalhousie',
    status: 'On Time',
    nextStop: 'Dalhousie',
    eta: '45 min',
    location: { lat: 32.5389, lng: 75.9704 }
  },
  {
    id: 4,
    operator: 'local',
    name: 'Shimla Local',
    route: 'Mall Road Circuit',
    status: 'On Time',
    nextStop: 'Mall Road',
    eta: '5 min',
    location: { lat: 31.1048, lng: 77.1734 }
  },
  {
    id: 5,
    operator: 'hrtc',
    name: 'Kinnaur Valley Express',
    route: 'Shimla → Rampur → Kalpa',
    status: 'On Time',
    nextStop: 'Rampur',
    eta: '60 min',
    location: { lat: 31.4497, lng: 77.6544 }
  },
  {
    id: 6,
    operator: 'juit',
    name: 'JUIT-Shimla Shuttle',
    route: 'JUIT → Shimla',
    status: 'On Time',
    nextStop: 'Shimla',
    eta: '15 min',
    location: { lat: 31.0065, lng: 77.0650 }
  },
  {
    id: 7,
    operator: 'juit',
    name: 'JUIT-Waknaghat Express',
    route: 'JUIT → Waknaghat',
    status: 'On Time',
    nextStop: 'Waknaghat',
    eta: '5 min',
    location: { lat: 31.0170, lng: 77.0750 }
  },
  {
    id: 8,
    operator: 'juit',
    name: 'JUIT-Solan Connector',
    route: 'JUIT → Solan',
    status: 'Delayed',
    nextStop: 'Solan',
    eta: '20 min',
    location: { lat: 30.9500, lng: 77.0800 }
  }
];

const busStops = [
  { id: 1, name: 'Shimla Bus Terminal', location: { lat: 31.1048, lng: 77.1734 }, routes: ['Shimla-Manali Express', 'Kinnaur Valley Express', 'JUIT-Shimla Shuttle'] },
  { id: 2, name: 'Manali Bus Stand', location: { lat: 32.2396, lng: 77.1887 }, routes: ['Shimla-Manali Express'] },
  { id: 3, name: 'Dharamshala Bus Stand', location: { lat: 32.2190, lng: 76.3234 }, routes: ['Dharamshala-McLeodganj Shuttle'] },
  { id: 4, name: 'McLeodganj Bus Stop', location: { lat: 32.2427, lng: 76.3233 }, routes: ['Dharamshala-McLeodganj Shuttle'] },
  { id: 5, name: 'JUIT Campus', location: { lat: 31.0065, lng: 77.0650 }, routes: ['JUIT-Shimla Shuttle', 'JUIT-Waknaghat Express', 'JUIT-Solan Connector'] },
  { id: 6, name: 'Waknaghat', location: { lat: 31.0170, lng: 77.0750 }, routes: ['JUIT-Waknaghat Express'] },
  { id: 7, name: 'Solan Bus Stand', location: { lat: 30.9045, lng: 77.0967 }, routes: ['JUIT-Solan Connector'] }
];

const BusTrackingPage = () => {
  const navigate = useNavigate();
  const [selectedOperator, setSelectedOperator] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingBus, setBookingBus] = useState(null);

  const handleTrackBus = (bus) => {
    // Navigate to the Map page with bus data
    navigate('/map', { state: { selectedBus: bus, allBuses: filteredBuses, busStops: busStops } });
  };

  const handleBookBus = (bus) => {
    setBookingBus(bus);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingBus(null);
  };

  const filteredBuses = busRoutes.filter(bus => {
    const matchesOperator = selectedOperator ? bus.operator === selectedOperator : true;
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOperator && matchesSearch;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Himachal Pradesh Bus Tracking
      </h1>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              className="input"
              placeholder="Search routes or destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="input"
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
            >
              <option value="">All Operators</option>
              {busOperators.map(operator => (
                <option key={operator.id} value={operator.id}>{operator.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {filteredBuses.map(bus => {
          const operator = busOperators.find(op => op.id === bus.operator);
          return (
            <div 
              key={bus.id} 
              className="card p-4 border-l-4 transition-transform hover:scale-105"
              style={{ borderLeftColor: operator.color }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{bus.name}</h3>
                <span 
                  className={`px-2 py-1 rounded text-sm ${
                    bus.status === 'On Time' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {bus.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{bus.route}</p>
              <div className="flex justify-between items-center text-sm">
                <span>Next: {bus.nextStop}</span>
                <span>ETA: {bus.eta}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button 
                  className="flex-1 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-blue-400/50"
                  onClick={() => handleTrackBus(bus)}
                >
                  Track Bus
                </button>
                <button 
                  className="flex-1 px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-green-400/50"
                  onClick={() => handleBookBus(bus)}
                >
                  Book Bus
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Bus Schedule
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Route</th>
                <th scope="col" className="px-6 py-3">From</th>
                <th scope="col" className="px-6 py-3">To</th>
                <th scope="col" className="px-6 py-3">Departure</th>
                <th scope="col" className="px-6 py-3">Arrival</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map(bus => (
                <tr key={bus.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {bus.name}
                  </td>
                  <td className="px-6 py-4">{bus.route.split('→')[0].trim()}</td>
                  <td className="px-6 py-4">{bus.route.split('→').pop().trim()}</td>
                  <td className="px-6 py-4">08:00 AM</td>
                  <td className="px-6 py-4">
                    {bus.status === 'On Time' ? '10:30 AM' : '10:45 AM'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      bus.status === 'On Time'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 shadow-sm hover:shadow-blue-400/50 transition-all duration-300"
                        onClick={() => handleTrackBus(bus)}
                      >
                        Track
                      </button>
                      <button 
                        className="px-3 py-1 text-white bg-green-600 rounded hover:bg-green-700 shadow-sm hover:shadow-green-400/50 transition-all duration-300"
                        onClick={() => handleBookBus(bus)}
                      >
                        Book
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && bookingBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Book Ticket - {bookingBus.name}
              </h3>
              <button 
                onClick={closeBookingModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold">Route:</span> {bookingBus.route}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold">Departure:</span> 08:00 AM
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <span className="font-semibold">Arrival:</span> {bookingBus.status === 'On Time' ? '10:30 AM' : '10:45 AM'}
              </p>
            </div>
            
            <form>
              <div className="mb-4">
                <label htmlFor="passengers" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Number of Passengers
                </label>
                <select 
                  id="passengers" 
                  className="input"
                  defaultValue="1"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="journeyDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Journey Date
                </label>
                <input 
                  type="date" 
                  id="journeyDate"
                  className="input" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-green-400/50 flex-1"
                  onClick={closeBookingModal}
                >
                  Book Now
                </button>
                <button
                  type="button"
                  className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-gray-400/50 flex-1"
                  onClick={closeBookingModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusTrackingPage;