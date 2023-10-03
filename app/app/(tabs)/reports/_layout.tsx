import { Stack } from 'expo-router'

const Layout = () => (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: '' }} />
        <Stack.Screen name="[id]" options={{ title: '', headerShown: true }} />
    </Stack>
)

export default Layout
