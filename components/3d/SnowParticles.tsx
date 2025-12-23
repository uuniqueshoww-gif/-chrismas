import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SNOW_VERTEX_SHADER, SNOW_FRAGMENT_SHADER } from '../../constants';

export const SnowParticles: React.FC = () => {
  const count = 2500;
  const matRef = useRef<THREE.ShaderMaterial>(null);
  
  const [data] = useState(() => {
    const pos = new Float32Array(count * 3);
    const randomness = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for(let i=0; i<count; i++) {
      pos[i*3] = (Math.random()-0.5)*80;
      pos[i*3+1] = (Math.random()-0.5)*60;
      pos[i*3+2] = (Math.random()-0.5)*80;
      
      randomness[i*3] = (Math.random()-0.5);
      randomness[i*3+1] = Math.random();
      randomness[i*3+2] = (Math.random()-0.5);
      
      scales[i] = Math.random() * 1.5 + 0.5;
    }
    return { pos, randomness, scales };
  });

  useFrame((state) => {
    if(matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos} itemSize={3} />
        <bufferAttribute attach="attributes-aRandomness" count={count} array={data.randomness} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={count} array={data.scales} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={SNOW_VERTEX_SHADER}
        fragmentShader={SNOW_FRAGMENT_SHADER}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};