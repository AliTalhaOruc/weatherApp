import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Navigation } from './Navigation';
import { View } from 'react-native';
import { WeatherProvider } from "./WeatherContext";

export default function App() {
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <WeatherProvider>
        <Navigation />
      </WeatherProvider>
    </GestureHandlerRootView>

  );
}
