import { Category, State, getStateColor } from "../state/interfaces";
import { FC } from "react";
import { StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import HStack from "./HStack";
import Typography from "./Typography";
import VStack from "./VStack";

const CategoryCard: FC<{
    category: Category;
    observations: number;
    pending: number;
}> = ({ category, observations, pending }) => {
    const ready = pending === 0;

    return (
        <VStack style={[styles.base, pending === 0 ? styles.completed : {}]}>
            <Typography variant="subtitle">{category.name}</Typography>

            {ready ? (
                <HStack
                    style={{
                        gap: 8,
                        alignItems: "center",
                    }}
                >
                    <Feather
                        size={24}
                        name="check-circle"
                        color={getStateColor(State.ACCEPTABLE)}
                    />
                    <Typography variant="body">{`${observations} observaciones realizadas`}</Typography>
                </HStack>
            ) : (
                <Typography variant="body">{`${pending} condiciones pendientes`}</Typography>
            )}
        </VStack>
    );
};

const styles = StyleSheet.create({
    base: {
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
    },
    completed: {
        backgroundColor: "#f0fdf4",
        borderColor: "#22c55e",
    },
});

export default CategoryCard;
