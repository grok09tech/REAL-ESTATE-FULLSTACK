import React from 'react';
import { Plot } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface MapViewProps {
  plots: Plot[];
  center?: LatLngExpression;
  zoom?: number;
  onPlotClick?: (plot: Plot) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  plots,
  center = [-6.7924, 39.2083],
  zoom = 10,
  onPlotClick,
}) => {
  // Simple map placeholder for now - will be enhanced with actual map library
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
        <p className="text-gray-600 mb-4">
          Showing {plots.length} available plots in Tanzania
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          {plots.slice(0, 4).map((plot) => (
            <div
              key={plot.id}
              onClick={() => onPlotClick?.(plot)}
              className="bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <h4 className="font-medium text-sm text-gray-900 truncate">{plot.title}</h4>
              <p className="text-xs text-gray-600">{plot.area_sqm.toLocaleString()} sqm</p>
              <p className="text-xs font-semibold text-blue-600">{formatCurrency(plot.price)}</p>
            </div>
          ))}
        </div>
        {plots.length > 4 && (
          <p className="text-sm text-gray-500 mt-4">
            +{plots.length - 4} more plots available
          </p>
        )}
      </div>
    </div>
  );
};