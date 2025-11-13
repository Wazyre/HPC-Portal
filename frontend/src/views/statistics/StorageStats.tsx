import { Card, Container, Grid, GridCol, Pill, RingProgress, Stack, Text, Title } from "@mantine/core";

import { useVerifyUser } from "../../utils/useVerifyUser";

const data2 = [
  { value: 20, color: 'green.4' },
];

const perc = 15

const StorageStats = () => {
    // Restrict page entry only to admins
    useVerifyUser(["sysAdmin", "webAdmin"]);

    return (
        <Container fluid>
            <Title order={2}>Storage Statistics</Title>
            <Grid>
                <GridCol span={4}>
                    <Card>
                        <Text>Research Cluster</Text>
                        <Stack align="center">
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={data2} 
                                label={<Text size="xl" ta="center">
                                    {perc}
                                </Text>}
                            />
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Memory (RAM)</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <Card>
                        <Text>Project Cluster</Text>
                        <Stack align="center">
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={data2} 
                                label={<Text size="xl" ta="center">
                                    {perc}
                                </Text>}
                            />
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Memory (RAM)</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <Card>
                        <Text>Developer Cluster</Text>
                        <Stack align="center">
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={data2} 
                                label={<Text size="xl" ta="center">
                                    {perc}
                                </Text>}
                            />
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Memory (RAM)</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>

                <GridCol span={6}>
                    <Card>
                        <Stack align="center">
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={data2} 
                                label={<Text size="xl" ta="center">
                                    {perc}
                                </Text>}
                            />
                            <Text fz={"larger"} fw={700}>50 GB</Text>
                            <Text>Scratch</Text>
                            <Pill>15%</Pill>
                        </Stack>
                    </Card>
                </GridCol>
                <GridCol span={6}>
                    <Card>
                        <Stack align="center">
                            <RingProgress 
                                size={120} 
                                thickness={10} 
                                sections={data2} 
                                label={<Text size="xl" ta="center">
                                    {perc}
                                </Text>}
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