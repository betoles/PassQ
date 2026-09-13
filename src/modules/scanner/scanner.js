/**
 * PassQ Real Optical Camera Scanner Engine (High-Efficiency, 0-Leak)
 * Features:
 * - Direct camera stream via WebRTC getUserMedia (Rear / Environment camera)
 * - Native Hardware-Accelerated BarcodeDetector with frame throttling (18-20 FPS max)
 * - Auto-cleanup on visibilitychange / backgrounding
 * - Web Audio API synthesized confirmation chime (Auto-closed context, zero leak)
 * - Native Haptic Vibration feedback
 * - Torch / Flashlight toggle
 * - Gallery Image upload scanner fallback
 */

import { GS1Formatter } from '../compliance/gs1.js';
import { i18n } from '../../core/i18n/i18n.js';

export class CameraScanner {
  constructor(onScanSuccess) {
    this.onScanSuccess = onScanSuccess;
    this.videoStream = null;
    this.videoElement = null;
    this.isScanning = false;
    this.torchActive = false;
    this.lastFrameTime = 0;
    this.frameInterval = 1000 / 18; // Throttle to 18 FPS for battery & CPU safety
    this.hasBarcodeDetector = 'BarcodeDetector' in window;
    this.barcodeDetector = null;
    this.animationFrameId = null;

    if (this.hasBarcodeDetector) {
      try {
        this.barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code', 'data_matrix', 'ean_13'] });
      } catch (e) {
        this.hasBarcodeDetector = false;
      }
    }

    // Auto-cleanup on tab switch or app backgrounding
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isScanning) {
        this.stop();
      }
    });
  }

  init(modalId = 'camera-scanner-modal') {
    this.modal = document.getElementById(modalId);
    this.videoElement = document.getElementById('scanner-video');

    document.getElementById('btn-close-scanner')?.addEventListener('click', () => this.stop());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.stop();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isScanning) this.stop();
    });
    document.getElementById('btn-toggle-torch')?.addEventListener('click', () => this.toggleTorch());
    document.getElementById('scanner-file-input')?.addEventListener('change', (e) => this.handleFileUpload(e));
  }

  async start() {
    this.modal?.classList.remove('hidden');
    this.isScanning = true;
    this.lastFrameTime = performance.now();

    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      };

      this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (this.videoElement) {
        this.videoElement.srcObject = this.videoStream;
        await this.videoElement.play();
        this.scanLoop(performance.now());
      }
    } catch (err) {
      console.warn('PassQ: Camera access denied or unavailable:', err);
      const errorMsg = document.getElementById('scanner-error-msg');
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
        errorMsg.textContent = i18n.t('passport:scanner.perm_error', 'Permiso de cámara no concedido. Puedes subir una foto con el código QR.');
      }
    }
  }

  stop() {
    this.isScanning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.videoStream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.modal?.classList.add('hidden');
    this.torchActive = false;
  }

  async toggleTorch() {
    if (!this.videoStream) return;
    const track = this.videoStream.getVideoTracks()[0];
    if (!track) return;

    const capabilities = track.getCapabilities?.() || {};
    if (capabilities.torch) {
      this.torchActive = !this.torchActive;
      try {
        await track.applyConstraints({ advanced: [{ torch: this.torchActive }] });
        const torchBtn = document.getElementById('btn-toggle-torch');
        if (torchBtn) {
          torchBtn.classList.toggle('bg-amber-500', this.torchActive);
        }
      } catch {}
    }
  }

  async scanLoop(timestamp) {
    if (!this.isScanning || !this.videoElement) return;

    // Frame rate throttler (18 FPS)
    if (timestamp - this.lastFrameTime >= this.frameInterval) {
      this.lastFrameTime = timestamp;

      if (this.videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        if (this.hasBarcodeDetector && this.barcodeDetector) {
          try {
            const barcodes = await this.barcodeDetector.detect(this.videoElement);
            if (barcodes && barcodes.length > 0) {
              this.triggerSuccess(barcodes[0].rawValue);
              return;
            }
          } catch {}
        }
      }
    }

    if (this.isScanning) {
      this.animationFrameId = requestAnimationFrame((ts) => this.scanLoop(ts));
    }
  }

  handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        if (this.hasBarcodeDetector && this.barcodeDetector) {
          try {
            const barcodes = await this.barcodeDetector.detect(img);
            if (barcodes && barcodes.length > 0) {
              this.triggerSuccess(barcodes[0].rawValue);
              return;
            }
          } catch (err) {
            console.error(err);
          }
        }
        alert(i18n.t('passport:scanner.no_qr_found', 'No se detectó un código QR válido en la imagen seleccionada.'));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  triggerSuccess(rawValue) {
    this.playSuccessFeedback();
    this.stop();
    if (this.onScanSuccess) {
      const parsed = GS1Formatter.parseScannedCode(rawValue);
      this.onScanSuccess(parsed ? parsed.url : rawValue, parsed);
    }
  }

  playSuccessFeedback() {
    // 1. Native Haptic Vibration
    if (navigator.vibrate) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch {}
    }

    // 2. Pure Web Audio API synthesized confirmation chime (Zero-leak auto-closed AudioContext)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);

        // Auto-close audio context to prevent iOS Safari memory cap limits
        setTimeout(() => {
          try {
            ctx.close();
          } catch {}
        }, 300);
      }
    } catch {}
  }
}
