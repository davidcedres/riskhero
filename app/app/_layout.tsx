import { Slot } from "expo-router";
import Notifications from "../components/Notifications";

const Layout = () => {
  return (
    <>
      <Slot />
      <Notifications />
    </>
  );
};

export default Layout;
