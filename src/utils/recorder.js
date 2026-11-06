import fixWebmDuration from 'fix-webm-duration';

// High-Fidelity 4K & HD Video Recording Engine using MediaRecorder API
// Pure client-side, zero database, zero external tracking

export class StudioRecorder {
  constructor({ onStateChange, onDataAvailable }) {
    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
    this.startTime = 0;
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.onStateChange = onStateChange || (() => {});
    this.onDataAvailable = onDataAvailable || (() => {});
    this.isRecording = false;
  }

  getBestMimeType() {
    const candidateTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4;codecs=avc1',
      'video/mp4',
    ];

    for (const type of candidateTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }

  // Start display/tab stream recording for true 4K / HD native quality
  async startDisplayCapture({ resolution = '4k', fps = 60, bitrate = 45000000 }) {
    if (this.isRecording) return;
    this.selectedRes = resolution;

    let targetWidth = 3840;
    let targetHeight = 2160;

    if (resolution === '4k') {
      targetWidth = 3840;
      targetHeight = 2160;
    } else if (resolution === '2k') {
      targetWidth = 2560;
      targetHeight = 1440;
    } else if (resolution === '1080p') {
      targetWidth = 1920;
      targetHeight = 1080;
    } else if (resolution === 'vertical-reel') {
      targetWidth = 1080;
      targetHeight = 1920;
    } else if (resolution === 'square') {
      targetWidth = 1080;
      targetHeight = 1080;
    }

    try {
      // Request high-resolution capture with cursor: 'never' to eliminate mouse pointer from video
      const displayMediaOptions = {
        video: {
          width: { ideal: targetWidth, max: 3840 },
          height: { ideal: targetHeight, max: 2160 },
          frameRate: { ideal: fps, max: 60 },
          displaySurface: 'browser',
          cursor: 'never', // Native browser flag: Hides mouse pointer in recorded video
        },
        audio: false,
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        surfaceSwitching: 'include',
        systemAudio: 'exclude',
      };

      try {
        this.stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      } catch (advancedErr) {
        console.warn('Advanced display constraints failed, trying standard high-res fallback:', advancedErr);
        this.stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: targetWidth },
            height: { ideal: targetHeight },
            frameRate: { ideal: fps },
          },
          audio: false,
        });
      }

      const videoTrack = this.stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          if (this.isRecording) {
            this.stop();
          }
        };

        // Region Capture: Crop recording strictly to the device with surrounding ~0.5cm studio margin
        const tightBox = document.getElementById('tight-device-capture-box');
        const stageEl = document.getElementById('device-mockup-stage');
        const targetEl = tightBox || stageEl;

        if (
          targetEl &&
          window.CropTarget &&
          typeof window.CropTarget.fromElement === 'function' &&
          typeof videoTrack.cropTo === 'function'
        ) {
          try {
            const cropTarget = await window.CropTarget.fromElement(targetEl);
            await videoTrack.cropTo(cropTarget);
          } catch (cropErr) {
            console.warn('Region capture cropTo note:', cropErr);
          }
        }
      }

      const mimeType = this.getBestMimeType();
      let mediaRecorder = null;
      try {
        mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: mimeType || undefined,
          videoBitsPerSecond: bitrate || 45000000,
        });
      } catch (err1) {
        console.warn('High bitrate initialization failed, using standard bitrate:', err1);
        try {
          mediaRecorder = new MediaRecorder(this.stream, {
            mimeType: mimeType || undefined,
          });
        } catch (err2) {
          mediaRecorder = new MediaRecorder(this.stream);
        }
      }

      this.mediaRecorder = mediaRecorder;
      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const recordedMimeType = this.mediaRecorder?.mimeType || mimeType || 'video/webm';
        const rawBlob = new Blob(this.chunks, {
          type: recordedMimeType,
        });
        const durationSec = Math.max(1, this.elapsedSeconds || Math.round((Date.now() - this.startTime) / 1000));
        const durationMs = Math.max(1000, Date.now() - this.startTime);

        let finalBlob = rawBlob;
        try {
          if (recordedMimeType.includes('webm')) {
            finalBlob = await fixWebmDuration(rawBlob, durationMs);
          }
        } catch (patchErr) {
          console.warn('Could not patch WebM duration header:', patchErr);
        }

        this.cleanup();
        this.onDataAvailable({
          blob: finalBlob,
          duration: durationSec,
          mimeType: recordedMimeType,
        });
      };

      this.mediaRecorder.start(1000);
      this.isRecording = true;
      this.startTime = Date.now();
      this.elapsedSeconds = 0;

      this.timerInterval = setInterval(() => {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        this.onStateChange({
          isRecording: true,
          elapsedSeconds: this.elapsedSeconds,
        });
      }, 500);

      this.onStateChange({
        isRecording: true,
        elapsedSeconds: 0,
      });

      return true;
    } catch (err) {
      this.cleanup();
      throw err;
    }
  }

  stop() {
    if (!this.isRecording || !this.mediaRecorder) return;
    try {
      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    } catch (e) {
      console.error('Error stopping recorder:', e);
    }
  }

  cancel() {
    this.cleanup();
    this.chunks = [];
    this.onStateChange({
      isRecording: false,
      elapsedSeconds: 0,
    });
  }

  cleanup() {
    this.isRecording = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.onStateChange({
      isRecording: false,
      elapsedSeconds: this.elapsedSeconds,
    });
  }
}
