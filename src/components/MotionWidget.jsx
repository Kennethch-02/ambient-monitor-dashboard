// src/components/MotionWidget.jsx
import React from 'react';
import { Activity } from 'lucide-react';
import { useEnvironment } from '../context/EnvironmentContext';

const MotionWidget = () => {
  const { current } = useEnvironment();
  const { motionDetected } = current;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg
        transition-all duration-300 transform
        ${motionDetected ? 
          'bg-green-500 text-white scale-110' : 
          'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
        }
      `}>
        <Activity className={`w-5 h-5 ${motionDetected ? 'animate-pulse' : ''}`} />
        <span className="font-medium">
          {motionDetected ? 'Movement Detected' : 'No Movement'}
        </span>
      </div>
    </div>
  );
};

export default MotionWidget;