import { useState } from 'react'
import { useStore } from '../state/store'
import { StyleSheet, View } from 'react-native'
import VStack from '../components/VStack'
import Typography from '../components/Typography'
import Input from '../components/Input'
import Button from '../components/Button'
import { router } from 'expo-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
    username: z.string().min(1, { message: 'Required' }),
    password: z.string().min(1, { message: 'Required' }),
})

const Signin = () => {
    const { setLogged } = useStore()

    const { control, handleSubmit } = useForm({
        resolver: zodResolver(schema),
    })

    const handleLogin = () => {
        setLogged(true)
        router.replace('/inspections')
    }

    return (
        <View style={styles.root}>
            <VStack>
                <Typography variant="title">Risk Ninja</Typography>
                <Input
                    spellCheck={false}
                    autoCapitalize="none"
                    textContentType="username"
                    placeholder="usuario"
                    name="username"
                    control={control}
                />
                <Input
                    secureTextEntry={true}
                    passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
                    placeholder="contraseña"
                    name="password"
                    control={control}
                />
                <Button onPress={handleSubmit(handleLogin, handleLogin)}>
                    Entrar
                </Button>
            </VStack>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        flex: 1,
        padding: 32,
    },
})

export default Signin
