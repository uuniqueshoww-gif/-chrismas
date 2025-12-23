export enum GestureType {
  NONE = 'NONE',
  FIST = 'FIST',
  OPEN = 'OPEN',
  VICTORY = 'VICTORY',
  POINT = 'POINT'
}

export interface GestureData {
  type: GestureType;
  x: number;
  y: number;
}

export interface ThemeColors {
  bodyColor: string;
  lightColor: string;
  heavyColor: string;
  starBodyColor: string;
  gemAColor: string;
  gemBColor: string;
  snowColor: string;
}

// Global window extensions for MediaPipe
declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
  }
}