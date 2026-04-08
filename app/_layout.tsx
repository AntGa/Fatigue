import { Stack } from "expo-router";
import { useSession } from "../lib/auth-client";

export default function RootLayout() {
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
