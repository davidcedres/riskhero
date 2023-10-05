import {
    Avatar,
    Badge,
    Button,
    Flex,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { InspectionExtended } from "../../api/interfaces";
import { format } from "date-fns";

const Inspections = () => {
    const query = useQuery(["FetchInspections"], () =>
        api.get<InspectionExtended[]>("/inspections")
    );

    const inspections =
        query.data?.data.map((inspection) => ({
            ...inspection,
            date: new Date(inspection.date),
        })) ?? [];

    const rows = inspections.map((inspection) => (
        <Table.Tr key={inspection.id}>
            <Table.Td>
                <Text>{inspection.area.name}</Text>
            </Table.Td>
            <Table.Td>
                <Text>{format(inspection.date, "MMMM dd")}</Text>
            </Table.Td>
            <Table.Td>
                <Flex align="center" gap="sm">
                    <Avatar>{inspection.inspector.name[0]}</Avatar>
                    <Text>{inspection.inspector.name}</Text>
                </Flex>
            </Table.Td>
            <Table.Td>
                <Badge color="lime">{inspection.type}</Badge>
            </Table.Td>
            <Table.Td>
                <Badge color="orange">{inspection.status}</Badge>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Stack>
            <Flex justify="space-between">
                <Title>Inspecciones</Title>
                <Button
                    component={Link}
                    to="new"
                    color="black"
                    variant="gradient"
                >
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
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Stack>
    );
};

export default Inspections;
