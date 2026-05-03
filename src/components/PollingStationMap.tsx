import { useState, useCallback, memo } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Map as MapIcon, Loader2 } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

export const PollingStationMap = memo(({ epicNumber }: { epicNumber: string }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const searchBooth = useCallback(async () => {
    if (!epicNumber) return;
    setLoading(true);

    // Simulate high-precision ECI geo-lookup
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mocks = [
      { lat: 28.6139, lng: 77.2090 }, // Delhi
      { lat: 19.0760, lng: 72.8777 }, // Mumbai
      { lat: 13.0827, lng: 80.2707 }, // Chennai
      { lat: 22.5726, lng: 88.3639 }, // Kolkata
      { lat: 12.9716, lng: 77.5946 }, // Bangalore
      { lat: 17.3850, lng: 78.4867 }, // Hyderabad
    ];
    
    setLocation(mocks[Math.floor(Math.random() * mocks.length)]);
    setLoading(false);
    setShowInfo(true);
  }, [epicNumber]);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div 
        id="polling-station-map" 
        className="relative h-full min-h-[500px] rounded-[40px] overflow-hidden border border-cv-dark/5 bg-cv-light group shadow-inner"
        role="region"
        aria-label="Polling Station Navigator"
      >
        {!location && !loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 text-center bg-white/40 backdrop-blur-md">
            <div className="w-20 h-20 bg-cv-blue/10 rounded-3xl flex items-center justify-center mb-8">
              <MapIcon className="w-10 h-10 text-cv-blue" />
            </div>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-cv-dark">Booth Navigator</h4>
            <p className="text-xs font-bold text-cv-dark/40 max-w-xs leading-relaxed uppercase tracking-widest">
              Enter secure EPIC credentials to visualize your designated polling precinct.
            </p>
            <button 
              id="locate-booth-trigger"
              onClick={searchBooth}
              disabled={!epicNumber}
              className="mt-8 px-10 py-4 bg-cv-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-20"
            >
              Locate Polling Sector
            </button>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl">
            <Loader2 className="w-10 h-10 animate-spin text-cv-blue mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cv-blue animate-pulse">Syncing Geo-Assets...</p>
          </div>
        )}

        <Map
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
          defaultZoom={5}
          center={location}
          zoom={location ? 14 : 5}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          mapId="cv_booth_map"
          className="w-full h-full"
        >
          {location && (
            <Marker 
              position={location} 
              onClick={() => setShowInfo(true)}
            />
          )}

          {showInfo && location && (
            <InfoWindow 
              position={location} 
              onCloseClick={() => setShowInfo(false)}
            >
              <div className="p-4 min-w-[200px]">
                <p className="text-[8px] font-black text-cv-blue uppercase tracking-widest mb-1">Assigned Station</p>
                <h5 className="font-black text-cv-dark uppercase text-sm mb-2">Sector 42 Polling Precinct</h5>
                <p className="text-[10px] font-bold text-cv-dark/40 leading-tight uppercase">
                  Mumbai South Constituency <br/> Room 4, Ground Floor, Civic High School
                </p>
                <div className="mt-4 pt-3 border-t border-cv-dark/5 flex justify-between items-center">
                   <span className="text-[8px] font-black text-green-500 uppercase">Status: Operational</span>
                   <button className="text-[8px] font-black text-cv-blue uppercase underline">Directions</button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
});
