import { Container, NavLink } from "@mantine/core";
import { 
    IconBook, IconBrandSpeedtest, IconChartBarPopular, 
    IconLayoutBoard, IconMail, IconTicket,
    IconDatabase 
} from "@tabler/icons-react";
import cx from "clsx";

import classes from "../sourceStyle.module.css"
import { Link } from "react-router";
import { useAppSelector } from "../app/hooks";
import { selectRole } from "../slices/authorizationSlice";

/* 
The sidebar of the entire portal
*/

const Sidebar = () => {
    const userRole = useAppSelector(selectRole);

    return (
        <Container>
            <NavLink
                component={Link}
                label="Dashboard"
                leftSection={<>
                    <IconBrandSpeedtest className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconBrandSpeedtest className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
                to="/portal/dashboard"
            />
            <NavLink
                label="Documentation"
                leftSection={<>
                    <IconBook className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconBook className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
            >
                {(userRole === "research" || userRole === "developer" || userRole === "project" || userRole === "webAdmin") ?
                    <>
                        <NavLink
                            component={Link}
                            label="Access-SSH"
                            to="/portal/documentation/ssh"
                        />
                        <NavLink
                            component={Link}
                            label="Modules"
                            to="/portal/documentation/modules"
                        />
                        <NavLink
                            component={Link}
                            label="File Management"
                            to="/portal/documentation/fmgmt"
                        />
                        <NavLink
                            component={Link}
                            label="Job Submission"
                            to="/portal/documentation/jobsub"
                        />
                        <NavLink
                            component={Link}
                            label="Useful Commands"
                            to="/portal/documentation/cmds"
                        />
                    </>
                : <></>
                }
                
            </NavLink>
            <NavLink
                label="Cluster Info"
                leftSection={<>
                    <IconLayoutBoard className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconLayoutBoard className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
            >
                {(userRole === "research" || userRole === "webAdmin") ?
                        <NavLink
                            component={Link}
                            label="Research"
                            to="/portal/clusters/research"
                        />
                    : <></>
                }
                {(userRole === "project" || userRole === "webAdmin") ?
                        <NavLink
                            component={Link}
                            label="Project"
                            to="/portal/clusters/project"
                        />
                    : <></>
                }
                {(userRole === "developer" || userRole === "webAdmin") ?
                        <NavLink
                            component={Link}
                            label="Developer"
                            to="/portal/clusters/dev"
                        />
                    : <></>
                }
            </NavLink>
            {(userRole === "sysAdmin" || userRole === "webAdmin") ?
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
                            to="/portal/stats/clusters"
                        />
                        <NavLink
                            component={Link}
                            label="Storage"
                            to="/portal/stats/storage"
                        />
                        {/* <NavLink
                            component={Link}
                            label="Jobs"
                            to="/stats/job"
                        /> */}
                    </NavLink>
            : <></>}
            
            <NavLink
                component={Link}
                label="Support"
                leftSection={<>
                    <IconMail className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconMail className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
                to="/portal/support"
            />
            <NavLink
                component={Link}
                label="Ticket Queue"
                leftSection={<>
                    <IconTicket className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconTicket className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
                to="/portal/tickets"
            />


            <NavLink
                label="Logging System"
                leftSection={<>
                    <IconDatabase className={cx(classes.icon, classes.dark)} stroke={1.5}/>
                    <IconDatabase className={cx(classes.icon, classes.light)} stroke={1.5}/>
                </>}
            >
                <NavLink
                    component={Link}
                    label="Add"
                    to="/portal/change-requests"
                />
                <NavLink
                    component={Link}
                    label="History"
                    to="/portal/modification-history"
                />
            </NavLink>
            
        </Container>
    )
};

export default Sidebar;