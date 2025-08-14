import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { PlotGrid } from '../components/Plots/PlotGrid';
import { PlotDetailsModal } from '../components/Plots/PlotDetailsModal';
import { SearchFilters, SearchFilters as SearchFiltersType } from '../components/Plots/SearchFilters';
import { MapView } from '../components/Map/MapView';
import { Plot } from '../types';
import { supabaseApiService } from '../services/supabaseApi';
import { useLanguage } from '../contexts/LanguageContext';
import { Map, Grid } from 'lucide-react';

export const Home: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async (filters?: SearchFiltersType) => {
    try {
      setLoading(true);
      
      const searchParams: any = { status: 'available' };
      
      if (filters) {
        if (filters.search) searchParams.search = filters.search;
        if (filters.minPrice > 0) searchParams.min_price = filters.minPrice;
        if (filters.maxPrice < 10000000) searchParams.max_price = filters.maxPrice;
        if (filters.minArea > 0) searchParams.min_area = filters.minArea;
        if (filters.maxArea < 10000) searchParams.max_area = filters.maxArea;
        if (filters.locationId) searchParams.location_id = filters.locationId;
        if (filters.usageType) searchParams.usage_type = filters.usageType;
      }

      const data = await supabaseApiService.getPlots(searchParams);
      setPlots(data);
    } catch (error) {
      console.error('Error fetching plots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFiltersType) => {
    fetchPlots(filters);
  };

  const handleViewDetails = (plot: Plot) => {
    setSelectedPlot(plot);
  };

  const handlePlotClick = (plot: Plot) => {
    setSelectedPlot(plot);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('home.title')}</h1>
          <p className="text-gray-600">{t('home.subtitle')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">{t('home.found_plots', { count: plots.length })}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'map'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {viewMode === 'grid' ? (
              <PlotGrid
                plots={plots}
                loading={loading}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <MapView
                plots={plots}
                onPlotClick={handlePlotClick}
              />
            )}
          </div>
        </div>

        {/* Plot Details Modal */}
        {selectedPlot && (
          <PlotDetailsModal
            plot={selectedPlot}
            isOpen={!!selectedPlot}
            onClose={() => setSelectedPlot(null)}
          />
        )}
      </div>
    </Layout>
  );
};