import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  handGestureEnabled: boolean;
  voiceGuidanceEnabled: boolean;
  setHandGestureEnabled: (enabled: boolean) => void;
  setVoiceGuidanceEnabled: (enabled: boolean) => void;
  getGestureSettings: () => {
    threshold: number;
    cooldown: number;
    confidence: number;
  };
  gestureSensitivity: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [handGestureEnabled, setHandGestureEnabled] = useState<boolean>(false);
  const [voiceGuidanceEnabled, setVoiceGuidanceEnabled] = useState<boolean>(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedHandGesture = localStorage.getItem('handGestureEnabled');
    const savedVoiceGuidance = localStorage.getItem('voiceGuidanceEnabled');
    
    if (savedHandGesture !== null) {
      setHandGestureEnabled(JSON.parse(savedHandGesture));
    }
    if (savedVoiceGuidance !== null) {
      setVoiceGuidanceEnabled(JSON.parse(savedVoiceGuidance));
    }
  }, []);

  // Save to localStorage when settings change
  const handleHandGestureToggle = (enabled: boolean) => {
    setHandGestureEnabled(enabled);
    localStorage.setItem('handGestureEnabled', JSON.stringify(enabled));
  };

  const handleVoiceGuidanceToggle = (enabled: boolean) => {
    setVoiceGuidanceEnabled(enabled);
    localStorage.setItem('voiceGuidanceEnabled', JSON.stringify(enabled));
  };

  // Example gesture settings and sensitivity, adjust as needed
  const gestureSensitivity = 'medium';
  const getGestureSettings = () => ({
    threshold: 0.5,
    cooldown: 1000,
    confidence: 0.8,
  });

  const value = {
    handGestureEnabled,
    voiceGuidanceEnabled,
    setHandGestureEnabled: handleHandGestureToggle,
    setVoiceGuidanceEnabled: handleVoiceGuidanceToggle,
    getGestureSettings,
    gestureSensitivity,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};