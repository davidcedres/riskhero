import { FC } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

const HStack: FC<ViewProps> = ({ style, ...rest }) => (
  <View {...rest} style={StyleSheet.compose(styles.root, style)} />
);

const styles = StyleSheet.create({
  root: {
    gap: 16,
    flexDirection: "row",
  },
});

export default HStack;
