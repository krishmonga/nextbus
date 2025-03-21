import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const himachalCities = [
  'Shimla',
  'Manali',
  'Dharamshala',
  'McLeodganj',
  'Kullu',
  'Dalhousie',
  'Kasauli',
  'Chamba',
  'Palampur',
  'Solan',
  'Mandi',
  'Bilaspur',
  'Hamirpur',
  'Una',
  'Kangra'
];

const popularRoutes = [
  {
    from: 'Shimla',
    to: 'Manali',
    distance: '250 km',
    duration: '8 hours',
    frequency: 'Daily'
  },
  {
    from: 'Dharamshala',
    to: 'McLeodganj',
    distance: '10 km',
    duration: '30 minutes',
    frequency: 'Every 2 hours'
  },
  {
    from: 'Kullu',
    to: 'Manali',
    distance: '40 km',
    duration: '1.5 hours',
    frequency: 'Every hour'
  },
  {
    from: 'Shimla',
    to: 'Kasauli',
    distance: '77 km',
    duration: '2.5 hours',
    frequency: 'Daily'
  }
];

const availableRides = [
  {
    id: 1,
    driver: {
      name: 'Rahul Sharma',
      rating: 4.8,
      trips: 156,
      verified: true
    },
    from: 'Shimla',
    to: 'Manali',
    date: '2025-01-15',
    time: '07:00',
    price: 800,
    seatsAvailable: 3,
    carDetails: 'Toyota Innova - HP01A 1234',
    amenities: ['AC', 'Music', 'Water']
  },
  {
    id: 2,
    driver: {
      name: 'Priya Verma',
      rating: 4.9,
      trips: 234,
      verified: true
    },
    from: 'Dharamshala',
    to: 'McLeodganj',
    date: '2025-01-15',
    time: '09:00',
    price: 150,
    seatsAvailable: 2,
    carDetails: 'Maruti Swift - HP02B 5678',
    amenities: ['AC', 'Music']
  }
];

const CarpoolPage = () => {
  const [isSearching, setIsSearching] = useState(true);
  const [searchResults, setSearchResults] = useState(availableRides);
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [selectedRoute, setSelectedRoute] = useState(null);

  const onSearchSubmit = (data) => {
    // Filter rides based on search criteria
    const filtered = availableRides.filter(ride => 
      ride.from.toLowerCase() === data.from.toLowerCase() &&
      ride.to.toLowerCase() === data.to.toLowerCase() &&
      ride.date === data.date
    );
    setSearchResults(filtered);
  };

  const onOfferSubmit = (data) => {
    console.log('Offer submitted:', data);
    // Handle ride offer submission
    reset();
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Himachal Pradesh Carpooling
      </h1>
      
      <div className="mb-8">
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              isSearching
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            } rounded-l-md`}
            onClick={() => setIsSearching(true)}
          >
            Find a Ride
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              !isSearching
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            } rounded-r-md`}
            onClick={() => setIsSearching(false)}
          >
            Offer a Ride
          </button>
        </div>

        {/* Popular Routes Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <div
                key={index}
                className="card p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setValue('from', route.from);
                  setValue('to', route.to);
                  setSelectedRoute(route);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{route.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{route.to}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{route.distance} • {route.duration}</p>
                  <p>{route.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isSearching ? (
          <div className="card p-6">
            <form onSubmit={handleSubmit(onSearchSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From</label>
                  <select
                    className="input"
                    {...register('from', { required: true })}
                  >
                    <option value="">Select city</option>
                    {himachalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <select
                    className="input"
                    {...register('to', { required: true })}
                  >
                    <option value="">Select city</option>
                    {himachalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="input"
                    min={format(new Date(), 'yyyy-MM-dd')}
                    {...register('date', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Passengers</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    max="6"
                    defaultValue="1"
                    {...register('passengers', { required: true })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Search Rides
              </button>
            </form>

            {/* Search Results */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
              <div className="space-y-4">
                {searchResults.map(ride => (
                  <div key={ride.id} className="card p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {ride.from} → {ride.to}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {format(new Date(ride.date), 'MMM dd, yyyy')} • {ride.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">₹{ride.price}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ride.seatsAvailable} seats left
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <p className="font-medium">{ride.driver.name}</p>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {ride.driver.rating}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{ride.driver.trips} trips</span>
                          {ride.driver.verified && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-green-600 dark:text-green-400">Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div>{ride.carDetails}</div>
                      <div className="flex gap-2">
                        {ride.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="btn btn-primary w-full">
                      Book Ride
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6">
            <form onSubmit={handleSubmit(onOfferSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">From</label>
                  <select
                    className="input"
                    {...register('offerFrom', { required: true })}
                  >
                    <option value="">Select city</option>
                    {himachalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">To</label>
                  <select
                    className="input"
                    {...register('offerTo', { required: true })}
                  >
                    <option value="">Select city</option>
                    {himachalCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="input"
                    min={format(new Date(), 'yyyy-MM-dd')}
                    {...register('offerDate', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    className="input"
                    {...register('offerTime', { required: true })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Available Seats</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    max="6"
                    defaultValue="1"
                    {...register('seats', { required: true })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Seat (₹)</label>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    step="50"
                    {...register('price', { required: true })}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Vehicle Details</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Toyota Innova - HP01A 1234"
                  {...register('vehicle', { required: true })}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Additional Information</label>
                <textarea
                  className="input"
                  rows="3"
                  placeholder="Add any additional details about the ride..."
                  {...register('description')}
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary w-full">
                Create Ride Offer
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarpoolPage;