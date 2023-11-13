import { Anchor, Badge, Image, Stack, Text, Title } from '@mantine/core'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import {
    Category,
    Condition,
    Evidence,
    Observation,
    Report,
    State,
    getStateColor,
    getStateTranslation
} from '../../api/interfaces'
import api from '../../api/api'
import colors from '../../colors'
import { useMediaQuery } from '@mantine/hooks'
import es from 'date-fns/locale/es'
import { format } from 'date-fns'
import ula from '../../assets/ula-logo.png'

// TODO: this file is extremely similar to New.tsx
// reuse the right parts via custom hooks
const ReportDetails = () => {
    const { id } = useParams()
    const isPrint = useMediaQuery('print')

    const reportRequest = useQuery(['FetchReport', id], () =>
        api.get<Report>('/reports/' + id)
    )

    const ispectionId = reportRequest.data?.data.inspectionId

    const categoriesRequest = useQuery(['FetchCategories'], () =>
        api.get<Category[]>(`/categories`)
    )

    const observationsRequest = useQuery(
        ['FetchObservations', ispectionId],
        () =>
            api.get<
                (Observation & {
                    condition: Condition
                    evidences: Evidence[]
                })[]
            >(`/observations`, {
                params: { inspectionId: ispectionId, state: 'BAD_ONES' }
            }),
        {
            enabled: Boolean(ispectionId)
        }
    )

    if (
        reportRequest.data === undefined ||
        observationsRequest.data === undefined ||
        categoriesRequest.data === undefined
    )
        return null

    const report = reportRequest.data.data
    const observations = observationsRequest.data.data

    const categoriesWithBadObservations = categoriesRequest.data.data.filter(
        (category) =>
            observations.filter(
                (observation) =>
                    [State.MISSING, State.NEEDS_REPAIR, State.UNSAFE].includes(
                        observation.state
                    ) && observation.categoryId === category.id
            ).length > 0
    )

    return (
        <Stack>
            {isPrint === false && (
                <Anchor component={Link} to="/reports">
                    ← Reportes
                </Anchor>
            )}

            <Image src={ula} w={256} />

            <Title>Informe</Title>

            <Text>
                Correspondiente a la inspección de{' '}
                <strong>
                    <i>{report.inspection.area.name}</i>
                </strong>{' '}
                ejecutada el{' '}
                <strong>
                    <i>
                        {format(
                            new Date(report.inspection.date),
                            "dd 'de' MMMM 'a las' h:mm bbb",
                            {
                                locale: es
                            }
                        )}
                    </i>
                </strong>{' '}
                por el inspector{' '}
                <strong>
                    <i>{report.inspection.inspector.name}.</i>
                </strong>
            </Text>

            {categoriesWithBadObservations.map((category, index) => {
                const categoryObservations = observations.filter(
                    (observation) => observation.categoryId === category.id
                )

                if (categoryObservations.length === 0) return

                return (
                    <Stack style={{ borderRadius: 8 }}>
                        <Title size="h2">{category.name}</Title>

                        {categoryObservations.map((observation) => {
                            return (
                                <Stack>
                                    <Title size="h3">
                                        {observation.condition.name}
                                    </Title>

                                    <Badge
                                        size="lg"
                                        color={
                                            colors[
                                                getStateColor(observation.state)
                                            ]['500']
                                        }
                                        variant="light"
                                    >
                                        {getStateTranslation(observation.state)}
                                    </Badge>

                                    <Text fs="italic">
                                        {observation.description}
                                    </Text>

                                    <Image
                                        src={observation.evidences[0].url}
                                        maw={128}
                                        mah={128}
                                        style={{
                                            cursor: 'pointer',
                                            borderRadius: 4
                                        }}
                                        onClick={() => setEvidence(true)}
                                    />

                                    <Text>{observation.analysis}</Text>
                                </Stack>
                            )
                        })}
                    </Stack>
                )
            })}

            <Stack>
                <Title size="h2">Conclusión</Title>
                <Text>{report.conclusion}</Text>
            </Stack>
        </Stack>
    )
}

export default ReportDetails
