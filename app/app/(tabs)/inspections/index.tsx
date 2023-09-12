import VStack from '../../../components/VStack'
import Typography from '../../../components/Typography'
import { ScrollView } from 'react-native-gesture-handler'
import InspectionCard from '../../../components/InspectionCard'
import { Link } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import { useStore } from '../../../state/store'
import { Pressable, TouchableOpacity } from 'react-native'
import { palette } from '../../../theme'

const Inspections = () => {
    const inspections = useStore((store) => store.inspections)
    const areas = useStore((store) => store.areas)

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Link href="/inspections/new" style={{ alignSelf: 'flex-end' }}>
                    <Feather size={28} name="edit" color={palette.main} />
                </Link>
                <Typography variant="title">Proximas Inspecciones</Typography>

                {inspections.ids
                    .map((id) => inspections.index[id])
                    .map((inspection) => (
                        <Link
                            key={inspection.id}
                            href={'/inspections/' + inspection.id}
                            asChild
                        >
                            <TouchableOpacity>
                                <InspectionCard
                                    key={inspection.id}
                                    inspection={inspection}
                                    area={areas.index[inspection.areaId]}
                                />
                            </TouchableOpacity>
                        </Link>
                    ))}
            </VStack>
        </ScrollView>
    )
}

export default Inspections
