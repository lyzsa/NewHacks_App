import React, { useState } from 'react';
import { TrendingUp, TrendingDown, MessageSquare, BarChart3, Clock } from 'lucide-react';
import { StockCardProps } from '@/types';
import AlertBadge from './AlertBadge';
import VolumeChart from './VolumeChart';

const StockCard: React.FC<StockCardProps> = ({ alert }) => {
  const [showChart, setShowChart] = useState(false);

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Generate mock volume data for the chart
  const generateVolumeData = () => {
    const data = [];
    const now = new Date();
    const average = 1000000; // Mock average volume
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const volume = average * (0.5 + Math.random() * 2);
      data.push({
        time: time.toISOString(),
        volume: Math.round(volume),
        average: average
      });
    }
    return data;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">${alert.ticker}</h2>
          <AlertBadge priority={alert.priority} />
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {formatPrice(alert.currentPrice)}
          </div>
          <div className={`flex items-center text-sm ${
            alert.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {alert.priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {formatChange(alert.priceChange)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-gray-600 mb-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Mentions</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{alert.mentionCount}</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-gray-600 mb-1">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Volume Ratio</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{alert.volumeRatio.toFixed(2)}x</div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-gray-600 mb-1">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Detected</span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {formatTime(alert.detectedAt)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
          <div className={`text-sm font-bold ${
            alert.volumeRatio > 3 ? 'text-red-600' : 
            alert.volumeRatio > 2 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {alert.volumeRatio > 3 ? 'High Alert' : 
             alert.volumeRatio > 2 ? 'Medium Alert' : 'Low Alert'}
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowChart(!showChart)}
        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {showChart ? 'Hide' : 'Show'} Volume Chart
      </button>

      {showChart && (
        <div className="mt-4">
          <VolumeChart data={generateVolumeData()} ticker={alert.ticker} />
        </div>
      )}
    </div>
  );
};

export default StockCard;
