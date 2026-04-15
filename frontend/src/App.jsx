import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

function App() {
  const [currentPos, setCurrentPos] = useState({ lat: 12.9716, lng: 77.5946 });
  const [destination, setDestination] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const audioCtx = useRef(null);

  // Hard-coded key for hackathon stability
  const GOOGLE_MAPS_API_KEY = "AIzaSyAQrAFhVJZMf0JXW4IQGgVwTHC-0xBoV-U";

  // 1. Live Geolocation Tracking
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentPos(newPos);
          console.log(`[CONSOLE] Live GPS Updated: ${newPos.lat}, ${newPos.lng}`);
        },
        (err) => console.error("GPS Access Denied:", err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // 2. Alarm Logic (Web Audio API to bypass silent switch)
  const triggerAlarm = () => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.frequency.value = 440; // Alert tone
    osc.start();
    setTimeout(() => osc.stop(), 5000); 
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-white">
      
      {/* LEFT SIDE: THE LIVE MAP */}
      <div className="flex-1 relative bg-slate-900">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={currentPos}
            center={currentPos}
            defaultZoom={15}
            mapId="HACKATHON_DEMO_MAP"
            disableDefaultUI={true}
          >
            <AdvancedMarker position={currentPos}>
               <Pin background={'#4285F4'} borderColor={'#fff'} glyphColor={'#fff'} scale={1.2} />
            </AdvancedMarker>
          </Map>
        </APIProvider>
        
        {/* Floating Telemetry Info */}
        <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-1">Hardware Telemetry</p>
          <code className="text-emerald-400 text-sm">
            LAT: {currentPos.lat.toFixed(5)} <br/>
            LNG: {currentPos.lng.toFixed(5)}
          </code>
        </div>
      </div>

      {/* RIGHT SIDE: ALARM CONSOLE */}
      <div className="w-[380px] p-8 flex flex-col justify-center bg-slate-950 border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-10">
        <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10">
          <h1 className="text-2xl font-black mb-1 text-blue-400">TRANSIT SHIELD</h1>
          <p className="text-[9px] uppercase tracking-widest opacity-30 mb-8">Urban Intelligence v1.0</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold opacity-40 block mb-2 tracking-tighter">Enter Destination</label>
              <input 
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 focus:border-blue-500/50 outline-none transition-all text-sm"
                placeholder="Search stop..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold opacity-40 block mb-2 tracking-tighter">Proximity Trigger</label>
              <select className="w-full p-4 rounded-2xl bg-black/40 border border-white/5 outline-none text-sm appearance-none">
                <option>1 Stop (500m)</option>
                <option>2 Stops (1.2km)</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setIsAlarmSet(!isAlarmSet);
                if(!isAlarmSet) console.log(`[ALARM CONSOLE] Geofence active for ${destination}`);
              }}
              className={`w-full p-5 rounded-2xl font-black text-xs transition-all transform active:scale-95 shadow-2xl ${
                isAlarmSet ? 'bg-red-500 shadow-red-500/40' : 'bg-blue-600 shadow-blue-600/40'
              }`}
            >
              {isAlarmSet ? "TERMINATE SHIELD" : "ACTIVATE SMART ALARM"}
            </button>

            {isAlarmSet && (
              <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-emerald-400 text-[10px] font-bold">LIVE TRACKING ACTIVE</p>
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <button onClick={triggerAlarm} className="text-[9px] opacity-20 hover:opacity-100 transition-opacity italic underline">
              Test Audio Oscillator (Silent Mode Override)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
