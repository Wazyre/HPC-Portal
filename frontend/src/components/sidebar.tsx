import { NavLink, Divider, Text, Box, Avatar, Stack, Group, Image } from "@mantine/core";
import { 
    IconBook, IconBrandSpeedtest, IconChartBarPopular, 
    IconLayoutBoard, IconMail, IconTicket,
    IconDatabase,
    IconUser
} from "@tabler/icons-react";
import cx from "clsx";

import classes from "../sourceStyle.module.css"
import { Link } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectRole, selectName, selectUsername } from "../slices/authorizationSlice";
import ikarusLogo from "../assets/images/ikarus_logo_full.png";

/* 
The sidebar of the entire portal
*/

const Sidebar = () => {
    const userRole = useAppSelector(selectRole);
    const name = useAppSelector(selectName);
    const username = useAppSelector(selectUsername);

    return (
        <Stack justify="space-between" h="100%" gap={0}>

            {/* Logo area — IKARUS full logo at the top of the sidebar — clicking navigates to Dashboard */}
            <Box className={classes.sidebarLogoArea} component={Link} to="/portal/dashboard" style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}>
                <Group align="center" justify="center">
                    {/* Increased width for better visibility in the sidebar */}
                    <Image src={ikarusLogo} w={190} fit="contain"/>
                </Group>
            </Box>

            {/* Main navigation links */}
            <Box style={{ flex: 1, overflowY: 'auto' }} pt={8} px={8}>

                {/* MAIN section label */}
                <Text className={classes.sidebarSectionLabel}>Main</Text>

                <NavLink
                    component={Link}
                    label="Dashboard"
                    className={classes.sidebarLink}
                    leftSection={<>
                        <IconBrandSpeedtest className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconBrandSpeedtest className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                    to="/portal/dashboard"
                />
                <NavLink
                    label="Documentation"
                    className={classes.sidebarLink}
                    leftSection={<>
                        <IconBook className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconBook className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                >
                    {(userRole === "research" || userRole === "developer" || userRole === "project" || userRole === "webAdmin") ?
                        <>
                            <NavLink component={Link} label="Access-SSH" to="/portal/documentation/ssh" className={classes.sidebarSubLink}/>
                            <NavLink component={Link} label="Modules" to="/portal/documentation/modules" className={classes.sidebarSubLink}/>
                            <NavLink component={Link} label="File Management" to="/portal/documentation/fmgmt" className={classes.sidebarSubLink}/>
                            <NavLink component={Link} label="Job Submission" to="/portal/documentation/jobsub" className={classes.sidebarSubLink}/>
                            <NavLink component={Link} label="Useful Commands" to="/portal/documentation/cmds" className={classes.sidebarSubLink}/>
                        </>
                    : <></>
                    }
                </NavLink>

                <NavLink
                    label="Cluster Info"
                    className={classes.sidebarLink}
                    leftSection={<>
                        <IconLayoutBoard className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconLayoutBoard className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                >
                    {(userRole === "research" || userRole === "webAdmin") ?
                        <NavLink component={Link} label="Research" to="/portal/clusters/research" className={classes.sidebarSubLink}/>
                    : <></>}
                    {(userRole === "project" || userRole === "webAdmin") ?
                        <NavLink component={Link} label="Project" to="/portal/clusters/project" className={classes.sidebarSubLink}/>
                    : <></>}
                    {(userRole === "developer" || userRole === "webAdmin") ?
                        <NavLink component={Link} label="Developer" to="/portal/clusters/dev" className={classes.sidebarSubLink}/>
                    : <></>}
                </NavLink>

                {(userRole === "sysAdmin" || userRole === "webAdmin") ?
                    <NavLink
                        label="Statistics"
                        className={classes.sidebarLink}
                        leftSection={<>
                            <IconChartBarPopular className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                            <IconChartBarPopular className={cx(classes.icon, classes.light)} stroke={1.5}/>
                        </>}
                    >
                        <NavLink component={Link} label="Clusters" to="/portal/stats/clusters" className={classes.sidebarSubLink}/>
                        <NavLink component={Link} label="Storage" to="/portal/stats/storage" className={classes.sidebarSubLink}/>
                        {/* <NavLink
                            component={Link}
                            label="Jobs"
                            to="/stats/job"
                        /> */}
                    </NavLink>
                : <></>}

                {/* SUPPORT section divider and label */}
                <Divider my={10} mx={6}/>
                <Text className={classes.sidebarSectionLabel}>Support</Text>

                <NavLink
                    component={Link}
                    label="Support"
                    className={classes.sidebarLink}
                    leftSection={<>
                        <IconMail className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconMail className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                    to="/portal/support"
                />
                <NavLink
                    component={Link}
                    label="Ticket Queue"
                    className={classes.sidebarLink}
                    leftSection={<>
                        <IconTicket className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconTicket className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                    to="/portal/tickets"
                />

                {/* ADMIN section divider and label */}
                <Divider my={10} mx={6}/>
                <Text className={classes.sidebarSectionLabel}>Admin</Text>

                <NavLink
                    label="Logging System"
                    className={classes.sidebarLink}
                    leftSection={<>
                        <IconDatabase className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconDatabase className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                >
                    <NavLink component={Link} label="Add" to="/portal/change-requests" className={classes.sidebarSubLink}/>
                    <NavLink component={Link} label="History" to="/portal/modification-history" className={classes.sidebarSubLink}/>
                </NavLink>

            </Box>

            {/* User info at the bottom of the sidebar — clicking navigates to the profile page */}
            <Box className={classes.sidebarUserInfo} component={Link} to="/portal/profile" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <Avatar radius="xl" size="sm" color="blue">
                    <IconUser size={16}/>
                </Avatar>
                <Box style={{ overflow: 'hidden' }}>
                    <Text size="xs" fw={500} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {name}
                    </Text>
                    <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {username}
                    </Text>
                </Box>
            </Box>
        </Stack>
    )
};

export default Sidebar;