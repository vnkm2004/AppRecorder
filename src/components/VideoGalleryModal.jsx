import React from 'react';
import {
  X,
  Film,
  Download,
  Trash2,
  HardDrive,
  Calendar,
  Clock,
} from 'lucide-react';

export default function VideoGalleryModal({
  isOpen,
  onClose,
  recordings = [],
  onDownloadItem,
  onDeleteItem,
  theme = 'dark',
}) {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

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

  const formatDate = (ts) => {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono select-none">
      <div
        className={`relative w-full max-w-3xl rounded-2xl border p-6 shadow-2xl max-h-[85vh] flex flex-col ${
          isDark
            ? 'glass-panel-dark border-white/10 text-white'
            : 'glass-panel-light border-black/10 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b shrink-0 ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isDark ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/15'
              }`}
            >
              <Film className="w-4 h-4 opacity-70" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Local Video Vault</h2>
              <p className="text-[11px] opacity-50">
                IndexedDB &bull; {recordings.length} saved video{recordings.length === 1 ? '' : 's'}
              </p>
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

        {/* Content Body */}
        <div className="py-4 overflow-y-auto flex-1">
          {recordings.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center opacity-60">
              <div
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-3 ${
                  isDark ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
                }`}
              >
                <Film className="w-6 h-6 opacity-40" />
              </div>
              <h3 className="text-xs font-semibold">No recordings yet</h3>
              <p className="text-[11px] max-w-sm mt-1 opacity-50">
                Click &ldquo;Record 4K&rdquo; in the top bar to record high-resolution videos of your 3D website mockups.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recordings.map((rec) => {
                const videoUrl = URL.createObjectURL(rec.blob);
                return (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-3 transition-colors ${
                      isDark
                        ? 'bg-white/[0.02] border-white/10 hover:border-white/30'
                        : 'bg-black/[0.02] border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/5">
                      <video
                        src={videoUrl}
                        controls
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold truncate max-w-[180px]">
                          {rec.name}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                            isDark
                              ? 'bg-white/10 border-white/20'
                              : 'bg-black/10 border-black/20'
                          }`}
                        >
                          {rec.resolution.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-[10px] opacity-60">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(rec.duration)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{formatFileSize(rec.sizeBytes)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(rec.timestamp)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1 border-t border-white/5">
                      <button
                        onClick={() => onDownloadItem(rec)}
                        className={`flex-1 py-1.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 border transition-colors ${
                          isDark
                            ? 'bg-white text-black hover:bg-neutral-200 border-white'
                            : 'bg-black text-white hover:bg-neutral-800 border-black'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => onDeleteItem(rec.id)}
                        className={`p-1.5 rounded-lg border text-red-500 hover:bg-red-500/10 transition-colors ${
                          isDark ? 'border-white/10' : 'border-black/10'
                        }`}
                        title="Delete recording"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`pt-3 border-t flex items-center justify-between text-[11px] opacity-50 shrink-0 ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Files stored locally in your browser storage</span>
          </div>
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded-lg border ${
              isDark ? 'border-white/10 hover:bg-white/10' : 'border-black/10 hover:bg-black/5'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
