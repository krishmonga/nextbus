import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

const loaderAnimationUrl = 'https://lottie.host/d806e611-5b67-4816-bee7-a0ede6e11f42/eGnS9lAnu6.json';

const Loader = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(loaderAnimationUrl)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => {
        console.error('Error loading Lottie animation:', error);
      });
  }, []);

  if (!animationData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500">Loading animation...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Lottie 
        animationData={animationData} 
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default Loader;
