import { Anchor, Card, CardSection, Code, Container, Divider, List, ListItem, Space, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title } from "@mantine/core";
import { useVerifyUser } from "../utils/useVerifyUser";
import { Link } from "react-router";

const JobSubmission = () => {
    useVerifyUser();

    return (
        <Container fluid>
            <Title order={2}>Job Submission</Title>

            <Card>
                <CardSection >
                    <Text>SLURM</Text>
                </CardSection>
                <Text >
                    One of the core components of HPC clusters such as IKARUS is the job
                    scheduler. The basic task of the job scheduler is to manage the
                    allocation of tasks to compute nodes. On IKARUS, <Text component="span" fw={700}>SLURM</Text> 
                    (Simple Linux Utility for Resource Management) workload manager is used. It is one of the most common 
                    schedulers used on Supercomputers and HPCs across the world.
                </Text>

                <Text mt={10}>The key things with the <Text component="span" fw={700}>SLURM</Text> scheduler are:</Text>
                <List>
                    <ListItem>It has queues for each dedicated cluster.</ListItem>
                    <ListItem>Manages the queue of pending jobs for efficient and fair scheduling, and allocates computer resource to jobs (i.e. nodes and cores)</ListItem>
                    <ListItem>Manages the execution and monitoring of tasks on the compute nodes</ListItem>
                    <ListItem>It works on a first-come-first-served basis</ListItem>
                    <ListItem>Users specify the required resources when scheduling the job</ListItem>
                </List>

                <Text mt={20}>Having been introduced to <Text component="span" fw={700}>SLURM</Text> scheduler, scheduling jobs to 
                    run automatically without interaction when the resource becomes available 
                    are called "batch jobs". To run a batch job, users provide all the required 
                    information to <Text component="span" fw={700}>SLURM</Text> via a job submission script, which is sort of like a 
                    recipe for the job.
                </Text>

                <Text mt={20}>
                    The <Text component="span" fw={700}>submission script</Text> is a text file that provides information to  
                    <Text component="span" fw={700}> SLURM</Text> about the task, required resources, and environment variables so the task can run. 
                    A minimal submission script has three main components:
                </Text>

                <List type="ordered" mt={10}>
                    <ListItem>A set of directives that provides SLURM with some high-level information such as:</ListItem>
                    <List>
                        <ListItem>Required Resources (Cores, Nodes, Memory … etc.)</ListItem>
                        <ListItem>Job name</ListItem>
                        <ListItem>Maximum Running Time</ListItem>
                        <ListItem>Job Logging Information</ListItem>
                        <ListItem>Job Output (if not defined, normally be shown on the screen)</ListItem>
                    </List>
                    <ListItem>Information about how the job environment should be set up, for example, what application (See <Anchor to="/documentation/modules" component={Link}>Modules</Anchor>) should be loaded.</ListItem>
                    <ListItem>The actual command(s) or developed code that needs to be executed.</ListItem>
                </List>
            </Card>

            {/* ---------------------------------------- */}

            <Card mt={20}>
                <CardSection >
                    <Text>SLURM Submission Scripts</Text>
                </CardSection>
                <Text>
                    A SLURM submission script must be created for each job. The script is used to specify where and 
                    how to run the job on IKARUS cluster and ends with the actual command(s)/code needed to run the 
                    job. The submission script file looks much like a standard shell script (.sh) file but also includes 
                    one or more lines that specify options for the SLURM scheduler.
                </Text>
                <Text mt={10}><Text component="span" fw={700} c="red">*Tip:</Text> For ease of use, give the job files a descriptive name, it is easier to create and submit the script from the working directory.</Text>
                
                <Text mt={20} fw={700} td="underline">SHABANGE</Text>
                <Text>It is the first line in any Linux shell script. All SLURM submission scripts must start with #!/bin/bash</Text>
                <Code block>#!/bin/bash</Code>

                <Text mt={10}>Although the hash signs (#) are regarded as comments by the shell, they are nonetheless read and interpreted by the SLURM scheduler.</Text>
                <Divider mt={20}/>

                {/* ---------------------------------------- */}

                <Text mt={20} fw={700} td="underline">#SBATCH</Text>
                <Text>The SLURM submission script must have one or more of #SBATCH directives, e.g.</Text>
                <Code block>#SBATCH --option-here</Code>
                <Text c="red" mt={10}>*Note: SBATCH directives are case sensitive.</Text>

                {/* ---------------------------------------- */}
                
                <Text mt={20}>Next is a list of the most common used options:</Text>
                <Table striped >
                    <TableThead>
                        <TableTr>
                            <TableTh>Variable</TableTh>
                            <TableTh>Description</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        <TableTr>
                            <TableTd>--job-name</TableTd>
                            <TableTd>Specify the job submission name</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--partition</TableTd>
                            <TableTd>Specify the cluster partition name</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--nodes</TableTd>
                            <TableTd>Specify number of nodes</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--ntasks-per-node</TableTd>
                            <TableTd>Specify number of tasks per node</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--ntasks</TableTd>
                            <TableTd>Specify number of tasks per job</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--cpus-per-task</TableTd>
                            <TableTd>Specify number of cores per task</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--mem</TableTd>
                            <TableTd>Specify the maximum amount of RAM requested per node</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>---mem-per-cpu</TableTd>
                            <TableTd>Specify the minimum RAM for each CPU core allocated to the job</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--time</TableTd>
                            <TableTd>Specify the maximum wall clock execution time for the job</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--output</TableTd>
                            <TableTd>Specify the job output file name or path/filename</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--error</TableTd>
                            <TableTd>Specify the job logs and error file name or path/filename</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--input</TableTd>
                            <TableTd>Specify the scripts input file name or path/filename</TableTd>
                        </TableTr>
                    </TableTbody>
                </Table>

                {/* ---------------------------------------- */}

                <Text mt={10} fw={700}>Example 1:</Text>
            </Card>

            <Card mt={20}>
                <CardSection >
                    <Text>Job Submission</Text>
                </CardSection>
            </Card>

            <Card mt={20}>
                <CardSection >
                    <Text>SLURM Commands</Text>
                </CardSection>
            </Card>

            <Card mt={20}>
                <CardSection >
                    <Text>Example - Many Sequential Running Parallel using Array</Text>
                </CardSection>
            </Card>

            <Card mt={20}>
                <CardSection >
                    <Text>Example - Parallel Using MPI</Text>
                </CardSection>
            </Card>
        </Container>
    );
};

export default JobSubmission;
