import {
    Button,
    SegmentedControl,
    Stack,
    TextInput,
    Title
} from '@mantine/core'
import colors from '../colors'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import api from '../api/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLocalStorage } from '@mantine/hooks'
import { User } from '../api/interfaces'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// This component might behave in one of the following three ways:
// 1. It will show a login form.
// 2. It will show a signup form.
// 3. It will show a password configuration form.
const Start = () => {
    // HOOKS
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<Form>({
        resolver: yupResolver(schema)
    })

    const [, setJwt] = useLocalStorage({
        key: 'jwt'
    })
    const [, setUser] = useLocalStorage({
        key: 'user'
    })

    // STATE
    const [mode, setMode] = useState<'login' | 'signup' | 'onboard'>('login')

    // REQUESTS
    const loginRequest = useMutation((data: Form) =>
        api.post<{ jwt: string; user: User }>('/sessions', data)
    )

    // const signupRequest = useMutation((data) => api.post('/organization', data))

    const setPasswordRequest = useMutation(
        (params: { data: Form; token: string }) =>
            api.patch(
                '/users/me',
                { password: params.data.password },
                {
                    headers: {
                        Authorization: 'Bearer ' + params.token
                    }
                }
            )
    )

    // EFFECTS
    useEffect(() => {
        if (searchParams.get('token')) {
            setMode('onboard')
        }
    }, [searchParams, setValue])

    // gotta do it this weird way because I think yup wont allow when 'some-value'
    useEffect(() => {
        if (mode === 'signup') {
            setValue('register', true)
            setValue('login', false)
            setValue('onboard', false)
        }

        if (mode === 'login') {
            setValue('register', false)
            setValue('login', true)
            setValue('onboard', false)
        }

        if (mode === 'onboard') {
            setValue('register', false)
            setValue('login', false)
            setValue('onboard', true)
        }
    }, [mode, setValue])

    const title =
        mode === 'login'
            ? 'Iniciar sesión'
            : mode === 'signup'
            ? 'Registro'
            : 'Configura tu contraseña'

    // CALLBACKS
    const onSubmit = async (data: Form) => {
        if (mode === 'onboard') {
            await setPasswordRequest.mutateAsync({
                data,
                token: searchParams.get('token')!
            })

            toast.success('Contraseña configurada')

            navigate('/', {
                replace: true
            })
        }

        if (mode === 'login') {
            const { data: credentials } = await loginRequest.mutateAsync(data)
            setJwt(credentials.jwt)
            setUser(JSON.stringify(credentials.user))
        }

        // TODO: Implement signup
        // alert('gotta implement signup')
    }

    return (
        <Stack gap="xl">
            <Title order={1}>Bienvenido</Title>

            {['login', 'signup'].includes(mode) && (
                <SegmentedControl
                    value={mode}
                    // @ts-expect-error -- library not smart enough
                    onChange={setMode}
                    data={[
                        { label: 'Inicio', value: 'login' },
                        { label: 'Registro', value: 'signup' }
                    ]}
                />
            )}

            <form>
                <Stack
                    p="lg"
                    style={{
                        borderColor: colors['slate']['200'],
                        borderWidth: 2,
                        borderStyle: 'solid'
                    }}
                    w="300"
                >
                    <Title order={3}>{title}</Title>

                    {mode === 'signup' && (
                        <TextInput
                            label="Nombre de la organización"
                            placeholder='Ejemplo: "Monsters, Inc."'
                            {...register('organization_name')}
                            error={errors.organization_name?.message}
                        />
                    )}

                    {['login', 'signup'].includes(mode) && (
                        <TextInput
                            label="Correo"
                            placeholder='Ejemplo: "david@monsters.inc"'
                            {...register('email')}
                            error={errors.email?.message}
                        />
                    )}

                    <TextInput
                        label="Contraseña"
                        type="password"
                        placeholder='Ejemplo: "12345678"'
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    {['signup', 'onboard'].includes(mode) && (
                        <TextInput
                            label="Confirmar contraseña"
                            type="password"
                            placeholder='Ejemplo: "12345678"'
                            {...register('password_confirm')}
                            error={errors.password_confirm?.message}
                        />
                    )}

                    <Button
                        onClick={handleSubmit(onSubmit)}
                        loading={
                            loginRequest.isLoading ||
                            setPasswordRequest.isLoading
                        }
                        type="submit"
                    >
                        Entrar
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

type Form = {
    login?: boolean
    register?: boolean
    onboard?: boolean
    email?: string
    password: string
    password_confirm?: string
    organization_name?: string
}

// login: email + password
// register: email + password + password_confirm + organization_name
// onboard: password + password_confirm
const schema = yup
    .object({
        // three booleans to govern form rules
        login: yup.boolean(),
        register: yup.boolean(),
        onboard: yup.boolean(),
        // fields
        organization_name: yup.string().when('register', {
            is: true,
            then: (schema) => schema.required()
        }),
        email: yup
            .string()
            .email()
            // required in both login and register
            .when('onboard', {
                is: false,
                then: (schema) => schema.required()
            }),
        password: yup.string().required(),
        password_confirm: yup.string().when('login', {
            is: false,
            then: (schema) =>
                schema
                    .oneOf([yup.ref('password')], 'Passwords must match')
                    .required()
        })
    })
    .required()

export default Start
