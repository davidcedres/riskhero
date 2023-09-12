import { StyleSheet } from 'react-native'
import Badge from './Badge'
import Typography from './Typography'
import VStack from './VStack'
import { FC } from 'react'
import { format } from 'date-fns'
import { Area, Inspection } from '../state/interfaces'

const InspectionCard: FC<{ inspection: Inspection; area: Area }> = ({
    inspection,
    area,
}) => {
    return (
        <VStack style={styles.base}>
            <Typography variant="subtitle">{area.name}</Typography>

            <VStack>
                <Typography variant="body">
                    {format(inspection.date, 'mm dd yy')}
                </Typography>
                <Typography variant="body">2:00pm</Typography>
            </VStack>

            <Badge
                label={
                    inspection.type === 'ANNOUNCED'
                        ? 'Anunciada'
                        : 'No Anunciada'
                }
                color="success"
            />
        </VStack>
    )
}

const styles = StyleSheet.create({
    base: {
        borderBottomWidth: 1,
        paddingBottom: 32,
        borderColor: '#C0C0C0',
        marginTop: 16,
    },
})

export default InspectionCard
