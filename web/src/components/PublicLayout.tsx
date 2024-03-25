import { Flex, Image, Stack, Anchor, Text, Group } from '@mantine/core'
import { Outlet, Link } from 'react-router-dom'

import banner from '../assets/jeriden-villegas-niSnhfMjiMI-unsplash.jpg'

const PublicLayout = () => {
    return (
        <Flex>
            <Flex w="100%" justify="center" p="lg">
                <Stack w={450} gap={48} align="center">
                    {/* Navbar */}
                    <Flex w="100%" align="center" justify="space-between">
                        <Anchor to="/" component={Link} td="none">
                            <Text fw="bold" c="dark">
                                Safety At Work
                            </Text>
                        </Anchor>

                        <Group>
                            <Anchor to="/" component={Link} td="none">
                                <Text fz="sm">¿Qué es?</Text>
                            </Anchor>

                            <Anchor to="/" component={Link} td="none">
                                <Text fz="sm">Precio</Text>
                            </Anchor>

                            <Anchor to="/" component={Link} td="none">
                                <Text fz="sm">Producto</Text>
                            </Anchor>
                        </Group>
                    </Flex>

                    {/* Mid Content */}
                    <Outlet />
                </Stack>
            </Flex>

            <Image src={banner} visibleFrom="md" style={{ height: '100vh' }} />
        </Flex>
    )
}

export default PublicLayout
