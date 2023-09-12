import { FC } from 'react'
import { Text, StyleSheet } from 'react-native'

const Typography: FC<{
    children: String
    variant: 'title' | 'subtitle' | 'section' | 'body'
}> = ({ children, variant }) => <Text style={styles[variant]}>{children}</Text>

const styles = StyleSheet.create({
    title: {
        color: '#0A100D',
        fontSize: 48,
        fontWeight: 'bold',
    },
    section: {
        color: '#0A100D',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#0A100D',
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        color: '#6A6A6A',
        fontSize: 16,
    },
})

export default Typography
