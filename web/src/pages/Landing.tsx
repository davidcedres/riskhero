import { Button, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <Stack maw={450} gap={48} align="flex-start">
            <Stack align="flex-start" gap="lg">
                <Title order={1}>
                    Lleva la seguridad de tu organización al siguiente nivel
                </Title>

                <Text>
                    Planifica, ejecuta y mide la efectividad de tus
                    inspecciones, auditorias y evaluaciones de riesgo, velando
                    por la salud de los trabajadores.
                </Text>

                <Button component={Link} to="/start">
                    Empezar
                </Button>
            </Stack>
        </Stack>
    )
}

export default Landing
