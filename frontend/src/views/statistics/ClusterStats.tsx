import { BarChart, LineChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Text, Title } from "@mantine/core";

import { useVerifyUser } from "../../utils/useVerifyUser";
import jobStat from "../../assets/data/jobsStat.json";
import jobPart from "../../assets/data/jobsPartition.json";
import liveResources from "../../assets/data/liveResources.json";
import { useEffect, useState } from "react";

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
    const [resourceData, setResourceData] = useState([{}]);
    const [partData, setPartData] = useState([{}]);
    const [statData, setStatData] = useState([{}]);

    const getLastSixMonths = () => {
        const months = [];
        const currentDate = new Date(); // Get the current date

        for (let i = 0; i < 6; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1); // Create a date object for the first day of the month, 'i' months ago
            const monthName = date.toLocaleString('default', { month: 'long' }); // Get the full month name
            // Add to the beginning of the array to maintain chronological order
            months.unshift(monthName);
        }
        return months;
    };

    const buildResourceData = () => {
        const data = [];
        for (let i = 0; i < 10; i++) {
            const tempCPUDev = liveResources[i].Developer.cpuState.split('/');
            const tempCPUProj = liveResources[i].Project.cpuState.split('/');
            const tempCPURes = liveResources[i].Research.cpuState.split('/');
            data.push({
                date: Date.now()+i, //TODO FIX AND USE TIMESTAMP
                Developer: ((1 - parseInt(tempCPUDev[1])/parseInt(tempCPUDev[3])) * 100),
                Project: ((1 - parseInt(tempCPUProj[1])/parseInt(tempCPUProj[3])) * 100),
                Research: ((1 - parseInt(tempCPURes[1])/parseInt(tempCPURes[3])) * 100),
            });
        }
        return data;
    };

    const buildStatData = () => {
        const months = getLastSixMonths();
        const data = [];
        for (let i = 0; i < months.length; i++) {
            data.push({
                month: months[i],
                Submitted: jobStat[i].Total,
                Completed: jobStat[i].Completed,
                Failed: jobStat[i].Failed,
                Cancelled: jobStat[i].Cancelled,
                Running: jobStat[i].Running,
                Pending: jobStat[i].Pending
            });
        }
        return data;
    };

    const buildPartData = () => {
        const months = getLastSixMonths();
        const data = [];
        for (let i = 0; i < months.length; i++) {
            data.push({
                month: months[i],
                Developer: jobPart[i].Developer,
                Project: jobPart[i].Project,
                Research: jobPart[i].Research,
            });
        }
        return data;
    };

    // Restrict page entry only to admins
    useVerifyUser(["sysAdmin", "webAdmin"]);

    useEffect(() => {
        setResourceData(buildResourceData());
        setPartData(buildPartData());
        setStatData(buildStatData())
    }, [jobPart, jobStat, liveResources]);

    return (
        <Container fluid>
            <Title order={2}>Cluster Statistics</Title>
            <Grid>
                <GridCol span={6}>
                    <Card>
                        <Text>Resource Utilization %</Text>
                        <Text fz="xs" c="gray.6">Combined CPU and Node Use</Text>
                        <LineChart
                            h={300}
                            data={resourceData}
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
                        <Text>Job Performance</Text>
                        <Text fz="xs" c="gray.6">From Slurm log</Text>
                        <BarChart
                            h={400}
                            dataKey="month"
                            data={statData}
                            series={[
                                {name: 'Submitted', color: 'violet.6'},
                                {name: 'Completed', color: 'teal.6'},
                                {name: 'Failed', color: 'red.5'},
                                {name: 'Cancelled', color: 'orange.6'},
                                {name: 'Running', color: 'blue.5'},
                                {name: 'Pending', color: 'yellow.5'}
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
                            type="stacked"
                            data={partData}
                            series={[
                                {name: 'Research', color: 'violet.6'},
                                {name: 'Project', color: 'teal.6'},
                                {name: 'Developer', color: 'red.5'}
                            ]}
                            tickLine="y"
                            xAxisLabel="Jobs"
                            yAxisProps={{width: 80}}
                            withLegend
                        />
                    </Card>
                </GridCol>
            </Grid>
        </Container>
    );    
};

export default ClusterStats;