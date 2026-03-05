import * as THREE from 'three';
import type { CountryFeature } from './geoData';

const MASK_WIDTH = 2048;
const MASK_HEIGHT = 1024;

function lngToX(lng: number): number {
  return ((lng + 180) / 360) * MASK_WIDTH;
}

function latToY(lat: number): number {
  return ((90 - lat) / 180) * MASK_HEIGHT;
}

function drawPolygonRing(ctx: CanvasRenderingContext2D, ring: number[][]) {
  if (ring.length === 0) return;
  ctx.moveTo(lngToX(ring[0][0]), latToY(ring[0][1]));
  for (let i = 1; i < ring.length; i++) {
    ctx.lineTo(lngToX(ring[i][0]), latToY(ring[i][1]));
  }
  ctx.closePath();
}

export function generateVisitedMask(features: CountryFeature[]): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = MASK_WIDTH;
  canvas.height = MASK_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, MASK_WIDTH, MASK_HEIGHT);

  ctx.fillStyle = '#ffffff';

  for (const feature of features) {
    const { geometry } = feature;
    ctx.beginPath();

    if (geometry.type === 'Polygon') {
      for (const ring of geometry.coordinates) {
        drawPolygonRing(ctx, ring);
      }
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        for (const ring of polygon) {
          drawPolygonRing(ctx, ring);
        }
      }
    }

    ctx.fill('evenodd');
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
