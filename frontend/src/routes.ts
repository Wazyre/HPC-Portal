import { createBrowserRouter } from "react-router";
import Layout from "./views/Layout";
import Dashboard from "./views/Dashboard";
import AccessSSH from "./views/AccessSSH";
import Support from "./views/Support";
import ClusResearch from "./views/ClusResearch";
import ClusProject from "./views/ClusProject";
import ClusDeveloper from "./views/ClusDeveloper";
import Modules from "./views/Modules";
import Login from "./views/Login";
import Profile from "./views/Profile";
import TicketPortal from "./views/TicketPortal";
import StorageStats from "./views/StorageStats";
import ClusterStats from "./views/ClusterStats";
import TicketReply from "./views/TicketReply";
import FileManagement from "./views/FileManagement";

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
                    {path: "jobsub", Component: Dashboard},
                    {path: "cmds", Component: Dashboard},
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