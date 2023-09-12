import { Stack } from 'expo-router'

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="new"
                options={{ presentation: 'modal', headerShown: false }}
            />
            <Stack.Screen name="[id]" options={{ title: '' }} />
            <Stack.Screen name="categories/[id]" options={{ title: '' }} />
            <Stack.Screen
                name="categories/observations/new"
                options={{
                    // headerShown: false,
                    title: '',
                    presentation: 'modal',
                }}
            />
        </Stack>
    )
}

export default Layout
