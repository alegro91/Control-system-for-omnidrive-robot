import { createWebpackConfigAsync } from "@expo/webpack-config";

export default async function (env, argv) {
  const config = await createWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  return config;
}
