import { Card, CardSection, Code, Container, Divider, Space, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title } from "@mantine/core";
import { useAppSelector } from "../app/hooks";
import { selectRole } from "../slices/authorizationSlice";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useVerifyUser } from "../utils/useVerifyUser";

// Table data
const params = [
    {param: "Groups", value: "Project", desc: "Accounts with free access, small-scale or short-time projects will be part of this group"},
    {param: "Nodes", value: "60", desc: "Computing nodes allocated/dedicated to this partition"},
    {param: "Cores", value: "2000", desc: "Maximum allocated processing units (core) per job"},
    {param: "Memory", value: "19 TB", desc: "Maximum allocated amount of RAM per job."},
    {param: "Running Time", value: "4 hours", desc: "Maximum runing time for each job. Jobs exceeding this limit will be terminated."},

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

const ClusProject = () => {
    const userRole = useAppSelector(selectRole);
    const navigate = useNavigate();

    useVerifyUser();

    useEffect(() => {
        if (userRole === "research") {
            navigate('/clusters/research')
        }
        else if (userRole === "developer") {
            navigate('/clusters/dev')
        }
    }, []);

    return (
        <Container fluid>
            <Title order={2}>Project Cluster</Title>
            <Card>
                <CardSection bg="yellow.4">
                    <Text>Project Cluster</Text>
                </CardSection>
                <Text>
                    The Project cluster is a dedicated partition within IKARUS, utilizing almost 85% of its total resources to support KISR projects (equal-to-project lifespan) or collaborators (limited lifespan) working at other research institutions. Moreover, accounts for the integrated applications will be able to utlize the resources offered by this cluster.
                </Text>
                <Divider my="md"/>
                <Text fw={700}>Objective:</Text>
                <Text>It is aimed to provide the necessary resources with flexible, accessible platforms for integrated applications, ongoing KISR projects and related workloads. </Text>
            </Card>

            <Card>
                <CardSection bg="cyan.4">
                    <Text>Avaliable Resources</Text>
                </CardSection>
                <Text fz="lg">
                    Integrated Kuwait Advanced Research for Ultrafast Systems (IKARUS) 
                </Text>
                <Space/>
                <Text>Project Cluster</Text>
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
                    To submit a job to "Project" cluster in IKARUS, the “sbatch” file should have the following minimum "#SBATCH" configurations:
                </Text>
                <Code block>
{`#!/bin/bash

#SBATCH --job-name=example
#SBATCH --partition=def1
#SBATCH --nodes=1                    # Max 50
#SBATCH --time=00:05:00              # Max 04:00:00
#SBATCH --mem=16G                    # Max 19T

....`}
                </Code>
            </Card>
        </Container>
    )
};

export default ClusProject;