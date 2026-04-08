import { useTheme, type ThemePreference } from "../lib/theme";
import { Pressable, Text, View } from "react-native";

const options: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <View className="flex-row gap-2 rounded-xl bg-secondary p-1">
      {options.map((opt) => {
        const active = preference === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => setPreference(opt.value)}
            className={`flex-1 items-center rounded-lg px-3 py-2 ${
              active ? "bg-card shadow-sm" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
