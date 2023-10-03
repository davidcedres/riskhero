import { StyleSheet } from 'react-native'
import Typography from './Typography'
import VStack from './VStack'
import { FC } from 'react'
import { Area, Observation } from '../state/interfaces'

const ReportCard: FC<{
    area: Area
    observations: Observation[]
}> = ({ area, observations }) => {
    return (
        <VStack style={styles.base}>
            <Typography variant="subtitle">{area.name}</Typography>

            <VStack>
                <Typography variant="body">
                    {`${observations.length} items necesitan atencion`}
                </Typography>
            </VStack>
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

export default ReportCard
