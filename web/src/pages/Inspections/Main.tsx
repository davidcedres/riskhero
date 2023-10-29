import { Area, Inspection, User } from '../../api/interfaces'
import {
    Badge,
    Button,
    Flex,
    Loader,
    Stack,
    Table,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import { format } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import api from '../../api/api'
import es from 'date-fns/locale/es'
import Relaxed from '../../components/Relaxed'
import { useContext } from 'react'
import { SessionContext } from '../../utils/useSession'
import { findColor } from '../../utils/findColor'
import { truncate } from 'lodash'

const Inspections = () => {
    const session = useContext(SessionContext)
    const navigate = useNavigate()

    const query = useQuery(['FetchInspections'], () =>
        api.get<
            (Inspection & {
                area: Area
                inspector: User
                date: string
            })[]
        >('/inspections')
    )

    const inspections =
        query.data?.data.map((inspection) => ({
            ...inspection,
            date: new Date(inspection.date)
        })) ?? []

    const emptyMessage =
        session.role === 'EMPLOYEE'
            ? 'Parece que no tienes trabajo asignado, comunícalo a tu superior.'
            : 'Parece que no hay inspecciones planificadas aún, empieza planificando una.'

    const rows = inspections.map((inspection) => {
        const actionMap: Record<
            Inspection['status'],
            { color: string; label: string }
        > = {
            OPEN: {
                label: 'Pendiente Por Inspeccion',
                color: '#123123'
            },
            CLOSED: {
                label: 'Pendiente Por Informe',
                color: '#123123'
            },
            DONE: {
                label: 'Finalizado',
                color: '#123123'
            }
        }

        const typeMap: Record<Inspection['type'], string> = {
            ANNOUNCED: 'Anunciada',
            UNANNOUNCED: 'No Anunciada'
        }

        const onClick = () => {
            navigate(String(inspection.id))
        }

        return (
            <Table.Tr
                key={inspection.id}
                onClick={onClick}
                style={{ cursor: 'pointer' }}
            >
                <Table.Td>
                    <Tooltip label={inspection.area.name} position="top-start">
                        <Text>{truncate(inspection.area.name)}</Text>
                    </Tooltip>
                </Table.Td>
                <Table.Td>
                    <Badge variant="light">
                        {format(inspection.date, 'MMMM dd,  h:mm bbb', {
                            locale: es
                        })}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Flex align="center" gap="sm">
                        <Text>{inspection.inspector.name}</Text>
                    </Flex>
                </Table.Td>
                <Table.Td>
                    <Badge
                        color={findColor(typeMap[inspection.type])}
                        variant="light"
                    >
                        {typeMap[inspection.type]}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Badge
                        color={findColor(actionMap[inspection.status].label)}
                        variant="light"
                    >
                        {actionMap[inspection.status].label}
                    </Badge>
                </Table.Td>
            </Table.Tr>
        )
    })

    if (query.isFetched === false) return <Loader />

    return (
        <Stack>
            <Flex justify="space-between">
                <Title>Inspecciones</Title>

                {session.role === 'MANAGER' && (
                    <Button component={Link} to="new">
                        Nueva
                    </Button>
                )}
            </Flex>

            {rows.length > 0 && (
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
            )}

            {rows.length === 0 && (
                <Stack align="center" pt="lg">
                    <Relaxed />
                    <Text>{emptyMessage}</Text>
                </Stack>
            )}
        </Stack>
    )
}

export default Inspections
