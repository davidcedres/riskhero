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
}

const schema = yup
    .object({
        name: yup.string().required(),
        email: yup.string().email().required()
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
        <form onSubmit={handleSubmit(onSubmit)}>
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

                <Button loading={request.isLoading} type="submit">
                    Crear
                </Button>
            </Stack>
        </form>
    )
}

export default NewUser
