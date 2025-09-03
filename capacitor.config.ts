import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.example.eventplanner',
    appName: 'event-planner',
    webDir: 'dist',
    plugins: {
        SplashScreen: {
            launchShowDuration: 0
        }
    }
}

export default config
