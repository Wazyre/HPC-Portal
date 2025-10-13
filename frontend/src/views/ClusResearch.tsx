import { Card, CardSection, Code, Container, Divider, Space, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title } from "@mantine/core";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router";
import { selectRole } from "../slices/authorizationSlice";
import { useEffect } from "react";
import { useVerifyUser } from "../utils/useVerifyUser";

// Table data
const params = [
    {param: "Groups", value: "Research", desc: "Accounts with free access, small-scale or short-time projects will be part of this group"},
    {param: "Nodes", value: "6", desc: "Computing nodes allocated/dedicated to this partition"},
    {param: "Cores", value: "240", desc: "Maximum allocated processing units (core) per job"},
    {param: "Memory", value: "2 TB", desc: "Maximum allocated amount of RAM per job."},
    {param: "Running Time", value: "36 hours", desc: "Maximum runing time for each job. Jobs exceeding this limit will be terminated."},

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

const ClusResearch = () => {
    const userRole = useAppSelector(selectRole);
    const navigate = useNavigate();

    useVerifyUser();

    useEffect(() => {
        if (userRole === "project") {
            navigate('/clusters/project')
        }
        else if (userRole === "developer") {
            navigate('/clusters/dev')
        }
    }, []);

    return (
        <Container fluid>
            <Title order={2}>Research Cluster</Title>
            <Card>
                <CardSection bg="yellow.4">
                    <Text>Research Cluster</Text>
                </CardSection>
                <Text>
                    The Research cluster is a dedicated partition within IKARUS, utilizing less than 10% of its total resources to support experimental, early-stage or small-scale scientific projects or conducting proof-of-concept simulations. 
                </Text>
                <Divider my="md"/>
                <Text fw={700}>Objective:</Text>
                <Text>It is aimed to provide a flexible and accessible platform for application development and testing before scaling to production without impacting IKARUS high-priority workloads. </Text>
            </Card>

            <Card>
                <CardSection bg="cyan.4">
                    <Text>Avaliable Resources</Text>
                </CardSection>
                <Text fz="lg">
                    Integrated Kuwait Advanced Research for Ultrafast Systems (IKARUS) 
                </Text>
                <Space/>
                <Text>Research Cluster</Text>
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

            <Card>
                <CardSection bg="cyan.4">
                    <Text>Submit Job</Text>
                </CardSection>
                <Text>
                    To submit a job to "Research" cluster in IKARUS, the “sbatch” file should have the following minimum "#SBATCH" configurations:
                </Text>
                <Code block color="gray.2">
{`#!/bin/bash

#SBATCH --job-name=example
#SBATCH --partition=def2
#SBATCH --nodes=1                    # Max 6
#SBATCH --time=00:05:00              # Max 36:00:00
#SBATCH --mem=16G                    # Max 2T

....`}
                </Code>
            </Card>
        </Container>
    )
};

export default ClusResearch;