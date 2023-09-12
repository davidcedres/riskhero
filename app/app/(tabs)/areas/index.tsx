import { ScrollView } from 'react-native'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'
import { Link } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import { useStore } from '../../../state/store'
import AreaCard from '../../../components/AreaCard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { palette } from '../../../theme'

const Areas = () => {
    const areas = useStore((store) => store.areas)

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Link href="/areas/new" style={{ alignSelf: 'flex-end' }}>
                    <Feather size={28} name="edit" color={palette.main} />
                </Link>

                <Typography variant="title">Areas de Trabajo</Typography>

                {areas.ids
                    .map((id) => areas.index[id])
                    .map((area) => (
                        <Link key={area.id} href={'/areas/' + area.id} asChild>
                            <TouchableOpacity>
                                <AreaCard area={area} />
                            </TouchableOpacity>
                        </Link>
                    ))}
            </VStack>
        </ScrollView>
    )
}
export default Areas
