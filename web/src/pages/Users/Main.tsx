import {
    Badge,
    Button,
    Flex,
    Loader,
    Stack,
    Table,
    Text,
    Title
} from '@mantine/core'
import { findColor } from '../../utils/findColor'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { User } from '../../api/interfaces'
import api from '../../api/api'

const Users = () => {
    const query = useQuery(['FetchUsers'], () => api.get<User[]>('/users'))

    const users = query.data?.data ?? []

    if (query.isFetched === false) return <Loader />

    return (
        <Stack>
            <Flex justify="space-between" mb="lg">
                <Title>Usuarios</Title>

                <Button component={Link} to="new">
                    Nuevo
                </Button>
            </Flex>

            <Table verticalSpacing="lg">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Rol</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {users.map((user) => (
                        <Table.Tr key={user.id}>
                            <Table.Td>
                                <Text>{user.name}</Text>
                            </Table.Td>
                            <Table.Td>
                                <Text>{user.email}</Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge
                                    color={findColor(user.role)}
                                    variant="light"
                                >
                                    {user.role}
                                </Badge>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Stack>
    )
}

export default Users
