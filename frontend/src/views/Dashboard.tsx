import { useEffect, useState } from "react";
import { BarChart } from "@mantine/charts";
import { Container, Group, Loader, Paper, SimpleGrid, Stack, Text, Title, Tooltip, ProgressRoot, ProgressSection, Box } from "@mantine/core";
import { useVerifyUser } from "../utils/useVerifyUser";
import { IconMail, IconServer, IconCpu } from "@tabler/icons-react";
import { useAppSelector } from "../app/hooks";
import { selectUsername, selectRole, selectName } from "../slices/authorizationSlice";
import { useGetPendingTicketsQuery } from "../apis/rtkApi";

import nodeInfo from "../assets/data/nodeInfo.json";
import userStorage from "../assets/data/userStorage.json";
import userJobs from "../assets/data/userJobs.json";
import humanFileSize from "../utils/humanFileSize";


const Dashboard = () => {
    const [storageUsed, setStorageUsed] = useState<number>(0);
    const [cpuState, setCpuState] = useState<string[]>([]);
    const [cpuPerc, setCpuPerc] = useState<number>(0);
    const [nodeState, setNodeState] = useState<string[]>([]);
    const [nodePerc, setNodePerc] = useState<number>(0);
    const [jobData, setJobData] = useState([{}]);
    const username = useAppSelector(selectUsername);
    const role = useAppSelector(selectRole);
    const name = useAppSelector(selectName); // Get full name to extract first name
    const firstName = name ? name.split(' ')[0] : ''; // Extract first name only
    const {data: pendingTickets, isLoading} = useGetPendingTicketsQuery(username);

    const buildData = () => {
        if (username) {
            const data = [];
            const jobs = userJobs.find(user => user.name === username)!;
            const {name, ...newJobs} = jobs;
            console.log(name);
            const storage = userStorage[username as keyof typeof userStorage]; 

            for (const month of Object.keys(newJobs)) {
                // Convert from bytes to GB, and assign zero if month has no storage changes
                const newStorage = parseFloat((storage[month as keyof typeof storage] / (1024 * 1024 * 1024)).toFixed(2)) || 0.00;
                data.push({ month: month.split('-')[1], Jobs: newJobs[month as keyof typeof newJobs].jobs, Storage: newStorage, Runtime: (newJobs[month as keyof typeof newJobs].time/3600).toFixed(1) },)
            }
            return data;
        }
        return [{}];
    };

    useVerifyUser(['any']);

    useEffect(() => {
        setStorageUsed(userStorage.scratchUsed);
        let tempNode: string[] = [];
        let tempCpu: string[] = [];
        if (role === "developer") {
            tempCpu = nodeInfo.Developer.cpuState.split('/'); // [allocated, idle, other, total]
            tempNode = nodeInfo.Developer.nodeState.split('/'); // [allocated, idle, other, total]
        }
        else if (role === "project") {
            tempCpu = nodeInfo.Project.cpuState.split('/');
            tempNode = nodeInfo.Project.nodeState.split('/');
        }
        else {
            tempCpu = nodeInfo.Research.cpuState.split('/');
            tempNode = nodeInfo.Research.nodeState.split('/');
        }
        setCpuState(tempCpu);
        setNodeState(tempNode);
        setCpuPerc(parseFloat(((1-parseInt(tempCpu[1])/parseInt(tempCpu[3]))*100).toFixed(1)));
        setNodePerc(parseFloat(((1-parseInt(tempNode[1])/parseInt(tempNode[3]))*100).toFixed(1)));
        setJobData(buildData());
    }, [nodeInfo, userJobs, userStorage, username])

    if (isLoading) {
        return (
            <Container fluid>
                <Stack justify={"center"} align={"center"}>
                    <Loader color="ikarus-blue" type="bars"/>
                </Stack>
            </Container>
        )
    }

    return (
        <Container fluid>

            {/* Page title, welcome message and today's date */}
            <Group justify="space-between" align="flex-start" mt="md" mb="md">
                <div>
                    <Title order={1}>Dashboard</Title>
                    <Text c="dimmed" size="md" mt={4}>Welcome back, {firstName}</Text>
                </div>
                <Paper withBorder px="md" py="xs" radius="md" mt="xs">
                    <Text size="sm" c="dimmed">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                </Paper>
            </Group>

            {/* 3 colorful gradient stat cards — Pending Tickets, Nodes, Cores */}
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">

                {/* Pending Tickets — blue gradient */}
                <Box
                    style={{
                        background: 'linear-gradient(135deg, #1f6dbf, #0a4a8a)',
                        borderRadius: 'var(--mantine-radius-md)',
                        padding: '16px',
                        color: 'white',
                    }}
                >
                    <IconMail size={20} style={{ opacity: 0.85 }}/>
                    <Text fz={24} fw={600} mt={10}>{pendingTickets ?? 0}</Text>
                    <Text fz={11} style={{ opacity: 0.85 }} mt={2}>Pending Tickets</Text>
                </Box>

                {/* Nodes — orange gradient */}
                <Box
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        borderRadius: 'var(--mantine-radius-md)',
                        padding: '16px',
                        color: 'white',
                    }}
                >
                    <IconServer size={20} style={{ opacity: 0.85 }}/>
                    <Text fz={24} fw={600} mt={10}>{nodeState[1] ?? 0}</Text>
                    <Text fz={11} style={{ opacity: 0.85 }} mt={2}>Nodes Active ({nodePerc}% in use)</Text>
                </Box>

                {/* Cores — pink gradient */}
                <Box
                    style={{
                        background: 'linear-gradient(135deg, #ec4899, #be185d)',
                        borderRadius: 'var(--mantine-radius-md)',
                        padding: '16px',
                        color: 'white',
                    }}
                >
                    <IconCpu size={20} style={{ opacity: 0.85 }}/>
                    <Text fz={24} fw={600} mt={10}>{cpuState[1] ?? 0}</Text>
                    <Text fz={11} style={{ opacity: 0.85 }} mt={2}>Cores Active ({cpuPerc}% in use)</Text>
                </Box>

            </SimpleGrid>

            {/* Storage Usage card with gradient progress bar */}
            <Paper withBorder radius="md" p="lg" mb="md">
                <Text fw={600} fz="md" mb={4}>Storage Usage</Text>
                <Text fz="xs" c="dimmed" mb="md">{'Out of ' + humanFileSize(userStorage.scratchSize, false)}</Text>
                <Tooltip label={humanFileSize(storageUsed, false)}>
                    {/* Increased size from 12 to 30 to make the bar thicker like the original design */}
                    <ProgressRoot size={30} radius="xl">
                        <ProgressSection
                            value={(storageUsed/userStorage.scratchSize)*100}
                            style={{ background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }}
                        />
                    </ProgressRoot>
                </Tooltip>
            </Paper>

            {/* Job Activity chart card */}
            <Paper withBorder radius="md" p="lg">
                <Text fw={600} fz="md" mb={4}>Job Activity</Text>
                <Text fz="xs" c="dimmed" mb="md">Jobs, runtime and storage usage per month</Text>
                <BarChart
                    h={400}
                    dataKey="month"
                    data={jobData}
                    series={[
                        {name: 'Jobs', color: 'violet.6'},
                        {name: 'Storage', label: 'Storage (GB)', color: 'teal.6'},
                        {name: 'Runtime', label: 'Runtime (Hr)', color: 'red.5'}
                    ]}
                    tickLine="y"
                    withLegend
                />
            </Paper>

        </Container>
    );
};

export default Dashboard;