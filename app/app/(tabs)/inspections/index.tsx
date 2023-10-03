import VStack from '../../../components/VStack'
import Typography from '../../../components/Typography'
import { ScrollView } from 'react-native-gesture-handler'
import InspectionCard from '../../../components/InspectionCard'
import { Link } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import { useStore } from '../../../state/store'
import { TouchableOpacity } from 'react-native'
import { palette } from '../../../theme'
import { values } from 'lodash'
import HStack from '../../../components/HStack'
import Chip from '../../../components/Chip'
import { useState } from 'react'
import { Inspection } from '../../../state/interfaces'

const Inspections = () => {
    const [status, setStatus] = useState<Inspection['status']>('OPEN')

    const inspections = useStore((store) =>
        values(store.inspections.index).filter(
            (inspection) => inspection.status === status
        )
    )

    const areas = useStore((store) => store.areas)

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Link href="/inspections/new" style={{ alignSelf: 'flex-end' }}>
                    <Feather size={28} name="edit" color={palette.main} />
                </Link>

                <Typography variant="title">Inspecciones</Typography>

                <HStack>
                    <TouchableOpacity onPress={() => setStatus('OPEN')}>
                        <Chip label="Pendientes" active={status === 'OPEN'} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setStatus('CLOSED')}>
                        <Chip
                            label="Finalizadas"
                            active={status === 'CLOSED'}
                        />
                    </TouchableOpacity>
                </HStack>

                {inspections.map((inspection) => (
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
