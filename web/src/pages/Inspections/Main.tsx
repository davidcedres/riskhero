import { Badge, Button, Flex, Stack, Table, Text, Title } from "@mantine/core";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Inspection, InspectionExtended } from "../../api/interfaces";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const Inspections = () => {
    const navigate = useNavigate();

    const query = useQuery(["FetchInspections"], () =>
        api.get<InspectionExtended[]>("/inspections")
    );

    const inspections =
        query.data?.data.map((inspection) => ({
            ...inspection,
            date: new Date(inspection.date),
        })) ?? [];

    const rows = inspections.map((inspection) => {
        const actionMap: Record<
            Inspection["status"],
            { color: string; label: string }
        > = {
            OPEN: {
                label: "Pendiente Por Inspeccion",
                color: "#123123",
            },
            CLOSED: {
                label: "Pendiente Por Informe",
                color: "#123123",
            },
            DONE: {
                label: "Finalizado",
                color: "#123123",
            },
        };

        const onClick = () => {
            navigate(String(inspection.id));
        };

        return (
            <Table.Tr
                key={inspection.id}
                onClick={onClick}
                style={{ cursor: "pointer" }}
            >
                <Table.Td>
                    <Text>{inspection.area.name}</Text>
                </Table.Td>
                <Table.Td>
                    <Badge color="black">
                        {format(inspection.date, "MMMM dd,  h:mm bbb", {
                            locale: es,
                        })}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Flex align="center" gap="sm">
                        <Text>{inspection.inspector.name}</Text>
                    </Flex>
                </Table.Td>
                <Table.Td>
                    <Badge color="green">{inspection.type}</Badge>
                </Table.Td>
                <Table.Td>
                    <Badge color="orange">
                        {actionMap[inspection.status].label}
                    </Badge>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Stack>
            <Flex justify="space-between">
                <Title>Inspecciones</Title>

                <Button component={Link} to="new" color="black">
                    Nueva
                </Button>
            </Flex>

            <Table verticalSpacing="lg">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Area</Table.Th>
                        <Table.Th>Fecha</Table.Th>
                        <Table.Th>Inspector</Table.Th>
                        <Table.Th>Tipo</Table.Th>
                        <Table.Th>Acción</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Stack>
    );
};

export default Inspections;
