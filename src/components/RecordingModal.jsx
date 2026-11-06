import React, { useState } from 'react';
import {
  X,
  Video,
  Download,
  RotateCcw,
  Check,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { VIDEO_RESOLUTIONS } from '../data/devicePresets';

export default function RecordingModal({
  isOpen,
  onClose,
  onStartRecord,
  isRecording,
  recordingTime,
  onStopRecord,
  recordedVideo,
  onDownloadVideo,
  onResetRecording,
  theme = 'dark',
}) {
  const [selectedResId, setSelectedResId] = useState('4k');
  const [fps, setFps] = useState(60);
  const [recordMode, setRecordMode] = useState('live');

  if (!isOpen) return null;

  const currentRes =
    VIDEO_RESOLUTIONS.find((r) => r.id === selectedResId) || VIDEO_RESOLUTIONS[0];

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleStart = () => {
    onStartRecord({
      resolution: currentRes.id,
      fps,
      bitrate: currentRes.bitrate,
      mode: recordMode,
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none">
      <div
        className={`relative w-full max-w-xl rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? 'glass-panel-dark border-white/10 text-white'
            : 'glass-panel-light border-black/10 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
              <Video className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold">4K Studio Recorder</h2>
              <p className="text-[11px] opacity-50">Browser native &bull; Local offline encoding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border ${
              isDark
                ? 'border-white/10 hover:bg-white/10 text-neutral-400'
                : 'border-black/10 hover:bg-black/5 text-neutral-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STATE A: RECORDED VIDEO PREVIEW & EXPORT */}
        {recordedVideo ? (
          <div className="py-4 space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-black border border-white/10 aspect-video flex items-center justify-center">
              <video
                src={recordedVideo.url}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Metadata Bar */}
            <div
              className={`grid grid-cols-3 gap-2 py-2 px-3 rounded-xl border text-center ${
                isDark
                  ? 'bg-black/40 border-white/10'
                  : 'bg-neutral-100 border-black/10'
              }`}
            >
              <div>
                <div className="text-[10px] uppercase font-bold opacity-50">Resolution</div>
                <div className="text-xs font-bold mt-0.5">
                  {recordedVideo.resolutionBadge || '4K UHD'}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold opacity-50">Duration</div>
                <div className="text-xs font-bold mt-0.5">
                  {formatDuration(recordedVideo.duration)}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold opacity-50">Size</div>
                <div className="text-xs font-bold mt-0.5">
                  {formatFileSize(recordedVideo.sizeBytes)}
                </div>
              </div>
            </div>

            <div
              className={`flex items-center space-x-2 text-xs p-2.5 rounded-xl border ${
                isDark
                  ? 'bg-white/5 border-white/10 text-neutral-300'
                  : 'bg-black/5 border-black/10 text-neutral-700'
              }`}
            >
              <Check className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Saved locally to browser IndexedDB. Ready for download.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={onResetRecording}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 ${
                  isDark
                    ? 'border-white/10 hover:bg-white/10 text-neutral-300'
                    : 'border-black/10 hover:bg-black/5 text-neutral-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Record Another</span>
              </button>

              <button
                onClick={onDownloadVideo}
                className={`flex-[2] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
                  isDark
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Video</span>
              </button>
            </div>
          </div>
        ) : isRecording ? (
          /* STATE B: RECORDING IN PROGRESS */
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-red-600/20 animate-ping absolute" />
              <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-red-400/50 flex items-center justify-center shadow-xl shadow-red-600/40">
                <Video className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-wider">
                {formatDuration(recordingTime)}
              </div>
              <div className="text-xs opacity-50 mt-1 flex items-center justify-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Recording {currentRes.badge} @ {fps}fps</span>
              </div>
            </div>

            <div className="w-full pt-4">
              <button
                onClick={onStopRecord}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-red-600/40 transition-all"
              >
                <div className="w-3 h-3 rounded-sm bg-white" />
                <span>Stop & Generate Video</span>
              </button>
            </div>
          </div>
        ) : (
          /* STATE C: SETUP & RESOLUTION SELECTION */
          <div className="py-4 space-y-4 text-xs">
            {/* Resolution */}
            <div>
              <label className="font-bold uppercase tracking-wider block mb-2 opacity-50 text-[10px]">
                Output Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {VIDEO_RESOLUTIONS.map((res) => {
                  const isSelected = selectedResId === res.id;
                  return (
                    <button
                      key={res.id}
                      onClick={() => setSelectedResId(res.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? isDark
                            ? 'border-white bg-white/10 font-bold'
                            : 'border-black bg-black/5 font-bold'
                          : isDark
                          ? 'border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100 hover:bg-white/5'
                          : 'border-black/5 bg-black/[0.02] opacity-60 hover:opacity-100 hover:bg-black/5'
                      }`}
                    >
                      <div className="font-bold text-xs">{res.label}</div>
                      <div className="text-[10px] opacity-40 mt-0.5">{res.badge}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frame Rate */}
            <div>
              <label className="font-bold uppercase tracking-wider block mb-2 opacity-50 text-[10px]">
                Frame Rate
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFps(60)}
                  className={`p-2 rounded-xl text-center border font-semibold transition-all ${
                    fps === 60
                      ? isDark
                        ? 'border-white bg-white/10 font-bold'
                        : 'border-black bg-black/5 font-bold'
                      : isDark
                      ? 'border-white/5 opacity-60 hover:opacity-100'
                      : 'border-black/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  60 FPS (Ultra Smooth)
                </button>
                <button
                  onClick={() => setFps(30)}
                  className={`p-2 rounded-xl text-center border font-semibold transition-all ${
                    fps === 30
                      ? isDark
                        ? 'border-white bg-white/10 font-bold'
                        : 'border-black bg-black/5 font-bold'
                      : isDark
                      ? 'border-white/5 opacity-60 hover:opacity-100'
                      : 'border-black/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  30 FPS (Standard)
                </button>
              </div>
            </div>

            {/* Recording Mode */}
            <div>
              <label className="font-bold uppercase tracking-wider block mb-2 opacity-50 text-[10px]">
                Recording Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRecordMode('live')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    recordMode === 'live'
                      ? isDark
                        ? 'border-white bg-white/10 font-bold'
                        : 'border-black bg-black/5 font-bold'
                      : isDark
                      ? 'border-white/5 opacity-60 hover:opacity-100'
                      : 'border-black/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Interactive 3D Stage</span>
                  </div>
                  <div className="text-[10px] opacity-40 mt-1">
                    Record live mouse rotates, clicks, and page scrolls.
                  </div>
                </button>

                <button
                  onClick={() => setRecordMode('tour')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    recordMode === 'tour'
                      ? isDark
                        ? 'border-white bg-white/10 font-bold'
                        : 'border-black bg-black/5 font-bold'
                      : isDark
                      ? 'border-white/5 opacity-60 hover:opacity-100'
                      : 'border-black/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3D Auto Turntable</span>
                  </div>
                  <div className="text-[10px] opacity-40 mt-1">
                    Auto-spins the 3D model for product commercial showcase.
                  </div>
                </button>
              </div>
            </div>

            {/* Storage Info */}
            <div
              className={`flex items-center space-x-2 text-[11px] p-2.5 rounded-xl border ${
                isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 opacity-50 shrink-0" />
              <span className="opacity-70">
                Encoded locally inside your browser and stored in IndexedDB.
              </span>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.01]"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                <span>Start 4K / HD Record</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
