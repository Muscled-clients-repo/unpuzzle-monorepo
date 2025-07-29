import { useCallback, useEffect, useState } from 'react';
import { useBaseApi } from './useBaseApi';
import { useClerkUser } from './useClerkUser';

interface SettingsState {
  // Profile settings
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar: string;
    timeZone: string;
    language: string;
    publicProfile: boolean;
  };
  
  // Learning preferences
  learning: {
    autoplay: boolean;
    subtitles: boolean;
    playbackSpeed: number;
    quality: string;
    skipIntro: boolean;
    pauseOnBlur: boolean;
    continuousPlay: boolean;
    rememberPosition: boolean;
    downloadQuality: string;
  };
  
  // Notifications
  notifications: {
    email: {
      courseUpdates: boolean;
      newCourses: boolean;
      announcements: boolean;
      reminders: boolean;
      marketing: boolean;
    };
    push: {
      courseDeadlines: boolean;
      liveEvents: boolean;
      messages: boolean;
      achievements: boolean;
    };
    frequency: string;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  
  // Privacy & Security
  privacy: {
    profileVisibility: string;
    showProgress: boolean;
    showCertificates: boolean;
    allowMessages: boolean;
    dataSharing: boolean;
    analytics: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  
  // Appearance
  appearance: {
    theme: string;
    fontSize: string;
    contrast: string;
    reducedMotion: boolean;
    compactMode: boolean;
    sidebarCollapsed: boolean;
  };
  
  // Accessibility
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    largeText: boolean;
    colorBlindMode: string;
    focusIndicator: boolean;
    animations: boolean;
  };
}

const defaultSettings: SettingsState = {
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatar: "",
    timeZone: "UTC",
    language: "en",
    publicProfile: false,
  },
  learning: {
    autoplay: false,
    subtitles: true,
    playbackSpeed: 1,
    quality: "auto",
    skipIntro: false,
    pauseOnBlur: true,
    continuousPlay: false,
    rememberPosition: true,
    downloadQuality: "720p",
  },
  notifications: {
    email: {
      courseUpdates: true,
      newCourses: false,
      announcements: true,
      reminders: true,
      marketing: false,
    },
    push: {
      courseDeadlines: true,
      liveEvents: true,
      messages: true,
      achievements: true,
    },
    frequency: "daily",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  },
  privacy: {
    profileVisibility: "public",
    showProgress: true,
    showCertificates: true,
    allowMessages: true,
    dataSharing: false,
    analytics: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
  },
  appearance: {
    theme: "light",
    fontSize: "medium",
    contrast: "normal",
    reducedMotion: false,
    compactMode: false,
    sidebarCollapsed: false,
  },
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    highContrast: false,
    largeText: false,
    colorBlindMode: "none",
    focusIndicator: true,
    animations: true,
  },
};

export const useSettings = () => {
  const api = useBaseApi();
  const { user } = useClerkUser();
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from API or localStorage
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to load from API first
      const response = await api.get<{ settings: SettingsState }>('/user/settings');
      
      if (response.success && response.data) {
        setSettings(response.data.settings);
      } else {
        // Fallback to localStorage
        const localSettings = localStorage.getItem('unpuzzle_user_settings');
        if (localSettings) {
          setSettings(JSON.parse(localSettings));
        } else {
          setSettings(defaultSettings);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      
      // Fallback to localStorage on API error
      const localSettings = localStorage.getItem('unpuzzle_user_settings');
      if (localSettings) {
        setSettings(JSON.parse(localSettings));
      } else {
        setSettings(defaultSettings);
      }
      
      setError('Failed to load settings from server');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Save settings to API and localStorage
  const saveSettings = useCallback(async (newSettings: SettingsState) => {
    setIsLoading(true);
    setError(null);

    try {
      // Save to localStorage immediately for offline support
      localStorage.setItem('unpuzzle_user_settings', JSON.stringify(newSettings));
      
      // Try to save to API
      const response = await api.post('/user/settings', { settings: newSettings });
      
      if (response.success) {
        setSettings(newSettings);
        setHasUnsavedChanges(false);
        
        // Apply theme changes immediately
        applyThemeSettings(newSettings.appearance);
        
        // Apply accessibility settings
        applyAccessibilitySettings(newSettings.accessibility);
        
        // Refresh data from server after successful save
        setTimeout(() => {
          loadSettings();
        }, 100);
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings to server. Changes saved locally.');
      
      // Still update local state even if API fails
      setSettings(newSettings);
      applyThemeSettings(newSettings.appearance);
      applyAccessibilitySettings(newSettings.accessibility);
      
      return { success: false, error: 'API save failed but saved locally' };
    } finally {
      setIsLoading(false);
    }
  }, [api, loadSettings]);

  // Update specific setting category
  const updateSettings = useCallback((category: keyof SettingsState, updates: Partial<SettingsState[keyof SettingsState]>) => {
    if (settings) {
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          ...updates
        }
      };
      setSettings(newSettings);
      setHasUnsavedChanges(true);
      
      // Save to localStorage immediately
      localStorage.setItem('unpuzzle_user_settings', JSON.stringify(newSettings));
    }
  }, [settings]);

  // Reset settings to default
  const resetSettings = useCallback(async () => {
    const resetToDefaults = { ...defaultSettings };
    
    // Preserve user profile data
    if (user) {
      resetToDefaults.profile = {
        ...resetToDefaults.profile,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
      };
    }
    
    const result = await saveSettings(resetToDefaults);
    
    // Refresh data from server after successful reset
    if (result.success) {
      setTimeout(() => {
        loadSettings();
      }, 100);
    }
    
    return result;
  }, [saveSettings, user, loadSettings]);

  // Apply theme settings to document
  const applyThemeSettings = useCallback((appearance: SettingsState['appearance']) => {
    const root = document.documentElement;
    
    // Apply theme
    if (appearance.theme === 'dark') {
      root.classList.add('dark');
    } else if (appearance.theme === 'light') {
      root.classList.remove('dark');
    } else if (appearance.theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    // Apply font size
    root.style.setProperty('--font-size-base', 
      appearance.fontSize === 'small' ? '14px' :
      appearance.fontSize === 'large' ? '18px' : '16px'
    );
    
    // Apply compact mode
    if (appearance.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
    
    // Apply reduced motion
    if (appearance.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
  }, []);

  // Apply accessibility settings
  const applyAccessibilitySettings = useCallback((accessibility: SettingsState['accessibility']) => {
    const root = document.documentElement;
    
    // High contrast mode
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Large text
    if (accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    // Focus indicator
    if (accessibility.focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
    
    // Color blind mode
    if (accessibility.colorBlindMode && accessibility.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${accessibility.colorBlindMode}`);
    } else {
      root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia');
    }
    
    // Keyboard navigation
    if (accessibility.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, []);

  // Export settings as JSON
  const exportSettings = useCallback(() => {
    if (settings) {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'unpuzzle-settings.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }, [settings]);

  // Import settings from JSON
  const importSettings = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const importedSettings = JSON.parse(text);
      
      // Validate imported settings structure
      if (typeof importedSettings === 'object' && importedSettings !== null) {
        // Merge with defaults to ensure all required fields exist
        const mergedSettings = {
          ...defaultSettings,
          ...importedSettings
        };
        
        const result = await saveSettings(mergedSettings);
        
        // Refresh data from server after successful import
        if (result.success) {
          setTimeout(() => {
            loadSettings();
          }, 100);
        }
        
        return result;
      } else {
        throw new Error('Invalid settings file format');
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
      setError('Failed to import settings. Please check the file format.');
      return { success: false, error: 'Import failed' };
    }
  }, [saveSettings, loadSettings]);

  // Load settings on mount only once
  useEffect(() => {
    loadSettings();
  }, []); // Empty dependency array - only run on mount

  // Apply settings when they change
  useEffect(() => {
    if (settings) {
      applyThemeSettings(settings.appearance);
      applyAccessibilitySettings(settings.accessibility);
    }
  }, [settings, applyThemeSettings, applyAccessibilitySettings]);

  // Auto-save to localStorage when settings change
  useEffect(() => {
    if (settings && hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('unpuzzle_user_settings', JSON.stringify(settings));
      }, 1000); // Debounce auto-save
      
      return () => clearTimeout(timeoutId);
    }
  }, [settings, hasUnsavedChanges]);

  return {
    settings,
    isLoading,
    error,
    hasUnsavedChanges,
    loadSettings,
    saveSettings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    defaultSettings,
  };
};