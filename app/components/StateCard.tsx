import { StyleSheet } from 'react-native'
import VStack from './VStack'
import { FC } from 'react'
import Feather from '@expo/vector-icons/Feather'
import Typography from './Typography'

const StateCard: FC<{
    highlited: boolean
    icon: 'thumbs-up' | 'alert-triangle' | 'help-circle' | 'tool'
    label: string
    color: string
}> = ({ highlited, icon, label, color }) => {
    return (
        <VStack
            style={StyleSheet.compose(
                styles.card,
                highlited
                    ? {
                          backgroundColor: '#F1F5F9',
                      }
                    : {}
            )}
        >
            <Feather size={64} name={icon} color={color} />
            <Typography variant="body">{label}</Typography>
        </VStack>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 42,
        paddingVertical: 32,
        borderRadius: 8,
    },
})

export default StateCard
