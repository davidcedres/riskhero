import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    NavLink as RouterLink
} from 'react-router-dom'
import { AppShell, Burger, Container, Flex, NavLink, Text } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import NewInspection from './Inspections/New'
import Inspections from './Inspections/Main'
import { IconEye, IconReport, IconUsers } from '@tabler/icons-react'
import Reports from './Reports/Main'
import Users from './Users/Main'
import InspectionDetails from './Inspections/Details'
import NewReport from './Reports/New'
import ReportDetails from './Reports/Details'
import UserButton from '../components/UserButton'

const Layout = () => {
    const [opened, { toggle }] = useDisclosure()
    const isPrint = useMediaQuery('print')

    if (isPrint) return <Outlet />

    return (
        <AppShell
            header={{ height: 128 }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
        >
            <AppShell.Header withBorder={false} p="lg">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />

                <Flex align="center" justify="space-between">
                    <Text ff="Oswald Variable" fz={32}>
                        RISKNINJA
                    </Text>

                    <UserButton />
                </Flex>
            </AppShell.Header>

            <AppShell.Navbar p="md" withBorder={false}>
                {[
                    {
                        to: '/inspections',
                        icon: IconEye,
                        label: 'Inspecciones'
                    },
                    {
                        to: '/reports',
                        icon: IconReport,
                        label: 'Informes'
                    },
                    {
                        to: '/users',
                        icon: IconUsers,
                        label: 'Usuarios'
                    }
                ].map((link) => (
                    <RouterLink
                        to={link.to}
                        style={{ textDecoration: 'none', color: 'black' }}
                    >
                        {({ isActive }) => (
                            <NavLink
                                leftSection={
                                    <link.icon size="1.5rem" stroke={1.5} />
                                }
                                label={link.label}
                                active={isActive}
                                p="md"
                            />
                        )}
                    </RouterLink>
                ))}
            </AppShell.Navbar>

            <AppShell.Main>
                <Container fluid>
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    )
}

const Private = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/inspections" />} />

                    <Route path="/inspections">
                        <Route index element={<Inspections />} />
                        <Route path="new" element={<NewInspection />} />
                        <Route path=":id" element={<InspectionDetails />} />
                    </Route>

                    <Route path="/reports">
                        <Route index element={<Reports />} />
                        <Route path="new" element={<NewReport />} />
                        <Route path=":id" element={<ReportDetails />} />
                    </Route>

                    <Route path="/users" element={<Users />} />

                    <Route path="*" element={<Navigate to="/inspections" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Private
