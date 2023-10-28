import { Anchor, Button, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from 'react-query'
import api from '../../api/api'

interface Form {
    name: string
    email: string
    password: string
}

const schema = yup
    .object({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(6).required()
    })
    .required()

const NewUser = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { handleSubmit, register } = useForm<Form>({
        resolver: yupResolver(schema)
    })

    const request = useMutation((data: Form) => api.post<Form>('/users', data))

    const onSubmit = async (data: Form) => {
        await request.mutateAsync(data)
        await queryClient.invalidateQueries(['FetchUsers'])
        navigate('/users', { replace: true })
    }

    return (
        <Stack maw={512}>
            <Anchor component={Link} to="/users">
                ← Usuarios
            </Anchor>
            <Title>Nuevo Usuario</Title>
            <TextInput
                required
                label="Nombre"
                placeholder="Nombre"
                {...register('name')}
            />
            <TextInput
                required
                label="Correo"
                placeholder="Correo"
                {...register('email')}
            />
            <TextInput
                required
                type="password"
                label="Contraseña"
                placeholder="*******"
                {...register('password')}
            />

            <Button
                onClick={handleSubmit(onSubmit)}
                loading={request.isLoading}
            >
                Crear
            </Button>
        </Stack>
    )
}

export default NewUser
