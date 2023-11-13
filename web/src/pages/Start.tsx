import {
    Anchor,
    Button,
    Container,
    Flex,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core'
import colors from '../colors'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import api from '../api/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLocalStorage } from '@mantine/hooks'
import { User } from '../api/interfaces'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'

type Form = {
    email?: string
    password: string
    isOnboarding: boolean
}

const schema = yup
    .object({
        email: yup
            .string()
            .email()
            .when('isOnboarding', {
                is: false,
                then: (schema) => schema.required()
            }),
        password: yup.string().required(),
        isOnboarding: yup.boolean().required()
    })
    .required()

const Start = () => {
    // HOOKS
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()

    const { handleSubmit, register, setValue } = useForm<Form>({
        resolver: yupResolver(schema),
        defaultValues: {
            isOnboarding: false
        }
    })

    const [, setJwt] = useLocalStorage({
        key: 'jwt'
    })

    const [, setUser] = useLocalStorage({
        key: 'user'
    })

    // DATA
    const loginRequest = useMutation((data: Form) =>
        api.post<{ jwt: string; user: User }>('/sessions', data)
    )

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

    // COMPUTED
    const isOnboarding = useMemo(
        () => Boolean(searchParams.get('token')),
        [searchParams]
    )

    const title = isOnboarding ? 'Configura tu contraseña' : 'Iniciar sesión'

    // EFFECTS
    useEffect(() => {
        setValue('isOnboarding', isOnboarding)
    }, [isOnboarding, setValue])

    // CALLBACKS
    const onSubmit = async (data: Form) => {
        if (isOnboarding) {
            await setPasswordRequest.mutateAsync({
                data,
                token: searchParams.get('token')!
            })

            toast.success('Contraseña configurada')
            navigate('/', {
                replace: true
            })
        } else {
            const { data: credentials } = await loginRequest.mutateAsync(data)
            setJwt(credentials.jwt)
            setUser(JSON.stringify(credentials.user))
        }
    }

    return (
        <Container>
            <Stack pb={256} gap={128}>
                <Flex py="lg" align="center" justify="space-between">
                    <Anchor
                        component={Link}
                        to="/"
                        style={{ textDecoration: 'none' }}
                    >
                        <Text ff="Oswald Variable" fz={32} c="dark">
                            RISKNINJA
                        </Text>
                    </Anchor>
                </Flex>

                <form>
                    <Stack
                        style={{
                            borderColor: colors['slate']['100'],
                            borderWidth: 2,
                            borderStyle: 'solid',
                            boxShadow: '0px 8px 24px ' + colors['slate']['100']
                        }}
                        gap="xl"
                        p="xl"
                        maw={512}
                    >
                        <Title order={3}>{title}</Title>

                        {isOnboarding === false && (
                            <TextInput
                                label="Usuario"
                                placeholder="david@riskninja.io"
                                {...register('email')}
                            />
                        )}

                        <TextInput
                            label="Contraseña"
                            placeholder="123456*"
                            type="password"
                            {...register('password')}
                        />

                        {loginRequest.isLoading}

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
        </Container>
    )
}

export default Start
