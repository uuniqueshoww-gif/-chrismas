import { ThemeColors } from './types';

export const THEME: ThemeColors = {
  bodyColor: '#003318',    // Dark Green Tree
  lightColor: '#FFD700',   // Gold Lights
  heavyColor: '#8a0a0a',   // Red Ornaments
  starBodyColor: '#FFD700',// Star Gold
  gemAColor: '#00FF41',    // Green Gem
  gemBColor: '#FF3333',    // Red Gem
  snowColor: '#ffffff'     // Snow White
};

export const SNOW_VERTEX_SHADER = `
  uniform float uTime; 
  attribute float aScale; 
  attribute vec3 aRandomness; 
  varying float vAlpha;
  
  void main() {
    vec3 pos = position;
    float fallSpeed = 3.0 + aRandomness.y * 2.0;
    
    // Fall animation
    pos.y -= uTime * fallSpeed; 
    pos.y = mod(pos.y + 35.0, 70.0) - 35.0;
    
    // Wind effect
    float windStrength = 2.0; 
    float windVariance = sin(uTime * 0.5 + pos.y * 0.1);
    pos.x += (uTime * windStrength) + (windVariance * 2.0); 
    pos.x = mod(pos.x + 40.0, 80.0) - 40.0;
    
    // Z-axis movement
    pos.z += sin(uTime * 0.8 + pos.y * 0.2) * 1.5; 
    pos += aRandomness * 2.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); 
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    float size = aScale * (250.0 / -mvPosition.z); 
    gl_PointSize = clamp(size, 2.0, 12.0);
    
    // Twinkle alpha
    vAlpha = 0.6 + 0.4 * sin(uTime * 2.0 + aRandomness.x * 100.0);
  }
`;

export const SNOW_FRAGMENT_SHADER = `
  varying float vAlpha; 
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5); 
    float dist = length(c);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist); 
    if(alpha < 0.01) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * alpha); 
  }
`;