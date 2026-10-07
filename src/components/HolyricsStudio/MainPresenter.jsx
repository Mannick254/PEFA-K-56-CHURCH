import React, { useEffect, useState, useMemo, useRef } from 'react';
import useFitText from './hooks/useFitText';
import Pefak56MediaLogo from './components/Pefak56MediaLogo';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './transitions.css'; // Import the transitions stylesheet

// Default presentation configuration
const DEFAULT_PRESET = {
  title: '',
  content: '',
  nextContent: '',
  isBlackout: false,
  isClearText: false,
  isFitText: false,
  fontSize: 48,
  fontFamily: 'Arial, sans-serif',
  fontColor: '#ffffff',
  bgType: 'color',
  bgSource: '#0a0a0c',
  transition: 'fade', // Default transition
  slideDirection: 'left', // Default slide direction
};

export default function MainPresenter() {
  const [liveData, setLiveData] = useState(DEFAULT_PRESET);
  const containerRef = useRef(null);
  const nodeRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Measure container dimensions
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Cross-Window Synchronization
  useEffect(() => {
    const bc = new BroadcastChannel('pefak56_holyrics_channel');
    bc.onmessage = (event) => {
      if (event.data?.type === 'SYNC_STATE' && event.data.payload) {
        setLiveData((prev) => ({ ...prev, ...event.data.payload }));
      }
    };
    return () => bc.close();
  }, []);

  const fittedFontSize = useFitText(liveData.content, {
    width: dimensions.width * 0.9,
    height: dimensions.height * 0.85,
    fontFamily: liveData.fontFamily,
    maxFontSize: liveData.fontSize,
  });

  // Compute styles
  const containerStyle = useMemo(() => ({
    width: '100vw',
    height: '100vh',
    backgroundColor: liveData.isBlackout ? '#000000' : (liveData.bgSource || '#0a0a0c'),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5vw',
    boxSizing: 'border-box',
    textAlign: 'center',
    overflow: 'hidden',
    userSelect: 'none',
    transition: 'background-color 0.4s ease',
    position: 'relative',
  }), [liveData.isBlackout, liveData.bgSource]);

  const textStyle = useMemo(() => ({
    fontSize: `${liveData.isFitText ? fittedFontSize : liveData.fontSize}px`,
    fontFamily: liveData.fontFamily,
    color: liveData.fontColor,
    lineHeight: '1.35',
    fontWeight: '700',
    textShadow: '0 4px 20px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.6)',
    whiteSpace: 'pre-line',
    margin: 0,
    maxWidth: '90vw',
    maxHeight: '85vh',
    wordBreak: 'break-word',
  }), [liveData, fittedFontSize]);

  // Dynamic class for transition effects
  const getTransitionClass = () => {
    if (liveData.transition === 'slide') {
      return `slide-${liveData.slideDirection}`;
    }
    return liveData.transition;
  };

  const transitionClass = getTransitionClass();
  const isVisible = !liveData.isClearText && liveData.content;

  if (liveData.isBlackout) {
    return (
      <main style={containerStyle}>
        <Pefak56MediaLogo />
      </main>
    );
  }

  return (
    <main ref={containerRef} style={containerStyle}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={isVisible ? liveData.content : 'empty'}
          nodeRef={nodeRef}
          timeout={500}
          classNames={transitionClass}
        >
          <div ref={nodeRef}>
            <h1 style={textStyle}>
              {isVisible ? liveData.content.toUpperCase() : ''}
            </h1>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </main>
  );
}