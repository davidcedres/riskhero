import { FC } from 'react'
import { StyleSheet, Text } from 'react-native'

const Badge: FC<{ label: string; color: 'success' }> = ({ label, color }) => (
    <Text style={StyleSheet.compose(styles.base, styles[color])}>{label}</Text>
)

const styles = StyleSheet.create({
    base: {
        fontSize: 16,
        padding: 8,
        alignSelf: 'flex-start',
    },
    success: {
        backgroundColor: '#1e293b',
        color: 'white',
    },
})

// danger FFC145

export default Badge
