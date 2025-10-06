import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router";
import { selectRole } from "../slices/authorizationSlice";
import { LineChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Text, Title } from "@mantine/core";

import classes from "../sourceStyle.module.css";
import { useVerifyUser } from "../utils/useVerifyUser";

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

    useEffect(() => {
            if (userRole !== "admin") {
                navigate(-1);
            }
        }, []);

    return (
        <Container fluid>
            <Title order={2}>Cluster Statistics</Title>
            <Grid>
                <GridCol span={6}>
                    <Card>
                        <Text>Resource Utilization</Text>
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
                            yAxisProps={{ domain: [0, 100] }}
                            classNames={{legend: classes.lineChartLegend, 
                                legendItem: classes.lineChartLegendItem,
                                legendItemName: classes.lineChartLegendName
                            }}
                        />
                    </Card>
                </GridCol>
            </Grid>
        </Container>
    );    
};

export default ClusterStats;