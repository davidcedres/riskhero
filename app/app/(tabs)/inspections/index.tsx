import { Link, router } from 'expo-router'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { useStore } from '../../../state/store'
import { values } from 'lodash'
import InspectionCard from '../../../components/InspectionCard'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'

const Inspections = () => {
    const inspections = useStore((store) =>
        values(store.inspections.index).filter(
            (inspection) => inspection.status === 'OPEN'
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
                <Typography variant="title">Proximas Inspecciones</Typography>

                {inspections.length === 0 && (
                    <Typography variant="body">
                        No tienes inspecciones asignadas
                    </Typography>
                )}

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
