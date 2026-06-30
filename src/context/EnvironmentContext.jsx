// src/context/EnvironmentContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, query, orderByKey, limitToLast, onValue } from 'firebase/database';
import { db } from '../config/firebase';

const EnvironmentContext = createContext();

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
};

// Función para calcular promedios ignorando valores inválidos
const calculateValidAverage = (values, minValid = 0) => {
  const validValues = values.filter(v => v > minValid);
  return validValues.length > 0 
    ? validValues.reduce((a, b) => a + b, 0) / validValues.length 
    : 0;
};

export const EnvironmentProvider = ({ children }) => {
  const [data, setData] = useState({
    current: {
      temperature: 0,
      humidity: 0,
      light: 0,
      hasRecentMotion: false,
      motionDetected: false,
      timestamp: new Date()
    },
    historical: [],
    motionHistory: [],
    summary: {
      avgTemp: 0,
      avgHumidity: 0,
      avgLight: 0,
      motionEvents: 0,
    },
    analysis: {
      tempQuality: 'Normal',
      humidityQuality: 'Normal',
      lightQuality: 'Normal'
    }
  });

  const analyzeEnvironment = (temp, humidity, light) => {
    // Temperatura (20-25°C considerado óptimo para programar)
    let tempQuality = 'Normal';
    if (temp < 18) tempQuality = 'Too Cold';
    else if (temp > 27) tempQuality = 'Too Hot';
    else if (temp >= 20 && temp <= 25) tempQuality = 'Optimal';

    // Humedad (40-60% considerado óptimo)
    let humidityQuality = 'Normal';
    if (humidity < 30) humidityQuality = 'Too Dry';
    else if (humidity > 70) humidityQuality = 'Too Humid';
    else if (humidity >= 40 && humidity <= 60) humidityQuality = 'Optimal';

    // Luz (300-500 lux considerado óptimo para pantallas)
    let lightQuality = 'Normal';
    if (light < 200) lightQuality = 'Too Dark';
    else if (light > 1000) lightQuality = 'Too Bright';
    else if (light >= 300 && light <= 500) lightQuality = 'Optimal';

    return { tempQuality, humidityQuality, lightQuality };
  };

  useEffect(() => {
    const ambientDataRef = ref(db, 'ambient_data');
    const motionEventsRef = ref(db, 'motion_events');
    
    // Consulta para datos ambientales
    const ambientQuery = query(ambientDataRef, orderByKey(), limitToLast(60));
    const motionQuery = query(motionEventsRef, orderByKey(), limitToLast(60));
    
    const unsubscribeAmbient = onValue(ambientQuery, (snapshot) => {
      const rawData = snapshot.val();
      if (!rawData) return;

      const entries = Object.entries(rawData)
        .map(([key, value]) => ({
          timestamp: new Date(value.timestamp),
          temperature: value.temperatura,
          humidity: value.humedad,
          light: value.luz,
        }))
        .filter(entry => !isNaN(entry.timestamp.getTime()))
        .sort((a, b) => a.timestamp - b.timestamp);

      const current = entries[entries.length - 1];
      const analysis = analyzeEnvironment(
        current.temperature,
        current.humidity,
        current.light
      );

      // Calcular promedios ignorando valores no válidos
      const summary = {
        avgTemp: calculateValidAverage(entries.map(e => e.temperature), 0),
        avgHumidity: calculateValidAverage(entries.map(e => e.humidity), 0),
        avgLight: calculateValidAverage(entries.map(e => e.light), 1), // Ignorar valores muy bajos para la luz
        motionEvents: data.summary.motionEvents
      };

      setData(prev => ({
        ...prev,
        current: {
          ...current,
          motionDetected: prev.current.motionDetected,
          hasRecentMotion: prev.current.hasRecentMotion
        },
        historical: entries,
        summary,
        analysis
      }));
    });

    // Subscripción a eventos de movimiento
    const unsubscribeMotion = onValue(motionQuery, (snapshot) => {
      const motionData = snapshot.val();
      if (!motionData) return;

      const motionEntries = Object.entries(motionData)
        .map(([key, value]) => ({
          timestamp: new Date(key.substring(0, 4) + '-' + 
                            key.substring(4, 6) + '-' + 
                            key.substring(6, 8) + ' ' + 
                            key.substring(8, 10) + ':' + 
                            key.substring(10, 12) + ':' + 
                            key.substring(12, 14)),
          detected: value.detectado
        }))
        .filter(entry => !isNaN(entry.timestamp.getTime()))
        .sort((a, b) => a.timestamp - b.timestamp);

      // Último estado de movimiento (para widget en tiempo real)
      const lastMotionState = motionEntries[motionEntries.length - 1]?.detected || false;

      // Verificar movimiento en los últimos 5 minutos (para métrica de movimiento)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentMotion = motionEntries.some(
        entry => entry.timestamp > fiveMinutesAgo && entry.detected
      );

      // Contar eventos de movimiento totales
      const motionCount = motionEntries.filter(entry => entry.detected).length;

      setData(prev => ({
        ...prev,
        current: {
          ...prev.current,
          motionDetected: lastMotionState,
          hasRecentMotion: recentMotion
        },
        motionHistory: motionEntries,
        summary: {
          ...prev.summary,
          motionEvents: motionCount
        }
      }));
    });

    return () => {
      unsubscribeAmbient();
      unsubscribeMotion();
    };
  }, []);

  return (
    <EnvironmentContext.Provider value={data}>
      {children}
    </EnvironmentContext.Provider>
  );
};