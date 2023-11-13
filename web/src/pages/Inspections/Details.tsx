import {
    Anchor,
    Badge,
    Button,
    Flex,
    SimpleGrid,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/api'
import {
    Area,
    Category,
    Inspection,
    Observation,
    User,
    getStateColor,
    getStateTranslation
} from '../../api/interfaces'
import { keyBy, merge } from 'lodash'
import colors from '../../colors'
import { format } from 'date-fns'
import es from 'date-fns/locale/es'
import { SessionContext } from '../../utils/useSession'
import { useContext } from 'react'

const Details = () => {
    const { id } = useParams()
    const session = useContext(SessionContext)

    const inspectionRequest = useQuery(['FetchInspection', id], () =>
        api.get<Inspection & { area: Area; inspector: User; date: string }>(
            '/inspections/' + id
        )
    )

    const observationsRequest = useQuery(
        ['FetchObservations', id],
        () =>
            api.get<Observation[]>(`/observations`, {
                params: { inspectionId: id }
            }),
        {
            select: ({ data }) =>
                keyBy(
                    data.map((observation) =>
                        merge(observation, {
                            key: `${observation.categoryId}-${observation.conditionId}`
                        })
                    ),
                    'key'
                )
        }
    )

    const categoriesRequest = useQuery(['FetchCategories'], () =>
        api.get<Category[]>(`/categories`)
    )

    if (
        observationsRequest.data === undefined ||
        categoriesRequest.data === undefined ||
        inspectionRequest.data === undefined
    )
        return null

    const userShouldCreateReport =
        session.id === inspectionRequest.data.data.inspector.id &&
        inspectionRequest.data.data.status === 'CLOSED'

    return (
        <Stack>
            <Anchor component={Link} to="/inspections">
                ← Inspecciones
            </Anchor>

            <Flex justify="space-between" my="md">
                <Stack gap="xs">
                    <Title>{inspectionRequest.data.data.area.name}</Title>

                    <Badge variant="light">
                        {format(
                            new Date(inspectionRequest.data.data.date),
                            'MMMM dd - h:mm bbb',
                            {
                                locale: es
                            }
                        )}
                    </Badge>
                </Stack>

                {userShouldCreateReport && (
                    <Button
                        component={Link}
                        to="/reports/new"
                        state={{ inspectionId: id }}
                    >
                        Crear Informe
                    </Button>
                )}
            </Flex>

            {categoriesRequest.data?.data.map((category) => (
                <Stack>
                    <Text fz="lg" fw="bold">
                        {category.name}
                    </Text>

                    <SimpleGrid cols={3}>
                        {category.conditions.map((condition) => {
                            const observation =
                                observationsRequest.data[
                                    `${category.id}-${condition.id}`
                                ]

                            const bgColor =
                                observation === undefined
                                    ? colors.slate['100']
                                    : colors[getStateColor(observation.state)][
                                          '500'
                                      ]

                            const badgeColor =
                                observation === undefined
                                    ? 'gray'
                                    : colors[getStateColor(observation.state)][
                                          '700'
                                      ]

                            const textColor = observation ? 'white' : 'black'

                            return (
                                <Stack
                                    p="lg"
                                    bg={bgColor}
                                    style={{ borderRadius: 8 }}
                                >
                                    <Text c={textColor} fw="bold">
                                        {condition.name}
                                    </Text>

                                    <Badge color={badgeColor}>
                                        {observation
                                            ? getStateTranslation(
                                                  observation.state
                                              )
                                            : 'Pendiente'}
                                    </Badge>
                                </Stack>
                            )
                        })}
                    </SimpleGrid>
                </Stack>
            ))}
        </Stack>
    )
}

export default Details
