import { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { palette } from '../theme'

const Chip: FC<{ label: string; active: boolean }> = ({ label, active }) => (
    <View
        style={StyleSheet.compose(
            styles.base,
            active
                ? { backgroundColor: palette.main }
                : {
                      borderWidth: 1,
                      borderColor: palette.main
                  }
        )}
    >
        <Text style={active ? styles.active : styles.inactive}>{label}</Text>
    </View>
)

const styles = StyleSheet.create({
    base: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        borderRadius: 16
    },
    active: {
        color: 'white'
    },
    inactive: {
        color: palette.main,
        borderColor: palette.main
    }
})

export default Chip
