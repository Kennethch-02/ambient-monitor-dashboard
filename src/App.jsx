// src/App.jsx
import React from 'react';
import { Thermometer, Droplets, Lightbulb, Activity } from 'lucide-react';
import { EnvironmentProvider, useEnvironment } from './context/EnvironmentContext';
import Layout from './components/Layout';
import MetricCard from './components/MetricCard';
import HistoryChart from './components/HistoryChart';
import SummaryPanel from './components/SummaryPanel';
import EnvironmentAnalysis from './components/EnvironmentAnalysis';
import MotionWidget from './components/MotionWidget';

const Dashboard = () => {
  const { current } = useEnvironment();

  return (
    <div className="space-y-6">
      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Temperature"
          value={current.temperature}
          unit="°C"
          icon={Thermometer}
        />
        <MetricCard
          title="Humidity"
          value={current.humidity}
          unit="%"
          icon={Droplets}
        />
        <MetricCard
          title="Light Level"
          value={current.light}
          unit="lux"
          icon={Lightbulb}
        />
        <MetricCard
          title="Movement"
          value={current.hasRecentMotion}
          icon={Activity}
        />
      </div>

      {/* Environment Analysis */}
      <EnvironmentAnalysis />

      {/* Historical Chart */}
      <HistoryChart />

      {/* Summary Panel */}
      <SummaryPanel />

      {/* Floating Motion Widget */}
      <MotionWidget />
    </div>
  );
};

const App = () => {
  return (
    <EnvironmentProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </EnvironmentProvider>
  );
};

export default App;