import { router } from 'expo-router'
import Button from '../../../components/Button'
import { useStore } from '../../../state/store'
import VStack from '../../../components/VStack'
import Avatar from '../../../components/Avatar'
import Typography from '../../../components/Typography'
import { View } from 'react-native'

const Profile = () => {
    const { setLogged } = useStore()

    const handleLogout = () => {
        setLogged(false)
        router.replace('/sign-in')
    }

    return (
        <View
            style={{
                padding: 32,
                flex: 1,
                justifyContent: 'space-between',
                backgroundColor: 'white',
            }}
        >
            <VStack>
                <Avatar />
                <Typography variant="section">David Cedres</Typography>
                <Typography variant="body">v27340336</Typography>
            </VStack>
            <Button onPress={handleLogout}>Cerrar Sesion</Button>
        </View>
    )
}

export default Profile
