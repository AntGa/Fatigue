import "../global.css";
import { Stack } from "expo-router";
import { useSession } from "../lib/auth-client";
import { ThemeProvider } from "../lib/theme";

function ThemedStack() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}
