import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, AppShellNavbar, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";

const getCurrentYear = () => new Date().getFullYear();

const Layout = () => {
    // Toggles handle opening and closing of sidebar
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(); // Burger toggle
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(); // Burger toggle

    return (
        <AppShell
            w="100vw"
            layout="alt"
            padding="md"
            header={{height: 60}}
            navbar={{
                width: {xs: 230},
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened },
            }}
        >
            <AppShellHeader pt={5} pr={10} pl={10}>
                <Header 
                    mobileOpened={mobileOpened}
                    desktopOpened={desktopOpened}
                    toggleMobile={toggleMobile}
                    toggleDesktop={toggleDesktop}
                />
            </AppShellHeader>
            <AppShellNavbar pt={0} pl={0} pr={0}>
                <Burger
                    opened={mobileOpened}
                    onClick={toggleMobile}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Sidebar/>
            </AppShellNavbar>
            <AppShellMain bg="backgroundColor.0">
                <Outlet/>
            </AppShellMain>
            <AppShellFooter ta="center" withBorder={false}>© {getCurrentYear()} KISR/IKARUS - All Rights Reserved</AppShellFooter>
        </AppShell>
    );
};

export default Layout;