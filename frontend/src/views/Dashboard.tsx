import { useEffect, useState } from "react";
import { BarChart, DonutChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Group, Loader, Pill, ProgressLabel, ProgressRoot, ProgressSection, RingProgress, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useVerifyUser } from "../utils/useVerifyUser";
import { IconMail } from "@tabler/icons-react";
import { useAppSelector } from "../app/hooks";
import { selectUsername, selectRole } from "../slices/authorizationSlice";
import { useGetPendingTicketsQuery } from "../apis/rtkApi";

import classes from "../sourceStyle.module.css";
import nodeInfo from "../assets/data/nodeInfo.json";
// import userStorage from "../assets/data/userStorage.json";
import userJobs from "../assets/data/userJobs.json";

//TODO Pulled from backend
/*
- Storage Usage
- Donut chart data
- Donut chart labels
- Area chart data
*/

const data = [
  { name: 'USA', value: 200, color: 'green.4' },
  { name: '', value: 600, color: 'gray.3' },
];

const perc = 8.9

const Dashboard = () => {
    const [cpuState, setCpuState] = useState<string[]>([]);
    const [cpuPerc, setCpuPerc] = useState<number>(0);
    const [nodeState, setNodeState] = useState<string[]>([]);
    const [nodePerc, setNodePerc] = useState<number>(0);
    const [jobData, setJobData] = useState([{}]);
    const username = useAppSelector(selectUsername);
    const role = useAppSelector(selectRole);
    const {data: pendingTickets, isLoading} = useGetPendingTicketsQuery(username);

    const buildData = () => {
        const data = [];
        console.log(username)
        const jobs = userJobs.find(user => user.name === username)!;
        const {name, ...newJobs} = jobs;
        console.log(name);
        for (const month in Object.keys(newJobs)) {
            console.log(month);
            data.push({ month: month, Jobs: newJobs[month as keyof typeof newJobs].jobs, Storage: 900, Runtime: (newJobs[month as keyof typeof newJobs].time/3600).toFixed(1) },)
        }
        return data;
    };

    useVerifyUser(['any']);

    useEffect(() => {
        let tempNode: string[] = [];
        let tempCpu: string[] = [];
        if (role === "research") {
            tempCpu = nodeInfo.research.cpuState.split('/'); // [allocated, idle, other, total]
            tempNode = nodeInfo.research.nodeState.split('/'); // [allocated, idle, other, total]
        }
        else if (role === "project") {
            tempCpu = nodeInfo.project.cpuState.split('/');
            tempNode = nodeInfo.project.nodeState.split('/');
        }
        else {
            tempCpu = nodeInfo.developer.cpuState.split('/');
            tempNode = nodeInfo.developer.nodeState.split('/');
        }
        setCpuState(tempCpu);
        setNodeState(tempNode);
        setCpuPerc((1-parseInt(tempCpu[1])/parseInt(tempCpu[3]))*100);
        setNodePerc((1-parseInt(tempNode[1])/parseInt(tempNode[3]))*100);
        setJobData(buildData());
    }, [nodeInfo, userJobs, username])

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
            <Title order={2}>Dashboard</Title>
            <Card>
                <Group>
                    <IconMail/>
                    <Text fw={700}>{'Pending Support Tickets: '+pendingTickets} </Text>
                </Group>

                <Text fw={700} mt={20}>Storage Usage</Text>
                <Text fz="xs" c="gray.6">Out of 2T</Text>
                <ProgressRoot size={30} mt={20}>
                    <Tooltip label="33GB - Applications">
                        <ProgressSection value={28} color="green.5">
                            <ProgressLabel>Applications</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="15GB - Documents">
                        <ProgressSection value={15} color="blue.5">
                            <ProgressLabel>Documents</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="7GB - Images">
                        <ProgressSection value={7} color="yellow.5">
                            <ProgressLabel>Images</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="26GB - Scripts">
                        <ProgressSection value={26} color="red.5">
                            <ProgressLabel>Scripts</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="40GB - Other">
                        <ProgressSection value={40} color="gray.5">
                            <ProgressLabel>Other</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="300GB - Unused">
                        <ProgressSection value={100} color="gray.1">
                            <ProgressLabel></ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                </ProgressRoot>

                {/* -------------------------------------------------------- */}

                <Text fw={700} mt={50}>Available Resources</Text>
                <Text fz="xs" c="gray.6">Cluster Resources</Text>
                <Grid>
                    <GridCol span={3}>
                        <Stack align="center">
                            {/* <DonutChart 
                                w={100} 
                                h={100} 
                                size={100} 
                                thickness={10} 
                                data={data} 
                                chartLabel={nodeState[1]}
                                labelsType="value"
                                withTooltip={false}
                                classNames={{label: classes.chartInnerText}}
                            /> */}
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={[{ value: nodePerc, color: 'green.4'}]}
                                label={
                                <Text size="xl" ta="center">
                                    {nodeState[1]}
                                </Text>}
                            />
                            <Text>Nodes</Text>
                            <Pill>{nodePerc + "%"}</Pill>
                        </Stack>
                    </GridCol>
                    <GridCol span={3}>
                        <Stack align="center">
                            {/* <DonutChart 
                                w={100} 
                                h={100} 
                                size={100} 
                                thickness={10} 
                                data={data} 
                                chartLabel={cpuState[1]}
                                labelsType="value"
                                withTooltip={false}
                                classNames={{label: classes.chartInnerText}}
                            /> */}
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={[{ value: cpuPerc, color: 'green.4'}]}
                                label={
                                <Text size="xl" ta="center">
                                    {cpuState[1]}
                                </Text>}
                            />
                            <Text>Cores</Text>
                            <Pill>{cpuPerc + "%"}</Pill>
                        </Stack>
                    </GridCol>
                    <GridCol span={3}>
                        <Stack align="center">
                            <DonutChart 
                                w={100} 
                                h={100} 
                                size={100} 
                                thickness={10} 
                                data={data} 
                                chartLabel={perc}
                                labelsType="value"
                                withTooltip={false}
                                classNames={{label: classes.chartInnerText}}
                            />
                            <Text>Storage</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </GridCol>
                </Grid>

                {/* -------------------------------------------------------- */}

                <Group mt={50}>
                    <BarChart
                        h={400}
                        dataKey="month"
                        data={jobData}
                        series={[
                            {name: 'Jobs', color: 'violet.6'},
                            {name: 'Storage', label: 'Storage (GB)',color: 'teal.6'},
                            {name: 'Runtime', label: 'Runtime (Hr)', color: 'red.5'}
                        ]}
                        tickLine="y"
                        withLegend
                    />

                    {/* -------------------------------------------------------- */}

                </Group>
            </Card>
        </Container>
    );
};

export default Dashboard;
