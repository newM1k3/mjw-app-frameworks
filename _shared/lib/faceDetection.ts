// faceDetection.ts
// MJW Design — Shared Library
//
// Client-side face detection using face-api.js (TensorFlow.js).
// Detects all faces in an image element, returns bounding boxes,
// landmarks, and confidence scores. No server required.
//
// Source: Harvested from mjw-time-travel-station (March 2026)
//
// Dependencies: @vladmandic/face-api
// Install: npm install @vladmandic/face-api
//         (or: pnpm add @vladmandic/face-api)
//
// Usage:
//   import { detectFaces, drawFaceDetections } from '../_shared/lib/faceDetection';
//
//   const imgEl = document.getElementById('photo') as HTMLImageElement;
//   const faces = await detectFaces(imgEl);
//   // faces[0].boundingBox, faces[0].confidence, faces[0].landmarks
//
// Notes:
//   - Models are loaded lazily on first call and cached for subsequent calls.
//   - Detection threshold auto-adjusts based on image brightness (dark images
//     use a lower threshold of 0.3 vs the default 0.5).
//   - drawFaceDetections() is a convenience helper for canvas overlays.
//     The label font and color can be customised via the optional DrawOptions param.
// ─────────────────────────────────────────────────────────────────────────────

import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

let modelsLoaded = false;

/**
 * Load face detection models from CDN (lazy, cached after first call).
 */
export async function loadFaceDetectionModels(): Promise<void> {
  if (modelsLoaded) return;
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
    modelsLoaded = true;
  } catch (error) {
    console.error('[faceDetection] Error loading models:', error);
    throw new Error('Failed to load face detection models');
  }
}

export interface DetectedFace {
  /** Zero-based index of the face in detection order */
  index: number;
  /** Bounding box in image pixel coordinates */
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** 68-point facial landmarks as [x, y] pairs */
  landmarks: Array<[number, number]>;
  /** Detection confidence score (0–1) */
  confidence: number;
}

/**
 * Detect all faces in an image element.
 * Automatically adjusts confidence threshold for dark images.
 */
export async function detectFaces(
  imageElement: HTMLImageElement
): Promise<DetectedFace[]> {
  await loadFaceDetectionModels();

  const brightness = analyzeImageBrightness(imageElement);
  const confidenceThreshold = brightness < 0.3 ? 0.3 : 0.5;

  const detections = await faceapi
    .detectAllFaces(
      imageElement,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: confidenceThreshold,
      })
    )
    .withFaceLandmarks();

  return detections.map((detection, index) => ({
    index,
    boundingBox: {
      x: detection.detection.box.x,
      y: detection.detection.box.y,
      width: detection.detection.box.width,
      height: detection.detection.box.height,
    },
    landmarks: detection.landmarks.positions.map(
      (p) => [p.x, p.y] as [number, number]
    ),
    confidence: detection.detection.score,
  }));
}

/** @internal Compute average pixel brightness (0–1) for threshold tuning */
function analyzeImageBrightness(imageElement: HTMLImageElement): number {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0.5;
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  let totalBrightness = 0;
  for (let i = 0; i < data.length; i += 4) {
    totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  return totalBrightness / (data.length / 4) / 255;
}

export interface DrawOptions {
  /** Box stroke colour (default: '#D2691E' — Leather Brown) */
  boxColor?: string;
  /** Label font (default: 'bold 20px sans-serif') */
  labelFont?: string;
  /** Confidence font (default: '14px monospace') */
  confidenceFont?: string;
}

/**
 * Draw face detection bounding boxes and labels onto a canvas element.
 * The canvas is resized to match the source image dimensions.
 */
export function drawFaceDetections(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  faces: DetectedFace[],
  options: DrawOptions = {}
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    boxColor = '#D2691E',
    labelFont = 'bold 20px sans-serif',
    confidenceFont = '14px monospace',
  } = options;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  faces.forEach((face) => {
    const { x, y, width, height } = face.boundingBox;
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = boxColor;
    ctx.font = labelFont;
    ctx.fillText(`Face ${face.index + 1}`, x, y - 10);
    ctx.font = confidenceFont;
    ctx.fillText(`${(face.confidence * 100).toFixed(0)}%`, x, y + height + 20);
  });
}
