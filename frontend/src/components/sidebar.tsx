import { Container, NavLink } from "@mantine/core";
import { IconBook, IconBrandSpeedtest, IconChartBarPopular, IconLayoutBoard, IconMail, IconTicket } from "@tabler/icons-react";
import cx from "clsx";

import classes from "../sourceStyle.module.css"
import { Link } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectRole } from "../slices/authorizationSlice";

const Sidebar = () => {
    const userRole = useAppSelector(selectRole)

    return (
        <Container>
            <NavLink
                component={Link}
                label="Dashboard"
                leftSection={<>
                    <IconBrandSpeedtest className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconBrandSpeedtest className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
                to="/dashboard"
            />
            <NavLink
                label="Documentation"
                leftSection={<>
                    <IconBook className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconBook className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
            >
                <NavLink
                    component={Link}
                    label="Access-SSH"
                    to="/documentation/ssh"
                />
                <NavLink
                    component={Link}
                    label="Modules"
                    to="/documentation/modules"
                />
                <NavLink
                    component={Link}
                    label="File Management"
                    to="/documentation/fmgmt"
                />
                <NavLink
                    component={Link}
                    label="Job Submission"
                    to="/documentation/jobsub"
                />
                <NavLink
                    component={Link}
                    label="Useful Commands"
                    to="/documentation/cmds"
                />
            </NavLink>
            <NavLink
                label="Cluster Info"
                leftSection={<>
                    <IconLayoutBoard className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconLayoutBoard className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
            >
                {(userRole === "research" || userRole === "admin") ?
                        <NavLink
                            component={Link}
                            label="Research"
                            to="/clusters/research"
                        />
                    : <></>
                }
                {(userRole === "project" || userRole === "admin") ?
                        <NavLink
                            component={Link}
                            label="Project"
                            to="/clusters/project"
                        />
                    : <></>
                }
                {(userRole === "developer" || userRole === "admin") ?
                        <NavLink
                            component={Link}
                            label="Developer"
                            to="/clusters/dev"
                        />
                    : <></>
                }
            </NavLink>
            {userRole === "admin" ?
                    <NavLink
                        label="Statistics"
                        leftSection={<>
                            <IconChartBarPopular className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                            <IconChartBarPopular className={cx(classes.icon, classes.light)} stroke={1.5}/>
                        </>}
                    >
                        <NavLink
                            component={Link}
                            label="Clusters"
                            to="/stats/clusters"
                        />
                        <NavLink
                            component={Link}
                            label="Storage"
                            to="/stats/storage"
                        />
                        <NavLink
                            component={Link}
                            label="Jobs"
                            to="/stats/jobs"
                        />
                    </NavLink>
            : <></>}
            
            <NavLink
                component={Link}
                label="Support"
                leftSection={<>
                    <IconMail className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconMail className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
                to="/support"
            />
            {userRole === 'admin' ? 
                <NavLink
                    component={Link}
                    label="Ticket Queue"
                    leftSection={<>
                        <IconTicket className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                        <IconTicket className={cx(classes.icon, classes.light)} stroke={1.5}/>
                    </>}
                    to="/tickets"
                />
            : <></>}
            
        </Container>
    )
};

export default Sidebar;