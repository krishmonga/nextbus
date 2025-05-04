import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedTrips, setBookedTrips] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    busId: '',
    journeyDate: format(new Date(), 'yyyy-MM-dd'),
    passengers: 1,
    busStopFrom: '',
    busStopTo: ''
  });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    preferredPayment: user?.preferredPayment || 'card'
  });

  // Bus data for booking (this would sync with your BusTrackingPage)
  const busOptions = [
    { id: 1, name: 'Shimla-Manali Express', route: 'Shimla → Mandi → Kullu → Manali', operator: 'hrtc' },
    { id: 2, name: 'Dharamshala-McLeodganj Shuttle', route: 'Dharamshala → McLeodganj', operator: 'local' },
    { id: 3, name: 'Dalhousie Express', route: 'Pathankot → Dalhousie', operator: 'private' },
    { id: 4, name: 'Shimla Local', route: 'Mall Road Circuit', operator: 'local' },
    { id: 5, name: 'Kinnaur Valley Express', route: 'Shimla → Rampur → Kalpa', operator: 'hrtc' },
    { id: 6, name: 'JUIT-Shimla Shuttle', route: 'JUIT → Shimla', operator: 'juit' },
    { id: 7, name: 'JUIT-Waknaghat Express', route: 'JUIT → Waknaghat', operator: 'juit' },
    { id: 8, name: 'JUIT-Solan Connector', route: 'JUIT → Solan', operator: 'juit' }
  ];
  
  // Bus stops based on selected bus
  const [busStops, setBusStops] = useState([]);
  
  // Update bus stops when bus ID changes
  useEffect(() => {
    if (bookingForm.busId) {
      const selectedBus = busOptions.find(bus => bus.id === parseInt(bookingForm.busId));
      if (selectedBus) {
        // Generate bus stops based on the route
        const stops = selectedBus.route.split('→').map(stop => stop.trim());
        setBusStops(stops);
        
        // Reset the from/to stops when bus changes
        setBookingForm(prev => ({
          ...prev,
          busStopFrom: '',
          busStopTo: ''
        }));
      }
    } else {
      setBusStops([]);
    }
  }, [bookingForm.busId]);

  // Load user's booked trips from localStorage or API on component mount
  useEffect(() => {
    const savedTrips = localStorage.getItem('bookedTrips');
    if (savedTrips) {
      // Convert date strings back to Date objects
      const parsedTrips = JSON.parse(savedTrips).map(trip => ({
        ...trip,
        departureDate: new Date(trip.departureDate),
        bookingDate: new Date(trip.bookingDate)
      }));
      setBookedTrips(parsedTrips);
    }
  }, []);

  // Save booked trips to localStorage when they change
  useEffect(() => {
    if (bookedTrips.length > 0) {
      localStorage.setItem('bookedTrips', JSON.stringify(bookedTrips));
    }
  }, [bookedTrips]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Update user data in store (would be handled by your auth store)
      setIsLoading(false);
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleBookBus = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Get selected bus details
    const selectedBus = busOptions.find(bus => bus.id === parseInt(bookingForm.busId));
    
    // Create new booking
    const newBooking = {
      id: `trip-${Date.now()}`,
      busId: parseInt(bookingForm.busId),
      busName: selectedBus.name,
      route: selectedBus.route,
      operator: selectedBus.operator,
      departureDate: new Date(bookingForm.journeyDate),
      bookingDate: new Date(),
      from: bookingForm.busStopFrom,
      to: bookingForm.busStopTo,
      passengers: parseInt(bookingForm.passengers),
      status: 'Confirmed',
      ticketNumber: `HP-${Date.now().toString().substring(7)}`,
      paymentMethod: formData.preferredPayment || 'card',
      price: parseInt(bookingForm.passengers) * 250
    };
    
    // Add booking to state
    setTimeout(() => {
      setBookedTrips(prev => [newBooking, ...prev]);
      setIsLoading(false);
      setActiveTab('trips');
      // Reset booking form
      setBookingForm({
        busId: '',
        journeyDate: format(new Date(), 'yyyy-MM-dd'),
        passengers: 1,
        busStopFrom: '',
        busStopTo: ''
      });
    }, 1000);
  };

  const cancelBooking = (tripId) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setIsLoading(true);
      // Simulate API call to cancel booking
      setTimeout(() => {
        setBookedTrips(prev => 
          prev.map(trip => 
            trip.id === tripId 
              ? {...trip, status: 'Cancelled'} 
              : trip
          )
        );
        setIsLoading(false);
      }, 500);
    }
  };

  // Navigate to bus tracking page with the selected bus data
  const navigateToBusTracking = (busId) => {
    const selectedBus = busOptions.find(bus => bus.id === busId);
    if (selectedBus) {
      navigate('/map', { 
        state: { 
          selectedBus: {
            id: selectedBus.id,
            name: selectedBus.name,
            route: selectedBus.route,
            operator: selectedBus.operator,
            location: { lat: 31.1048, lng: 77.1734 }, // Placeholder, would come from API
            status: 'On Time',
            nextStop: busStops[1] || 'Unknown',
            eta: '10 minutes'
          },
          allBuses: busOptions.map(bus => ({
            id: bus.id,
            name: bus.name,
            route: bus.route,
            operator: bus.operator,
            location: { 
              lat: 31.1048 + (Math.random() * 0.05), 
              lng: 77.1734 + (Math.random() * 0.05) 
            },
            status: Math.random() > 0.3 ? 'On Time' : 'Delayed',
            nextStop: 'Next Stop',
            eta: `${Math.floor(Math.random() * 30) + 5} minutes`
          })),
          busStops: busStops.map((stop, index) => ({
            id: `stop-${index}`,
            name: stop,
            location: { 
              lat: 31.1048 + (Math.random() * 0.05), 
              lng: 77.1734 + (Math.random() * 0.05) 
            },
            routes: [selectedBus.route]
          }))
        }
      });
    }
  };

  // Function to generate and download ticket
  const downloadTicket = (trip) => {
    // Create ticket content
    const ticketContent = `
------------------------------------------
          NEXT BUS TICKET
------------------------------------------
Ticket Number: ${trip.ticketNumber}
Bus: ${trip.busName}
Route: ${trip.from} → ${trip.to}
Date: ${format(trip.departureDate, 'MMM dd, yyyy')}
Passengers: ${trip.passengers}
Total Amount: ₹${(trip.passengers * 250).toFixed(2)}
Status: ${trip.status}
------------------------------------------
    `;
    
    // Create blob and download
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket-${trip.ticketNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        User Dashboard
      </h1>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'trips'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('trips')}
          >
            My Trips
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'profile'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'payment'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'book'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('book')}
          >
            Book a Ride
          </button>
        </nav>
      </div>

      {/* My Trips Tab */}
      {activeTab === 'trips' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Booked Trips
            </h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setActiveTab('book')}
            >
              Book New Trip
            </button>
          </div>

          {bookedTrips.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                You haven't booked any trips yet. 
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setActiveTab('book')}
              >
                Book Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookedTrips.map((trip) => (
                <div 
                  key={trip.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4"
                  style={{ 
                    borderLeftColor: trip.status === 'Confirmed' ? '#34D399' : '#F87171'
                  }}
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-semibold">{trip.busName}</h3>
                    <span 
                      className={`px-2 py-1 rounded text-sm ${
                        trip.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-medium">Route:</span> {trip.from ? `${trip.from} → ${trip.to}` : trip.route}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Journey Date
                      </p>
                      <p className="font-medium">
                        {format(trip.departureDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Passengers
                      </p>
                      <p className="font-medium">{trip.passengers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Booking Date
                      </p>
                      <p className="font-medium">
                        {format(trip.bookingDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ticket Number
                      </p>
                      <p className="font-medium">{trip.ticketNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="flex-1 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                      onClick={() => navigateToBusTracking(trip.busId)}
                    >
                      Track Bus
                    </button>
                    {trip.status === 'Confirmed' && (
                      <button 
                        className="flex-1 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
                        onClick={() => cancelBooking(trip.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button 
                      className="flex-1 px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-300"
                      onClick={() => downloadTicket(trip)}
                    >
                      Download Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                <p className="font-medium">{formData.firstName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                <p className="font-medium">{formData.lastName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{formData.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">{formData.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Payment Method</p>
                <p className="font-medium capitalize">{formData.preferredPayment || 'Card'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="preferredPayment" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Preferred Payment Method
                  </label>
                  <select
                    id="preferredPayment"
                    name="preferredPayment"
                    value={formData.preferredPayment}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Methods
          </h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">**** **** **** 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/25</p>
                </div>
              </div>
              <div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                  Default
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">UPI ID: user@upi</p>
                  <p className="text-sm text-gray-500">Connected to SBI Account</p>
                </div>
              </div>
            </div>
            
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Payment Method
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Payment History</h3>
            {bookedTrips.length === 0 ? (
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <p className="text-gray-500">No payment history available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Trip</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                      <th scope="col" className="px-6 py-3">Payment Method</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookedTrips.map((trip) => (
                      <tr key={trip.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{format(trip.bookingDate, 'MMM dd, yyyy')}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{trip.busName}</td>
                        <td className="px-6 py-4">₹{(trip.passengers * 250).toFixed(2)}</td>
                        <td className="px-6 py-4 capitalize">{trip.paymentMethod || 'Card'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${ 
                            trip.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {trip.status === 'Confirmed' ? 'Paid' : 'Refunded'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book a Ride Tab */}
      {activeTab === 'book' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Book a New Ride
          </h2>
          
          <form onSubmit={handleBookBus}>
            <div className="mb-4">
              <label htmlFor="busId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Select Bus
              </label>
              <select
                id="busId"
                name="busId"
                value={bookingForm.busId}
                onChange={handleBookingInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
              >
                <option value="">Select a bus</option>
                {busOptions.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.name} - {bus.route}
                  </option>
                ))}
              </select>
            </div>
            
            {busStops.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="busStopFrom" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    From
                  </label>
                  <select
                    id="busStopFrom"
                    name="busStopFrom"
                    value={bookingForm.busStopFrom}
                    onChange={handleBookingInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  >
                    <option value="">Select departure point</option>
                    {busStops.map((stop, index) => (
                      <option key={index} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="busStopTo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    To
                  </label>
                  <select
                    id="busStopTo"
                    name="busStopTo"
                    value={bookingForm.busStopTo}
                    onChange={handleBookingInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required
                  >
                    <option value="">Select destination</option>
                    {busStops.map((stop, index) => (
                      bookingForm.busStopFrom !== stop && (
                        <option key={index} value={stop}>{stop}</option>
                      )
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="journeyDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Journey Date
                </label>
                <input
                  type="date"
                  id="journeyDate"
                  name="journeyDate"
                  value={bookingForm.journeyDate}
                  onChange={handleBookingInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="passengers" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Number of Passengers
                </label>
                <select
                  id="passengers"
                  name="passengers"
                  value={bookingForm.passengers}
                  onChange={handleBookingInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {bookingForm.busId && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <h3 className="font-medium text-lg mb-2">Booking Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Bus</p>
                    <p className="font-medium">
                      {busOptions.find(b => b.id === parseInt(bookingForm.busId))?.name || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                    <p className="font-medium">
                      {bookingForm.busStopFrom && bookingForm.busStopTo 
                        ? `${bookingForm.busStopFrom} → ${bookingForm.busStopTo}`
                        : busOptions.find(b => b.id === parseInt(bookingForm.busId))?.route || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Journey Date</p>
                    <p className="font-medium">
                      {format(new Date(bookingForm.journeyDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Passengers</p>
                    <p className="font-medium">{bookingForm.passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price per Passenger</p>
                    <p className="font-medium">₹250.00</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
                    <p className="font-medium">₹{(bookingForm.passengers * 250).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-green-400/50"
              disabled={!bookingForm.busId || (busStops.length > 0 && (!bookingForm.busStopFrom || !bookingForm.busStopTo))}
            >
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;