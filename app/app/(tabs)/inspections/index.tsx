import { Inspection } from '../../../state/interfaces'
import { Link, router } from 'expo-router'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { useStore } from '../../../state/store'
import { values } from 'lodash'
import Chip from '../../../components/Chip'
import HStack from '../../../components/HStack'
import InspectionCard from '../../../components/InspectionCard'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'

const Inspections = () => {
    const [status, setStatus] = useState<Inspection['status']>('OPEN')

    const inspections = useStore((store) =>
        values(store.inspections.index).filter(
            (inspection) => inspection.status === status
        )
    )

    return (
        <ScrollView
            style={{ backgroundColor: 'white' }}
            refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => router.push('/sync')}
                />
            }
        >
            <VStack style={{ padding: 16 }}>
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
                                area={inspection.area}
                            />
                        </TouchableOpacity>
                    </Link>
                ))}
            </VStack>
        </ScrollView>
    )
}

export default Inspections
