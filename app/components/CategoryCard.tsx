import { StyleSheet } from 'react-native'
import Typography from './Typography'
import VStack from './VStack'
import { FC } from 'react'
import { Category, State, getStateColor } from '../state/interfaces'
import HStack from './HStack'
import Feather from '@expo/vector-icons/Feather'

const CategoryCard: FC<{
    category: Category
    observations: number
    pending: number
}> = ({ category, observations, pending }) => {
    return (
        <VStack style={styles.base}>
            <Typography variant="subtitle">{category.name}</Typography>

            <HStack style={{ gap: 8, alignItems: 'center' }}>
                <Feather
                    size={24}
                    name="check-circle"
                    color={getStateColor(State.ACCEPTABLE)}
                />

                <Typography variant="body">{`${observations} Condiciones Completadas`}</Typography>
            </HStack>

            <HStack style={{ gap: 8, alignItems: 'center' }}>
                <Feather
                    size={24}
                    name="alert-circle"
                    color={getStateColor(State.UNSAFE)}
                />

                <Typography variant="body">{`${pending} Condiciones Faltantes`}</Typography>
            </HStack>
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

export default CategoryCard
