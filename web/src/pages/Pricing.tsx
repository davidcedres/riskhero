import {
    Button,
    Checkbox,
    Flex,
    Stack,
    Text,
    Title,
    useMantineTheme
} from '@mantine/core'
import { FC } from 'react'
import { Link } from 'react-router-dom'

type Plan = 'BASIC' | 'ADVANCED'

const features: { label: string; plans: Plan[] }[] = [
    // Basic
    {
        label: 'Máximo de 3 inspectores registrados en la organización',
        plans: ['BASIC']
    },
    {
        label: 'Captura máxima de dos evidencias por aspecto observado',
        plans: ['BASIC']
    },
    {
        label: 'Planificacion máxima de hasta 20 inspecciones',
        plans: ['BASIC']
    },
    // Advanced
    {
        label: 'Cantidad ilimitada de inspectores en la organización',
        plans: ['ADVANCED']
    },
    {
        label: 'Cantidad ilimitada de evidencias por aspecto observado',
        plans: ['ADVANCED']
    },
    {
        label: 'Planificacion ilimitada de inspecciones',
        plans: ['ADVANCED']
    },

    {
        label: 'Herramienta de captura de datos offline',
        plans: ['BASIC', 'ADVANCED']
    },
    { label: 'Soporte 24/7', plans: ['ADVANCED'] }
]

const Card: FC<{
    plan: string
    features: { label: string }[]
    price: number
}> = ({ plan, features, price }) => {
    const theme = useMantineTheme()

    return (
        <Flex
            direction="column"
            justify="space-between"
            gap="lg"
            p="lg"
            style={{
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: theme.colors.gray['3'],
                borderRadius: theme.radius.sm
            }}
            w="100%"
        >
            <Stack>
                <Title order={2}>{plan}</Title>

                {features.map((feature) => (
                    <Flex gap="md">
                        <Text w="100%" mih={36}>
                            {feature.label}
                        </Text>
                        <Checkbox checked={true} />
                    </Flex>
                ))}
            </Stack>

            <Stack>
                <Title order={3}>${price}/Mes</Title>

                <Button component={Link} to="/start">
                    Comenzar prueba gratuita
                </Button>
            </Stack>
        </Flex>
    )
}

const Pricing = () => {
    return (
        <Stack>
            <Title order={1}>Planes</Title>

            <Flex gap="md">
                <Card
                    plan="Básico"
                    features={features.filter((feat) =>
                        feat.plans.includes('BASIC')
                    )}
                    price={19}
                />

                <Card
                    plan="Avanzado"
                    features={features.filter((feat) =>
                        feat.plans.includes('ADVANCED')
                    )}
                    price={99}
                />
            </Flex>
        </Stack>
    )
}

export default Pricing
