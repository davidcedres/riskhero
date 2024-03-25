import { every, keyBy, values } from 'lodash'
import { Link, router, useLocalSearchParams } from 'expo-router'
import { ScrollView, TouchableOpacity } from 'react-native'
import { State } from '../../../../state/interfaces'
import { useMemo } from 'react'
import { useStore } from '../../../../state/store'
import Button from '../../../../components/Button'
import ConditionCard from '../../../../components/ConditionCard'
import Typography from '../../../../components/Typography'
import VStack from '../../../../components/VStack'

const Category = () => {
    const { id, inspectionId } = useLocalSearchParams()
    if (typeof id !== 'string' || typeof inspectionId !== 'string')
        throw new Error(
            'params.id not string or params.inspectionId not string'
        )

    const category = useStore((store) => store.categories.index[id])
    const observations = useStore((store) => store.observations)
    const createSimpleObservation = useStore(
        (store) => store.createSimpleObservation
    )

    const observationsAlreadyMade = useMemo(
        () =>
            values(observations.index).filter(
                (observation) =>
                    observation.inspectionId === Number(inspectionId) &&
                    observation.categoryId === Number(id)
            ),
        [observations.index]
    )

    const observationsPerCondition = useMemo(
        () => keyBy(observationsAlreadyMade, 'conditionId'),
        [observations, inspectionId, id]
    )

    const omitCategory = () => {
        category.conditions.forEach((condition) => {
            createSimpleObservation({
                inspectionId: Number(inspectionId),
                categoryId: Number(id),
                conditionId: condition.id,
                state: State.SKIPPED,
                description: 'No Aplica'
            })
        })

        router.back()
    }

    const hasObservations = observationsAlreadyMade.length > 0

    const isSkipped =
        observationsAlreadyMade.length === category.conditions.length &&
        every(
            observationsPerCondition,
            (observation) => observation.state === State.SKIPPED
        )

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Link href={'/inspections/' + inspectionId}>Regresar</Link>

                <Typography variant="title">{category.name}</Typography>

                <Typography variant="section">Condiciones</Typography>

                {category.conditions.map((condition) => (
                    <Link
                        key={condition.id}
                        href={{
                            pathname:
                                '/inspections/categories/observations/new',
                            params: {
                                inspectionId,
                                categoryId: id,
                                conditionId: condition.id,
                                conditionName: condition.name
                            }
                        }}
                        asChild
                    >
                        <TouchableOpacity>
                            <ConditionCard
                                key={condition.id}
                                condition={condition}
                                state={
                                    observationsPerCondition[condition.id]
                                        ?.state
                                }
                            />
                        </TouchableOpacity>
                    </Link>
                ))}

                {hasObservations === false && isSkipped === false && (
                    <Button
                        onPress={omitCategory}
                        style={{ backgroundColor: '#ef4444' }}
                    >
                        Omitir
                    </Button>
                )}
            </VStack>
        </ScrollView>
    )
}

export default Category
