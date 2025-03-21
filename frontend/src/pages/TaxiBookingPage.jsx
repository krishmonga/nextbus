import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, addDays } from 'date-fns';

const taxiTypes = [
  { id: 'standard', name: 'Standard', capacity: 4, pricePerMile: 2.5, image: 'https://via.placeholder.com/100x60?text=Standard' },
  { id: 'premium', name: 'Premium', capacity: 4, pricePerMile: 3.5, image: 'https://via.placeholder.com/100x60?text=Premium' },
  { id: 'suv', name: 'SUV', capacity: 6, pricePerMile: 4.0, image: 'https://via.placeholder.com/100x60?text=SUV' },
  { id: 'van', name: 'Van', capacity: 8, pricePerMile: 4.5, image: 'https://via.placeholder.com/100x60?text=Van' },
];

const popularDestinations = [
  { id: 1, name: 'Airport', distance: 15, estimatedTime: '25 min' },
  { id: 2, name: 'Downtown', distance: 5, estimatedTime: '12 min' },
  { id: 3, name: 'Shopping Mall', distance: 8, estimatedTime: '18 min' },
  { id: 4, name: 'University', distance: 3, estimatedTime: '10 min' },
];

const TaxiBookingPage = () => {
  const [selectedTaxiType, setSelectedTaxiType] = useState('standard');
  const [bookingType, setBookingType] = useState('now');
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      pickupLocation: '',
      dropoffLocation: '',
      pickupDate: format(new Date(), 'yyyy-MM-dd'),
      pickupTime: format(new Date(), 'HH:mm'),
      passengers: 1,
    }
  });
  
  const calculateEstimatedPrice = (distance, taxiType) => {
    const selectedTaxi = taxiTypes.find(taxi => taxi.id === taxiType);
    return (distance * selectedTaxi.pricePerMile).toFixed(2);
  };
  
  const handleDestinationSelect = (destination) => {
    setValue('dropoffLocation', destination.name);
    const price = calculateEstimatedPrice(destination.distance, selectedTaxiType);
    setEstimatedPrice(price);
  };
  
  const onSubmit = (data) => {
    console.log('Booking data:', data);
    // In a real app, this would send the booking to an API
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      reset();
      setEstimatedPrice(null);
    }, 5000);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Book a Taxi
      </h1>
      
      {bookingConfirmed ? (
        <div className="card p-6 mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-green-500 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Booking Confirmed!</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your taxi has been booked successfully. You will receive a confirmation email shortly.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setBookingConfirmed(false);
              reset();
              setEstimatedPrice(null);
            }}
          >
            Book Another Taxi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="card p-6 mb-6">
              <div className="flex mb-4">
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    bookingType === 'now'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  } rounded-l-md`}
                  onClick={() => setBookingType('now')}
                >
                  Book Now
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    bookingType === 'schedule'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  } rounded-r-md`}
                  onClick={() => setBookingType('schedule')}
                >
                  Schedule
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pickup Location
                  </label>
                  <input
                    id="pickupLocation"
                    type="text"
                    className="input"
                    placeholder="Enter pickup address"
                    {...register('pickupLocation', { required: 'Pickup location is required' })}
                  />
                  {errors.pickupLocation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pickupLocation.message}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dropoff Location
                  </label>
                  <input
                    id="dropoffLocation"
                    type="text"
                    className="input"
                    placeholder="Enter destination address"
                    {...register('dropoffLocation', { required: 'Dropoff location is required' })}
                  />
                  {errors.dropoffLocation && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dropoffLocation.message}</p>
                  )}
                </div>
                
                {bookingType === 'schedule' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pickup Date
                      </label>
                      <input
                        id="pickupDate"
                        type="date"
                        className="input"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                        {...register('pickupDate', { required: 'Pickup date is required' })}
                      />
                      {errors.pickupDate && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pickupDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pickup Time
                      </label>
                      <input
                        id="pickupTime"
                        type="time"
                        className="input"
                        {...register('pickupTime', { required: 'Pickup time is required' })}
                      />
                      {errors.pickupTime && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pickupTime.message}</p>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Passengers
                  </label>
                  <input
                    id="passengers"
                    type="number"
                    className="input"
                    min="1"
                    max="8"
                    {...register('passengers', { 
                      required: 'Number of passengers is required',
                      min: { value: 1, message: 'Minimum 1 passenger' },
                      max: { value: 8, message: 'Maximum 8 passengers' }
                    })}
                  />
                  {errors.passengers && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passengers.message}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {taxiTypes.map(taxi => (
                      <div 
                        key={taxi.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedTaxiType === taxi.id 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-400' 
                            : 'border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-600'
                        }`}
                        onClick={() => {
                          setSelectedTaxiType(taxi.id);
                          if (estimatedPrice) {
                            const price = calculateEstimatedPrice(
                              popularDestinations.find(d => d.name === document.getElementById('dropoffLocation').value)?.distance || 5,
                              taxi.id
                            );
                            setEstimatedPrice(price);
                          }
                        }}
                      >
                        <img src={taxi.image} alt={taxi.name} className="w-full h-12 object-contain mb-2" />
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900 dark:text-white">{taxi.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Up to {taxi.capacity} passengers</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">${taxi.pricePerMile}/mile</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {estimatedPrice && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Estimated Price:</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">${estimatedPrice}</span>
                    </div>
                  </div>
                )}
                
                <button type="submit" className="w-full btn btn-primary">
                  {bookingType === 'now' ? 'Book Now' : 'Schedule Ride'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Popular Destinations
              </h2>
              <div className="space-y-3">
                {popularDestinations.map(destination => (
                  <div 
                    key={destination.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleDestinationSelect(destination)}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">{destination.name}</h3>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{destination.distance} miles</span>
                      <span>{destination.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our customer support team is available 24/7 to assist you with your booking.
              </p>
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">1-800-NEXTBUS</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-gray-700 dark:text-gray-300">support@nextbus.com</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxiBookingPage;