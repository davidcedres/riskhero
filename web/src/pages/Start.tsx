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
import { Link } from 'react-router-dom'
import { useMutation } from 'react-query'
import api from '../api/api'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLocalStorage } from '@mantine/hooks'
import { User } from '../api/interfaces'

type Form = {
    email: string
    password: string
}

const schema = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().required()
    })
    .required()

const Start = () => {
    // HOOKS
    const { handleSubmit, register } = useForm<Form>({
        resolver: yupResolver(schema)
    })

    const [, setJwt] = useLocalStorage({
        key: 'jwt'
    })

    const [, setUser] = useLocalStorage({
        key: 'user'
    })

    const loginRequest = useMutation((data: Form) =>
        api.post<{ jwt: string; user: User }>('/sessions', data)
    )

    const onSubmit = async (data: Form) => {
        const { data: credentials } = await loginRequest.mutateAsync(data)
        setJwt(credentials.jwt)
        setUser(JSON.stringify(credentials.user))
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
                        <Text ff="Oswald Variable" fz={32}>
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
                        <Title order={3}>Iniciar sesión</Title>

                        <TextInput
                            label="Usuario"
                            placeholder="david@riskninja.io"
                            {...register('email')}
                        />
                        <TextInput
                            label="Contraseña"
                            placeholder="123456*"
                            type="password"
                            {...register('password')}
                        />

                        {loginRequest.isLoading}

                        <Button
                            onClick={handleSubmit(onSubmit)}
                            loading={loginRequest.isLoading}
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
