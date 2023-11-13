import { router } from 'expo-router'
import { useStore } from '../../../state/store'
import { View } from 'react-native'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'
import Avatar from '../../../components/Avatar'

const Profile = () => {
    const { logout } = useStore()

    const handleLogout = () => {
        logout()
        router.replace('/sign-in')
    }

    return (
        <View
            style={{
                padding: 32,
                flex: 1,
                justifyContent: 'space-between',
                backgroundColor: 'white'
            }}
        >
            <VStack>
                <Avatar />
                <Typography variant="section">David Cedres</Typography>
            </VStack>

            <Button onPress={handleLogout}>Cerrar Sesión</Button>
        </View>
    )
}

export default Profile
