import { FC, useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import Constant from "expo-constants";
import { Toast } from "react-hot-toast";

const CustomToast: FC<{
  t: Toast;
  updateHeight: (height: number) => void;
  offset: number;
}> = ({ t, updateHeight, offset }) => {
  // Animations for enter and exit
  const fadeAnim = useRef(new Animated.Value(0.5)).current;
  const posAnim = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: t.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, t.visible]);

  useEffect(() => {
    Animated.spring(posAnim, {
      toValue: t.visible ? offset : -80,
      useNativeDriver: true,
    }).start();
  }, [posAnim, offset, t.visible]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: t.visible ? 9999 : undefined,
        alignItems: "center",
        opacity: fadeAnim,
        transform: [
          {
            translateY: posAnim,
          },
        ],
      }}
    >
      <View
        onLayout={(event) => updateHeight(event.nativeEvent.layout.height)}
        style={{
          margin: Constant.statusBarHeight + 10,
          backgroundColor: "#000",
          width: 150,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
        key={t.id}
      >
        <Text>{t.icon} </Text>
        <Text
          style={{
            color: "#fff",
            padding: 4,
            flex: 1,
            textAlign: "center",
          }}
        >
          {t.message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default CustomToast;
