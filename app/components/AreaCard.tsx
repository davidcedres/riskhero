import { StyleSheet } from 'react-native'
import Typography from './Typography'
import VStack from './VStack'
import { FC } from 'react'
import { Area } from '../state/interfaces'

const AreaCard: FC<{ area: Area }> = ({ area }) => {
    return (
        <VStack style={styles.base}>
            <Typography variant="subtitle">{area.name}</Typography>

            {/* <VStack>
        <Typography variant="body">Martes, 3 de Octubre</Typography>
        <Typography variant="body">2:00pm</Typography>
      </VStack>

      <Badge label="Anunciada" color="success" /> */}
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

export default AreaCard
