import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    NavLink as RouterLink,
} from "react-router-dom";
import {
    AppShell,
    Burger,
    Container,
    Flex,
    Image,
    NavLink,
    Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserButton } from "@clerk/clerk-react";
import NewInspection from "./Inspections/New";
import Inspections from "./Inspections/Main";
import Logo from "../assets/logo2.png";
import { IconEye, IconReport, IconUsers } from "@tabler/icons-react";
import Reports from "./Reports/Main";
import Users from "./Users/Main";
import Details from "./Inspections/Details";
import NewReport from "./Reports/New";
import colors from "../colors";

const Layout = () => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 84 }}
            navbar={{
                width: 250,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                />

                <Flex p="lg" align="center" justify="space-between">
                    <Image src={Logo} h={32} />
                    <UserButton />
                </Flex>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack>
                    <RouterLink
                        to="/inspections"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        {({ isActive }) => (
                            <NavLink
                                leftSection={
                                    <IconEye size="1rem" stroke={1.5} />
                                }
                                label="Inspecciones"
                                active={isActive}
                            />
                        )}
                    </RouterLink>

                    <RouterLink
                        to="/reports"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        {({ isActive }) => (
                            <NavLink
                                leftSection={
                                    <IconReport size="1rem" stroke={1.5} />
                                }
                                label="Reportes"
                                active={isActive}
                            />
                        )}
                    </RouterLink>

                    <RouterLink
                        to="/users"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        {({ isActive }) => (
                            <NavLink
                                leftSection={
                                    <IconUsers size="1rem" stroke={1.5} />
                                }
                                label="Usuarios"
                                active={isActive}
                                variant="filled"
                            />
                        )}
                    </RouterLink>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Container fluid>
                    <Outlet />
                </Container>
            </AppShell.Main>
        </AppShell>
    );
};

const Welcome = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/inspections" />} />

                    <Route path="/inspections">
                        <Route index element={<Inspections />} />
                        <Route path="new" element={<NewInspection />} />
                        <Route path=":id" element={<Details />} />
                    </Route>

                    <Route path="/reports">
                        <Route index element={<Reports />} />
                        <Route path="new" element={<NewReport />} />
                    </Route>

                    <Route path="/users" element={<Users />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Welcome;
