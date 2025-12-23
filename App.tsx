import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { GestureController } from './components/GestureController';
import { GestureData, GestureType } from './types';

const App: React.FC = () => {
  const [isFormed, setIsFormed] = useState(false);
  const [isLightsOff, setIsLightsOff] = useState(false);
  const [userTextures, setUserTextures] = useState<THREE.Texture[]>([]);
  const [showMagic, setShowMagic] = useState(false);
  
  // Ref to OrbitControls to manipulate camera via gestures
  const controlsRef = useRef<any>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newTextures: THREE.Texture[] = [];
      const loader = new THREE.TextureLoader();
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file as Blob);
        loader.load(url, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          newTextures.push(tex);
          // Update state only when all selected files are processed (simple batching)
          if (newTextures.length === files.length) {
            setUserTextures(prev => [...prev, ...newTextures]);
          }
        });
      });
    }
  };

  const handleGestureUpdate = (data: GestureData) => {
    if (data.type === GestureType.FIST) setIsFormed(true);
    if (data.type === GestureType.OPEN) setIsFormed(false);
    
    // Toggle lights with victory sign (simple debounce logic could be added in production)
    if (data.type === GestureType.VICTORY) {
      setIsLightsOff(true);
    } else if (data.type !== GestureType.NONE) {
      setIsLightsOff(false);
    }

    // Camera control logic
    if (data.type === GestureType.POINT && controlsRef.current) {
      const controls = controlsRef.current;
      const sensitivity = 0.1;
      
      // Horizontal rotation
      if (data.x < 0.4) controls.setAzimuthalAngle(controls.getAzimuthalAngle() + sensitivity);
      else if (data.x > 0.6) controls.setAzimuthalAngle(controls.getAzimuthalAngle() - sensitivity);
      
      // Vertical rotation
      if (data.y < 0.3) controls.setPolarAngle(Math.max(0.1, controls.getPolarAngle() - sensitivity));
      else if (data.y > 0.7) controls.setPolarAngle(Math.min(Math.PI / 2, controls.getPolarAngle() + sensitivity));
    }
  };

  return (
    <div className="w-full h-screen relative bg-black text-white overflow-hidden">
      {/* 3D Scene */}
      <Scene 
        isFormed={isFormed} 
        isLightsOff={isLightsOff} 
        userTextures={userTextures} 
        controlsRef={controlsRef}
      />

      {/* UI Overlay */}
      <Overlay 
        isFormed={isFormed}
        setIsFormed={setIsFormed}
        isLightsOff={isLightsOff}
        setIsLightsOff={setIsLightsOff}
        showMagic={showMagic}
        setShowMagic={setShowMagic}
        onPhotoUpload={handlePhotoUpload}
      />

      {/* Gesture Controller HUD */}
      {showMagic && (
        <GestureController onUpdate={handleGestureUpdate} />
      )}
    </div>
  );
};

export default App;