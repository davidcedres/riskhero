import { ScrollView } from 'react-native-gesture-handler'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'
import { Picker } from '@react-native-picker/picker'
import { useState } from 'react'
import { useStore } from '../../../state/store'
import RNDateTimePickerfrom from '@react-native-community/datetimepicker'
import Button from '../../../components/Button'
import toast from 'react-hot-toast/headless'
import { router } from 'expo-router'

const New = () => {
    const [areaId, setAreaId] = useState<string>()
    const [userId, setUserId] = useState<string>()
    const [type, setType] = useState<'ANNOUNCED' | 'UNANNOUNCED'>()
    const [date, setDate] = useState<Date>()

    const areas = useStore((store) => store.areas)
    const users = useStore((store) => store.users)

    const createInspection = useStore((store) => store.createInspection)

    const handleCreate = () => {
        if (
            areaId === undefined ||
            userId === undefined ||
            type === undefined ||
            date === undefined
        )
            return

        createInspection({
            areaId,
            userId,
            type,
            date,
            observations: [],
            status: 'OPEN',
        })
        router.back()
        toast('Guardado', {
            icon: '✅',
        })
    }

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 32 }}>
                <Typography variant="title">Nueva Inspección</Typography>

                <VStack style={{ gap: 0 }}>
                    <Typography variant="body">Area a inspeccionar</Typography>

                    <Picker
                        style={{ top: -18 }}
                        selectedValue={areaId}
                        onValueChange={(id) => setAreaId(id)}
                    >
                        {areas.ids
                            .map((id) => areas.index[id])
                            .map((area) => (
                                <Picker.Item
                                    key={area.id}
                                    label={area.name}
                                    value={area.id}
                                />
                            ))}
                    </Picker>
                </VStack>

                <VStack style={{ gap: 0 }}>
                    <Typography variant="body">
                        Selecciona el inspector
                    </Typography>

                    <Picker
                        style={{ top: -18 }}
                        selectedValue={userId}
                        onValueChange={(id) => setUserId(id)}
                    >
                        {users.ids
                            .map((id) => users.index[id])
                            .map((user) => (
                                <Picker.Item
                                    key={user.id}
                                    label={user.name}
                                    value={user.id}
                                />
                            ))}
                    </Picker>
                </VStack>

                <VStack style={{ marginBottom: 48 }}>
                    <Typography variant="body">Fecha y hora</Typography>

                    <RNDateTimePickerfrom
                        mode="datetime"
                        value={date ?? new Date()}
                        onChange={(event, date) => setDate(date)}
                        style={{ alignSelf: 'flex-start' }}
                    />
                </VStack>

                <VStack style={{ gap: 0 }}>
                    <Typography variant="body">Tipo de Inspección</Typography>

                    <Picker
                        style={{ top: -18 }}
                        selectedValue={type}
                        onValueChange={(value) => setType(value)}
                    >
                        <Picker.Item label="Anunciada" value="ANNOUNCED" />
                        <Picker.Item label="No Anunciada" value="UNANNOUNCED" />
                    </Picker>
                </VStack>

                <Button onPress={handleCreate}>Guardar</Button>
            </VStack>
        </ScrollView>
    )
}

export default New
