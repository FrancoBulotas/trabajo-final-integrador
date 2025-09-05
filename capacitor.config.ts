import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TFI',
  webDir: 'www',
  plugins: {
      SplashScreen: {
          launchShowDuration: 3000,
          launchAutoHide: true,
          backgroundColor: "#ffffff",
          androidScaleType: "CENTER_CROP",
          showSpinner: true,
          androidSpinnerStyle: "large",
          iosSpinnerStyle: "small",
          spinnerColor: "#999999"
      }
  }
};

export default config;
