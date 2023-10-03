import { Observation, State } from '../../../state/interfaces'
import { ScrollView } from 'react-native'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useLocalSearchParams } from 'expo-router'
import { useStore } from '../../../state/store'
import { values } from 'lodash'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Typography from '../../../components/Typography'
import VStack from '../../../components/VStack'

const schema = z.object({
    username: z.string().min(1, { message: 'Required' }),
    password: z.string().min(1, { message: 'Required' }),
})

const Report = () => {
    // should be the id of the report
    // but by now it will be the id of inspection
    const { id } = useLocalSearchParams()
    if (typeof id !== 'string') throw new Error('BOOM')

    // FORM
    const { control } = useForm({
        resolver: zodResolver(schema),
    })

    const { fields, replace } = useFieldArray({
        control,
        name: 'report',
        rules: {
            minLength: 4,
        },
    })

    // DATA
    const inspection = useStore((store) => store.inspections.index[id])
    const area = useStore((store) => store.areas.index[inspection.areaId])
    const conditions = useStore((store) => store.conditions.index)
    const categories = useStore((store) => store.categories.index)

    const observations = useStore((store) =>
        values(store.observations.index).filter(
            (observation) => observation.state !== State.ACCEPTABLE
        )
    )

    // EFFECTS
    useEffect(() => {
        replace(observations)
    }, [])

    return (
        <ScrollView style={{ backgroundColor: 'white' }}>
            <VStack style={{ padding: 16 }}>
                <Typography variant="title">Reporte</Typography>
                <Typography variant="section">{area.name}</Typography>
                <Typography variant="body">{`Observaciones Sobre Los Agentes De Riesgo Y Condiciones Inseguras`}</Typography>

                {(fields as Observation[]).map((field, index) => (
                    <VStack key={field.id} style={{ marginBottom: 8 }}>
                        <Typography variant="subtitle">
                            {categories[field.categoryId].name +
                                ' - ' +
                                conditions[field.conditionId].name}
                        </Typography>

                        <Input
                            name={`report.${index}.description`}
                            control={control}
                            multiline={true}
                            textAlignVertical="top"
                            placeholder="Notas"
                            style={{
                                height: 128,
                                padding: 10,
                            }}
                        />
                    </VStack>
                ))}

                <Button>Terminar Reporte</Button>
            </VStack>
        </ScrollView>
    )
}

export default Report
