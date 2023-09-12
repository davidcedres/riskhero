import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import Typography from '../../../../../components/Typography'
import VStack from '../../../../../components/VStack'
import HStack from '../../../../../components/HStack'
import Button from '../../../../../components/Button'
import { useState } from 'react'
import {
    State,
    getStateColor,
    getStateIcon,
    getStateLabel,
} from '../../../../../state/interfaces'
import StateCard from '../../../../../components/StateCard'
import { router, useLocalSearchParams } from 'expo-router'
import { useStore } from '../../../../../state/store'
import toast from 'react-hot-toast/headless'

const Observation = () => {
    const { inspectionId, categoryId, conditionId } = useLocalSearchParams()
    if (
        typeof inspectionId !== 'string' ||
        typeof categoryId !== 'string' ||
        typeof conditionId !== 'string'
    )
        throw new Error('BOOM')

    const category = useStore((store) => store.categories.index[categoryId])
    const condition = useStore((store) => store.conditions.index[conditionId])
    const createObservation = useStore((store) => store.createObservation)

    const [state, setState] = useState<State>()

    const handleCreate = () => {
        if (state === undefined) return

        createObservation({
            inspectionId,
            categoryId,
            conditionId,
            state,
        })

        router.back()

        toast('Guardado', {
            icon: '✅',
        })
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack
                style={{
                    padding: 32,
                    justifyContent: 'space-between',
                }}
            >
                <VStack>
                    <VStack>
                        <Typography variant="title">{category.name}</Typography>
                        <Typography variant="section">
                            {condition.name}
                        </Typography>
                    </VStack>

                    <VStack style={{ gap: 32 }}>
                        <HStack style={styles.horizontal}>
                            <TouchableOpacity
                                onPress={() => setState(State.ACCEPTABLE)}
                            >
                                <StateCard
                                    highlited={state === State.ACCEPTABLE}
                                    icon={getStateIcon(State.ACCEPTABLE)}
                                    label={getStateLabel(State.ACCEPTABLE)}
                                    color={getStateColor(State.ACCEPTABLE)}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setState(State.UNSAFE)}
                            >
                                <StateCard
                                    highlited={state === State.UNSAFE}
                                    icon={getStateIcon(State.UNSAFE)}
                                    label={getStateLabel(State.UNSAFE)}
                                    color={getStateColor(State.UNSAFE)}
                                />
                            </TouchableOpacity>
                        </HStack>

                        <HStack style={styles.horizontal}>
                            <TouchableOpacity
                                onPress={() => setState(State.MISSING)}
                            >
                                <StateCard
                                    highlited={state === State.MISSING}
                                    icon={getStateIcon(State.MISSING)}
                                    label={getStateLabel(State.MISSING)}
                                    color={getStateColor(State.MISSING)}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setState(State.NEEDS_REPAIR)}
                            >
                                <StateCard
                                    highlited={state === State.NEEDS_REPAIR}
                                    icon={getStateIcon(State.NEEDS_REPAIR)}
                                    label={getStateLabel(State.NEEDS_REPAIR)}
                                    color={getStateColor(State.NEEDS_REPAIR)}
                                />
                            </TouchableOpacity>
                        </HStack>
                    </VStack>
                </VStack>

                <Button onPress={handleCreate}>Guardar</Button>
            </VStack>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    horizontal: {
        justifyContent: 'center',
        gap: 32,
    },
})

export default Observation
