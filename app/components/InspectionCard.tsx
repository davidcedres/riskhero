import { Area, Inspection } from "../state/interfaces";
import { FC } from "react";
import { format } from "date-fns";
import { StyleSheet } from "react-native";
import Badge from "./Badge";
import Typography from "./Typography";
import VStack from "./VStack";

const InspectionCard: FC<{ inspection: Inspection; area: Area }> = ({
    inspection,
    area,
}) => {
    return (
        <VStack style={styles.base}>
            <Typography variant="subtitle">{area.name}</Typography>

            <VStack>
                <Typography variant="body">
                    {format(inspection.date, "MMMM dd")}
                </Typography>

                <Typography variant="body">2:00pm</Typography>
            </VStack>

            <Badge
                label={
                    inspection.type === "ANNOUNCED"
                        ? "Anunciada"
                        : "No Anunciada"
                }
                color="success"
            />
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
});

export default InspectionCard;
