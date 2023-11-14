import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import Typography from '../../../../../components/Typography'
import VStack from '../../../../../components/VStack'
import HStack from '../../../../../components/HStack'
import Button from '../../../../../components/Button'
import { useRef, useState } from 'react'
import {
    State,
    getStateColor,
    getStateIcon,
    getStateLabel
} from '../../../../../state/interfaces'
import StateCard from '../../../../../components/StateCard'
import { router, useLocalSearchParams } from 'expo-router'
import { useStore } from '../../../../../state/store'
import { Camera, CameraType } from 'expo-camera'
import * as FileSystem from 'expo-file-system'

const Observation = () => {
    // HOOKS
    const { inspectionId, categoryId, conditionId, conditionName } =
        useLocalSearchParams()

    if (
        typeof inspectionId !== 'string' ||
        typeof categoryId !== 'string' ||
        typeof conditionId !== 'string' ||
        typeof conditionName !== 'string'
    )
        throw new Error('Bad params')

    // CAMERA STATE
    const [stage, setStage] = useState<
        'PICK_STATE' | 'TAKE_PICTURE' | 'WRITE_CAPTION'
    >('PICK_STATE')
    const cameraRef = useRef<Camera>()

    // TRANSIENT STATE / BUFFERS
    const [state, setState] = useState<State>()
    const [description, setDescription] = useState('')
    const [filename, setFilename] = useState<string>()

    // DATA AND MUTATORS
    const category = useStore((store) => store.categories.index[categoryId])
    const createSimpleObservation = useStore(
        (store) => store.createSimpleObservation
    )
    const createObservationWithEvidence = useStore(
        (store) => store.createObservationWithEvidence
    )

    // CALLBACKS
    const close = () => {
        router.back()
    }

    const saveState = async () => {
        if (state === undefined) return

        if (state === State.ACCEPTABLE) {
            createSimpleObservation({
                inspectionId: Number(inspectionId),
                categoryId: Number(categoryId),
                conditionId: Number(conditionId),
                state,
                description: 'Condición en buen estado'
            })

            return close()
        }

        const { status } = await Camera.requestCameraPermissionsAsync()

        if (status === 'granted') {
            return setStage('TAKE_PICTURE')
        }
    }

    const savePicture = async () => {
        if (cameraRef.current === undefined)
            throw new Error('camera instance not found')

        const { uri } = await cameraRef.current.takePictureAsync()
        const filename = uri.split('/').pop()

        if (FileSystem.documentDirectory === null) {
            throw new Error('App does not have access to document directory')
        }

        const evidencesDirectory = await FileSystem.getInfoAsync(
            FileSystem.documentDirectory + '/evidences'
        )

        if (evidencesDirectory.exists === false) {
            await FileSystem.makeDirectoryAsync(
                FileSystem.documentDirectory + 'evidences'
            )
        }

        await FileSystem.copyAsync({
            from: uri,
            to: FileSystem.documentDirectory + `evidences/` + filename
        })

        setFilename(filename)
        setStage('WRITE_CAPTION')
    }

    const saveCaption = () => {
        if (state === undefined || filename === undefined)
            throw new Error(
                'Bad logic, state and filename must be defined by now'
            )

        createObservationWithEvidence({
            observation: {
                inspectionId: Number(inspectionId),
                categoryId: Number(categoryId),
                conditionId: Number(conditionId),
                state,
                description
            },
            evidence: {
                filename
            }
        })

        close()
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack
                style={{
                    padding: 32,
                    justifyContent: 'space-between'
                }}
            >
                <VStack>
                    <VStack>
                        <Typography variant="title">{category.name}</Typography>
                        <Typography variant="section">
                            {conditionName}
                        </Typography>
                    </VStack>

                    {stage === 'PICK_STATE' && (
                        <>
                            <VStack style={{ gap: 32 }}>
                                <HStack style={styles.horizontal}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            setState(State.ACCEPTABLE)
                                        }
                                    >
                                        <StateCard
                                            highlited={
                                                state === State.ACCEPTABLE
                                            }
                                            icon={getStateIcon(
                                                State.ACCEPTABLE
                                            )}
                                            label={getStateLabel(
                                                State.ACCEPTABLE
                                            )}
                                            color={getStateColor(
                                                State.ACCEPTABLE
                                            )}
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
                                        onPress={() =>
                                            setState(State.NEEDS_REPAIR)
                                        }
                                    >
                                        <StateCard
                                            highlited={
                                                state === State.NEEDS_REPAIR
                                            }
                                            icon={getStateIcon(
                                                State.NEEDS_REPAIR
                                            )}
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

                            <Button onPress={saveState}>Continuar</Button>
                        </>
                    )}

                    {stage === 'TAKE_PICTURE' && (
                        <>
                            <View style={styles.preview}>
                                <Camera
                                    type={CameraType.back}
                                    style={styles.camera}
                                    // @ts-expect-error -- not sure how to type this up
                                    ref={cameraRef}
                                />
                            </View>

                            <Button onPress={savePicture}>
                                Capturar Evidencia
                            </Button>
                        </>
                    )}

                    {stage === 'WRITE_CAPTION' && (
                        <>
                            <TextInput
                                multiline={true}
                                numberOfLines={10}
                                value={description}
                                onChangeText={setDescription}
                                style={styles.textarea}
                            />

                            <Button onPress={saveCaption}>Guardar</Button>
                        </>
                    )}
                </VStack>
            </VStack>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    horizontal: {
        justifyContent: 'center',
        gap: 32
    },
    camera: {
        height: 320,
        width: '100%'
    },
    preview: {
        borderRadius: 8,
        overflow: 'hidden'
    },
    textarea: {
        height: 256,
        padding: 8,
        borderWidth: 1,
        borderColor: '#64748b',
        borderRadius: 8,
        lineHeight: 24
    }
})

export default Observation
