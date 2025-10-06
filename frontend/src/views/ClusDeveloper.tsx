import { Card, CardSection, Code, Container, Divider, Space, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title } from "@mantine/core";
import { useAppSelector } from "../app/hooks";
import { selectRole } from "../slices/authorizationSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useVerifyUser } from "../utils/useVerifyUser";

import classes from "../sourceStyle.module.css"

// TODO check submit job bash instructions

// Table data
const params = [
    {param: "Groups", value: "Developer", desc: "Accounts with free access, small-scale or short-time projects will be part of this group"},
    {param: "Nodes", value: "1", desc: "Computing nodes allocated/dedicated to this partition"},
    {param: "Cores", value: "196", desc: "Maximum allocated processing units (core) per job"},
    {param: "Memory", value: "1 TB", desc: "Maximum allocated amount of RAM per job."},
    {param: "Running Time", value: "72 hours", desc: "Maximum runing time for each job. Jobs exceeding this limit will be terminated."},
]

const tableData = params.map((row) => {
    return (
        <TableTr>
            <TableTd>{row.param}</TableTd>
            <TableTd>{row.value}</TableTd>
            <TableTd>{row.desc}</TableTd>
        </TableTr>
    )
})

const ClusDeveloper = () => {
    const userRole = useAppSelector(selectRole);
    const navigate = useNavigate();

    useVerifyUser();

    useEffect(() => {
        if (userRole === "project") {
            navigate('/clusters/project')
        }
        else if (userRole === "research") {
            navigate('/clusters/research')
        }
    }, []);

    return (
        <Container fluid>
            <Title order={2}>Developer Cluster</Title>
            <Card className={classes.card} m={20}>
                <CardSection className={classes.header} bg="yellow.4" p={10} withBorder={true}>
                    <Text>Research Cluster</Text>
                </CardSection>
                <Text>
                    The Developer cluster is a dedicated partition within IKARUS, utilizing less than 5% of its total resources to support experimental or small-scale scientific developments and resource assessment tools. 
                </Text>
                <Divider my="md"/>
                <Text fw={700}>Objective:</Text>
                <Text>It is aimed to provide a long run-time platform for application development and testing before scaling to production without impacting IKARUS high-priority workloads. </Text>
            </Card>

            <Card className={classes.card} m={20}>
                <CardSection className={classes.header} bg="cyan.4" p={10} withBorder={true}>
                    <Text>Avaliable Resources</Text>
                </CardSection>
                <Text fz="lg">
                    Integrated Kuwait Advanced Research for Ultrafast Systems (IKARUS) 
                </Text>
                <Space/>
                <Text>Developer Cluster</Text>
                <Table striped stripedColor="gray.2">
                    <TableThead>
                        <TableTr>
                            <TableTh>Parameter</TableTh>
                            <TableTh>Set Value</TableTh>
                            <TableTh>Description</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        {tableData}
                    </TableTbody>
                </Table>
            </Card>

            <Card className={classes.card} m={20}>
                <CardSection className={classes.header} bg="cyan.4" p={10} withBorder={true}>
                    <Text>Submit Job</Text>
                </CardSection>
                <Text>
                    To submit a job to "Developer" cluster in IKARUS, the “sbatch” file should have the following minimum "#SBATCH" configurations:
                </Text>
                <Code block color="gray.2">
{`#!/bin/bash

#SBATCH --job-name=example
#SBATCH --partition=longrun
#SBATCH --nodes=1                    # Max 1
#SBATCH --time=00:05:00              # Max 72:00:00
#SBATCH --mem=16G                    # Max 1T

....`}
                </Code>
            </Card>
        </Container>
    )
};

export default ClusDeveloper;