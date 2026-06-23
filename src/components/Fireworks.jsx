import React, { useEffect, useRef, memo } from 'react';
import Fireworks from 'fireworks-js';

const FireworksComponent = ({ options }) => {
  const containerRef = useRef(null);
  const fireworksRef = useRef(null);

  useEffect(() => {
    const { fullscreen, ...restOptions } = options || {};
    const finalOptions = {
      maxRockets: 3,
      rocketSpawnInterval: 150,
      numParticles: 100,
      explosionMinHeight: 0.2,
      explosionMaxHeight: 0.9,
      explosionChance: 0.08,
      ...restOptions, // Merge any additional options passed
    };

    const container = containerRef.current;
    if (!container) return;

    fireworksRef.current = new Fireworks(container, finalOptions);

    if (fullscreen) {
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '9999'; // In front of all other content
    }

    // Start fireworks on mount
    if (fireworksRef.current) {
      fireworksRef.current.start();
      // Stop fireworks after 3 seconds
      setTimeout(() => {
        if (fireworksRef.current) {
          fireworksRef.current.stop();
        }
      }, 3000);
    }

    // Cleanup on unmount
    return () => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        // A bit of a delay to ensure the stop command is processed before clearing
        setTimeout(() => (fireworksRef.current = null), 500);
      }
    };
  }, [options]);

  return <div ref={containerRef} className="fireworks-container" />;
};

export default memo(FireworksComponent);
