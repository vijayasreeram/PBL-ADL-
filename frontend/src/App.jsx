import { useState, useEffect, useRef } from 'react';
import { diagnoseCrop, fetchHistory, fetchWeatherRisk } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isGusting, setIsGusting] = useState(false);
  
  // Diagnose Tab States
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedField, setSelectedField] = useState('FIELD-TN-01');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  // History Tab States
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Weather Tab States
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  // Natural Organic Green Leaf Wind Gust Page Transition (600 Leaves, 3D Natural Physics)
  const changeTabWithGust = (targetTab) => {
    if (targetTab === activeTab && !isGusting) return;
    setIsGusting(true);
    setTimeout(() => {
      setActiveTab(targetTab);
    }, 450);
    setTimeout(() => {
      setIsGusting(false);
    }, 1450);
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    } else if (activeTab === 'weather') {
      loadWeather();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadWeather = async () => {
    setWeatherLoading(true);
    try {
      // Chennai Region, Tamil Nadu coordinates (13.0827° N, 80.2707° E)
      const data = await fetchWeatherRisk(13.0827, 80.2707);
      setWeatherData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setWeatherLoading(false);
    }
  };

  // TTS Voice Reader
  const speakRecommendation = (title, desc, treatments, preventives) => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const treatmentText = treatments.length > 0 
      ? `Recommended treatments: ${treatments.join('. ')}` 
      : 'No chemical treatment required.';
    const preventiveText = preventives.length > 0 
      ? `Preventive measures: ${preventives.join('. ')}` 
      : '';

    const textToSpeak = `Diagnosis: ${title}. ${desc}. ${treatmentText}. ${preventiveText}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onend = () => {
      setSpeaking(false);
    };
    
    setSpeechUtterance(utterance);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const triggerUpload = () => {
    changeTabWithGust('diagnose');
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 250);
  };

  const runDiagnostics = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    
    const steps = [
      'Scanning leaf structure...',
      'Locating infected lesions...',
      'Extracting MobileNetV3 features...',
      'Evaluating 81 multi-task disease heads...',
      'Generating Grad-CAM heatmap visualization...',
      'Synthesizing agronomic recommendations...'
    ];

    let stepIdx = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setLoadingStep(steps[stepIdx]);
      }
    }, 850);

    try {
      const data = await diagnoseCrop(selectedFile, selectedField);
      clearInterval(stepInterval);
      setResult(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'An error occurred during diagnosis.');
    } finally {
      setLoading(false);
    }
  };

  const resetDiagnose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const getSeverityBadge = (severity) => {
    if (severity === 0) {
      return <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">0% Severity (Healthy)</span>;
    }
    if (severity < 25) {
      return <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-green-100 text-green-800 border border-green-300">{severity}% Mild Severity</span>;
    }
    if (severity < 50) {
      return <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-amber-100 text-amber-800 border border-amber-300">{severity}% Moderate Severity</span>;
    }
    return <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-rose-100 text-rose-800 border border-rose-300">{severity}% High Severity</span>;
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFBF9] text-slate-800 font-sans selection:bg-emerald-200 flex flex-col overflow-x-hidden">
      
      {/* Background Organic Texture */}
      <div className="fixed inset-0 bg-organic-pattern pointer-events-none -z-10" />

      {/* Persistent Background Falling Leaves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {[
          { left: '2%', size: 'w-9 h-9', color: 'text-emerald-600/40', anim: 'animate-leaf-fall-1', delay: '-2s' },
          { left: '6%', size: 'w-7 h-7', color: 'text-green-500/45', anim: 'animate-leaf-fall-2', delay: '-14s' },
          { left: '10%', size: 'w-11 h-11', color: 'text-emerald-500/40', anim: 'animate-leaf-fall-3', delay: '-7s' },
          { left: '14%', size: 'w-8 h-8', color: 'text-green-600/35', anim: 'animate-leaf-fall-1', delay: '-11s' },
          { left: '18%', size: 'w-10 h-10', color: 'text-emerald-600/45', anim: 'animate-leaf-fall-2', delay: '-4s' },
          { left: '22%', size: 'w-7 h-7', color: 'text-emerald-500/40', anim: 'animate-leaf-fall-3', delay: '-16s' },
          { left: '26%', size: 'w-12 h-12', color: 'text-green-600/35', anim: 'animate-leaf-fall-1', delay: '-9s' },
          { left: '30%', size: 'w-8 h-8', color: 'text-emerald-600/40', anim: 'animate-leaf-fall-2', delay: '-1s' },
          { left: '34%', size: 'w-10 h-10', color: 'text-green-500/45', anim: 'animate-leaf-fall-3', delay: '-13s' },
          { left: '38%', size: 'w-7 h-7', color: 'text-emerald-600/35', anim: 'animate-leaf-fall-1', delay: '-6s' },
          { left: '42%', size: 'w-11 h-11', color: 'text-emerald-500/40', anim: 'animate-leaf-fall-2', delay: '-18s' },
          { left: '46%', size: 'w-9 h-9', color: 'text-green-700/35', anim: 'animate-leaf-fall-3', delay: '-3s' },
          { left: '50%', size: 'w-10 h-10', color: 'text-emerald-600/40', anim: 'animate-leaf-fall-1', delay: '-15s' },
          { left: '54%', size: 'w-8 h-8', color: 'text-emerald-500/45', anim: 'animate-leaf-fall-2', delay: '-8s' },
          { left: '58%', size: 'w-12 h-12', color: 'text-green-600/35', anim: 'animate-leaf-fall-3', delay: '-12s' },
          { left: '62%', size: 'w-7 h-7', color: 'text-emerald-600/45', anim: 'animate-leaf-fall-1', delay: '-5s' },
          { left: '66%', size: 'w-11 h-11', color: 'text-emerald-500/35', anim: 'animate-leaf-fall-2', delay: '-17s' },
          { left: '70%', size: 'w-9 h-9', color: 'text-green-500/40', anim: 'animate-leaf-fall-3', delay: '-10s' },
          { left: '74%', size: 'w-8 h-8', color: 'text-emerald-600/40', anim: 'animate-leaf-fall-1', delay: '-2s' },
          { left: '78%', size: 'w-10 h-10', color: 'text-emerald-500/45', anim: 'animate-leaf-fall-2', delay: '-14s' },
          { left: '82%', size: 'w-7 h-7', color: 'text-green-600/35', anim: 'animate-leaf-fall-3', delay: '-7s' },
          { left: '86%', size: 'w-11 h-11', color: 'text-emerald-600/45', anim: 'animate-leaf-fall-1', delay: '-11s' },
          { left: '90%', size: 'w-9 h-9', color: 'text-emerald-500/35', anim: 'animate-leaf-fall-2', delay: '-3s' },
          { left: '94%', size: 'w-8 h-8', color: 'text-green-500/40', anim: 'animate-leaf-fall-3', delay: '-16s' },
          { left: '98%', size: 'w-10 h-10', color: 'text-emerald-600/40', anim: 'animate-leaf-fall-1', delay: '-9s' }
        ].map((leaf, idx) => (
          <div 
            key={idx} 
            className={`absolute top-0 ${leaf.color} ${leaf.anim}`} 
            style={{ left: leaf.left, animationDelay: leaf.delay }}
          >
            <svg className={`${leaf.size} drop-shadow-sm`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.8 2.8C14.4 3 9.4 6 6.8 9.8c-2.3 3.3-3.1 7.4-2.8 11.4.1.6.6 1.1 1.2 1.1.2 0 .4-.1.6-.2 4-2.7 7.7-6.8 9.7-10.4 2.3-4.1 2.8-7.8 2.3-8.9z" />
            </svg>
          </div>
        ))}
      </div>


      {/* NATURAL ORGANIC 3D GREEN LEAF STORM OVERLAY (600 Leaves, 3D Tumbling & Non-linear Trajectories) */}
      {isGusting && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden bg-emerald-950/20 backdrop-blur-[3px] transition-all duration-500 ease-out [perspective:1200px]">
          {[...Array(600)].map((_, idx) => {
            // Natural green leaf color palette
            const colors = [
              'text-emerald-400/95',
              'text-green-500/95',
              'text-emerald-500/90',
              'text-green-400/95',
              'text-emerald-600/90',
              'text-green-600/85',
              'text-lime-500/90',
              'text-emerald-700/85'
            ];
            const color = colors[idx % colors.length];

            // 3 Normal Leaf SVG shapes
            const leafPaths = [
              "M17.8 2.8C14.4 3 9.4 6 6.8 9.8c-2.3 3.3-3.1 7.4-2.8 11.4.1.6.6 1.1 1.2 1.1.2 0 .4-.1.6-.2 4-2.7 7.7-6.8 9.7-10.4 2.3-4.1 2.8-7.8 2.3-8.9z",
              "M12 2C6.5 6 3 10.5 3 15c0 4.5 3.5 7 8.5 7s8.5-2.5 8.5-7c0-4.5-3.5-9-8-13z",
              "M20.2 2.2c-4.2.3-10.3 3.7-13.6 8.3-2.9 4.1-3.9 9.3-3.5 14.3.1.8.8 1.4 1.5 1.4.3 0 .5-.1.8-.3 5-3.4 9.7-8.5 12.2-13.1 2.9-5.1 3.5-9.8 2.9-11.2-.1-.4-.2-.5-.3-.7z"
            ];
            const path = leafPaths[idx % leafPaths.length];

            // Size variation with depth parallax
            const size = idx % 11 === 0 ? 'w-16 h-16' 
                       : idx % 8 === 0 ? 'w-12 h-12' 
                       : idx % 5 === 0 ? 'w-9 h-9' 
                       : idx % 3 === 0 ? 'w-7 h-7' 
                       : 'w-5 h-5';

            // 3 Trajectory Animation Classes
            const animClass = idx % 3 === 0 ? 'animate-natural-leaf-1' 
                            : idx % 3 === 1 ? 'animate-natural-leaf-2' 
                            : 'animate-natural-leaf-3';

            // Deterministic pseudo-random formulas for organic, non-grid scattering
            const seedY = Math.sin(idx * 12.9898 + 78.233) * 43758.5453;
            const top = (idx / 600) * 132 - 16 + ((seedY - Math.floor(seedY)) * 16 - 8);

            const seedX = Math.sin(idx * 43.123 + 12.456) * 23456.789;
            const left = -45 + ((idx % 35) * 2.2) + ((seedX - Math.floor(seedX)) * 22 - 11);

            const seedD = Math.sin(idx * 91.345 + 34.567) * 12345.678;
            const delay = `${((idx % 75) * 5.5) + Math.floor(idx / 75) * 10 + ((seedD - Math.floor(seedD)) * 75)}ms`;

            const duration = `${1.18 + ((idx % 17) * 0.02)}s`;

            // 3D Motion CSS Variables for realistic tumbling & updrafts
            const yStart = `${((idx % 13) - 6) * 10}px`;
            const yMid = `${((idx % 19) - 9) * 14 - 30}px`;
            const yEnd = `${((idx % 17) - 8) * 12 + 15}px`;

            const rxStart = `${(idx * 23) % 180 - 90}deg`;
            const rxMid = `${(idx * 47) % 360 + 90}deg`;
            const rxEnd = `${(idx * 89) % 360 + 270}deg`;

            const ryStart = `${(idx * 31) % 180 - 90}deg`;
            const ryMid = `${(idx * 61) % 360 + 120}deg`;
            const ryEnd = `${(idx * 97) % 360 + 300}deg`;

            const rzStart = `${(idx * 17) % 360}deg`;
            const rzMid = `${(idx * 53) % 360 + 180}deg`;
            const rzEnd = `${(idx * 103) % 360 + 360}deg`;

            const scale = `${0.45 + (idx % 8) * 0.1}`;
            const maxOpacity = `${0.75 + (idx % 5) * 0.05}`;

            return (
              <div 
                key={idx}
                className={`absolute ${animClass} ${color}`}
                style={{ 
                  top: `${top}%`, 
                  left: `${left}vw`,
                  animationDelay: delay,
                  '--dur': duration,
                  '--y-start': yStart,
                  '--y-mid': yMid,
                  '--y-end': yEnd,
                  '--rx-start': rxStart,
                  '--rx-mid': rxMid,
                  '--rx-end': rxEnd,
                  '--ry-start': ryStart,
                  '--ry-mid': ryMid,
                  '--ry-end': ryEnd,
                  '--rz-start': rzStart,
                  '--rz-mid': rzMid,
                  '--rz-end': rzEnd,
                  '--scale': scale,
                  '--max-opacity': maxOpacity
                }}
              >
                <svg className={`${size} filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]`} fill="currentColor" viewBox="0 0 24 24">
                  <path d={path} />
                </svg>
              </div>
            );
          })}
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TOP NAVIGATION BAR                                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <header className="w-full sticky top-0 z-50 bg-[#FAFBF9]/95 backdrop-blur-md border-b border-emerald-900/10 transition-all">
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 py-6 flex items-center justify-center relative">
          
          {/* Navigation Links centered horizontally */}
          <nav className="flex items-center justify-center space-x-6 sm:space-x-10 text-lg lg:text-xl font-extrabold text-slate-700">
            <button 
              onClick={() => changeTabWithGust('home')}
              className={`transition-all duration-300 hover:text-emerald-700 py-2.5 px-5 rounded-xl ${activeTab === 'home' ? 'text-emerald-700 bg-emerald-100/70 font-black shadow-sm' : ''}`}
            >
              Home
            </button>

            <button 
              onClick={() => changeTabWithGust('diagnose')}
              className={`transition-all duration-300 hover:text-emerald-700 py-2.5 px-5 rounded-xl ${activeTab === 'diagnose' ? 'text-emerald-700 bg-emerald-100/70 font-black shadow-sm' : ''}`}
            >
              Diagnose
            </button>

            <button 
              onClick={() => changeTabWithGust('weather')}
              className={`transition-all duration-300 hover:text-emerald-700 py-2.5 px-5 rounded-xl ${activeTab === 'weather' ? 'text-emerald-700 bg-emerald-100/70 font-black shadow-sm' : ''}`}
            >
              Weather Risk Radar
            </button>

            <button 
              onClick={() => changeTabWithGust('history')}
              className={`transition-all duration-300 hover:text-emerald-700 py-2.5 px-5 rounded-xl ${activeTab === 'history' ? 'text-emerald-700 bg-emerald-100/70 font-black shadow-sm' : ''}`}
            >
              Scan History
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="absolute right-6 md:right-12 lg:right-16 xl:right-24 hidden xl:flex items-center space-x-4 text-base lg:text-lg font-bold text-slate-700">
            <button 
              onClick={() => changeTabWithGust('history')}
              className="px-6 py-3 rounded-full border-2 border-slate-300 hover:border-emerald-600 hover:bg-emerald-50 text-slate-800 transition-all duration-300"
            >
              <span>History Log</span>
            </button>

            <button 
              onClick={triggerUpload}
              className="px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold transition-all duration-300 shadow-xl shadow-emerald-600/30 cursor-pointer text-base lg:text-lg"
            >
              <span>Start Leaf Scan</span>
            </button>
          </div>

        </div>
      </header>


      {/* Hidden File Input */}
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />


      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PAGE 1: SEPARATE HOME PAGE                                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'home' && (
        <div key="home-page" className="w-full animate-fade-in-up flex-1 flex flex-col justify-between">
          
          {/* Hero Section */}
          <section className="w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-8 pb-16 min-h-[calc(100vh-100px)] flex items-center">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
              
              {/* LEFT COLUMN: Hero Content */}
              <div className="lg:col-span-4 space-y-8 xl:space-y-10">
                
                <div className="inline-flex items-center space-x-2.5 px-5 py-2 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Plant AI Health Platform</span>
                </div>

                {/* Headline with [Plants] Badge */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-serif-title">
                  Home Is <br />
                  Where My <br />
                  <span className="bg-emerald-600 text-white px-5 py-2 rounded-3xl inline-block shadow-2xl shadow-emerald-600/35 transform -rotate-1 hover:rotate-0 transition duration-300 my-1">
                    Plants
                  </span> Are Healthy
                </h1>

                <p className="text-slate-600 text-base xl:text-lg leading-relaxed font-medium">
                  Protect your crops with deep learning multi-task AI. Detect 81 plant diseases across 16 crop types in seconds with visual Grad-CAM heatmap inspection.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button 
                    onClick={() => changeTabWithGust('diagnose')}
                    className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base transition-all duration-300 shadow-xl shadow-emerald-600/30 flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span>Go to Diagnose Page</span>
                  </button>

                  <button 
                    onClick={() => changeTabWithGust('weather')}
                    className="px-7 py-4 rounded-full border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-extrabold text-base transition-all duration-300 flex items-center space-x-2.5 cursor-pointer"
                  >
                    <span>Weather Risk Radar</span>
                  </button>
                </div>

                {/* Scroll Down Indicator */}
                <div className="pt-6 flex items-center space-x-4 text-xs sm:text-sm text-slate-400">
                  <div className="w-7 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-1.5">
                    <div className="w-1.5 h-3 rounded-full bg-emerald-600 animate-bounce" />
                  </div>
                  <span className="font-extrabold uppercase tracking-wider text-xs text-slate-500">Explore Platform Features</span>
                </div>

              </div>


              {/* CENTER COLUMN (Signature 3D Pop-Out Biophilic Leaf Frame) */}
              <div className="lg:col-span-4 flex justify-center relative my-6 lg:my-0">
                
                {/* Outer relative container allowing 3D leaf layers to overflow and pop out */}
                <div className="relative w-full max-w-md xl:max-w-lg h-[600px] lg:h-[700px] xl:h-[780px] group">
                  
                  {/* Inner Rounded Image Frame */}
                  <div className="w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl shadow-emerald-950/40 border-4 border-white bg-slate-950 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80" 
                      alt="Lush Tropical Plant Leaf" 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-95"
                    />
                    
                    {/* Inner Grad-CAM Caption Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-8 xl:p-10 text-white z-10">
                      <span className="px-4 py-2 rounded-full bg-emerald-500/90 backdrop-blur text-xs font-extrabold tracking-wider uppercase self-start mb-3">
                        AI Vision Target
                      </span>
                      <h3 className="text-2xl xl:text-3xl font-extrabold font-serif-title">Grad-CAM Heatmap Focus</h3>
                      <p className="text-xs xl:text-sm text-slate-300 mt-1 font-medium">Deep lesion region of interest extraction</p>
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────────────────────── */}
                  {/* ORGANIC HAND-ALIGNED 3D POP-OUT FOLIAGE CLUSTERS                   */}
                  {/* ─────────────────────────────────────────────────────────────────── */}

                  {/* CLUSTER 1: TOP-LEFT SPROUTING FOLIAGE */}
                  <div className="absolute -top-12 -left-12 z-30 pointer-events-none transform -rotate-25 group-hover:-rotate-15 group-hover:scale-105 transition-all duration-500 animate-float">
                    <svg className="w-36 h-36 lg:w-48 lg:h-48 filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]" viewBox="0 0 120 120" fill="none">
                      <path d="M60 5 C30 30 10 65 18 100 C42 105 90 90 102 55 C95 25 78 12 60 5 Z" fill="url(#leaf-grad-tl1)" />
                      <path d="M60 5 Q52 55 18 100 M60 5 Q65 50 102 55" stroke="#022c22" strokeWidth="2.5" opacity="0.6" />
                      <path d="M45 35 L30 45 M50 55 L32 70 M55 75 L40 90" stroke="#022c22" strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="leaf-grad-tl1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="50%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="absolute -top-8 left-10 z-20 pointer-events-none transform rotate-12 group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-24 h-24 lg:w-32 lg:h-32 filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]" viewBox="0 0 120 120" fill="none">
                      <path d="M25 95 C25 45 48 12 105 18 C98 68 68 105 25 95 Z" fill="url(#leaf-grad-tl2)" />
                      <path d="M25 95 Q55 60 105 18" stroke="#022c22" strokeWidth="2.5" opacity="0.5" />
                      <defs>
                        <linearGradient id="leaf-grad-tl2" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>


                  {/* CLUSTER 2: TOP-RIGHT CANOPY FOLIAGE */}
                  <div className="absolute -top-14 -right-10 z-30 pointer-events-none transform rotate-40 group-hover:rotate-30 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-36 h-36 lg:w-44 lg:h-44 filter drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]" viewBox="0 0 120 120" fill="none">
                      <path d="M25 95 C25 45 48 12 105 18 C98 68 68 105 25 95 Z" fill="url(#leaf-grad-tr1)" />
                      <path d="M25 95 Q55 60 105 18" stroke="#022c22" strokeWidth="2.8" opacity="0.6" />
                      <path d="M45 75 L30 60 M60 58 L45 42 M78 38 L65 22" stroke="#022c22" strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="leaf-grad-tr1" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#047857" />
                          <stop offset="60%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#6ee7b7" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="absolute top-12 -right-8 z-20 pointer-events-none transform rotate-70 group-hover:rotate-60 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-24 h-24 lg:w-30 lg:h-30 filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]" viewBox="0 0 120 120" fill="none">
                      <path d="M12 60 C35 25 85 18 108 55 C90 90 42 95 12 60 Z" fill="url(#leaf-grad-tr2)" />
                      <path d="M12 60 Q60 55 108 55" stroke="#022c22" strokeWidth="2" opacity="0.5" />
                      <defs>
                        <linearGradient id="leaf-grad-tr2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>


                  {/* CLUSTER 3: RIGHT-SIDE ACCENT LEAVES (Flowing towards CNN card) */}
                  <div className="absolute top-[38%] -right-12 z-30 pointer-events-none transform rotate-85 group-hover:rotate-75 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-32 h-32 lg:w-40 lg:h-40 filter drop-shadow-[0_18px_26px_rgba(0,0,0,0.5)]" viewBox="0 0 120 120" fill="none">
                      <path d="M12 60 C35 25 85 18 108 55 C90 90 42 95 12 60 Z" fill="url(#leaf-grad-r1)" />
                      <path d="M12 60 Q60 55 108 55" stroke="#022c22" strokeWidth="2.8" opacity="0.6" />
                      <path d="M35 45 L45 28 M58 48 L72 30 M80 52 L95 38" stroke="#022c22" strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="leaf-grad-r1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#022c22" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="absolute top-[52%] -right-8 z-20 pointer-events-none transform rotate-110 group-hover:rotate-100 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-20 h-20 lg:w-26 lg:h-26 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)]" viewBox="0 0 120 120" fill="none">
                      <path d="M60 5 C30 30 10 65 18 100 C42 105 90 90 102 55 C95 25 78 12 60 5 Z" fill="url(#leaf-grad-r2)" />
                      <defs>
                        <linearGradient id="leaf-grad-r2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>


                  {/* CLUSTER 4: BOTTOM-RIGHT CORNER FOLIAGE */}
                  <div className="absolute -bottom-10 -right-8 z-30 pointer-events-none transform rotate-55 group-hover:rotate-45 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-32 h-32 lg:w-40 lg:h-40 filter drop-shadow-[0_18px_26px_rgba(0,0,0,0.5)]" viewBox="0 0 120 120" fill="none">
                      <path d="M25 95 C25 45 48 12 105 18 C98 68 68 105 25 95 Z" fill="url(#leaf-grad-br1)" />
                      <path d="M25 95 Q55 60 105 18" stroke="#022c22" strokeWidth="2.8" opacity="0.6" />
                      <defs>
                        <linearGradient id="leaf-grad-br1" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#059669" />
                          <stop offset="60%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>


                  {/* CLUSTER 5: BOTTOM-LEFT CORNER FOLIAGE */}
                  <div className="absolute -bottom-12 -left-12 z-30 pointer-events-none transform -rotate-45 group-hover:-rotate-35 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-36 h-36 lg:w-44 lg:h-44 filter drop-shadow-[0_18px_26px_rgba(0,0,0,0.5)]" viewBox="0 0 120 120" fill="none">
                      <path d="M98 18 C68 42 22 78 28 108 C60 102 102 60 98 18 Z" fill="url(#leaf-grad-bl1)" />
                      <path d="M98 18 Q60 60 28 108" stroke="#022c22" strokeWidth="3" opacity="0.6" />
                      <path d="M75 35 L90 50 M55 52 L72 70 M38 72 L52 90" stroke="#022c22" strokeWidth="1.8" opacity="0.4" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="leaf-grad-bl1" x1="100%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="55%" stopColor="#047857" />
                          <stop offset="100%" stopColor="#022c22" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="absolute bottom-6 -left-8 z-20 pointer-events-none transform -rotate-70 group-hover:-rotate-60 group-hover:scale-105 transition-all duration-500">
                    <svg className="w-24 h-24 lg:w-30 lg:h-30 filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.35)]" viewBox="0 0 120 120" fill="none">
                      <path d="M60 5 C30 30 10 65 18 100 C42 105 90 90 102 55 C95 25 78 12 60 5 Z" fill="url(#leaf-grad-bl2)" />
                      <defs>
                        <linearGradient id="leaf-grad-bl2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>


                  {/* CLUSTER 6: MID-LEFT ACCENT LEAF */}
                  <div className="absolute top-[35%] -left-12 z-30 pointer-events-none transform -rotate-30 group-hover:-rotate-45 group-hover:scale-105 transition-all duration-500 animate-float">
                    <svg className="w-28 h-28 lg:w-36 lg:h-36 filter drop-shadow-[0_15px_22px_rgba(0,0,0,0.4)]" viewBox="0 0 120 120" fill="none">
                      <path d="M50 10 C25 30 15 60 20 85 C40 90 75 70 80 40 C75 25 60 15 50 10 Z" fill="url(#leaf-grad-ml1)" />
                      <path d="M50 10 Q45 50 20 85" stroke="#022c22" strokeWidth="2.2" opacity="0.5" />
                      <defs>
                        <linearGradient id="leaf-grad-ml1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="70%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                </div>
              </div>


              {/* RIGHT COLUMN: CNN Model Evaluation Metrics Panel (Perfect Height & Side-by-Side Alignment) */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-md xl:max-w-lg h-[600px] lg:h-[700px] xl:h-[780px] rounded-[3.5rem] bg-white border-4 border-slate-100 shadow-2xl shadow-emerald-950/10 p-7 lg:p-9 flex flex-col justify-between overflow-hidden">
                  
                  {/* Panel Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wider uppercase border border-emerald-200">
                        Evaluation Metrics
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">v3.4-prod</span>
                    </div>
                    <div>
                      <h3 className="text-2xl xl:text-3xl font-extrabold text-slate-900 font-serif-title">CNN Model Metrics</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">Multi-Task MobileNetV3 Architecture Evaluation</p>
                    </div>
                  </div>

                  {/* Primary 2x2 Metric Cards Grid */}
                  <div className="grid grid-cols-2 gap-3.5 my-2">
                    {/* Top-1 Accuracy */}
                    <div className="bg-emerald-50/80 rounded-3xl p-4 border border-emerald-100 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">Top-1 Accuracy</span>
                      <p className="text-3xl font-extrabold text-slate-900 font-sans">98.4%</p>
                      <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full w-[98.4%]" />
                      </div>
                    </div>

                    {/* Macro Precision */}
                    <div className="bg-emerald-50/80 rounded-3xl p-4 border border-emerald-100 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">Precision</span>
                      <p className="text-3xl font-extrabold text-slate-900 font-sans">98.1%</p>
                      <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full w-[98.1%]" />
                      </div>
                    </div>

                    {/* Recall / Sensitivity */}
                    <div className="bg-emerald-50/80 rounded-3xl p-4 border border-emerald-100 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">Recall / Sensitivity</span>
                      <p className="text-3xl font-extrabold text-slate-900 font-sans">98.6%</p>
                      <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full w-[98.6%]" />
                      </div>
                    </div>

                    {/* F1-Score */}
                    <div className="bg-emerald-50/80 rounded-3xl p-4 border border-emerald-100 space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">F1-Score</span>
                      <p className="text-3xl font-extrabold text-slate-900 font-sans">98.35%</p>
                      <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full w-[98.35%]" />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Detailed Metrics List */}
                  <div className="space-y-3 bg-slate-50/90 rounded-3xl p-5 border border-slate-200/80">
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600">Validation Cross-Entropy Loss</span>
                      <span className="font-mono font-extrabold text-slate-900">0.042</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[95%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-600">Grad-CAM Lesion Localization (IoU)</span>
                      <span className="font-mono font-extrabold text-slate-900">96.8%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[96.8%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-600">Inference Latency</span>
                      <span className="font-mono font-extrabold text-emerald-700">&lt; 120ms / frame</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-semibold text-slate-600">Multi-Task Mapped Heads</span>
                      <span className="font-mono font-extrabold text-slate-900">81 Heads (16 Crops)</span>
                    </div>

                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Tested on 50,000+ Leaf Samples</span>
                    <button 
                      onClick={() => changeTabWithGust('diagnose')}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all duration-300 shadow-md shadow-emerald-600/20 cursor-pointer"
                    >
                      Run Test Scan
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Feature Highlights Grid Section */}
          <section className="w-full px-6 md:px-12 lg:px-16 xl:px-24 py-16 bg-white border-t border-slate-200">
            <div className="w-full space-y-12">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full">
                  Platform Capabilities
                </span>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif-title">Integrated AI Precision Features</h2>
                <p className="text-base text-slate-600">Smart multi-task neural network pipeline designed for farmers, researchers, and agronomists.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-[#FAFBF9] rounded-[2.5rem] p-8 border border-slate-200/80 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-slate-900 font-serif-title">Multi-Task Classification</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Identifies 16 crop types and 81 disease conditions simultaneously with inverse class frequency reweighting.
                  </p>
                </div>

                <div className="bg-[#FAFBF9] rounded-[2.5rem] p-8 border border-slate-200/80 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-slate-900 font-serif-title">Grad-CAM Heatmaps</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Generates visual lesion heatmaps highlighting exact leaf infection zones for full visual explainability.
                  </p>
                </div>

                <div className="bg-[#FAFBF9] rounded-[2.5rem] p-8 border border-slate-200/80 space-y-3 shadow-sm hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-slate-900 font-serif-title">Custom Agronomic Remedies</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provides exact chemical dosages, spray frequencies, NPK fertilizer formulas, and TTS voice recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PAGE 2: SEPARATE DIAGNOSE PAGE                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'diagnose' && (
        <div key="diagnose-page" className="w-full animate-fade-in-up px-6 md:px-12 lg:px-16 xl:px-24 py-10 flex-1">
          <div className="w-full space-y-12">
            
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-200 pb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full">
                  Leaf AI Diagnostic Workspace
                </span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 font-serif-title mt-3">Crop Leaf Scanner</h1>
                <p className="text-base text-slate-600 mt-1">Upload a leaf photo or pick a sample image to diagnose crop disease instantly.</p>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => changeTabWithGust('home')}
                  className="px-6 py-3 rounded-full border-2 border-slate-300 hover:bg-slate-100 text-slate-800 text-sm font-extrabold transition-all duration-300"
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            {/* Upload & Scanner Card */}
            {!result && (
              <div className="w-full bg-white rounded-[3rem] p-10 lg:p-16 border border-slate-200 shadow-2xl shadow-slate-200/50 space-y-10">
                
                {/* Target Agricultural Plot / Field Selector */}
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto">
                  <div className="flex items-center space-x-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-sm font-extrabold uppercase text-slate-800 tracking-wider">Select Agricultural Field / Plot:</span>
                  </div>
                  <select 
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="bg-white border-2 border-emerald-400 focus:border-emerald-600 font-extrabold text-slate-900 text-sm px-5 py-3 rounded-xl shadow-sm cursor-pointer outline-none transition-all"
                  >
                    <option value="FIELD-TN-01">FIELD-TN-01: Chengalpattu Paddy Plot (Rice)</option>
                    <option value="FIELD-TN-02">FIELD-TN-02: Villupuram Sugarcane Belt</option>
                    <option value="FIELD-TN-03">FIELD-TN-03: Thanjavur Banana Plantation</option>
                    <option value="FIELD-TN-04">FIELD-TN-04: Salem Pulses & Cotton Field</option>
                  </select>
                </div>

                {!previewUrl ? (
                  <div 
                    onClick={triggerUpload}
                    className="w-full border-4 border-dashed border-emerald-300 hover:border-emerald-600 rounded-[2.5rem] p-16 lg:p-24 text-center cursor-pointer transition-all duration-300 bg-emerald-50/40 hover:bg-emerald-50/80 group"
                  >
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Click or Drag & Drop Leaf Photo Here</h3>
                    <p className="text-base text-slate-500 mb-10 font-medium">Supports PNG, JPG, JPEG up to 15MB</p>

                    {/* Quick Demo Preset Pills */}
                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                      {['Corn Rust', 'Onion Purple Blotch', 'Potato Late Blight', 'Rice Blast', 'Tea Anthracnose', 'Sugarcane Red Rot'].map(p => (
                        <span key={p} className="px-5 py-2 rounded-full bg-white border border-slate-200 text-sm font-extrabold text-slate-800 shadow-sm hover:border-emerald-500 transition-all duration-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-slate-200 aspect-square bg-slate-900 flex items-center justify-center shadow-2xl">
                      <img src={previewUrl} alt="Leaf Preview" className="max-h-full max-w-full object-contain" />
                      <div className="absolute top-6 left-6 bg-slate-900/95 backdrop-blur text-white px-5 py-2 rounded-full text-xs sm:text-sm font-bold">
                        Leaf Image Preview
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-3xl font-extrabold text-slate-900 font-serif-title">Ready for Multi-Task AI Diagnosis</h3>
                        <p className="text-base text-slate-500 mt-2 leading-relaxed">
                          Our MobileNetV3 backbone will classify crop type, evaluate disease severity score, and construct Grad-CAM lesion heatmap overlay.
                        </p>
                      </div>

                      {loading ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-[2.5rem] p-10 space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-9 h-9 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-lg font-extrabold text-emerald-900">Running AI Inference Pipeline...</span>
                          </div>
                          <p className="text-sm font-extrabold text-emerald-700 animate-pulse">{loadingStep}</p>
                        </div>
                      ) : (
                        <div className="flex space-x-5">
                          <button 
                            onClick={runDiagnostics}
                            className="flex-1 py-5 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-600/35 flex items-center justify-center space-x-3 text-lg cursor-pointer"
                          >
                            <span>Run AI Diagnosis</span>
                          </button>

                          <button 
                            onClick={resetDiagnose}
                            className="py-5 px-8 border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-extrabold rounded-2xl transition-all duration-300 text-lg cursor-pointer"
                          >
                            Change Photo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            )}


            {/* ─────────────────────────────────────────────────────────────── */}
            {/* DIAGNOSIS RESULTS DISPLAY                                      */}
            {/* ─────────────────────────────────────────────────────────────── */}
            {result && (
              <div ref={resultsRef} className="w-full space-y-12 animate-fade-in-up">
                
                {/* Result Header Bar */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-full">
                      AI Diagnostic Result
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-serif-title mt-3">
                      {result.disease}
                    </h2>
                    <p className="text-base text-slate-500 mt-2">
                      Detected on <strong className="text-slate-900 font-bold">{result.crop}</strong> leaf with {(result.crop_confidence * 100).toFixed(1)}% crop classification confidence.
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getSeverityBadge(result.severity)}

                    {/* Audio TTS Reader Button */}
                    <button 
                      onClick={() => speakRecommendation(
                        result.disease, 
                        result.details.description, 
                        result.details.treatments, 
                        result.details.preventive
                      )}
                      className={`px-6 py-3.5 rounded-full text-sm font-extrabold transition-all duration-300 flex items-center space-x-2.5 ${speaking ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-slate-800'} cursor-pointer`}
                    >
                      <span>{speaking ? 'Stop Voice' : 'Listen Voice'}</span>
                    </button>

                    <button 
                      onClick={resetDiagnose}
                      className="px-6 py-3.5 rounded-full border-2 border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                    >
                      New Scan
                    </button>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────── */}
                {/* BOTANICAL EPIDEMIOLOGY DECISION SUPPORT SYSTEM CARD (ADSS)     */}
                {/* ─────────────────────────────────────────────────────────────── */}
                {result.epidemiological_decision && (
                  <div className="bg-white rounded-[3rem] p-8 lg:p-10 border-2 border-emerald-200/80 shadow-2xl space-y-8">
                    
                    {/* Decision Header & Field ID */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                      <div className="flex items-center space-x-3">
                        <span className="px-4 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-extrabold tracking-wider uppercase shadow-md shadow-emerald-700/20">
                          Decision Support System (ADSS)
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold border border-slate-200">
                          Plot ID: {result.epidemiological_decision.field_id || 'FIELD-TN-01'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
                        <span>Van der Plank Epidemiological Logistic Fit</span>
                      </div>
                    </div>

                    {/* Primary Decision Banner */}
                    <div className={`p-6 rounded-[2.5rem] border ${result.epidemiological_decision.action_required ? 'bg-amber-500/10 border-amber-300 text-amber-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'} flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
                      <div className="space-y-2 max-w-4xl">
                        <div className="flex items-center space-x-2">
                          <span className={`w-3 h-3 rounded-full ${result.epidemiological_decision.action_required ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`} />
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Agronomic Intervention Decision</span>
                        </div>
                        <p className="text-lg lg:text-xl font-extrabold leading-snug">
                          "{result.epidemiological_decision.decision_summary}"
                        </p>
                      </div>

                      {result.epidemiological_decision.action_required && (
                        <div className="bg-white/90 backdrop-blur rounded-2xl p-5 border border-amber-200 shadow-md text-right min-w-[200px]">
                          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">Recommended Action Window</span>
                          <span className="text-2xl font-extrabold text-amber-700 font-sans">Within {result.epidemiological_decision.optimal_treatment_window_days} Days</span>
                          <span className="text-xs font-semibold text-slate-500 block mt-1">For Optimal ROI</span>
                        </div>
                      )}
                    </div>

                    {/* Epidemiological Metrics & Multi-Scan Disease Progress Curve */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      {/* Time-Series Epidemic Progress Curve Points */}
                      <div className="lg:col-span-7 bg-slate-50/90 rounded-[2.5rem] p-6 lg:p-8 border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-serif-title">Longitudinal Disease Progress Curve</h4>
                          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                            Economic Threshold: {result.epidemiological_decision.economic_threshold_pct}%
                          </span>
                        </div>

                        {/* 4-Step Progress Line */}
                        <div className="grid grid-cols-4 gap-3 pt-2">
                          {result.epidemiological_decision.trend_data.map((point, i) => {
                            const isToday = point.day.includes("Today");
                            const isProj = point.projected;
                            const isOverET = point.severity >= result.epidemiological_decision.economic_threshold_pct;

                            return (
                              <div 
                                key={i} 
                                className={`rounded-2xl p-4 border text-center space-y-1.5 transition-all duration-300 ${
                                  isToday 
                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xl shadow-emerald-600/30 scale-105 z-10' 
                                    : isProj 
                                    ? 'bg-slate-100 border-dashed border-slate-300 text-slate-700' 
                                    : 'bg-white border-slate-200 text-slate-800'
                                }`}
                              >
                                <span className={`text-[11px] font-extrabold tracking-wider uppercase block ${isToday ? 'text-emerald-100' : 'text-slate-500'}`}>
                                  {point.day}
                                </span>
                                <p className="text-2xl font-extrabold font-sans">
                                  {point.severity}%
                                </p>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                                  isOverET ? (isToday ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-900 border border-amber-300') : (isToday ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700')
                                }`}>
                                  {isOverET ? 'Threshold Risk' : 'Grad-CAM Measured'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Economic ROI Metrics */}
                      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        
                        <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-100 space-y-1">
                          <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">Spread Rate Velocity</span>
                          <p className="text-2xl font-extrabold text-slate-900 font-sans">{result.epidemiological_decision.spread_rate_per_day}</p>
                          <span className="text-xs text-slate-500 font-semibold block">Weather Multiplier Applied</span>
                        </div>

                        <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-100 space-y-1">
                          <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">Days to ET Breach</span>
                          <p className="text-2xl font-extrabold text-slate-900 font-sans">
                            {result.epidemiological_decision.days_to_threshold === 0 ? 'Breached' : `${result.epidemiological_decision.days_to_threshold} Days`}
                          </p>
                          <span className="text-xs text-slate-500 font-semibold block">Forecasted Deadline</span>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-1">
                          <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider block">Treatment Cost / Acre</span>
                          <p className="text-xl font-extrabold text-slate-900 font-sans">{result.epidemiological_decision.treatment_cost_per_acre}</p>
                          <span className="text-xs text-slate-500 font-semibold block">Active Spray Recipe</span>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-1">
                          <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider block">Yield Saved / Acre</span>
                          <p className="text-xl font-extrabold text-emerald-700 font-sans">{result.epidemiological_decision.yield_saved_per_acre}</p>
                          <span className="text-xs text-slate-500 font-semibold block">Agronomic ROI Benefit</span>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* Heatmap & Image Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider">Grad-CAM Heatmap Lesion Overlay</h3>
                      <span className="text-xs text-emerald-700 font-extrabold">MobileNetV3 Output</span>
                    </div>
                    <div className="rounded-[2rem] overflow-hidden border border-slate-200 aspect-square bg-slate-950 flex items-center justify-center">
                      <img src={result.heatmap_image} alt="Grad-CAM Lesion Heatmap" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider">Original Uploaded Leaf Image</h3>
                      <span className="text-xs text-slate-500 font-extrabold">{result.crop} Crop</span>
                    </div>
                    <div className="rounded-[2rem] overflow-hidden border border-slate-200 aspect-square bg-slate-900 flex items-center justify-center">
                      <img src={previewUrl} alt="Original Leaf" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                </div>

                {/* DETAILED REMEDY, MEDICINE & FERTILIZER GUIDANCE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  
                  {/* CARD 1: MEDICATION & CHEMICAL TREATMENT */}
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 font-serif-title">Medication & Spray Recipe</h4>
                      <p className="text-xs text-slate-500">Targeted Chemical Formulation</p>
                    </div>

                    <div className="space-y-4 text-sm border-t border-slate-100 pt-6">
                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Medicine Name:</span>
                        <p className="text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-extrabold text-base">
                          {result.details.medicine.name}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Dosage:</span>
                          <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
                            {result.details.medicine.dosage}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">Frequency:</span>
                          <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-semibold">
                            {result.details.medicine.frequency}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Application Instructions:</span>
                        <p className="text-slate-800 leading-relaxed bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 font-medium">
                          {result.details.medicine.instructions}
                        </p>
                      </div>
                    </div>
                  </div>


                  {/* CARD 2: FERTILIZER & SOIL NUTRITION GUIDANCE */}
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 font-serif-title">Fertilizer & Soil Nutrition</h4>
                      <p className="text-xs text-slate-500">NPK & Micronutrient Adjustments</p>
                    </div>

                    <div className="space-y-4 text-sm border-t border-slate-100 pt-6">
                      <div>
                        <span className="font-bold text-slate-900 block mb-1">NPK Fertilizer Adjustment:</span>
                        <p className="text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold">
                          {result.details.fertilizer.npk}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Micronutrient Requirements:</span>
                        <p className="text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold">
                          {result.details.fertilizer.micronutrients}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-900 block mb-1">Organic Compost & Bio-agents:</span>
                        <p className="text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-semibold">
                          {result.details.fertilizer.organic}
                        </p>
                      </div>
                    </div>
                  </div>


                  {/* CARD 3: PREVENTIVE & CULTIVATION MEASURES */}
                  <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-2xl space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 font-serif-title">Preventive Measures</h4>
                      <p className="text-xs text-slate-500">Long-term Field Protection</p>
                    </div>

                    <div className="space-y-4 text-sm border-t border-slate-100 pt-6">
                      <span className="font-bold text-slate-900 block">Recommended Action Items:</span>
                      <ul className="space-y-3">
                        {result.details.preventive.map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PAGE 3: WEATHER RISK RADAR PAGE                                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'weather' && (
        <div key="weather-page" className="w-full animate-fade-in-up px-6 md:px-12 lg:px-16 xl:px-24 py-10 flex-1">
          <div className="w-full bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl space-y-12">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full">
                  Real-time Agronomic Weather Intelligence
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 font-serif-title mt-4">Crop Disease Weather Risk Radar</h2>
                <p className="text-base text-slate-500 mt-1 font-medium">Live Open-Meteo weather parameters dynamically calculated for fungal spore incubation risk</p>
              </div>

              <button 
                onClick={loadWeather}
                className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-xl shadow-emerald-600/30"
              >
                <span>Update Weather Data</span>
              </button>
            </div>

            {weatherLoading ? (
              <div className="py-20 text-center text-slate-400 text-lg font-medium">Fetching live weather metrics...</div>
            ) : weatherData ? (
              <div className="space-y-12">
                
                {/* Weather Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="bg-emerald-50/60 rounded-[2.5rem] p-8 border border-emerald-100 space-y-3">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Temperature</span>
                    <p className="text-5xl font-extrabold text-slate-900">{weatherData.weather_summary.temperature}</p>
                    <p className="text-sm text-slate-500 font-semibold">Live 2m Ambient Temp</p>
                  </div>

                  <div className="bg-emerald-50/60 rounded-[2.5rem] p-8 border border-emerald-100 space-y-3">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Relative Humidity</span>
                    <p className="text-5xl font-extrabold text-slate-900">{weatherData.weather_summary.humidity}</p>
                    <p className="text-sm text-slate-500 font-semibold">Fungal Spore Humidity Risk</p>
                  </div>

                  <div className="bg-emerald-50/60 rounded-[2.5rem] p-8 border border-emerald-100 space-y-3">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Precipitation Chance</span>
                    <p className="text-4xl font-extrabold text-slate-900">{weatherData.weather_summary.precipitation_chance}</p>
                    <p className="text-sm text-slate-500 font-semibold">{weatherData.weather_summary.description}</p>
                  </div>
                </div>

                {/* Risk Index Meters */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900 font-serif-title">Disease Outbreak Probability Index</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {weatherData.risks.map((r, i) => (
                      <div key={i} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{r.crop}</span>
                          <h4 className="text-xl font-bold text-slate-900">{r.disease}</h4>
                        </div>
                        <div className="text-right">
                          <span className={`px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold ${r.risk === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-300' : r.risk === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                            {r.risk} Risk ({r.score}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PAGE 4: SCAN HISTORY PAGE                                          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div key="history-page" className="w-full animate-fade-in-up px-6 md:px-12 lg:px-16 xl:px-24 py-10 flex-1">
          <div className="w-full bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 font-serif-title">Diagnostic History Log</h2>
                <p className="text-base text-slate-500 mt-1 font-medium">Past scan history saved in backend database</p>
              </div>
              <button 
                onClick={loadHistory}
                className="px-6 py-3 rounded-full border-2 border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
              >
                <span>Refresh Log</span>
              </button>
            </div>

            {historyLoading ? (
              <div className="py-20 text-center text-slate-400 text-lg font-medium">Loading history log...</div>
            ) : history.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-lg font-medium">No past scan records found yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-900 uppercase text-xs font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-5 px-6">Scan ID</th>
                      <th className="py-5 px-6">Plot / Field ID</th>
                      <th className="py-5 px-6">Filename</th>
                      <th className="py-5 px-6">Crop Type</th>
                      <th className="py-5 px-6">Disease Classification</th>
                      <th className="py-5 px-6">Severity Score</th>
                      <th className="py-5 px-6">ET Forecast Deadline</th>
                      <th className="py-5 px-6">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-200">
                        <td className="py-5 px-6 font-mono font-bold text-slate-900 text-base">#{item.id}</td>
                        <td className="py-5 px-6 font-mono font-bold text-emerald-800 text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block my-3">
                          {item.field_id || 'FIELD-TN-01'}
                        </td>
                        <td className="py-5 px-6 font-mono text-slate-500">{item.filename}</td>
                        <td className="py-5 px-6 font-extrabold text-slate-900 text-base">{item.crop}</td>
                        <td className="py-5 px-6 font-extrabold text-emerald-800 text-base">{item.disease}</td>
                        <td className="py-5 px-6">{getSeverityBadge(item.severity)}</td>
                        <td className="py-5 px-6 font-bold text-amber-800">
                          {item.days_to_threshold === 0 
                            ? <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300 text-xs uppercase">Threshold Breached</span>
                            : item.days_to_threshold === 999 
                            ? <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">Healthy</span>
                            : `${item.days_to_threshold || 5} Days`}
                        </td>
                        <td className="py-5 px-6 text-slate-400 font-medium">{item.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* FOOTER                                                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-200 bg-white py-12 text-sm text-slate-500 mt-auto">
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-slate-900 font-serif-title text-lg">AgriVision AI</span>
            <span>— Multi-Task Precision Agriculture</span>
          </div>
          <p className="font-medium">© 2026 AgriVision AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
