import { Flex, Image, Stack, Anchor, Text, Group, Button } from '@mantine/core'
import { Outlet, Link, NavLink } from 'react-router-dom'

import banner from '../assets/jeriden-villegas-niSnhfMjiMI-unsplash.jpg'

const PublicLayout = () => {
    return (
        <Flex>
            <Flex w="100%" justify="center" p="xl">
                <Stack w="100%" gap={48} align="center">
                    {/* Navbar */}
                    <Flex w="100%" align="center" justify="space-between">
                        <Anchor to="/" component={Link} td="none">
                            <Text fw="bold" c="dark">
                                Riskninja
                            </Text>
                        </Anchor>

                        <Group>
                            {[
                                ['/', '¿Qué es?'],
                                ['/pricing', 'Precio']
                            ].map(([path, text]) => (
                                <NavLink
                                    to={path}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {({ isActive }) => (
                                        <Text
                                            fz="sm"
                                            c={isActive ? 'orange' : 'dark'}
                                        >
                                            {text}
                                        </Text>
                                    )}
                                </NavLink>
                            ))}

                            <Button component={Link} to="/contact" size="xs">
                                Contacto
                            </Button>
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
