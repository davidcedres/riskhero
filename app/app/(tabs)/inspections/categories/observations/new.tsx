import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Typography from '../../../../../components/Typography'
import VStack from '../../../../../components/VStack'
import HStack from '../../../../../components/HStack'
import Button from '../../../../../components/Button'
import { useRef, useState } from 'react'
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
import { Camera, CameraType } from 'expo-camera'
import { first, values } from 'lodash'

const Observation = () => {
    // HOOKS
    const { inspectionId, categoryId, conditionId } = useLocalSearchParams()

    // CAMERA STATE
    const cameraRef = useRef<Camera>()
    const [camera, setCamera] = useState(false)

    // OBSERVATION STATE
    const [state, setState] = useState<State>()

    // VALIDATE PARAMS
    if (
        typeof inspectionId !== 'string' ||
        typeof categoryId !== 'string' ||
        typeof conditionId !== 'string'
    )
        throw new Error('BOOM')

    // DATA AND MUTATORS
    const category = useStore((store) => store.categories.index[categoryId])
    const condition = useStore((store) => store.conditions.index[conditionId])
    const createObservation = useStore((store) => store.createObservation)
    const createEvidence = useStore((store) => store.createEvidence)
    const observationId = useStore(
        (store) =>
            first(
                values(store.observations.index).filter(
                    (observation) =>
                        observation.inspectionId === inspectionId &&
                        observation.categoryId === categoryId &&
                        observation.conditionId === conditionId
                )
            )?.id
    )

    // CALLBACKS
    const createObservationAndAskEvidence = async () => {
        if (state === undefined) return

        createObservation({
            inspectionId,
            categoryId,
            conditionId,
            state,
            description:
                state === State.ACCEPTABLE ? 'Aspecto en buen estado' : '',
        })

        const { status } = await Camera.requestCameraPermissionsAsync()

        if (status === 'granted') {
            return setCamera(true)
        }

        throw new Error('Bro')
    }

    const captureEvidence = async () => {
        if (cameraRef.current === undefined || observationId === undefined)
            throw new Error('BOOM')

        const { uri } = await cameraRef.current?.takePictureAsync()
        createEvidence({ data: uri, observationId })

        router.back()
        toast('Guardado', {
            icon: '✅',
        })
    }

    // BUTTON VALUES
    const buttonText = camera ? 'Capturar Evidencia' : 'Continuar'

    const buttonAction = camera
        ? captureEvidence
        : createObservationAndAskEvidence

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

                    {camera ? (
                        <View style={styles.preview}>
                            <Camera
                                type={CameraType.back}
                                style={styles.camera}
                                // @ts-expect-error -- not sure how to type this up
                                ref={cameraRef}
                            />
                        </View>
                    ) : (
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
                                        label={getStateLabel(
                                            State.NEEDS_REPAIR
                                        )}
                                        color={getStateColor(
                                            State.NEEDS_REPAIR
                                        )}
                                    />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    )}
                </VStack>

                <Button onPress={buttonAction}>{buttonText}</Button>
            </VStack>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    horizontal: {
        justifyContent: 'center',
        gap: 32,
    },
    camera: {
        height: 320,
        width: '100%',
    },
    preview: {
        borderRadius: 16,
        overflow: 'hidden',
    },
})

export default Observation
