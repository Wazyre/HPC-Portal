import { AppShell, AppShellFooter, AppShellHeader, AppShellMain, AppShellNavbar, Burger, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import ikarusLogo from "../assets/images/ikarus_logo.png";

const Layout = () => {
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
            <AppShellNavbar pt={5} pl={10} pr={10}>
                <Burger
                    opened={mobileOpened}
                    onClick={toggleMobile}
                    hiddenFrom="sm"
                    size="sm"
                />
                <Image radius="sm" src={ikarusLogo} w="auto" fit="contain"/>
                <Sidebar
                    // mobileOpened={mobileOpened}
                    // desktopOpened={desktopOpened}
                    // toggleMobile={toggleMobile}
                    // toggleDesktop={toggleDesktop}
                />
            </AppShellNavbar>
            <AppShellMain bg="backgroundColor">
                <Outlet/>
            </AppShellMain>
            <AppShellFooter ta="center" withBorder={false}>© 2025 KISR/IKARUS - All Rights Reserved</AppShellFooter>
        </AppShell>
    );
};

export default Layout;