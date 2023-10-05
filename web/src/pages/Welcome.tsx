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
import New from "./Inspections/New";
import Inspections from "./Inspections/Main";
import Logo from "../assets/logo2.png";

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
                            <NavLink label="Inspecciones" active={isActive} />
                        )}
                    </RouterLink>

                    <RouterLink
                        to="/reports"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        {({ isActive }) => (
                            <NavLink label="Reportes" active={isActive} />
                        )}
                    </RouterLink>

                    <RouterLink
                        to="/users"
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        {({ isActive }) => (
                            <NavLink
                                label="Usuarios"
                                active={isActive}
                                variant="filled"
                            />
                        )}
                    </RouterLink>
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Container py="xl">
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
                        <Route path="new" element={<New />} />
                    </Route>

                    <Route path="/reports" element={<Inspections />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Welcome;
