import { FC } from 'react'
import { Control, useController } from 'react-hook-form'
import { StyleSheet, TextInput, TextInputProps } from 'react-native'

const Input: FC<
    TextInputProps & { control?: Control<any, any>; name: string }
> = ({ control, name, style, ...rest }) => {
    const { field } = useController({
        control,
        name,
    })

    return (
        <TextInput
            style={StyleSheet.compose(styles.root, style)}
            placeholderTextColor="#96939B"
            {...rest}
            value={field.value}
            onChangeText={field.onChange}
        />
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#F6F6F6',
        borderColor: '#E8E8E8',
        borderRadius: 8,
        borderWidth: 1,
        color: '#1e293b',
        fontSize: 16,
        padding: 16,
    },
})

export default Input
