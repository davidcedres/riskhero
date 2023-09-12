import { Tabs } from 'expo-router'

import Feather from '@expo/vector-icons/Feather'
import { Platform } from 'react-native'

export default () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarStyle: {
                    ...(Platform.OS === 'ios' && {
                        height: 96,
                        paddingBottom: 32,
                    }),
                    ...(Platform.OS === 'android' && {
                        height: 64,
                        paddingBottom: 8,
                    }),
                },
                tabBarActiveTintColor: '#1e293b',
            }}
        >
            <Tabs.Screen
                name="inspections"
                options={{
                    title: 'Inspecciones',
                    tabBarIcon: ({ color }) => (
                        <Feather size={28} name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reportes',
                    tabBarIcon: ({ color }) => (
                        <Feather size={28} name="file" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="areas"
                options={{
                    title: 'Areas',
                    tabBarIcon: ({ color }) => (
                        <Feather size={28} name="map-pin" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <Feather size={28} name="user" color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}
