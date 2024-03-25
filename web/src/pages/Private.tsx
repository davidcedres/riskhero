import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    NavLink as RouterLink,
    Link
} from 'react-router-dom'
import {
    Anchor,
    AppShell,
    Burger,
    Container,
    Flex,
    NavLink,
    Text
} from '@mantine/core'
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
import NewUser from './Users/New'
import { FC, useContext } from 'react'
import { SessionContext } from '../utils/useSession'
import { User } from '../api/interfaces'

const Layout: FC<{ role: User['role'] }> = ({ role }) => {
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
                    <Anchor to="/inspections" component={Link} td="none">
                        <Anchor to="/" component={Link} td="none">
                            <Text fw="bold" c="dark">
                                Safety At Work
                            </Text>
                        </Anchor>
                    </Anchor>

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
                        label: 'Usuarios',
                        roles: ['MANAGER']
                    }
                ]
                    .filter((page) => page.roles?.includes(role) ?? true)
                    .map((link) => (
                        <RouterLink
                            to={link.to}
                            style={{ textDecoration: 'none', color: 'black' }}
                            key={link.to}
                        >
                            {({ isActive }) => (
                                <NavLink
                                    component="span"
                                    leftSection={
                                        <link.icon size="1.5rem" stroke={1.5} />
                                    }
                                    label={link.label}
                                    active={isActive}
                                    variant="light"
                                    p="md"
                                    style={{ borderRadius: 4 }}
                                />
                            )}
                        </RouterLink>
                    ))}
            </AppShell.Navbar>

            <AppShell.Main>
                <Container fluid={true} pb="lg">
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    )
}

const Private = () => {
    const session = useContext(SessionContext)
    const role = session.role
    const isManager = role === 'MANAGER'

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout role={role} />}>
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

                    {isManager && (
                        <Route path="/users">
                            <Route index element={<Users />} />
                            <Route path="new" element={<NewUser />} />
                        </Route>
                    )}

                    <Route path="*" element={<Navigate to="/inspections" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Private
