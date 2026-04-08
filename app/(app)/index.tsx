import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { signOut, useSession } from "../../lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.greeting}>
        Hello, {session?.user.name ?? session?.user.email}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
