import { SafeAreaView, Text, View } from 'react-native'
import { useCallback } from 'react'
import { router, useFocusEffect } from 'expo-router'
import { useStore } from '../../state/store'
import sync from './sync'
import Typography from '../../components/Typography'
import VStack from '../../components/VStack'
import Button from '../../components/Button'
import LottieView from 'lottie-react-native'

const Sync = () => {
    const state = useStore((store) => store.sync)

    useFocusEffect(useCallback(() => void sync(), []))

    const navigateAway = () => router.replace('/inspections')

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
                            <Typography variant="body">
                                Esto podria tardar varios minutos.
                            </Typography>
                        )}
                    </VStack>
                </VStack>

                {state.loading === false && (
                    <LottieView
                        autoPlay
                        style={{
                            width: 200,
                            height: 200,
                            alignSelf: 'center'
                        }}
                        source={require('../../assets/check.json')}
                        onAnimationFinish={navigateAway}
                        loop={false}
                    />
                )}

                <Text></Text>
            </View>
        </SafeAreaView>
    )
}

export default Sync
