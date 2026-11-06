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
  const calculateFitScale = (model) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      // Net vertical stage space available between 2-row navbar (~96px) and floating HUD (~56px) + margin (40px)
      const availH = Math.max(260, screenH - 192);
      const availW = Math.max(240, screenW - 32);
      const fitH = (availH * 0.86) / (model.height || 700);
      const fitW = (availW * 0.90) / (model.width || 340);
      const computed = Math.min(fitH, fitW);
      return Math.min(0.46, Math.max(0.26, +computed.toFixed(2)));
    }
    return model.defaultScale || 0.85;
  };

  const [scale, setScale] = useState(() => calculateFitScale(DEVICE_MODELS['iphone-18-pro']));
  const [showGlare, setShowGlare] = useState(true);
  const [isTurntableActive, setIsTurntableActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [isCleanStudio, setIsCleanStudio] = useState(false);

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
    setScale(calculateFitScale(currentModel));
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setScale(calculateFitScale(currentModel));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentModel]);

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
    // Mobile / Restricted browser fallback: Launch clean studio presentation mode
    if (mode === 'mobile-presentation' || !navigator?.mediaDevices?.getDisplayMedia) {
      setIsRecordingModalOpen(false);
      setSidebarOpen(false);
      setIsTurntableActive(true);
      setIsCleanStudio(true);
      return;
    }

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
        if (err.message && err.message.includes('getDisplayMedia')) {
          setIsCleanStudio(true);
          setIsTurntableActive(true);
          setIsRecordingModalOpen(false);
        } else {
          alert('Could not start screen capture: ' + (err.message || err));
        }
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
      className={`flex flex-col h-screen w-full max-w-full overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Top Navbar */}
      {!isRecording && !isCleanStudio && (
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

      {/* Floating Exit Button for Clean Studio Mode */}
      {isCleanStudio && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
          <button
            onClick={() => setIsCleanStudio(false)}
            className="px-3.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/20 shadow-2xl flex items-center space-x-2 text-xs font-mono backdrop-blur-md transition-all active:scale-95"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Exit Studio Mode</span>
          </button>
        </div>
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
          isOpen={sidebarOpen && !isRecording && !isCleanStudio}
          onClose={() => setSidebarOpen(false)}
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
            isCleanStudio={isCleanStudio}
            handConfig={handConfig}
            calculateFitScale={() => calculateFitScale(currentModel)}
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
