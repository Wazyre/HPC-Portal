import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router";
import { selectRole } from "../../slices/authorizationSlice";
import { BarChart, LineChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Text, Title } from "@mantine/core";

import { useVerifyUser } from "../../utils/useVerifyUser";

const data = [
    {
        date: 0,
        Research: 25,
        Project: 85,
        Developer: 28,
    },
    {
        date: 1,
        Research: 34,
        Project: 64,
        Developer: 46,
    },
    {
        date: 2,
        Research: 12,
        Project: 34,
        Developer: 76,
    },
    {
        date: 3,
        Research: 45,
        Project: 16,
        Developer: 36,
    },
    {
        date: 4,
        Research: 25,
        Project: 78,
        Developer: 34,
    },
];

const ClusterStats = () => {
    const userRole = useAppSelector(selectRole);

    const navigate = useNavigate();

    useVerifyUser();

    // Restrict page entry only to admins
    useEffect(() => {
        if (userRole !== "sysAdmin" && userRole !== "webAdmin") {
            navigate(-1);
        }
    }, []);

    return (
        <Container fluid>
            <Title order={2}>Cluster Statistics</Title>
            <Grid>
                <GridCol span={6}>
                    <Card>
                        <Text>Resource Utilization %</Text>
                        <LineChart
                            h={300}
                            data={data}
                            dataKey="date"
                            series={[
                                { name: 'Research', color: 'indigo.6' },
                                { name: 'Project', color: 'blue.6' },
                                { name: 'Developer', color: 'teal.6' },
                            ]}
                            curveType="linear"
                            withLegend
                            legendProps={{verticalAlign: 'top', height: 50}}
                            withXAxis={false}
                            yAxisLabel="Percent %"
                            yAxisProps={{ domain: [0, 100] }}
                        />
                        
                    </Card>
                </GridCol>
                
                {/* -------------------------------------------------------- */}

                <GridCol span={6}>
                    <Card>
                        <Text>Running Tasks %</Text>
                        <LineChart
                            h={300}
                            data={data}
                            dataKey="date"
                            series={[
                                { name: 'Research', color: 'indigo.6' },
                                { name: 'Project', color: 'blue.6' },
                                { name: 'Developer', color: 'teal.6' },
                            ]}
                            curveType="linear"
                            withLegend
                            legendProps={{verticalAlign: 'top', height: 50}}
                            withXAxis={false}
                            yAxisLabel="Percent %"
                            yAxisProps={{ domain: [0, 100] }}
                        />
                        
                    </Card>
                </GridCol>
            </Grid>

            {/* -------------------------------------------------------- */}

            <Grid>
                <GridCol span={6}>
                    <Card>
                        <Text>Performance</Text>
                        <Text fz="xs" c="gray.6">From Slurm log</Text>
                        <BarChart
                            h={400}
                            dataKey="month"
                            data={[
    { month: 'January', Submitted: 1200, Completed: 900, Canceled: 200 },
    { month: 'February', Submitted: 1900, Completed: 1200, Canceled: 400 },
    { month: 'March', Submitted: 400, Completed: 1000, Canceled: 200 },
    { month: 'April', Submitted: 1000, Completed: 200, Canceled: 800 },
    { month: 'May', Submitted: 800, Completed: 1400, Canceled: 1200 },
    { month: 'June', Submitted: 750, Completed: 600, Canceled: 1000 },
    ]}
                            series={[
                                {name: 'Submitted', color: 'violet.6'},
                                {name: 'Completed', color: 'teal.6'},
                                {name: 'Canceled', color: 'red.5'}
                            ]}
                            tickLine="y"
                            yAxisLabel="Jobs"
                            withLegend
                        />
                    </Card>
                </GridCol>

                {/* -------------------------------------------------------- */}
                
                <GridCol span={6}>
                    <Card>
                        <Text>Total Jobs/Cluster</Text>
                        <Text fz="xs" c="gray.6">From Slurm log</Text>
                        <BarChart
                            h={400}
                            dataKey="month"
                            orientation="vertical"
                            data={[
    { month: 'January', Research: 1200, Project: 900, Developer: 200 },
    { month: 'February', Research: 1900, Project: 1200, Developer: 400 },
    { month: 'March', Research: 400, Project: 1000, Developer: 200 },
    { month: 'April', Research: 1000, Project: 200, Developer: 800 },
    { month: 'May', Research: 800, Project: 1400, Developer: 1200 },
    { month: 'June', Research: 750, Project: 600, Developer: 1000 },
    ]}
                            series={[
                                {name: 'Research', color: 'violet.6'},
                                {name: 'Project', color: 'teal.6'},
                                {name: 'Developer', color: 'red.5'}
                            ]}
                            tickLine="y"
                            xAxisLabel="Jobs"
                            withLegend
                        />
                    </Card>
                </GridCol>
            </Grid>
        </Container>
    );    
};

export default ClusterStats;