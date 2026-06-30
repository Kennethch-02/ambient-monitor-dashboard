// src/components/MetricCard.jsx
import React from 'react';

const MetricCard = ({ title, value, icon: Icon, unit, bgColor = 'bg-white' }) => {
  // Determinar si es el card de movimiento
  const isMovement = title.toLowerCase() === 'movement';
  
  // Personalizar la visualización del valor para el movimiento
  const displayValue = isMovement ? (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${value ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
      <span>{value ? 'Active (last 5m)' : 'No activity (5m)'}</span>
    </div>
  ) : (
    <span>
      {typeof value === 'number' ? value.toFixed(1) : value}
      {unit && <span className="ml-1">{unit}</span>}
    </span>
  );

  return (
    <div className={`${bgColor} dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {displayValue}
          </p>
        </div>
        {Icon && (
          <Icon className={`w-8 h-8 ${
            isMovement && value 
              ? 'text-green-500 animate-pulse' 
              : 'text-gray-400 dark:text-gray-500'
          }`} />
        )}
      </div>
    </div>
  );
};

export default MetricCard;