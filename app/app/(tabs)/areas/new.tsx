import Button from '../../../components/Button'
import Input from '../../../components/Input'
import VStack from '../../../components/VStack'
import Typography from '../../../components/Typography'
import { useStore } from '../../../state/store'
import { router } from 'expo-router'
import toast from 'react-hot-toast/headless'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
    name: z.string().min(1, { message: 'Required' }),
})

type Schema = z.infer<typeof schema>

const NewArea = () => {
    const { control, handleSubmit } = useForm<Schema>({
        resolver: zodResolver(schema),
    })
    const createArea = useStore((store) => store.createArea)

    const handleCreate = ({ name }: Schema) => {
        createArea({ name })
        router.back()
        toast('Guardado', {
            icon: '✅',
        })
    }

    return (
        <VStack style={{ backgroundColor: 'white', padding: 36, flex: 1 }}>
            <Typography variant="section">Nueva Area de Trabajo</Typography>
            <Input control={control} name="name" placeholder="Nombre de Area" />
            <Button onPress={handleSubmit(handleCreate)}>Guardar</Button>
        </VStack>
    )
}

export default NewArea
