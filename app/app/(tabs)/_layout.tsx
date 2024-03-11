import { Platform } from 'react-native'
import { Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'

export default () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    ...(Platform.OS === 'ios' && {
                        height: 96,
                        paddingBottom: 0
                    }),
                    ...(Platform.OS === 'android' && {
                        height: 64,
                        paddingBottom: 0
                    })
                },
                tabBarActiveTintColor: '#1e293b'
            }}
        >
            <Tabs.Screen
                name="inspections"
                options={{
                    title: 'Inspecciones',
                    tabBarIcon: ({ color }) => (
                        <Feather size={28} name="list" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => (
                        <Feather size={28} name="user" color={color} />
                    )
                }}
            />
        </Tabs>
    )
}
