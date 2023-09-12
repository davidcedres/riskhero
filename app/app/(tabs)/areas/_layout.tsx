import { Stack } from 'expo-router'

const Layout = () => (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
            name="new"
            options={{ presentation: 'modal', headerShown: false }}
        />
    </Stack>
)

export default Layout
