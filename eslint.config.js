import { defineConfig, globalIgnores } from "eslint/config";
import expo from "eslint-config-expo/flat.js";

const eslintConfig = defineConfig([
  expo,
  globalIgnores(["node_modules/**", ".expo/**", "**/dist/**", ".claude/**"]),
]);

export default eslintConfig;
