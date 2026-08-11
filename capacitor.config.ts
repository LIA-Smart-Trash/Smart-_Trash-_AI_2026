import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lia.smarttrash',
  appName: 'LiaSmartTrash',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#020617",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    }
  }
};

export default config;
