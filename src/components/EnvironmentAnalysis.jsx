// src/components/EnvironmentAnalysis.jsx
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';
import { Sun, Thermometer, Droplets } from 'lucide-react';

const QualityIndicator = ({ quality, icon: Icon, title }) => {
  const getColorClass = () => {
    switch (quality) {
      case 'Optimal':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'Too Dark':
      case 'Too Cold':
      case 'Too Dry':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'Too Bright':
      case 'Too Hot':
      case 'Too Humid':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getColorClass()} transition-colors`}>
      <div className="flex items-center space-x-3">
        <Icon className="w-6 h-6" />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm">{quality}</p>
        </div>
      </div>
    </div>
  );
};

const EnvironmentAnalysis = () => {
  const { analysis } = useEnvironment();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Environment Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QualityIndicator
          quality={analysis.tempQuality}
          icon={Thermometer}
          title="Temperature"
        />
        <QualityIndicator
          quality={analysis.humidityQuality}
          icon={Droplets}
          title="Humidity"
        />
        <QualityIndicator
          quality={analysis.lightQuality}
          icon={Sun}
          title="Light"
        />
      </div>
    </div>
  );
};

export default EnvironmentAnalysis;