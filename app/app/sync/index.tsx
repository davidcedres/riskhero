import { ActivityIndicator, SafeAreaView, View } from 'react-native'
import { useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { useStore } from '../../state/store'
import sync from './sync'
import Typography from '../../components/Typography'
import VStack from '../../components/VStack'
import Button from '../../components/Button'

const Sync = () => {
    const state = useStore((store) => store.sync)

    useFocusEffect(useCallback(() => void sync(), []))

    const navigateAway = router.back

    const title = state.loading
        ? 'Sincronizando con el servidor'
        : 'Sincronización finalizada'

    return (
        <SafeAreaView>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '100%',
                    padding: 16
                }}
            >
                <VStack style={{ gap: 96 }}>
                    <VStack>
                        <Typography variant="title">{title}</Typography>

                        {state.loading && (
                            <View style={{ marginTop: 25 }}>
                                <ActivityIndicator />
                            </View>
                        )}
                    </VStack>
                </VStack>

                {state.loading === false && (
                    <Button onPress={navigateAway}>Continuar</Button>
                )}
            </View>
        </SafeAreaView>
    )
}

export default Sync
