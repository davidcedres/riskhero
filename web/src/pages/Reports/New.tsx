import { useQuery, useQueryClient } from 'react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    Area,
    Category,
    Condition,
    Evidence,
    Inspection,
    Observation,
    State,
    User,
    getStateColor,
    getStateTranslation
} from '../../api/interfaces'
import api from '../../api/api'
import {
    Anchor,
    Badge,
    Button,
    Image,
    Modal,
    Stack,
    Text,
    Textarea,
    Title
} from '@mantine/core'
import { useState } from 'react'
import colors from '../../colors'
import { useFieldArray, useForm } from 'react-hook-form'
import { IconAlertCircleFilled } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import es from 'date-fns/locale/es'

type Form = {
    observations: {
        id: number
        categoryId: number
        conditionId: number
        analysis: string
    }[]
    conclusion: string
}

const randomImage =
    'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fHww'

const NewReport = () => {
    // HOOKS
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { state } = useLocation()
    const inspectionId = Number(state.inspectionId)

    // FORM
    const { control, register, handleSubmit } = useForm<Form>()
    const { fields, replace } = useFieldArray({
        control,
        name: 'observations'
    })

    // STATE
    const [saving, setSaving] = useState(false)
    const [confirmation, setConfirmation] = useState(false)
    const [evidence, setEvidence] = useState(false)
    const [payloadBuffer, setPayloadBuffer] = useState<Form>()

    // QUERIES
    const inspectionRequest = useQuery(['FetchInspection', inspectionId], () =>
        api.get<Inspection & { area: Area; inspector: User; date: string }>(
            '/inspections/' + inspectionId
        )
    )

    const observationsRequest = useQuery(
        ['FetchObservations', inspectionId],
        () =>
            api.get<
                (Observation & {
                    condition: Condition
                    evidences: Evidence[]
                })[]
            >(`/observations`, {
                params: { inspectionId, state: 'BAD_ONES' }
            }),
        {
            onSuccess: ({ data: observations }) => {
                replace(
                    observations.map((observation) => ({
                        id: observation.id,
                        categoryId: observation.categoryId,
                        conditionId: observation.conditionId,
                        analysis: observation.analysis ?? ''
                    }))
                )
            }
        }
    )

    const categoriesRequest = useQuery(['FetchCategories'], () =>
        api.get<Category[]>(`/categories`)
    )

    // CALLBACKS
    const handleAttemptToSave = (payload: Form) => {
        setPayloadBuffer(payload)
        setConfirmation(true)
    }

    const onSubmit = async () => {
        if (payloadBuffer === undefined) return

        setSaving(true)

        const observationsWithAnalyses = payloadBuffer.observations.filter(
            (observation) => observation.analysis.length > 0
        )

        await Promise.all(
            observationsWithAnalyses.map((observation) =>
                api.patch('/observations/' + observation.id, {
                    analysis: observation.analysis
                })
            )
        )

        await api.patch('/inspections/' + inspectionId, {
            status: 'DONE'
        })

        await api.post('/reports', {
            inspectionId,
            conclusion: payloadBuffer.conclusion
        })

        await queryClient.invalidateQueries(['FetchReports'])
        await queryClient.invalidateQueries(['FetchInspections'])

        toast.success('Informe guardado')
        navigate('/reports', { replace: true })
    }

    if (
        observationsRequest.data === undefined ||
        categoriesRequest.data === undefined ||
        inspectionRequest.data === undefined
    )
        return null

    const observations = observationsRequest.data.data
    const categories = categoriesRequest.data.data
    const inspection = inspectionRequest.data.data

    return (
        <form onSubmit={handleSubmit(handleAttemptToSave)}>
            <Stack gap="xl">
                <Stack gap="0">
                    <Anchor component={Link} to="/reports">
                        ← Informes
                    </Anchor>

                    <Title my="md">Nuevo Informe</Title>

                    <Text>
                        Correspondiente a la inspección de{' '}
                        <strong>
                            <i>{inspection.area.name}</i>
                        </strong>{' '}
                        ejecutada el{' '}
                        <strong>
                            <i>
                                {format(
                                    new Date(inspection.date),
                                    "dd 'de' MMMM 'a las' h:mm bbb",
                                    {
                                        locale: es
                                    }
                                )}
                            </i>
                        </strong>{' '}
                        por el inspector{' '}
                        <strong>
                            <i>{inspection.inspector.name}.</i>
                        </strong>
                    </Text>
                </Stack>

                {categories.map((category) => {
                    const badObservations = observations.filter(
                        (observation) =>
                            [
                                State.MISSING,
                                State.NEEDS_REPAIR,
                                State.UNSAFE
                            ].includes(observation.state) &&
                            observation.categoryId === category.id
                    )

                    if (badObservations.length === 0) return

                    return (
                        <Stack
                            bg={colors.slate['50']}
                            p="md"
                            style={{ borderRadius: 8 }}
                        >
                            <Title size="h2">{category.name}</Title>

                            {badObservations.map((observation) => {
                                const index = fields.findIndex(
                                    (field) =>
                                        field.categoryId === category.id &&
                                        field.conditionId ===
                                            observation.conditionId
                                )

                                return (
                                    <Stack>
                                        <Title size="h3">
                                            {observation.condition.name}
                                        </Title>

                                        <Badge
                                            size="lg"
                                            color={
                                                colors[
                                                    getStateColor(
                                                        observation.state
                                                    )
                                                ]['500']
                                            }
                                            variant="light"
                                        >
                                            {getStateTranslation(
                                                observation.state
                                            )}
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

                                        <Textarea
                                            label="Analisis"
                                            minRows={5}
                                            autosize
                                            required
                                            placeholder={`Escriba su análisis sobre el estado de ${category.name}: ${observation.condition.name}.`}
                                            style={{
                                                borderWidth: 0,
                                                borderColor: 'red'
                                            }}
                                            {...register(
                                                `observations.${index}.analysis`,
                                                {
                                                    required: true
                                                }
                                            )}
                                        />
                                    </Stack>
                                )
                            })}
                        </Stack>
                    )
                })}

                <Stack bg={colors.slate['50']} p="md">
                    <Title size="h2">Conclusión</Title>

                    <Textarea
                        label="Conclusión final"
                        minRows={5}
                        autosize
                        required
                        placeholder="Escriba sus comentarios de cierre para finalizar el reporte."
                        {...register('conclusion', { required: true })}
                    />
                </Stack>

                <Button
                    style={{ alignSelf: 'flex-end' }}
                    onClick={handleSubmit(handleAttemptToSave)}
                >
                    Guardar Cambios
                </Button>

                <Modal
                    opened={evidence}
                    onClose={() => setEvidence(false)}
                    withCloseButton={false}
                    centered
                    overlayProps={{
                        backgroundOpacity: 0.25,
                        blur: 3
                    }}
                >
                    <Image src={randomImage} maw={512} mah={512} />
                </Modal>

                <Modal
                    opened={confirmation}
                    onClose={() => setConfirmation(false)}
                    centered
                    overlayProps={{
                        backgroundOpacity: 0.25,
                        blur: 3
                    }}
                    withCloseButton={false}
                >
                    <Stack align="center">
                        <IconAlertCircleFilled
                            size="4rem"
                            style={{
                                color: colors.orange['400']
                            }}
                        />

                        <Text ta="center">
                            Al realizar esta acción el informe será creado y la
                            inspección será marcada como finalizada.
                        </Text>

                        <Text>Esta acción no es reversible.</Text>

                        <Button onClick={onSubmit} loading={saving}>
                            Acepto
                        </Button>
                    </Stack>
                </Modal>
            </Stack>
        </form>
    )
}

export default NewReport
