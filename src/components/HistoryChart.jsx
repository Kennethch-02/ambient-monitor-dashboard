// src/components/HistoryChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEnvironment } from '../context/EnvironmentContext';

const HistoryChart = () => {
  const { historical, motionHistory } = useEnvironment();

  const formatData = () => {
    // Crear un mapa de timestamps para los datos de movimiento
    const motionMap = new Map(
      motionHistory.map(motion => [
        motion.timestamp.getTime(),
        motion.detected
      ])
    );

    // Combinar datos ambientales con datos de movimiento
    return historical.map(entry => ({
      time: entry.timestamp.toLocaleTimeString('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      temperature: entry.temperature,
      humidity: entry.humidity,
      light: entry.light,
      motion: motionMap.get(entry.timestamp.getTime()) ? 1 : 0
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Historical Data (Last Hour)
      </h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis 
              dataKey="time" 
              className="text-xs" 
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              name="Temperature (°C)"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="#3b82f6" 
              name="Humidity (%)"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="light" 
              stroke="#f59e0b" 
              name="Light (lux)"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="step" 
              dataKey="motion" 
              stroke="#22c55e" 
              name="Motion"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;