import { ScrollView, TouchableOpacity } from 'react-native'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'
import HStack from '../../../components/HStack'
import Chip from '../../../components/Chip'
import { useStore } from '../../../state/store'
import ReportCard from '../../../components/ReportCard'
import { groupBy, values } from 'lodash'
import { State } from '../../../state/interfaces'
import { Link } from 'expo-router'

const Reports = () => {
    const inspections = useStore((store) =>
        values(store.inspections.index).filter(
            (inspection) => inspection.status === 'CLOSED'
        )
    )
    const areas = useStore((store) => store.areas)
    const observations = useStore((store) =>
        groupBy(
            values(store.observations.index).filter(
                (observation) => observation.state !== State.ACCEPTABLE
            ),
            'inspectionId'
        )
    )

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Typography variant="title">Reportes</Typography>

                <HStack>
                    <Chip label="Pendientes" active={true} />
                    <Chip label="Finalizados" active={false} />
                    <Chip label="Archivados" active={false} />
                </HStack>

                {inspections.map((inspection) => (
                    <Link
                        key={inspection.id}
                        href={'/reports/' + inspection.id}
                        asChild
                    >
                        <TouchableOpacity>
                            <ReportCard
                                area={areas.index[inspection.areaId]}
                                observations={observations[inspection.id] ?? []}
                            />
                        </TouchableOpacity>
                    </Link>
                ))}
            </VStack>
        </ScrollView>
    )
}
export default Reports
