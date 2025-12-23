import * as THREE from 'three';

export const getPineTreePoint = (t: number, angle: number, radiusOffset: number): THREE.Vector3 => {
  const height = 16; 
  const y = t * height; 
  
  let baseR = (t < 0.1) ? 6.5 + (t / 0.1) * 2.5 : 9.0 * (1 - t);
  const layerWave = Math.sin(t * 25.0) * 0.8 * (1 - t); 
  
  let r = baseR + layerWave + radiusOffset; 
  if (r < 0) r = 0;
  
  const x = r * Math.cos(angle); 
  const z = r * Math.sin(angle);
  
  return new THREE.Vector3(x, y - height / 2 + 1.5, z);
};

export const createStarShape = (size = 0.5): THREE.Shape => {
  const s = new THREE.Shape(); 
  const points = 5;
  for (let i = 0; i < points * 2; i++) {
    const l = i % 2 === 1 ? size * 0.4 : size; 
    const a = (i / points) * Math.PI;
    const x = Math.sin(a) * l; 
    const y = Math.cos(a) * l; 
    if (i === 0) s.moveTo(x, y); 
    else s.lineTo(x, y);
  }
  s.closePath(); 
  return s;
};

export function createDefaultTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas'); 
  canvas.width = 512; 
  canvas.height = 512; 
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = '#fff'; 
    ctx.fillRect(0,0,512,512); 
    ctx.fillStyle = '#f5f5f5'; 
    ctx.fillRect(40,40,432,380);
    ctx.font = '40px Serif'; 
    ctx.fillStyle = '#ccc'; 
    ctx.textAlign = 'center'; 
    ctx.fillText("PHOTO", 256, 250);
  }
  
  return new THREE.CanvasTexture(canvas);
}