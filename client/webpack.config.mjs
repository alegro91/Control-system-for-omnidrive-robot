import createExpoWebpackConfigAsync from "@expo/webpack-config";

export default async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.

  // Add resolve property with the specified extensions
  config.resolve = {
    ...config.resolve, // Keep any existing resolve configurations
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  };

  return config;
}
