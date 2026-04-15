import React, { useState, useRef } from 'react';

function App() {
  const [destination, setDestination] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const audioCtx = useRef(null);

  const triggerAlarm = () => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.frequency.value = 440; 
    osc.start();
    setTimeout(() => osc.stop(), 5000); 
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      {/* LEFT SIDE: MAP VIEW */}
      <div className="flex-1 bg-slate-800 relative flex items-center justify-center border-r border-white/10">
        <div className="text-white/20 text-4xl font-bold uppercase tracking-widest pointer-events-none">
          Live Map View
        </div>
        {/* If you have a working Google Maps API key, insert the Map component here */}
        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs text-green-400">
          📍 GPS: Active
        </div>
      </div>

      {/* RIGHT SIDE: ALARM CONTROL */}
      <div className="w-96 bg-slate-900 p-8 flex flex-col justify-center shadow-2xl z-10">
        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
          <h1 className="text-2xl font-bold mb-6 text-blue-400">Transit Shield</h1>
          
          <label className="text-xs opacity-60 uppercase">Destination</label>
          <input 
            className="w-full p-3 mt-1 rounded-xl bg-slate-800 border border-white/10 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search stop..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <label className="text-xs opacity-60 uppercase">Proximity</label>
          <select className="w-full p-3 mt-1 rounded-xl bg-slate-800 border border-white/10 mb-6">
            <option>1 Stop Before (500m)</option>
            <option>2 Stops Before (1.2km)</option>
          </select>

          <button 
            onClick={() => { setIsAlarmSet(!isAlarmSet); if(!isAlarmSet) alert("Alarm Set!"); }}
            className={`w-full p-4 rounded-2xl font-bold transition-all ${isAlarmSet ? 'bg-red-500 shadow-lg shadow-red-500/20' : 'bg-blue-600 shadow-lg shadow-blue-600/20'}`}
          >
            {isAlarmSet ? "CANCEL ALARM" : "ARM SMART ALARM"}
          </button>

          <button onClick={triggerAlarm} className="w-full mt-4 text-xs opacity-30 hover:opacity-100 italic transition-opacity">
            Test Audio Driver (Silent Mode Bypass)
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
