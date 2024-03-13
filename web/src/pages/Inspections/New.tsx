import {
    Anchor,
    Autocomplete,
    Button,
    InputLabel,
    SegmentedControl,
    Select,
    Stack,
    Title
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQuery } from 'react-query'
import api from '../../api/api'
import { useMemo } from 'react'
import { Area, Inspection, User } from '../../api/interfaces'
import toast from 'react-hot-toast'

interface Form {
    area: string
    inspector: string
    type: Inspection['type']
    date: Date
}

const schema = yup
    .object({
        area: yup.string().required(),
        inspector: yup.string().required(),
        type: yup.string().oneOf(['ANNOUNCED', 'UNANNOUNCED']).required(),
        date: yup.date().required()
    })
    .required()

const NewInspection = () => {
    const navigate = useNavigate()

    const { handleSubmit, control } = useForm<Form>({
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'ANNOUNCED'
        }
    })

    const areasRequest = useQuery(['FetchAreas'], () =>
        api.get<Area[]>('/areas')
    )

    const usersRequest = useQuery(['FetchUsers'], () =>
        api.get<User[]>('/users', {
            params: {
                role: 'EMPLOYEE'
            }
        })
    )

    const saveRequest = useMutation(
        (data: Omit<Inspection, 'id' | 'observations'>) =>
            api.post('/inspections', data)
    )

    const createAreaRequest = useMutation((data: { name: string }) =>
        api.post<Area>('/areas', data)
    )

    const areas = useMemo(
        () => areasRequest.data?.data ?? [],
        [areasRequest.data?.data]
    )

    const users = useMemo(
        () => usersRequest.data?.data ?? [],
        [usersRequest.data?.data]
    )

    const onSubmit = async (data: Form) => {
        let area = areas.find((area) => area.name === data.area)

        if (area === undefined) {
            const response = await createAreaRequest.mutateAsync({
                name: data.area
            })
            area = response.data
        }

        await saveRequest.mutateAsync({
            areaId: area.id,
            userId: Number(data.inspector),
            status: 'OPEN',
            date: data.date,
            type: data.type
        })

        navigate('/', {
            replace: true
        })

        toast.success('Inspección guardada')
    }

    return (
        <Stack maw={512}>
            <Anchor component={Link} to="/inspections">
                ← Inspecciones
            </Anchor>

            <Title>Nueva Inspección</Title>

            <Controller
                name="area"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        label="Area"
                        placeholder="Seleccione area a inspeccionar"
                        data={areas.map((area) => ({
                            value: String(area.id),
                            label: area.name
                        }))}
                    />
                )}
            />

            <Controller
                name="inspector"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        label="Inspector"
                        placeholder="Seleccione un inspector"
                        data={users.map((user) => ({
                            value: String(user.id),
                            label: user.name
                        }))}
                    />
                )}
            />

            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <Stack gap={1}>
                        <InputLabel>Tipo de inspección</InputLabel>
                        <SegmentedControl
                            {...field}
                            data={[
                                { label: 'Anunciada', value: 'ANNOUNCED' },
                                { label: 'No Anunciada', value: 'UNANNOUNCED' }
                            ]}
                        />
                    </Stack>
                )}
            />

            <Controller
                name="date"
                control={control}
                render={({ field }) => (
                    <DateTimePicker
                        {...field}
                        label="Fecha y hora"
                        placeholder="Fecha y hora de la inspección"
                    />
                )}
            />

            <Button
                onClick={handleSubmit(onSubmit)}
                loading={createAreaRequest.isLoading || saveRequest.isLoading}
            >
                Guardar
            </Button>
        </Stack>
    )
}

export default NewInspection
