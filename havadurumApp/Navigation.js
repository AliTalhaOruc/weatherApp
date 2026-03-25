import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InfoPage from "./Screens/InfoPage"
import { HomePage } from './Screens/Homepage';
import { GardropPage } from './Screens/GardropPage';
import { MystillPage } from './Screens/MystillPage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, View } from 'react-native';
import { useContext } from 'react';
import { WeatherContext } from './WeatherContext';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Homestack = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen name='HomePage' component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name='InfoPage' component={InfoPage} options={{ headerTransparent: true, }} />
        </Stack.Navigator>
    )

}

export const Navigation = () => {
    const { switchtoogle } = useContext(WeatherContext)

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'transparent',
                    position: 'absolute',

                    elevation: 0, // Android için gölgeyi kaldırır
                    left: 0,
                    right: 0,
                    bottom: 0,


                },
                tabBarBackground: () => {
                    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                }
            }}>
                <Tab.Screen name='HomeTab' component={Homestack} options={{ tabBarLabelStyle: { fontWeight: 'bold' }, tabBarIcon: () => (<FontAwesome name="home" size={24} color={switchtoogle ? "rgb(170, 170, 170)" : "gray"} />), tabBarLabel: "Ana Sayfa", headerShown: false }} />
                <Tab.Screen name='GardropPage' component={GardropPage} options={{ tabBarLabelStyle: { fontWeight: 'bold' }, tabBarIcon: () => (<MaterialCommunityIcons name="wardrobe" size={24} color={switchtoogle ? "rgb(170, 170, 170)" : "gray"} />), tabBarLabel: "Bugün ne Giysem?", headerShown: false }} />
                <Tab.Screen name='MystillPage' component={MystillPage} options={{
                    tabBarLabelStyle: { fontWeight: 'bold' }, tabBarIcon: () => (<MaterialIcons name="summarize" size={24}
                        color={switchtoogle ? "rgb(170, 170, 170)" : "gray"} />), tabBarLabel: "Stil özeti", headerShown: false,

                }}
                />
            </Tab.Navigator>
        </NavigationContainer>


    )
}


