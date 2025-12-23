import React, { useRef, useEffect, useState } from 'react';
import { GestureData, GestureType } from '../types';

interface GestureControllerProps {
  onUpdate: (data: GestureData) => void;
}

export const GestureController: React.FC<GestureControllerProps> = ({ onUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Loading AI...");

  useEffect(() => {
    // MediaPipe globals are loaded via script tags in index.html
    const Hands = window.Hands;
    const Camera = window.Camera;
    const drawConnectors = window.drawConnectors;
    const drawLandmarks = window.drawLandmarks;
    const HAND_CONNECTIONS = window.HAND_CONNECTIONS;

    if (!Hands || !Camera) {
      setStatus("Failed to load MediaPipe");
      return;
    }

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6
    });

    hands.onResults((results: any) => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      let gestureData: GestureData = { type: GestureType.NONE, x: 0.5, y: 0.5 };

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const lm = results.multiHandLandmarks[0];
        
        drawConnectors(ctx, lm, HAND_CONNECTIONS, {color: '#FFD700', lineWidth: 2});
        drawLandmarks(ctx, lm, {color: '#FFFFFF', lineWidth: 1, radius: 2});

        const isIndexUp = lm[8].y < lm[6].y;
        const isMiddleUp = lm[12].y < lm[10].y;
        const isRingUp = lm[16].y < lm[14].y;
        const isPinkyUp = lm[20].y < lm[18].y;

        if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
            gestureData.type = GestureType.FIST;
        } else if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) {
            gestureData.type = GestureType.OPEN;
        } else if (isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp) {
            gestureData.type = GestureType.VICTORY;
        } else if (isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
            gestureData.type = GestureType.POINT;
        }

        gestureData.x = lm[8].x;
        gestureData.y = lm[8].y;
      }

      onUpdate(gestureData);
      ctx.restore();
    });

    if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                if (videoRef.current) await hands.send({image: videoRef.current});
            },
            width: 320,
            height: 240
        });
        camera.start().then(() => setStatus("Ready"));
    }

    return () => {
        hands.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute top-20 right-6 w-40 h-32 rounded-xl overflow-hidden border-2 border-yellow-500/60 bg-black/60 z-40 transform -scale-x-100 shadow-lg shadow-yellow-500/20">
      <video ref={videoRef} className="hidden"></video>
      <canvas ref={canvasRef} className="w-full h-full" width={320} height={240}></canvas>
      {status !== "Ready" && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold bg-black/50 transform scale-x-[-1]">
          {status}
        </div>
      )}
    </div>
  );
};