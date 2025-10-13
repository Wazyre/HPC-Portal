import { ActionIcon, Avatar, Burger, Group, Indicator, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconBell, IconMoon, IconSun } from "@tabler/icons-react";
import { Link } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectAllNotifications } from "../slices/notificationSlice";
import { notifications } from "@mantine/notifications";
import cx from "clsx";
import ikarusIcon from "../assets/images/icon.png";

import classes from "../sourceStyle.module.css"
import type { MouseEventHandler } from "react";
import HeaderMenu from "./headerMenu";


interface HeaderProps {
    mobileOpened: boolean,
    toggleMobile: MouseEventHandler<HTMLButtonElement>,
    desktopOpened: boolean,
    toggleDesktop: MouseEventHandler<HTMLButtonElement>
}

const Header = ({mobileOpened, toggleMobile}: HeaderProps) => {
    const {setColorScheme} = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
    const notifs = useAppSelector(selectAllNotifications);

    const showNotifications = () => {
        for (const n of notifs) {
            notifications.show({
                id: n.id,
                title: n.dateTitle,
                message: n.message,
                color: n.color,
                withCloseButton: n.withCloseButton,
                withBorder: n.withBorder,
                position: n.position,
            });
        }
    };

    return (
        <Group classNames={{root: classes.headerGroup}}>
            <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
            />
            {/* <Burger
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
            /> */}
            <Group gap="xs">
                <ActionIcon
                    onClick={showNotifications}
                    variant="transparent"
                    size="xl"
                    radius={"100%"}
                    aria-label="Notifications"
                >
                    <Indicator processing>
                        <IconBell className={cx(classes.icon, classes.light)} stroke={1.5} />
                        <IconBell className={cx(classes.icon, classes.dark)} stroke={1.5} />
                    </Indicator>
                </ActionIcon>
                <ActionIcon
                    onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                    variant="transparent"
                    size="xl"
                    aria-label="Toggle color scheme"
                >
                    <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                    <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
                </ActionIcon>
                <Avatar component={Link} to="/profile" src={ikarusIcon}/>
                <HeaderMenu/>
            </Group>
        </Group>
    );
};
export default Header;