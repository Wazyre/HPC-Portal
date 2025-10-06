import { DonutChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Pill, ProgressLabel, ProgressRoot, ProgressSection, Stack, Text, Title, Tooltip } from "@mantine/core";

import classes from "../sourceStyle.module.css";
import { useVerifyUser } from "../utils/useVerifyUser";

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

    useVerifyUser();

    return (
        <Container fluid>
            <Title order={2}>Dashboard</Title>
            <Card radius="md" withBorder m={20}>
                <Text fw={700}>Storage Usage</Text>
                <Text fz="xs" c="gray.6">Out of 500G</Text>
                <ProgressRoot size={30}>
                    <Tooltip label="33GB">
                        <ProgressSection value={28} color="green.5">
                            <ProgressLabel>Applications</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="15GB">
                        <ProgressSection value={15} color="blue.5">
                            <ProgressLabel>Documents</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="7GB">
                        <ProgressSection value={7} color="yellow.5">
                            <ProgressLabel>Images</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="26GB">
                        <ProgressSection value={26} color="red.5">
                            <ProgressLabel>Scripts</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <Tooltip label="40GB">
                        <ProgressSection value={40} color="gray.5">
                            <ProgressLabel>Other</ProgressLabel>
                        </ProgressSection>
                    </Tooltip>
                    <ProgressSection value={100} color="gray.1">
                        <ProgressLabel></ProgressLabel>
                    </ProgressSection>
                </ProgressRoot>

                <Text fw={700} mt={20}>Avg. Utilization</Text>
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

            </Card>
        </Container>
    );
};

export default Dashboard;
