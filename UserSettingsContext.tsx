import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface UserSettings {
  fontSize: number;
  backgroundColor: string;
  lineSpacing: number;
}

interface UserSettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  loading: boolean;
}

const defaultSettings: UserSettings = {
  fontSize: 18,
  backgroundColor: '#FFF9E6',
  lineSpacing: 1.8,
};

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setSettings(defaultSettings);
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('font_size, background_color, line_spacing')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setSettings({
        fontSize: data.font_size,
        backgroundColor: data.background_color,
        lineSpacing: data.line_spacing,
      });
    }

    setLoading(false);
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    const { error } = await supabase
      .from('profiles')
      .update({
        font_size: updatedSettings.fontSize,
        background_color: updatedSettings.backgroundColor,
        line_spacing: updatedSettings.lineSpacing,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating settings:', error);
      setSettings(settings);
    }
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
}
