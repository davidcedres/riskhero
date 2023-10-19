import { Slot } from "expo-router";
import { useEffect } from "react";
import { useStore } from "../state/store";
import NetInfo from "@react-native-community/netinfo";
import Notifications from "../components/Notifications";
import sync from "../state/sync";

const Layout = () => {
    const auth = useStore((store) => store.auth);
    const store = useStore();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected === false || auth.logged === false) return;
            void sync();
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <Slot />
            <Notifications />
        </>
    );
};

export default Layout;
