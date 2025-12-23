import React, { useMemo } from 'react';
import * as THREE from 'three';
import { THEME } from '../../constants';
import { TreeTrunk } from './TreeComponents';
import { GiftBoxes } from './TreeComponents';
import { CloudySnowFloor } from './TreeComponents';
import { GeometricGroup } from './TreeComponents';
import { Polaroids } from './TreeComponents';
import { StarTopper } from './TreeComponents';
import { createStarShape } from '../../utils/geometry';

interface TreeSystemProps {
  isFormed: boolean;
  isLightsOff: boolean;
  userTextures: THREE.Texture[];
}

export const TreeSystem: React.FC<TreeSystemProps> = ({ isFormed, isLightsOff, userTextures }) => {
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const boxGeo = useMemo(() => new THREE.BoxGeometry(0.8, 0.8, 0.8), []); 
  const jewelGeo = useMemo(() => new THREE.IcosahedronGeometry(0.5, 0), []); 
  const starDecoGeo = useMemo(() => { 
    const shape = createStarShape(0.4); 
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }); 
  }, []);

  return (
    <group position={[0, -2, 0]}>
      <TreeTrunk isFormed={isFormed} />
      <GiftBoxes isFormed={isFormed} />
      <CloudySnowFloor isFormed={isFormed} isLightsOff={isLightsOff} />
      
      {/* Tree Body (Green Jewels) */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="TREE_BODY" 
        color={THEME.bodyColor} 
        geometry={jewelGeo} 
        count={2500} 
        scaleRange={[0.6, 1.2]} 
      />
      
      {/* Golden Lights */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="LIGHT" 
        color={THEME.lightColor} 
        geometry={sphereGeo} 
        count={100} 
        scaleRange={[0.25, 0.45]} 
      />
      
      {/* Red Ornaments */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="HEAVY" 
        color={THEME.heavyColor} 
        geometry={sphereGeo} 
        count={80} 
        scaleRange={[0.3, 0.5]} 
      />
      
      {/* Star Decorations */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="STAR_GOLD" 
        color={THEME.starBodyColor} 
        geometry={starDecoGeo} 
        count={40} 
        scaleRange={[0.8, 1.2]} 
        isLightsOff={isLightsOff} 
      />
      
      {/* Glowing Green Gems */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="GLOW_GREEN" 
        color={THEME.gemAColor} 
        geometry={jewelGeo} 
        count={120} 
        scaleRange={[0.3, 0.5]} 
        isLightsOff={isLightsOff} 
      />
      
      {/* Glowing Red Gems */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="GLOW_RED" 
        color={THEME.gemBColor} 
        geometry={jewelGeo} 
        count={120} 
        scaleRange={[0.3, 0.5]} 
        isLightsOff={isLightsOff} 
      />
      
      {/* Glowing White Cubes */}
      <GeometricGroup 
        isFormed={isFormed} 
        type="GLOW_WHITE" 
        color="#ffffff" 
        geometry={boxGeo} 
        count={200} 
        scaleRange={[0.15, 0.25]} 
        isLightsOff={isLightsOff} 
      />
      
      <Polaroids isFormed={isFormed} userTextures={userTextures} />
      
      <StarTopper isFormed={isFormed} color={THEME.starBodyColor} isLightsOff={isLightsOff} />
    </group>
  );
};