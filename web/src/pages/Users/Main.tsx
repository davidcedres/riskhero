import { Badge, Button, Flex, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "react-query";
import api from "../../api/api";
import { User } from "../../api/interfaces";

const Users = () => {
    const query = useQuery(["FetchUsers"], () => api.get<User[]>("/users"));

    return (
        <Stack>
            <Flex justify="space-between" mb="lg">
                <Title>Usuarios</Title>
                <Button>Nuevo</Button>
            </Flex>

            {query.data?.data.map((user) => (
                <Flex
                    justify="space-between"
                    bg="#f8fafc"
                    p="lg"
                    style={{ borderRadius: 8 }}
                >
                    <Stack>
                        <Text fw="bold">{user.name}</Text>
                        <Text>{user.email}</Text>
                    </Stack>

                    <Badge>{user.role}</Badge>
                </Flex>
            ))}
        </Stack>
    );
};

export default Users;
