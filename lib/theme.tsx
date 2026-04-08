import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "theme-preference";

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  colorScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "system" || stored === "light" || stored === "dark") {
        applyPreference(stored);
      }
    });
  }, []);

  function applyPreference(next: ThemePreference) {
    setPreferenceState(next);
    Appearance.setColorScheme(next === "system" ? null : next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <ThemeContext.Provider
      value={{
        preference,
        setPreference: applyPreference,
        colorScheme: colorScheme ?? "light",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
