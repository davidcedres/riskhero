import { Link, router, useLocalSearchParams } from 'expo-router'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'
import { useStore } from '../../../state/store'
import { ScrollView, TouchableOpacity } from 'react-native'
import CategoryCard from '../../../components/CategoryCard'
import { useMemo } from 'react'
import { keyBy, values } from 'lodash'
import Button from '../../../components/Button'

const Inspection = () => {
    const { id } = useLocalSearchParams()
    if (typeof id !== 'string') throw new Error('BOOM')

    const inspection = useStore((store) => store.inspections.index[id])
    const closeInspection = useStore((store) => store.closeInspection)
    const area = useStore((store) => store.areas.index[inspection.areaId])
    const inspector = useStore((store) => store.users.index[inspection.userId])
    const categories = useStore((store) => store.categories)
    const categoryConditions = useStore((store) => store.categoryConditions)
    const observations = useStore((store) => store.observations)

    const statsPerCategory = useMemo(
        () =>
            keyBy(
                values(categories.index).map((category) => ({
                    id: category.id,
                    observations: values(observations.index).filter(
                        (observation) =>
                            observation.inspectionId === id &&
                            observation.categoryId === category.id
                    ).length,
                    conditions: values(categoryConditions.index).filter(
                        (condition) => condition.categoryId === category.id
                    ).length,
                })),
                'id'
            ),
        [categories, observations, categoryConditions]
    )

    // CALLBACKS
    const handleClose = () => {
        closeInspection(id)
        router.back()
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <VStack style={{ marginBottom: 16 }}>
                    <Typography variant="title">Inspeccion</Typography>
                    <Typography variant="body">{area.name}</Typography>
                    <Typography variant="body">{inspector.name}</Typography>
                </VStack>

                <VStack style={{ marginBottom: 16 }}>
                    {categories.ids
                        .map((id) => categories.index[id])
                        .map((category) => (
                            <Link
                                key={category.id}
                                href={{
                                    pathname: `/inspections/categories/${category.id}`,
                                    params: {
                                        inspectionId: id,
                                    },
                                }}
                                asChild
                            >
                                <TouchableOpacity>
                                    <CategoryCard
                                        category={category}
                                        observations={
                                            statsPerCategory[category.id]
                                                .observations
                                        }
                                        pending={
                                            statsPerCategory[category.id]
                                                .conditions -
                                            statsPerCategory[category.id]
                                                .observations
                                        }
                                    />
                                </TouchableOpacity>
                            </Link>
                        ))}
                </VStack>

                {inspection.status === 'OPEN' && (
                    <Button onPress={handleClose}>Terminar Inspeccion</Button>
                )}
            </VStack>
        </ScrollView>
    )
}

export default Inspection
