import { Link, useLocalSearchParams } from 'expo-router'
import Typography from '../../../../components/Typography'
import VStack from '../../../../components/VStack'
import { useStore } from '../../../../state/store'
import ConditionCard from '../../../../components/ConditionCard'
import { useMemo } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { keyBy, values } from 'lodash'

const Category = () => {
    const { id, inspectionId } = useLocalSearchParams()
    if (typeof id !== 'string' || typeof inspectionId !== 'string')
        throw new Error('BOOM')

    const category = useStore((store) => store.categories.index[id])
    const categoryConditions = useStore((store) => store.categoryConditions)
    const conditions = useStore((store) => store.conditions)
    const observations = useStore((store) => store.observations)

    const conditionIds = categoryConditions.ids
        .map((id) => categoryConditions.index[id])
        .filter((categoryCondition) => categoryCondition.categoryId === id)
        .map((categoryCondition) => categoryCondition.conditionId)

    const conditionsForCategory = useMemo(
        () => conditionIds.map((id) => conditions.index[id]),
        [conditionIds, conditions]
    )

    const observationsForThisInspectionAndCategory = useMemo(
        () =>
            keyBy(
                values(observations.index).filter(
                    (observation) =>
                        observation.inspectionId === inspectionId &&
                        observation.categoryId === id
                ),
                'conditionId'
            ),
        [observations, inspectionId, id]
    )

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Typography variant="title">{category.name}</Typography>

                <Typography variant="section">Condiciones</Typography>

                {conditionsForCategory.map((condition) => (
                    <Link
                        key={condition.id}
                        href={{
                            pathname:
                                '/inspections/categories/observations/new',
                            params: {
                                inspectionId,
                                categoryId: id,
                                conditionId: condition.id,
                            },
                        }}
                        asChild
                    >
                        <TouchableOpacity>
                            <ConditionCard
                                key={condition.id}
                                condition={condition}
                                state={
                                    observationsForThisInspectionAndCategory[
                                        condition.id
                                    ]?.state
                                }
                            />
                        </TouchableOpacity>
                    </Link>
                ))}
            </VStack>
        </ScrollView>
    )
}

export default Category
