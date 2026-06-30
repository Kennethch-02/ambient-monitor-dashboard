// src/components/SummaryPanel.jsx
import React from 'react';
import { useEnvironment } from '../context/EnvironmentContext';

const SummaryItem = ({ title, value, unit }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {title}
    </h3>
    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
      {typeof value === 'number' ? value.toFixed(1) : value}
      {unit && <span className="ml-1">{unit}</span>}
    </p>
  </div>
);

const SummaryPanel = () => {
  const { summary } = useEnvironment();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Daily Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryItem 
          title="Average Temperature" 
          value={summary.avgTemp} 
          unit="°C" 
        />
        <SummaryItem 
          title="Average Humidity" 
          value={summary.avgHumidity} 
          unit="%" 
        />
        <SummaryItem 
          title="Average Light" 
          value={summary.avgLight} 
          unit="lux" 
        />
        <SummaryItem 
          title="Movement Events" 
          value={summary.movementCount} 
          unit="today" 
        />
      </div>
    </div>
  );
};

export default SummaryPanel;