import { Stack } from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ title: "" }} />
            <Stack.Screen name="categories/[id]" options={{ title: "" }} />
            <Stack.Screen
                name="categories/observations/new"
                options={{
                    title: "",
                }}
            />
        </Stack>
    );
};

export default Layout;
