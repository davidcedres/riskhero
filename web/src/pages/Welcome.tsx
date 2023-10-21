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
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { UserButton } from "@clerk/clerk-react";
import NewInspection from "./Inspections/New";
import Inspections from "./Inspections/Main";
import Logo from "../assets/logo2.png";
import { IconEye, IconReport, IconUsers } from "@tabler/icons-react";
import Reports from "./Reports/Main";
import Users from "./Users/Main";
import InspectionDetails from "./Inspections/Details";
import NewReport from "./Reports/New";
import ReportDetails from "./Reports/Details";

const Layout = () => {
    const [opened, { toggle }] = useDisclosure();
    const isPrint = useMediaQuery("print");

    if (isPrint) return <Outlet />;

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
                {[
                    {
                        to: "/inspections",
                        icon: IconEye,
                        label: "Inspecciones",
                    },
                    {
                        to: "/reports",
                        icon: IconReport,
                        label: "Informes",
                    },
                    {
                        to: "/users",
                        icon: IconUsers,
                        label: "Usuarios",
                    },
                ].map((link) => (
                    <RouterLink
                        to={link.to}
                        style={{ textDecoration: "none", color: "black" }}
                    >
                        {({ isActive }) => (
                            <NavLink
                                leftSection={
                                    <link.icon size="1.5rem" stroke={1.5} />
                                }
                                label={link.label}
                                active={isActive}
                                style={{ borderRadius: 8 }}
                                p="sm"
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
                        <Route path=":id" element={<InspectionDetails />} />
                    </Route>

                    <Route path="/reports">
                        <Route index element={<Reports />} />
                        <Route path="new" element={<NewReport />} />
                        <Route path=":id" element={<ReportDetails />} />
                    </Route>

                    <Route path="/users" element={<Users />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Welcome;
