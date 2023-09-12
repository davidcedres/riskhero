import { View } from "react-native";
import Toast from "./Toast";
import { useToaster } from "react-hot-toast/headless";

const Notifications = () => {
  const { toasts, handlers } = useToaster();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {toasts.map((t) => (
        <Toast
          key={t.id}
          t={t}
          updateHeight={(height: number) => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </View>
  );
};

export default Notifications;
