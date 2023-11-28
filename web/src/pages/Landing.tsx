import { Player } from '@lottiefiles/react-lottie-player'
import {
    Anchor,
    Button,
    Container,
    Flex,
    Group,
    Image,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { Link } from 'react-router-dom'
import construction from '../lotties/construction.json'
import ssstLogo from '../assets/ssst.png'

const Landing = () => {
    return (
        <Container>
            <Stack pb={256} gap={256}>
                <Flex py="lg" align="center" justify="space-between">
                    <Anchor to="/" component={Link} td="none">
                        <Group>
                            <Image src={ssstLogo} h={50} />

                            <Text ff="Oswald Variable" fz={32} c="dark">
                                SSST ULA
                            </Text>
                        </Group>
                    </Anchor>

                    <Button component={Link} to="/start" variant="light">
                        Iniciar sesión
                    </Button>
                </Flex>

                <Stack align="center" gap="lg">
                    <Title fz={48}>Servicio de Seguridad y Salud ULA</Title>

                    <Player
                        autoplay
                        loop
                        src={construction}
                        style={{ height: '300px', width: '100%' }}
                    />
                </Stack>
            </Stack>
        </Container>
    )
}

export default Landing
