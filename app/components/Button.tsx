import { FC } from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native'
import { palette } from '../theme'

const Button: FC<TouchableOpacityProps> = ({ children, style, ...rest }) => {
    return (
        <TouchableOpacity
            style={StyleSheet.compose(styles.root, style)}
            {...rest}
        >
            <Text style={styles.text}>{children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: palette.main,
        borderRadius: 32,
        paddingBottom: 16,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 16,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
})

export default Button
