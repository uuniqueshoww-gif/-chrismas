import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import { THEME } from '../constants';
import { TreeSystem } from './3d/TreeSystem';
import { SnowParticles } from './3d/SnowParticles';
import { FloatingSparkles } from './3d/FloatingSparkles';

interface SceneProps {
  isFormed: boolean;
  isLightsOff: boolean;
  userTextures: THREE.Texture[];
  controlsRef: React.MutableRefObject<any>;
}

export const Scene: React.FC<SceneProps> = ({ isFormed, isLightsOff, userTextures, controlsRef }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 4, 25], fov: 45 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
    >
      <color attach="background" args={['#000000']} />
      
      <Suspense fallback={null}>
        <Environment preset="city" />
        
        {/* Dynamic Lighting */}
        <ambientLight intensity={isLightsOff ? 0.02 : 0.2} />
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.4} 
          penumbra={1} 
          intensity={isLightsOff ? 10 : 250} 
          castShadow 
          color="#FFD700" 
        />
        <pointLight 
          position={[-10, 5, -10]} 
          intensity={isLightsOff ? 5 : 80} 
          color="#ffffff" 
        />
        <pointLight 
          position={[0, -5, 10]} 
          intensity={30} 
          color={THEME.bodyColor} 
        />

        {/* 3D Content */}
        <TreeSystem 
          isFormed={isFormed} 
          isLightsOff={isLightsOff} 
          userTextures={userTextures} 
        />
        
        <FloatingSparkles isFormed={isFormed} />
        <SnowParticles />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ContactShadows opacity={0.6} scale={40} blur={2.5} far={10} resolution={256} color="#000000" />

        {/* Post Processing */}
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1.0} mipmapBlur intensity={1.8} radius={0.5} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Suspense>

      <OrbitControls 
        ref={controlsRef} 
        enablePan={false} 
        maxPolarAngle={Math.PI / 2 + 0.1} 
        minDistance={5} 
        maxDistance={40} 
        autoRotate={isFormed} 
        autoRotateSpeed={0.5} 
      />
    </Canvas>
  );
};