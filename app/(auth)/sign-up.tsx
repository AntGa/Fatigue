import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link } from "expo-router";
import { signUp } from "../../lib/auth-client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const { error } = await signUp.email(data);
    if (error) setError("root", { message: error.message ?? "Sign up failed" });
  }

  return (
    <View className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <Text className="text-3xl font-bold mb-6 text-black dark:text-white">Create Account</Text>

      {errors.root && (
        <Text className="text-red-500 mb-3">{errors.root.message}</Text>
      )}

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={`border rounded-lg px-3 py-3 mb-1 text-base text-black dark:text-white dark:bg-neutral-900 ${errors.name ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"}`}
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-500 text-xs mb-3">{errors.name.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={`border rounded-lg px-3 py-3 mb-1 text-base text-black dark:text-white dark:bg-neutral-900 ${errors.email ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"}`}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text className="text-red-500 text-xs mb-3">{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={`border rounded-lg px-3 py-3 mb-1 text-base text-black dark:text-white dark:bg-neutral-900 ${errors.password ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"}`}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={value}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text className="text-red-500 text-xs mb-3">{errors.password.message}</Text>
      )}

      <TouchableOpacity
        className="bg-black dark:bg-white rounded-lg py-4 items-center mt-2 disabled:opacity-50"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white dark:text-black text-base font-semibold">Create Account</Text>
        )}
      </TouchableOpacity>

      <Link href="/(auth)/sign-in" className="mt-5 text-center text-neutral-500">
        Already have an account? Sign in
      </Link>
    </View>
  );
}
