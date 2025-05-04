import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../stores/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearErrors } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isDriverRegistration, setIsDriverRegistration] = useState(false);
  
  const password = watch('password', '');
  
  const onSubmit = async (data) => {
    clearErrors();
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: isDriverRegistration ? 'driver' : 'user'
    };
    
    // Add driver-specific fields if registering as a driver
    if (isDriverRegistration) {
      userData.driverInfo = {
        licenseNumber: data.licenseNumber,
        licenseExpiry: data.licenseExpiry,
        vehicleId: data.vehicleId,
        experience: data.experience
      };
    }
    
    const success = await registerUser(userData);
    if (success) {
      navigate('/login');
    }
  };

  const toggleRegistrationType = () => {
    setIsDriverRegistration(!isDriverRegistration);
    // Reset form when switching registration types
    reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      terms: false
    });
    clearErrors();
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 card">
      {/* Registration type toggle */}
      <div className="flex rounded-md overflow-hidden mb-6 bg-gray-100 dark:bg-gray-700">
        <button 
          className={`flex-1 py-2 px-4 text-center transition-colors ${!isDriverRegistration ? 
            'bg-primary-600 text-white' : 
            'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          onClick={() => isDriverRegistration && toggleRegistrationType()}
        >
          Passenger Registration
        </button>
        <button 
          className={`flex-1 py-2 px-4 text-center transition-colors ${isDriverRegistration ? 
            'bg-blue-600 text-white' : 
            'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          onClick={() => !isDriverRegistration && toggleRegistrationType()}
        >
          Driver Registration
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        {isDriverRegistration ? 'Create a Driver Account' : 'Create an Account'}
      </h1>
      
      {isDriverRegistration && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">
              By registering as a driver, you'll be able to access location sharing features and driver-specific functions. Please provide valid license information.
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-100 dark:border-red-800">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="John"
              {...register('firstName', { 
                required: 'First name is required' 
              })}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Doe"
              {...register('lastName', { 
                required: 'Last name is required' 
              })}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={isDriverRegistration ? "driver@example.com" : "user@example.com"}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="9876543210"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit phone number'
              }
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
          )}
        </div>

        {/* Driver-specific fields */}
        {isDriverRegistration && (
          <>
            <div className="mb-4">
              <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1">
                Driver License Number
              </label>
              <input
                id="licenseNumber"
                type="text"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="HP-1234567890"
                {...register('licenseNumber', { 
                  required: 'License number is required'
                })}
              />
              {errors.licenseNumber && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.licenseNumber.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="licenseExpiry" className="block text-sm font-medium mb-1">
                License Expiry Date
              </label>
              <input
                id="licenseExpiry"
                type="date"
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                {...register('licenseExpiry', { 
                  required: 'License expiry date is required'
                })}
              />
              {errors.licenseExpiry && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.licenseExpiry.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="vehicleId" className="block text-sm font-medium mb-1">
                  Vehicle ID/Number
                </label>
                <input
                  id="vehicleId"
                  type="text"
                  className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="HP-01-AB-1234"
                  {...register('vehicleId', { 
                    required: 'Vehicle ID is required'
                  })}
                />
                {errors.vehicleId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vehicleId.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium mb-1">
                  Driving Experience (Years)
                </label>
                <input
                  id="experience"
                  type="number"
                  min="1"
                  max="50"
                  className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="5"
                  {...register('experience', { 
                    required: 'Experience is required',
                    min: {
                      value: 1,
                      message: 'Experience must be at least 1 year'
                    },
                    max: {
                      value: 50,
                      message: 'Please enter a valid experience'
                    }
                  })}
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.experience.message}</p>
                )}
              </div>
            </div>
          </>
        )}
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white pr-10"
              placeholder="••••••••"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                }
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 8 characters with a mix of uppercase, lowercase, numbers, and special characters.
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="••••••••"
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('terms', { 
                  required: 'You must agree to the terms and conditions' 
                })}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Privacy Policy
                </Link>
                {isDriverRegistration && (
                  <>, including the <Link to="/driver-terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    Driver Terms of Service
                  </Link></>
                )}
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.terms.message}</p>
              )}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className={`w-full px-4 py-2 font-medium text-white rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDriverRegistration 
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
              : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isDriverRegistration ? 'Creating Driver Account...' : 'Creating Account...'}
            </div>
          ) : (
            isDriverRegistration ? 'Create Driver Account' : 'Create Account'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className={`${isDriverRegistration ? 'text-blue-600 hover:text-blue-500 dark:text-blue-400' : 'text-primary-600 hover:text-primary-500 dark:text-primary-400'}`}>
            Log in
          </Link>
        </p>
      </div>

      {isDriverRegistration && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Driver Information
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            By registering as a driver, you're agreeing to share your real-time location while on duty.
            Your account will need to be verified before you can start accepting rides.
            All driver information will be kept confidential and used only for verification purposes.
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;