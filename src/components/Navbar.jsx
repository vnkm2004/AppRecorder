import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Video,
  Film,
  Sliders,
  ChevronDown,
  Layers,
  ExternalLink,
  Sun,
  Moon,
  Image as ImageIcon,
} from 'lucide-react';
import { SAMPLE_WEBSITES, DEMO_TEMPLATES } from '../data/sampleWebsites';
import { normalizeUrl } from '../utils/urlHelper';

export default function Navbar({
  contentUrl,
  setUrl,
  contentType,
  setContentType,
  selectedDemo,
  setSelectedDemo,
  onImageSelected,
  isRecording,
  recordingTime,
  onStartRecordClick,
  onStopRecordClick,
  onOpenGallery,
  savedRecordingsCount = 0,
  toggleSidebar,
  theme,
  setTheme,
}) {
  const [inputUrl, setInputUrl] = useState(contentUrl || 'https://servcate.com');
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (contentUrl) {
      setInputUrl(contentUrl);
    }
  }, [contentUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl) return;
    const normalized = normalizeUrl(inputUrl);
    setInputUrl(normalized);
    setUrl(normalized);
    setContentType('url');
  };

  const handleSelectSample = (url) => {
    const normalized = normalizeUrl(url);
    setInputUrl(normalized);
    setUrl(normalized);
    setContentType('url');
    setShowPresetsMenu(false);
  };

  const handleSelectDemo = (demoKey) => {
    setSelectedDemo(demoKey);
    setContentType('demo');
    setShowPresetsMenu(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (onImageSelected) {
      onImageSelected(objectUrl);
    }
    setContentType('image');
  };

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={`relative z-40 h-16 w-full px-4 flex items-center justify-between border-b transition-colors duration-200 select-none ${
        isDark
          ? 'glass-panel-dark border-white/10 text-white'
          : 'glass-panel-light border-black/10 text-neutral-900'
      }`}
    >
      {/* Brand & Sidebar Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'glass-btn-dark' : 'glass-btn-light'
          }`}
          title="Toggle Controls Sidebar"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold font-mono text-sm ${
              isDark
                ? 'bg-neutral-900 border-white/20 text-white'
                : 'bg-neutral-100 border-black/15 text-neutral-900'
            }`}
          >
            AR
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold tracking-tight text-sm font-mono">AppRecorder</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-white/10 text-neutral-300 border-white/15'
                    : 'bg-black/5 text-neutral-700 border-black/10'
                }`}
              >
                3D STUDIO
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center URL Bar & Content Switchers (100% Direct, Zero Proxy) */}
      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSubmit} className="relative flex items-center space-x-2">
          <div className="relative flex-1 flex items-center">
            <div
              className={`absolute left-3 pointer-events-none flex items-center ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              <Globe className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter website URL (e.g. servcate.com, google.com, localhost:3000)..."
              className={`w-full h-10 pl-9 pr-24 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                isDark
                  ? 'bg-neutral-900/90 text-neutral-100 placeholder-neutral-500 border-white/10 focus:border-white/40'
                  : 'bg-white text-neutral-900 placeholder-neutral-400 border-black/10 focus:border-black/30'
              }`}
            />

            <div className="absolute right-1.5 flex items-center space-x-1">
              <button
                type="submit"
                className={`h-7 px-3 text-xs font-semibold rounded-lg transition-colors font-mono ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                Load
              </button>

              {/* Demos & Samples Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                  className={`h-7 px-2 rounded-lg flex items-center space-x-1 text-xs border ${
                    isDark
                      ? 'border-white/10 hover:bg-white/10 text-neutral-300'
                      : 'border-black/10 hover:bg-black/5 text-neutral-700'
                  }`}
                  title="Interactive Demos & Preset Websites"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showPresetsMenu && (
                  <div
                    className={`absolute right-0 top-9 w-64 rounded-xl shadow-2xl p-2 z-50 border text-xs ${
                      isDark
                        ? 'bg-neutral-900 border-white/10 text-white'
                        : 'bg-white border-black/10 text-neutral-900 shadow-xl'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider opacity-50">
                      Interactive Web Demos
                    </div>
                    {Object.entries(DEMO_TEMPLATES).map(([key, demo]) => (
                      <button
                        key={key}
                        onClick={() => handleSelectDemo(key)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                          contentType === 'demo' && selectedDemo === key
                            ? isDark
                              ? 'bg-white/15 font-semibold'
                              : 'bg-black/10 font-semibold'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-black/5'
                        }`}
                      >
                        <span>{demo.name}</span>
                        <span className="text-[10px] opacity-50">{demo.category}</span>
                      </button>
                    ))}

                    <div
                      className={`border-t my-1.5 ${
                        isDark ? 'border-white/10' : 'border-black/10'
                      }`}
                    />

                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider opacity-50">
                      Sample Live Websites
                    </div>
                    {SAMPLE_WEBSITES.map((sample) => (
                      <button
                        key={sample.url}
                        onClick={() => handleSelectSample(sample.url)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                        }`}
                      >
                        <span>{sample.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-40" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Screenshot / Image Upload Option (For any site or Figma export) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`h-10 px-3 rounded-xl border flex items-center space-x-1.5 text-xs font-mono transition-colors ${
              contentType === 'image'
                ? isDark
                  ? 'bg-white text-black font-semibold'
                  : 'bg-black text-white font-semibold'
                : isDark
                ? 'bg-neutral-900 border-white/10 text-neutral-300 hover:bg-neutral-800'
                : 'bg-white border-black/10 text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Upload app screenshot or design image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Screenshot</span>
          </button>
        </form>
      </div>

      {/* Right Controls: Theme Toggle, Gallery, Record */}
      <div className="flex items-center space-x-2">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-2 rounded-xl transition-colors ${
            isDark ? 'glass-btn-dark' : 'glass-btn-light'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun className="w-4 h-4 text-neutral-300" /> : <Moon className="w-4 h-4 text-neutral-700" />}
        </button>

        {/* Saved Videos Gallery Button */}
        <button
          onClick={onOpenGallery}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center space-x-1.5 transition-colors ${
            isDark ? 'glass-btn-dark' : 'glass-btn-light'
          }`}
          title="Local Saved Videos Vault"
        >
          <Film className="w-3.5 h-3.5 opacity-60" />
          <span className="hidden sm:inline">Vault</span>
          {savedRecordingsCount > 0 && (
            <span
              className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              {savedRecordingsCount}
            </span>
          )}
        </button>

        {/* Start / Stop Recording Button */}
        {isRecording ? (
          <button
            onClick={onStopRecordClick}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-lg shadow-red-600/30 animate-pulse transition-all"
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-white" />
            <span>Stop ({formatDuration(recordingTime)})</span>
          </button>
        ) : (
          <button
            onClick={onStartRecordClick}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDark
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <Video className="w-3.5 h-3.5" />
            <span>Record 4K</span>
          </button>
        )}
      </div>
    </header>
  );
}
