import { createBrowserRouter } from "react-router";
import Layout from "./views/Layout";
import Dashboard from "./views/Dashboard";

import Support from "./views/Support";

import Login from "./views/Login";
import Profile from "./views/Profile";
import TicketPortal from "./views/TicketPortal";
import StorageStats from "./views/StorageStats";
import ClusterStats from "./views/ClusterStats";
import TicketReply from "./views/TicketReply";

import AccessSSH from "./views/userDocumentation/AccessSSH";
import Modules from "./views/userDocumentation/Modules";
import FileManagement from "./views/userDocumentation/FileManagement";
import UsefulCommands from "./views/userDocumentation/UsefulCommands";
import JobSubmission from "./views/userDocumentation/JobSubmission";

import ClusResearch from "./views/clusterInfo/ClusResearch";
import ClusProject from "./views/clusterInfo/ClusProject";
import ClusDeveloper from "./views/clusterInfo/ClusDeveloper";

export const router = createBrowserRouter([
    { index: true, Component: Login},
    {
        Component: Layout, // Main Component
        children: [ // Children are Outlets that fill the AppShell Main
            {path: "/dashboard", Component: Dashboard},
            {path: "/documentation",
                children: [
                    {path: "ssh", Component: AccessSSH},
                    {path: "modules", Component: Modules},
                    {path: "fmgmt", Component: FileManagement},
                    {path: "jobsub", Component: JobSubmission},
                    {path: "cmds", Component: UsefulCommands},
                ]
            },
            {path: "/clusters",
                children: [
                    {path: "research", Component: ClusResearch},
                    {path: "project", Component: ClusProject},
                    {path: "dev", Component: ClusDeveloper},
                ]
            },
            {path: "/stats",
                children: [
                    {path: "clusters", Component: ClusterStats},
                    {path: "storage", Component: StorageStats},
                    {path: "job", Component: Dashboard},
                ]
            },
            {path: "support", Component: Support},
            {path: "tickets", 
                children: [
                    {index: true, Component: TicketPortal},
                    {path: ":tid", Component: TicketReply}
                ]
            },
            {path: "profile", Component: Profile}
        ]
    }
])