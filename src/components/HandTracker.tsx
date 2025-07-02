import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Hand, X, Maximize2, Minimize2 } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface HandGestureControlProps {
  enabled: boolean;
  voiceEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

type Landmark = { x: number; y: number; z?: number };

const HandGestureControl: React.FC<HandGestureControlProps> = ({
  enabled,
  voiceEnabled,
  onToggle
}) => {
  const { getGestureSettings, gestureSensitivity } = useAccessibility();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastGesture, setLastGesture] = useState<string>('');
  const [gestureStability, setGestureStability] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Gesture detection state
  const gestureCounterRef = useRef<{ [key: string]: number }>({});
  const lastActionTimeRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoveredElementRef = useRef<Element | null>(null);

  // Get dynamic settings from accessibility context
  const { threshold: GESTURE_THRESHOLD, cooldown: ACTION_COOLDOWN, confidence: CONFIDENCE_THRESHOLD } = getGestureSettings();
  const SCROLL_AMOUNT = 150; // Increased for better scrolling
  const CURSOR_SMOOTH_FACTOR = 0.3; // For smoother cursor movement

  // Voice synthesis
  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    // Clear any existing speech timeout
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    
    // Debounce speech to avoid overwhelming the user
    speechTimeoutRef.current = setTimeout(() => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.volume = 0.7;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, [voiceEnabled]);

  // Detect hand gestures with improved accuracy
  const detectGesture = useCallback((landmarks: Landmark[]): string | null => {
    if (!landmarks || landmarks.length < 21) return null;

    // Helper function to check if finger is extended
    const isFingerExtended = (tipIdx: number, pipIdx: number, mcpIdx: number) => {
      const tip = landmarks[tipIdx];
      const pip = landmarks[pipIdx];
      const mcp = landmarks[mcpIdx];
      return tip.y < pip.y && pip.y < mcp.y;
    };

    // Count extended fingers
    const extendedFingers = [
      landmarks[4].x > landmarks[3].x, // Thumb (different logic)
      isFingerExtended(8, 6, 5),       // Index
      isFingerExtended(12, 10, 9),     // Middle
      isFingerExtended(16, 14, 13),    // Ring
      isFingerExtended(20, 18, 17)     // Pinky
    ];

    const extendedCount = extendedFingers.filter(Boolean).length;

    // Gesture detection with improved logic (fixed duplicate conditions)
    if (extendedFingers[1] && !extendedFingers[2] && !extendedFingers[3] && !extendedFingers[4]) {
      return 'point'; // Only index finger
    } else if (extendedFingers[1] && extendedFingers[2] && !extendedFingers[3] && !extendedFingers[4]) {
      return 'peace'; // Index and middle
    } else if (extendedCount === 5) {
      return 'open_palm'; // All fingers extended
    } else if (extendedCount === 0) {
      return 'fist'; // No fingers extended
    } else if (extendedFingers[1] && extendedFingers[4] && !extendedFingers[0] && !extendedFingers[2] && !extendedFingers[3]) {
      return 'scroll_up'; // Index and pinky (fixed condition)
    } else if (extendedFingers[2] && extendedFingers[3] && !extendedFingers[0] && !extendedFingers[1] && !extendedFingers[4]) {
      return 'scroll_down'; // Middle and ring (fixed condition)
    }

    return null;
  }, []);

  // Update cursor position smoothly
  const updateCursorPosition = useCallback((landmarks: Landmark[]) => {
    if (!landmarks || landmarks.length < 21) return;

    const indexTip = landmarks[8];
    const videoRect = videoRef.current?.getBoundingClientRect();
    if (!videoRect) return;

    // Convert normalized coordinates to screen coordinates
    const x = (1 - indexTip.x) * window.innerWidth; // Flip X for mirror effect
    const y = indexTip.y * window.innerHeight;

    // Smooth cursor movement
    setCursorPosition(prev => ({
      x: prev.x + (x - prev.x) * CURSOR_SMOOTH_FACTOR,
      y: prev.y + (y - prev.y) * CURSOR_SMOOTH_FACTOR
    }));

    // Update hover effect
    const elementUnderCursor = document.elementFromPoint(x, y);
    if (elementUnderCursor && elementUnderCursor !== hoveredElementRef.current) {
      // Remove previous hover effect
      if (hoveredElementRef.current) {
        hoveredElementRef.current.classList.remove('gesture-hover');
      }

      // Add hover effect to new element
      if (elementUnderCursor.tagName === 'BUTTON' || 
          elementUnderCursor.closest('button') || 
          elementUnderCursor.classList.contains('cursor-pointer') ||
          elementUnderCursor.closest('[role="button"]')) {
        
        const targetElement = elementUnderCursor.closest('button') || 
                             elementUnderCursor.closest('[role="button"]') || 
                             elementUnderCursor;
        
        targetElement.classList.add('gesture-hover');
        hoveredElementRef.current = targetElement;
        
        // Announce the element with debouncing
        const elementText = targetElement.textContent?.trim() || 
                           targetElement.getAttribute('aria-label') || 
                           targetElement.getAttribute('title') || 
                           'interactive element';
        
        if (elementText && elementText.length < 50) {
          speak(`You can click ${elementText}`);
        }
      } else {
        hoveredElementRef.current = null;
      }
    }
  }, [speak]);

  // Execute gesture actions
  const executeGestureAction = useCallback((gesture: string, landmarks: Landmark[]) => {
    const indexTip = landmarks[8];
    const x = (1 - indexTip.x) * window.innerWidth;
    const y = indexTip.y * window.innerHeight;

    switch (gesture) {
      case 'peace': {
        // Click action
        const clickElement = document.elementFromPoint(x, y);
        if (clickElement) {
          const clickableElement = clickElement.closest('button') || 
                                 clickElement.closest('a') || 
                                 clickElement.closest('[role="button"]') ||
                                 clickElement.closest('.cursor-pointer') ||
                                 clickElement;
          
          if (clickableElement && typeof (clickableElement as HTMLElement).click === 'function') {
            (clickableElement as HTMLElement).click();
            speak('Clicked');
          }
        }
        break;
      }
      case 'pinch': {
        // Right click / context menu
        const rightClickEvent = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y
        });
        document.elementFromPoint(x, y)?.dispatchEvent(rightClickEvent);
        speak('Right clicked');
        break;
      }
      case 'open_palm': {
        // Go back or close modal
        const backButton = document.querySelector('[aria-label*="back"]') ||
                          document.querySelector('[aria-label*="close"]') ||
                          document.querySelector('.modal button[aria-label="Close"]') ||
                          document.querySelector('button:contains("Back")');
        
        if (backButton) {
          (backButton as HTMLElement).click();
          speak('Going back');
        } else {
          window.history.back();
          speak('Going back');
        }
        break;
      }
      case 'fist': {
        // Refresh page
        window.location.reload();
        speak('Refreshing page');
        break;
      }
      case 'scroll_up': {
        // Scroll up
        if (!isScrolling) {
          setIsScrolling(true);
          window.scrollBy({ top: -SCROLL_AMOUNT, behavior: 'smooth' });
          speak('Scrolling up');
          
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 500);
        }
        break;
      }
      case 'scroll_down': {
        // Scroll down
        if (!isScrolling) {
          setIsScrolling(true);
          window.scrollBy({ top: SCROLL_AMOUNT, behavior: 'smooth' });
          speak('Scrolling down');
          
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 500);
        }
        break;
      }
    }
  }, [speak, isScrolling]);

  // Handle gestures with improved stability
  const handleGesture = useCallback((gesture: string, landmarks: Landmark[]) => {
    const now = Date.now();
    
    // Initialize gesture counter
    if (!gestureCounterRef.current[gesture]) {
      gestureCounterRef.current[gesture] = 0;
    }

    // Increment gesture counter
    gestureCounterRef.current[gesture]++;

    // Reset other gesture counters
    Object.keys(gestureCounterRef.current).forEach(key => {
      if (key !== gesture) {
        gestureCounterRef.current[key] = Math.max(0, gestureCounterRef.current[key] - 1);
      }
    });
    
    // Update UI state
    setLastGesture(gesture);
    setGestureStability(gestureCounterRef.current[gesture]);

    // Execute action if gesture is stable and cooldown has passed
    if (gestureCounterRef.current[gesture] >= GESTURE_THRESHOLD && 
        now - lastActionTimeRef.current > ACTION_COOLDOWN) {
      
      executeGestureAction(gesture, landmarks);
      lastActionTimeRef.current = now;
      
      // Reset gesture counter after action
      gestureCounterRef.current[gesture] = 0;
    }
  }, [GESTURE_THRESHOLD, ACTION_COOLDOWN, executeGestureAction]);

  // Initialize MediaPipe Hands
  const initializeHandTracking = useCallback(async () => {
    if (!enabled || !videoRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get camera stream with higher resolution
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Load MediaPipe Hands
      const { Hands, HAND_CONNECTIONS } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');
      const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');

      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: CONFIDENCE_THRESHOLD,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          // Draw hand landmarks
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
          drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1, radius: 3 });

          // Detect gesture and update cursor
          const gesture = detectGesture(landmarks);
          if (gesture) {
            handleGesture(gesture, landmarks);
          }
          
          // Update cursor position based on index finger
          updateCursorPosition(landmarks);
        }
      });

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Hand tracking initialization error:', err);
      setError('Failed to initialize hand tracking. Please ensure camera permissions are granted.');
      setIsLoading(false);
      onToggle(false);
    }
  }, [enabled, onToggle, CONFIDENCE_THRESHOLD, handleGesture, updateCursorPosition, detectGesture]);

  // Initialize when enabled
  useEffect(() => {
    if (enabled) {
      initializeHandTracking();
    } else {
      // Clean up when disabled
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      // Cleanup on unmount
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [enabled, initializeHandTracking]);

  // Add CSS for hover effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gesture-hover {
        outline: 3px solid #3A8EBA !important;
        outline-offset: 2px !important;
        background-color: rgba(58, 142, 186, 0.1) !important;
        transition: all 0.2s ease !important;
      }
      
      .gesture-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #3A8EBA 40%, transparent 40%);
        border: 2px solid #fff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.1s ease;
        box-shadow: 0 0 10px rgba(58, 142, 186, 0.5);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Virtual Cursor */}
      <div 
        className="gesture-cursor"
        style={{
          left: cursorPosition.x - 10,
          top: cursorPosition.y - 10,
          transform: `scale(${gestureStability > 3 ? 1.5 : 1})`
        }}
      />

      {/* Camera Panel */}
      <div className={`fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg border-2 border-gray-300 transition-all duration-300 ${
        isMinimized ? 'w-16 h-16' : 'w-80 h-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-blue-600" />
            {!isMinimized && <span className="text-sm font-medium">Hand Tracking</span>}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 rounded"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggle(false)}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Disable Hand Tracking"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="relative">
            {/* Video Feed */}
            <div className="relative w-full h-48 bg-black rounded-b-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover scale-x-[-1]"
                autoPlay
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                width={320}
                height={240}
                className="absolute top-0 left-0 w-full h-full scale-x-[-1]"
              />
              
              {/* Status Overlay */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {isLoading ? 'Loading...' : lastGesture || 'Ready'}
              </div>
              
              {/* Gesture Stability Indicator */}
              {gestureStability > 0 && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {Math.round((gestureStability / GESTURE_THRESHOLD) * 100)}%
                </div>
              )}

              {/* Sensitivity Indicator */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {gestureSensitivity.charAt(0).toUpperCase() + gestureSensitivity.slice(1)} Mode
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-600 text-sm p-4 rounded-b-lg">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Minimized State */}
        {isMinimized && (
          <div className="flex items-center justify-center h-10">
            <Camera className={`w-6 h-6 ${isLoading ? 'text-gray-400' : 'text-blue-600'}`} />
          </div>
        )}
      </div>

      {/* Gesture Guide (only when not minimized) */}
      {!isMinimized && (
        <div className="fixed bottom-4 right-4 z-40 bg-blue-50 rounded-lg p-3 max-w-xs shadow-lg border border-blue-200">
          <h4 className="text-sm font-semibold mb-2 text-blue-800">Quick Gestures ({gestureSensitivity}):</h4>
          <div className="text-xs space-y-1 text-blue-700">
            <div>👆 Point - Navigate/Hover</div>
            <div>✌️ Peace - Click ({gestureStability}/{GESTURE_THRESHOLD})</div>
            <div>🤏 Pinch - Right Click</div>
            <div>🤚 Open Palm - Go Back</div>
            <div>✊ Fist - Refresh</div>
            <div>🤞 Index+Pinky - Scroll Up</div>
            <div>🤘 Middle+Ring - Scroll Down</div>
            <div className="mt-2 p-2 bg-blue-100 rounded text-blue-600">
              {gestureSensitivity === 'slow' && "Hold gestures longer for stability"}
              {gestureSensitivity === 'normal' && "Balanced gesture response"}
              {gestureSensitivity === 'fast' && "Quick gesture activation"}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HandGestureControl;