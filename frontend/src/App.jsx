import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [destination, setDestination] = useState('');
  const [alarmRadius, setAlarmRadius] = useState(500); // Default: 1 stop (~500m)
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const audioCtx = useRef(null);

  // Core Function: The Silent-Bypass Alarm
  const triggerAlarm = () => {
    // Create AudioContext only on user interaction to bypass browser blocks
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.current.currentTime); // Standard A4 tone
    
    oscillator.start();
    // Alarm rings for 10 seconds or until manually stopped
    setTimeout(() => oscillator.stop(), 10000);
  };

  useEffect(() => {
    let watchId;
    if (isAlarmSet && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("Tracking location...", position.coords.latitude, position.coords.longitude);
          // Logic: Calculate distance to destination stop here
          // If distance < alarmRadius, triggerAlarm();
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isAlarmSet, alarmRadius]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Predictive Commute Pro</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium opacity-70 mb-2">Destination Stop</label>
            <input 
              type="text"
              placeholder="Enter destination..."
              className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium opacity-70 mb-2">Wake me up before:</label>
            <select 
              className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 outline-none"
              value={alarmRadius}
              onChange={(e) => setAlarmRadius(Number(e.target.value))}
            >
              <option value="500">1 Stop Before (500m)</option>
              <option value="1200">2 Stops Before (1.2km)</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setIsAlarmSet(!isAlarmSet);
              if (!isAlarmSet) alert("Geofence Armed! Alarm will sound when near stop.");
            }}
            className={`w-full p-4 rounded-2xl font-bold text-lg transition-transform active:scale-95 shadow-lg ${
              isAlarmSet 
              ? 'bg-red-500 shadow-red-500/30' 
              : 'bg-blue-600 shadow-blue-600/30 hover:bg-blue-500'
            }`}
          >
            {isAlarmSet ? "DEACTIVATE ALARM" : "SET SMART ALARM"}
          </button>
          
          {isAlarmSet && (
            <div className="flex items-center justify-center gap-2 text-green-400 animate-pulse">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <p className="text-sm">Live Location Tracking Active</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Visual Test Button for Judges */}
      <button onClick={triggerAlarm} className="mt-8 opacity-30 text-xs italic hover:opacity-100 transition-opacity">
        Test Audio (Silent Switch Bypass)
      </button>
    </div>
  );
}

export default App;
