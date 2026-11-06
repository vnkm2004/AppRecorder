import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SidebarControls from './components/SidebarControls';
import DeviceStage from './components/DeviceStage';
import RecordingModal from './components/RecordingModal';
import VideoGalleryModal from './components/VideoGalleryModal';
import {
  DEVICE_MODELS,
  FINISH_MATERIALS,
  VIEW_ANGLES,
  STAGE_BACKGROUNDS,
  VIDEO_RESOLUTIONS,
} from './data/devicePresets';
import { DEMO_TEMPLATES } from './data/sampleWebsites';
import { StudioRecorder } from './utils/recorder';
import {
  saveRecording,
  getAllRecordings,
  deleteRecording,
  saveFavoriteUrl,
} from './utils/storage';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('apprecorder_theme') || 'dark';
  });

  const [selectedCategory, setSelectedCategory] = useState('mobile');
  const [selectedModelId, setSelectedModelId] = useState('iphone-18-pro');
  const [selectedMaterialId, setSelectedMaterialId] = useState('space-black');
  const [selectedAngleId, setSelectedAngleId] = useState('iso-left');
  const [selectedBgId, setSelectedBgId] = useState(() =>
    theme === 'light' ? 'light-studio' : 'dark-studio'
  );
  const [scale, setScale] = useState(0.85);
  const [showGlare, setShowGlare] = useState(true);
  const [isTurntableActive, setIsTurntableActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [handConfig, setHandConfig] = useState({
    enabled: false,
    gender: 'male',
    skinTone: 'honey',
    pose: 'auto',
  });

  const [contentUrl, setContentUrl] = useState('https://servcate.com');
  const [contentType, setContentType] = useState('url');
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState('saas');

  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [savedRecordings, setSavedRecordings] = useState([]);

  const stageRef = useRef(null);
  const recorderRef = useRef(null);
  const activeTourTimeoutRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('apprecorder_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // When switching theme, automatically switch stage background
  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'light') {
      setSelectedBgId('light-studio'); // Shaded White Studio backdrop
    } else {
      setSelectedBgId('dark-studio');
    }
  };

  // Hide cursor globally during active recording & handle Escape key
  useEffect(() => {
    if (isRecording) {
      document.body.classList.add('recording-active');
    } else {
      document.body.classList.remove('recording-active');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isRecording) {
        handleStopRecord();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording]);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const currentModel = DEVICE_MODELS[selectedModelId] || DEVICE_MODELS['iphone-18-pro'];
  const currentMaterial =
    FINISH_MATERIALS.find((m) => m.id === selectedMaterialId) || FINISH_MATERIALS[0];
  const currentAngle =
    VIEW_ANGLES.find((a) => a.id === selectedAngleId) || VIEW_ANGLES[0];
  const currentBg =
    STAGE_BACKGROUNDS.find((b) => b.id === selectedBgId) || STAGE_BACKGROUNDS[0];

  useEffect(() => {
    if (currentModel.defaultScale) {
      setScale(currentModel.defaultScale);
    }
  }, [currentModel.id]);

  useEffect(() => {
    async function loadRecordings() {
      const items = await getAllRecordings();
      setSavedRecordings(items);
    }
    loadRecordings();
  }, []);

  useEffect(() => {
    recorderRef.current = new StudioRecorder({
      onStateChange: ({ isRecording, elapsedSeconds }) => {
        setIsRecording(isRecording);
        setRecordingTime(elapsedSeconds);
      },
      onDataAvailable: async ({ blob, duration, mimeType }) => {
        const videoUrl = URL.createObjectURL(blob);
        const resObj =
          VIDEO_RESOLUTIONS.find((r) => r.id === recorderRef.current?.selectedRes) ||
          VIDEO_RESOLUTIONS[0];

        const videoData = {
          blob,
          url: videoUrl,
          duration,
          sizeBytes: blob.size,
          resolution: resObj.id,
          resolutionBadge: resObj.badge,
        };
        setRecordedVideo(videoData);

        await saveRecording({
          blob,
          metadata: {
            duration,
            resolution: resObj.label,
            deviceModel: currentModel.name,
          },
        });

        const updated = await getAllRecordings();
        setSavedRecordings(updated);
        setIsRecordingModalOpen(true);
      },
    });

    return () => {
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
      if (activeTourTimeoutRef.current) {
        clearTimeout(activeTourTimeoutRef.current);
      }
    };
  }, [currentModel.name]);

  const handleUrlChange = (newUrl) => {
    setContentUrl(newUrl);
    saveFavoriteUrl(newUrl);
  };

  const handleStartRecord = async ({ resolution, fps, bitrate, mode }) => {
    if (!recorderRef.current) return;
    recorderRef.current.selectedRes = resolution;

    try {
      // 1. Immediately close the modal so it completely disappears before capture starts
      setIsRecordingModalOpen(false);
      // 2. Hide sidebar to maximize pristine device stage space
      setSidebarOpen(false);

      // 3. Short delay to ensure modal unmount and UI transitions are 100% complete
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (mode === 'tour') {
        setIsTurntableActive(true);
      }

      await recorderRef.current.startDisplayCapture({
        resolution,
        fps,
        bitrate,
      });

      if (mode === 'tour') {
        activeTourTimeoutRef.current = setTimeout(() => {
          handleStopRecord();
        }, 12000);
      }
    } catch (err) {
      console.error('Failed to start recording stream:', err);
      setIsRecordingModalOpen(true);
      if (err.name !== 'NotAllowedError') {
        alert('Could not start screen capture: ' + (err.message || err));
      }
    }
  };

  const handleStopRecord = () => {
    if (activeTourTimeoutRef.current) {
      clearTimeout(activeTourTimeoutRef.current);
    }
    if (recorderRef.current) {
      recorderRef.current.stop();
    }
  };

  const handleDownloadVideo = (videoObj = recordedVideo) => {
    if (!videoObj || !videoObj.blob) return;
    const url = videoObj.url || URL.createObjectURL(videoObj.blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const modelTag = (videoObj.deviceModel || currentModel.name).replace(/\s+/g, '-');
    const resTag = (videoObj.resolutionBadge || videoObj.resolution || '4K').replace(/\s+/g, '-');
    a.download = `AppRecorder-3D-${modelTag}-${resTag}-${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      if (!videoObj.url) {
        URL.revokeObjectURL(url);
      }
    }, 150);
  };

  const handleDeleteItem = async (id) => {
    await deleteRecording(id);
    const updated = await getAllRecordings();
    setSavedRecordings(updated);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Top Navbar - Completely hidden during recording for pure device & website recording */}
      {!isRecording && (
        <Navbar
          contentUrl={contentUrl}
          setUrl={handleUrlChange}
          contentType={contentType}
          setContentType={setContentType}
          selectedDemo={selectedDemo}
          setSelectedDemo={setSelectedDemo}
          onImageSelected={setImageSrc}
          isRecording={isRecording}
          recordingTime={recordingTime}
          onStartRecordClick={() => {
            setRecordedVideo(null);
            setIsRecordingModalOpen(true);
          }}
          onStopRecordClick={handleStopRecord}
          onOpenGallery={() => setIsGalleryModalOpen(true)}
          savedRecordingsCount={savedRecordings.length}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          theme={theme}
          setTheme={handleSetTheme}
        />
      )}

      {/* Floating Stop Pill during Active Recording */}
      {isRecording && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          <button
            onClick={handleStopRecord}
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center space-x-2 shadow-2xl animate-pulse transition-all select-none"
            title="Click or press Esc to Stop Recording"
          >
            <div className="w-2.5 h-2.5 rounded-sm bg-white" />
            <span>Stop Recording ({formatDuration(recordingTime)})</span>
            <span className="opacity-60 text-[10px] hidden sm:inline">[Esc]</span>
          </button>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <SidebarControls
          isOpen={sidebarOpen && !isRecording}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          selectedMaterialId={selectedMaterialId}
          setSelectedMaterialId={setSelectedMaterialId}
          selectedAngleId={selectedAngleId}
          setSelectedAngleId={setSelectedAngleId}
          selectedBgId={selectedBgId}
          setSelectedBgId={setSelectedBgId}
          showGlare={showGlare}
          setShowGlare={setShowGlare}
          isTurntableActive={isTurntableActive}
          setIsTurntableActive={setIsTurntableActive}
          theme={theme}
          handConfig={handConfig}
          setHandConfig={setHandConfig}
        />

        {/* 3D Device Stage */}
        <main className="flex-1 relative h-full flex flex-col overflow-hidden">
          <DeviceStage
            deviceModel={currentModel}
            finishMaterial={currentMaterial}
            viewAngle={currentAngle}
            onResetAngle={() => setSelectedAngleId('front')}
            stageBg={currentBg}
            contentUrl={contentUrl}
            contentType={contentType}
            imageSrc={imageSrc}
            demoHtml={DEMO_TEMPLATES[selectedDemo]?.html || ''}
            scale={scale}
            setScale={setScale}
            showGlare={showGlare}
            setShowGlare={setShowGlare}
            isTurntableActive={isTurntableActive}
            setIsTurntableActive={setIsTurntableActive}
            stageRef={stageRef}
            theme={theme}
            isRecording={isRecording}
            handConfig={handConfig}
          />
        </main>
      </div>

      {/* 4K Video Recording Modal */}
      <RecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onStartRecord={handleStartRecord}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onStopRecord={handleStopRecord}
        recordedVideo={recordedVideo}
        onDownloadVideo={() => handleDownloadVideo(recordedVideo)}
        onResetRecording={() => setRecordedVideo(null)}
        theme={theme}
      />

      {/* Local Video Vault Modal */}
      <VideoGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        recordings={savedRecordings}
        onDownloadItem={handleDownloadVideo}
        onDeleteItem={handleDeleteItem}
        theme={theme}
      />
    </div>
  );
}
