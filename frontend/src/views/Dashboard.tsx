import { BarChart, DonutChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Group, Loader, Pill, ProgressLabel, ProgressRoot, ProgressSection, Stack, Text, Title, Tooltip } from "@mantine/core";
import { useVerifyUser } from "../utils/useVerifyUser";
import { IconMail } from "@tabler/icons-react";
import { useAppSelector } from "../app/hooks";
import { selectEmail } from "../slices/authorizationSlice";
import { useGetPendingTicketsQuery } from "../apis/rtkApi";

import classes from "../sourceStyle.module.css";

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
    const email = useAppSelector(selectEmail);
    const {data: pendingTickets, isLoading} = useGetPendingTicketsQuery(email);

    useVerifyUser(['any']);

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
                <Text fz="xs" c="gray.6">Out of 500G</Text>
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

                <Text fw={700} mt={50}>Avg. Utilization</Text>
                <Text fz="xs" c="gray.6">Cluster Resources</Text>
                <Grid>
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
                            <Text>Nodes</Text>
                            <Pill>15%</Pill>
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
                            <Text>Cores</Text>
                            <Pill>15%</Pill>
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
                            <Text>Network</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </GridCol>
                </Grid>

                {/* -------------------------------------------------------- */}

                <Group mt={50}>
                    <BarChart
                        h={400}
                        dataKey="month"
                        data={[
  { month: 'January', Jobs: 1200, Storage: 900, Runtime: 200 },
  { month: 'February', Jobs: 1900, Storage: 1200, Runtime: 400 },
  { month: 'March', Jobs: 400, Storage: 1000, Runtime: 200 },
  { month: 'April', Jobs: 1000, Storage: 200, Runtime: 800 },
  { month: 'May', Jobs: 800, Storage: 1400, Runtime: 1200 },
  { month: 'June', Jobs: 750, Storage: 600, Runtime: 1000 },
]}
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
