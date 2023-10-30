import {
    Anchor,
    Box,
    Button,
    Container,
    Flex,
    SimpleGrid,
    Stack,
    Text,
    Title
} from '@mantine/core'
import colors from '../colors'
import {
    IconAlertTriangleFilled,
    IconChecklist,
    IconCompass
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <Container>
            <Stack pb={256} gap={256}>
                <Flex py="lg" align="center" justify="space-between">
                    <Anchor style={{ textDecoration: 'none' }}>
                        <Text ff="Oswald Variable" fz={32} c="dark">
                            RISKNINJA
                        </Text>
                    </Anchor>

                    <Button component={Link} to="/start" variant="light">
                        Iniciar sesión
                    </Button>
                </Flex>

                <Stack gap="xl">
                    <Title fz={48}>
                        Diga adiós a las tediosas evaluaciones de riesgos
                        laborales
                    </Title>

                    <Text>
                        <strong>Risk Ninja</strong> es una plataforma
                        revolucionaria que automatiza la evaluación de riesgos,
                        priorizando la seguridad de su empresa y ahorrando
                        tiempo y recursos valiosos.
                    </Text>

                    <Button
                        component={Link}
                        to="/start"
                        style={{ alignSelf: 'flex-end' }}
                    >
                        Comienza Ahora
                    </Button>
                </Stack>

                <Stack gap="xl">
                    <Title order={2} fz={32}>
                        ¿Cómo funciona Risk Ninja?
                    </Title>

                    <SimpleGrid cols={3}>
                        <Box
                            p="lg"
                            style={{
                                borderColor: colors['slate']['100'],
                                borderStyle: 'solid',
                                borderWidth: 2
                            }}
                        >
                            <IconAlertTriangleFilled
                                style={{ color: colors['orange']['500'] }}
                            />
                            <Text>Evaluamos la gravedad de cada riesgo.</Text>
                        </Box>
                        <Box
                            p="lg"
                            style={{
                                borderColor: colors['slate']['100'],
                                borderStyle: 'solid',
                                borderWidth: 2
                            }}
                        >
                            <IconChecklist
                                style={{ color: colors['blue']['500'] }}
                            />

                            <Text>
                                Desarrollamos un plan para mitigar los riesgos.
                            </Text>
                        </Box>

                        <Box
                            p="lg"
                            style={{
                                borderColor: colors['slate']['100'],
                                borderStyle: 'solid',
                                borderWidth: 2
                            }}
                        >
                            <IconCompass
                                style={{ color: colors['green']['500'] }}
                            />

                            <Text>
                                Implementamos el plan y lo monitoreamos para
                                asegurarnos de que sea efectivo.
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Stack>

                <Stack gap="xl">
                    <Title order={2} fz={32}>
                        ¿Cuáles son los beneficios de usar Risk Ninja?
                    </Title>

                    <Stack>
                        <Title order={3}>Ahorre dinero</Title>
                        <Text>
                            Risk Ninja puede ayudarle a ahorrar dinero al
                            identificar y mitigar riesgos. Por ejemplo, si puede
                            identificar un riesgo potencial y desarrollar un
                            plan para mitigarlo, puede evitar que ocurra un
                            accidente. Esto le ahorrará dinero en costos
                            médicos, tiempo de inactividad y otros gastos
                            relacionados con accidentes.
                        </Text>
                    </Stack>

                    <Stack>
                        <Title order={3}>Mejorar la seguridad</Title>
                        <Text>
                            Risk Ninja puede ayudarle a mejorar la seguridad de
                            su lugar de trabajo al identificar y mitigar
                            riesgos. Al tomar medidas para mitigar los riesgos,
                            puede crear un lugar de trabajo más seguro para sus
                            empleados. Esto puede ayudarle a reducir los
                            accidentes, las lesiones y las enfermedades
                            profesionales.
                        </Text>
                    </Stack>
                    <Stack>
                        <Title order={3}>Aumentar la productividad</Title>
                        <Text>
                            Risk Ninja puede ayudarle a aumentar la
                            productividad de su empresa al identificar y mitigar
                            riesgos. Al crear un lugar de trabajo más seguro,
                            puede reducir la cantidad de tiempo que sus
                            empleados pierden debido a accidentes, lesiones y
                            enfermedades profesionales. Esto puede ayudarle a
                            aumentar la productividad y la eficiencia de su
                            empresa.
                        </Text>
                    </Stack>
                </Stack>

                <Stack
                    style={{
                        backgroundColor: colors['slate']['50']
                    }}
                    justify="space-between"
                    gap="xl"
                    align="center"
                    py={64}
                >
                    <Title order={1}>¿Está listo para probar Risk Ninja?</Title>

                    <Button component={Link} to="/start">
                        Registrarse
                    </Button>
                </Stack>
            </Stack>
        </Container>
    )
}

export default Landing
