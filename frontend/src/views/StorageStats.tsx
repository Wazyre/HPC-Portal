import { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router";
import { selectRole } from "../slices/authorizationSlice";
import { DonutChart } from "@mantine/charts";
import { Card, Container, Grid, GridCol, Pill, RingProgress, Stack, Text, Title } from "@mantine/core";

import classes from "../sourceStyle.module.css";
import { useVerifyUser } from "../utils/useVerifyUser";

const data = [
  { name: 'USA', value: 200, color: 'green.4' },
  { name: '', value: 600, color: 'gray.3' },
];

const data2 = [
  { value: 20, color: 'green.4' },
];

const perc = 15

const StorageStats = () => {
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
            <Title order={2}>Storage Statistics</Title>
            <Grid>
                <GridCol span={4}>
                    <Card radius="md" withBorder m={20}>
                        <Text>Research Cluster</Text>
                        <Stack align="center">
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={data2} 
                                label={<Text size="xl" ta="center">
                                    {perc}
                                </Text>}
                                // classNames={{label: classes.chartInnerText}}
                            />
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Memory (RAM)</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <Card radius="md" withBorder m={20}>
                        <Text>Project Cluster</Text>
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
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Memory (RAM)</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <Card radius="md" withBorder m={20}>
                        <Text>Developer Cluster</Text>
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
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Memory (RAM)</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>

                <GridCol span={6}>
                    <Card radius="md" withBorder m={20}>
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
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Scratch</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
                <GridCol span={6}>
                    <Card radius="md" withBorder m={20}>
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
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Archive</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
            </Grid>
        </Container>
    )
};

export default StorageStats