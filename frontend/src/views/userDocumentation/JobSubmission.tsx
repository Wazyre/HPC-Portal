import { Anchor, Card, CardSection, Code, Container, Divider, List, ListItem, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text, Title } from "@mantine/core";
import { useVerifyUser } from "../../utils/useVerifyUser";
import { Link } from "react-router";

const JobSubmission = () => {
    useVerifyUser(['any']);

    return (
        <Container fluid>
            <Title order={2}>Job Submission</Title>

            <Card>
                <CardSection>SLURM</CardSection>
                <Text >
                    One of the core components of HPC clusters such as IKARUS is the job scheduler. The 
                    basic task of the job scheduler is to manage the allocation of tasks to compute nodes. 
                    On IKARUS, <Text component="span" fw={700}>SLURM</Text> (Simple Linux Utility for 
                    Resource Management) workload manager is used. It is one of the most common schedulers
                    used on Supercomputers and HPCs across the world.
                </Text>

                <Text mt={10}>
                    The key things with the <Text component="span" fw={700}>SLURM</Text> scheduler are:
                </Text>
                <List>
                    <ListItem>It has queues for each dedicated cluster.</ListItem>
                    <ListItem>
                        Manages the queue of pending jobs for efficient and fair scheduling, and 
                        allocates computer resource to jobs (i.e. nodes and cores)
                    </ListItem>
                    <ListItem>Manages the execution and monitoring of tasks on the compute nodes</ListItem>
                    <ListItem>It works on a first-come-first-served basis</ListItem>
                    <ListItem>Users specify the required resources when scheduling the job</ListItem>
                </List>

                <Text mt={20}>
                    Having been introduced to <Text component="span" fw={700}>SLURM</Text> scheduler, 
                    scheduling jobs to run automatically without interaction when the resource becomes 
                    available are called "batch jobs". To run a batch job, users provide all the required 
                    information to <Text component="span" fw={700}>SLURM</Text> via a job submission 
                    script, which is sort of like a recipe for the job.
                </Text>

                <Text mt={20}>
                    The <Text component="span" fw={700}>submission script</Text> is a text file that 
                    provides information to <Text component="span" fw={700}>SLURM</Text> about the task, 
                    required resources, and environment variables so the task can run. A minimal 
                    submission script has three main components:
                </Text>

                <List type="ordered" mt={10} spacing={10}>
                    <ListItem>
                        A set of directives that provides SLURM with some high-level information 
                        such as:
                    </ListItem>
                    <List spacing={0}>
                        <ListItem>Required Resources (Cores, Nodes, Memory … etc.)</ListItem>
                        <ListItem>Job name</ListItem>
                        <ListItem>Maximum Running Time</ListItem>
                        <ListItem>Job Logging Information</ListItem>
                        <ListItem>Job Output (if not defined, normally be shown on the screen)</ListItem>
                    </List>
                    <ListItem>
                        Information about how the job environment should be set up, for example, what 
                        application (See <Anchor to="/documentation/modules" component={Link}>Modules</Anchor>) should 
                        be loaded.
                    </ListItem>
                    <ListItem>The actual command(s) or developed code that needs to be executed.</ListItem>
                </List>
            </Card>

            {/* ---------------------------------------- */}

            <Card mt={20}>
                <CardSection>SLURM Submission Scripts</CardSection>
                <Text>
                    A SLURM submission script must be created for each job. The script is used to specify 
                    where and how to run the job on IKARUS cluster and ends with the actual command(s)/code
                    needed to run the job. The submission script file looks much like a standard shell 
                    script (.sh) file but also includes one or more lines that specify options for the 
                    SLURM scheduler.
                </Text>
                <Text mt={10}>
                    <Text component="span" fw={700} c="red">*Tip:</Text> For ease of use, give the job 
                    files a descriptive name, it is easier to create and submit the script from the 
                    working directory.
                </Text>
                
                <Text mt={20} fw={700} td="underline">SHEBANG</Text>
                <Text>
                    It is the first line in any Linux shell script. All SLURM submission scripts must 
                    start with #!/bin/bash
                </Text>
                <Code block>#!/bin/bash</Code>

                <Text mt={10}>
                    Although the hash signs (#) are regarded as comments by the shell, they are 
                    nonetheless read and interpreted by the SLURM scheduler.
                </Text>
                <Divider mt={10}/>

                {/* ---------------------------------------- */}

                <Text mt={20} fw={700} td="underline">#SBATCH</Text>
                <Text>The SLURM submission script must have one or more of #SBATCH directives, e.g.</Text>
                <Code block>#SBATCH --option-here</Code>
                <Text c="red" mt={10}>*Note: SBATCH directives are case sensitive.</Text>

                {/* ---------------------------------------- */}
                
                <Text mt={20}>Next is a list of the most common used options:</Text>
                <Table striped mt={10}>
                    <TableThead>
                        <TableTr>
                            <TableTh>Variable</TableTh>
                            <TableTh>Description</TableTh>
                            <TableTh>Format</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        <TableTr>
                            <TableTd>--job-name</TableTd>
                            <TableTd>Specify the job submission name</TableTd>
                            <TableTd>Any text</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--partition</TableTd>
                            <TableTd>Specify the cluster partition name (Default is "Res")</TableTd>
                            <TableTd>Dev, def1, or Res (according to user account)</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--nodes</TableTd>
                            <TableTd>Specify the minimum number of nodes</TableTd>
                            <TableTd>Full number</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--ntasks</TableTd>
                            <TableTd>Specify maximum number of tasks per job</TableTd>
                            <TableTd>Full number</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--ntasks-per-node</TableTd>
                            <TableTd>Specify maximum number of tasks per node</TableTd>
                            <TableTd>Full number</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--cpus-per-task</TableTd>
                            <TableTd>Specify number of cores per task</TableTd>
                            <TableTd>Full number (Default is 1)</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--mem</TableTd>
                            <TableTd>Specify the maximum amount of RAM requested per node</TableTd>
                            <TableTd>Default unit is megabytes. Specify using [K|M|G|T]</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--mem-per-cpu</TableTd>
                            <TableTd>Specify the minimum RAM for each CPU core allocated to the job</TableTd>
                            <TableTd>Default unit is megabytes. Specify using [K|M|G|T]</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--time</TableTd>
                            <TableTd>Specify the maximum wall clock execution time for the job</TableTd>
                            <TableTd>
                                "minutes", "minutes:seconds", "hours:minutes:seconds", "days-hours",
                                "days-hours:minutes", "days-hours:minutes:seconds"
                            </TableTd>
                        </TableTr>       
                        <TableTr>
                            <TableTd>--array</TableTd>
                            <TableTd>Submit the same job multiple times with identical parameters</TableTd>
                            <TableTd></TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--input</TableTd>
                            <TableTd>Specify the scripts input file name or path/filename</TableTd>
                            <TableTd>/path/to/filename</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--output</TableTd>
                            <TableTd>Specify the job output file name or path/filename</TableTd>
                            <TableTd>/path/to/filename</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--error</TableTd>
                            <TableTd>Specify the job logs and error file name or path/filename</TableTd>
                            <TableTd>/path/to/filename</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>--test-only</TableTd>
                            <TableTd>
                                Validate the batch script and return an estimate of when job would be 
                                scheduled given current job queue
                            </TableTd>
                            <TableTd>N/A</TableTd>
                        </TableTr>
                    </TableTbody>
                </Table>

                {/* ---------------------------------------- */}

                <Text mt={10} fw={700}>Example 1:</Text>
                <Text>
                    The following is an example of a minimal SLURM submission script that includes the 
                    required options to run in 
                    the <Anchor to="/clusters/research" component={Link}>Research Cluster</Anchor>. 
                    It will run as <Text component="span" td="underline">“hello-ikarus”</Text> job name 
                    reserving <Text component="span" td="underline">100M RAM</Text> with unattended for up 
                    to <Text component="span" td="underline">30 seconds</Text> in 
                    the <Text component="span" td="underline">"Res"</Text> partition, 
                    and will simply print out the words, "Welcome to IKARUS by KISR":
                </Text>

                <Code block mt={10}>
{`#!/bin/bash

######## Start of option ########
#SBATCH --job-name=hello-ikarus
#SBATCH --partition=Res
#SBATCH --mem=100M
#SBATCH --time=00:00:30
######## End of option ########

echo "Welcome to IKARUS by KISR "`}
                </Code>

                <Text mt={20} fw={700}>Example 2:</Text>
                <Text>
                    In this example, the submission script asks 
                    for <Text component="span" td="underline">40</Text> cores
                    per <Text component="span" td="underline">one</Text> task 
                    on <Text component="span" td="underline">one</Text> of the compute nodes in 
                    the <Text component="span" td="underline">"Res"</Text> partition 
                    utilizing <Text component="span" td="underline">50G</Text> RAM with 
                    maximum <Text component="span" td="underline">5 minutes</Text> and will simply print 
                    out the words, "Welcome to IKARUS by KISR":
                </Text>
                <Code block mt={10}>
{`#!/bin/bash

######## Start of option ########
#SBATCH --job-name=hello-ikarus
#SBATCH --partition=Res
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=40
#SBATCH --mem=50G
#SBATCH --time=00:05:00
######## End of option ########

echo "Welcome to IKARUS by KISR "`}
                </Code>
            </Card>

            {/* ---------------------------------------- */}

            <Card mt={20}>
                <CardSection>Job Submission</CardSection>
                <Text>
                    To submit the SLURM job use the “sbatch” command. This command submits a submission
                    script containing commands to be executed on compute nodes. See below example:
                </Text>
                <Code block>
{`[hpcdemo@clavis2 ~]$ sbatch JobHello.sh					
										
Submitted batch job 568`}
                </Code>

                <Text td="underline" mt={20}>Use Cases:</Text>
                <Text>
                    Ideal for long-running, non-interactive jobs where immediate feedback is not required, 
                    such as simulations, data processing, or large-scale computations.
                </Text>
                <Divider mt={10}/>
                
                {/* ---------------------------------------- */}

                <Text mt={20}>
                    Another way to execute jobs using SLURM scheduler 
                    is <Text component="span" td="underline">"srun"</Text>. 
                    This command is used to request resources for an interactive session on a compute node, 
                    providing a shell prompt on that node. When using this command, the shell is blocked 
                    until the requested resources are allocated and the interactive session begins. See 
                    below example:
                </Text>
                <Code block>
                    [hpcdemo@clavis2 ~]$ srun --partition=Res --nodes=1 --time=00:10:00 bash -l
                </Code>
                
                <Text td="underline" mt={20}>Use Cases:</Text>
                <Text>
                    Ideal for testing code, debugging, or performing tasks that require direct user 
                    interaction on a compute node.
                </Text>
                <Divider mt={10}/>

                {/* ---------------------------------------- */}

                <Text td="underline" mt={20}>SLURM Run Commands:</Text>
                <Table striped mt={10}>
                    <TableThead>
                        <TableTr>
                            <TableTh>Feature</TableTh>
                            <TableTh>srun</TableTh>
                            <TableTh>sbatch</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        <TableTr>
                            <TableTd>Nature</TableTd>
                            <TableTd>Batch job submission</TableTd>
                            <TableTd>Interactive execution / Job step launching</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Behavior</TableTd>
                            <TableTd>Asynchronous (returns immediately)</TableTd>
                            <TableTd>Synchronous (waits for resources/completion)</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Usage</TableTd>
                            <TableTd>Submits scripts for background execution</TableTd>
                            <TableTd>Interactive sessions, launching tasks within jobs</TableTd>
                        </TableTr>
                    </TableTbody>
                </Table>
            </Card>

            {/* ---------------------------------------- */}

            <Card mt={20}>
                <CardSection>SLURM Commands</CardSection>
                <Text>
                    Manual (Man) pages exist for all SLURM daemons, commands, and functions. The command 
                    option “--help" also provides a summary of the options. Note that the command options 
                    are all case sensitive.
                </Text>

                <Text mt={20} fw={700} td="underline">Command "sacct"</Text>
                <Text>
                    This command is used to list jobs or steps of active or completed jobs in the 
                    SLURM accounting log. Usually use this command to display status information about 
                    your historical jobs.
                </Text>

                <Text mt={10}>
                    For example, the below command will list all the job steps of $USER (current active 
                    user i.e. hpcdemo) from “2025-08-01” till the date of running this command:
                </Text>
                <Code block>[hpcdemo@clavis2 ~]$ sacct --user=$USER --starttime=2025-08-01</Code>

                <Text mt={10}>Another example, the below command will list the steps of job id “566”</Text>
                <Code block>[hpcdemo@clavis2 ~]$  sacct --jobs=566</Code>

                {/* ---------------------------------------- */}

                <Text mt={20} fw={700} td="underline">Command "squeue"</Text>
                <Text>
                    This is one of the most common SLURM commands used by the HPC users, which shows a 
                    list of all jobs or tasks that are running on IKARUS, with details:
                </Text>

                <Table striped mt={10}>
                    <TableThead>
                        <TableTr>
                            <TableTh>Heading</TableTh>
                            <TableTh>Description</TableTh>
                        </TableTr>
                    </TableThead>
                    <TableTbody>
                        <TableTr>
                            <TableTd>JOBID</TableTd>
                            <TableTd>
                                A unique identifier assigned to a job, this unique number will be used 
                                to identify and get information on the running job
                            </TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>PARTITION</TableTd>
                            <TableTd>
                                The queue or partition the task is running on, which indicates the 
                                type of node being used (def1, Res, or Dev)
                            </TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>NAME</TableTd>
                            <TableTd>Name of the job</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>USER</TableTd>
                            <TableTd>User ID of the job owner/submitter account</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>ST</TableTd>
                            <TableTd>Job state code (R: 'Running', PD: 'Pending')</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>TIME</TableTd>
                            <TableTd>Length of time a job has been running</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>NODES</TableTd>
                            <TableTd>Number of nodes a job is running on</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>NODELIST(REASON)</TableTd>
                            <TableTd>
                                List of nodes a job is running on, and also provides a reason a job is not 
                                running e.g. a dependency on a node
                            </TableTd>
                        </TableTr>
                    </TableTbody>
                </Table>

                <Text mt={20}>
                    It has a wide variety of filtering, sorting, and formatting options. By default, 
                    it reports the running jobs in priority order and then the pending jobs in priority
                     order. Shown below the most used “squeue” options:
                </Text>
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>squeue -u username:</Text> Shows a list of jobs in 
                        the queue for that specified username
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>squeue -me:</Text> Shows a list of jobs in the 
                        queue for your account only
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>squeue --start:</Text> Provides a method to 
                        calculate the estimated start time for the jobs
                    </ListItem>
                </List>

                {/* ---------------------------------------- */}

                <Text mt={20} fw={700} td="underline">Command "scancel"</Text>
                <Text>
                    This command is used to cancel a job with a given JOBID. Only jobs running under 
                    your account may be cancelled. No output is given by this command, but by checking 
                    the queue you can see if it was removed.
                </Text>

                {/* ---------------------------------------- */}

                <Text mt={20} fw={700} td="underline">Command "sinfo"</Text>
                <Text>
                    This command is commonly used to show the state of partitions and nodes managed by 
                    SLURM. It has a wide variety of filtering, sorting, and formatting options.
                </Text>

                {/* ---------------------------------------- */}

                <Text mt={20} fw={700} td="underline">Command "sstat"</Text>
                <Text>
                    To get all the information about the resources utilized by a submitted job use 
                    this command with the job's JOBID.
                </Text>
                <Code block>[hpcdemo@clavis2 ~]$ sstat --jobs=566</Code>
            </Card>
            
            {/* ---------------------------------------- */}

            <Card mt={20}>
                <CardSection>Example - Many Sequential Running Parallel using Array</CardSection>
                <Text>
                    In this example, the submission script is aimed to run many similar sequential jobs 
                    in parallel using job arrays. Python is used for the coding but this does not matter 
                    for the job arrays:
                </Text>

                <List type="ordered" spacing={10}>
                    <ListItem>
                        Create a python script file named “seq_script.py”, copy the following code 
                        lines and save the file:
                    </ListItem>
                    <Code block>
{`#!/usr/bin/env python3


import time


print('start at ' + time.strftime('%H:%M:%S'))


print('sleep for 10 seconds ...')
time.sleep(10)


print('stop at ' + time.strftime('%H:%M:%S'))`}
                    </Code>
                    <ListItem>
                        Make sure to change the file permission to executable 
                        (See <Anchor to="/documentation/cmds" component={Link}>Useful Commands</Anchor>)
                    </ListItem>
                        <Code block>[hpcdemo@clavis2 ~]$ chmod u+x seq_script.py</Code>
                    <ListItem>Test it using the following command:</ListItem>
                        <Code block>[hpcdemo@clavis2 ~]$ ./seq_script.py</Code>
                    <ListItem>
                        Next, create a SLURM submission script named “run_seq.sh”, copy the following code 
                        lines and save the script:
                    </ListItem>
                    <Code block>
{`#!/bin/bash


#SBATCH --job-name=seq_example
#SBATCH --partition=research
#SBATCH --array=1-16
#SBATCH --time=0-00:05:00
#SBATCH --mem-per-cpu=500MB


# Job Directory
SCRATCH_DIRECTORY=/NFS/scratch/homes/$\{USER}/$\{SLURM_JOBID}
mkdir -p $\{SCRATCH_DIRECTORY}
cd $\{SCRATCH_DIRECTORY}
cp $\{SLURM_SUBMIT_DIR}/seq_script.py  $\{SCRATCH_DIRECTORY}
# Job Output
echo "now processing task id:: " $\{SLURM_ARRAY_TASK_ID}
python3 seq_script.py > output_$\{SLURM_ARRAY_TASK_ID}.txt
cp output_$\{SLURM_ARRAY_TASK_ID}.txt  $\{SLURM_SUBMIT_DIR}

#Clean Directory
cd $\{SLURM_SUBMIT_DIR}
rm -rf $\{SCRATCH_DIRECTORY}

exit 0`}
                    </Code>
                    <ListItem>Submit the job, e.g.</ListItem>
                    <Code block>[hpcdemo@clavis2 ~]$ sbatch run_seq.sh</Code>
                </List>

                <Text mt={10}>After a short while you should see 16 output files in the submit directory.</Text>
            </Card>

            {/* ---------------------------------------- */}

            <Card mt={20}>
                <CardSection>Example - Parallel Using MPI</CardSection>
                <Text c="red">*Assumption: you have the following scripts (“pi-digits.py” & “sum-digit.py”)</Text>

                <Text mt={20}>
                    In this example, the “pi-digits” file will be running for 5 jobs simultaneously using 
                    MPI module (See <Anchor to="/documentation/modules" component={Link}>Modules</Anchor>), 
                    each using 4 tasks, thus totalling to 20 tasks. Once they finish, the “sum-digit.py” 
                    will be executed with 20 tasks.
                </Text>
                
                <List type="ordered" mt={10} spacing={10}>
                    <ListItem>
                        Make sure to have these scripts in the same directory of the following submission 
                        script
                    </ListItem>
                    <ListItem>
                        Create a SLURM submission script named “run_pi-scripts.sh”, copy the following code 
                        lines and save the script:
                    </ListItem>
                    <Code block>
{`#!/bin/bash

#SBATCH --job-name=mpi-example
#SBATCH --partition=research
#SBATCH --ntasks=20
#SBATCH --time=0-00:05:00
#SBATCH --mem-per-cpu=500MB

#load the MPI module
module load openmpi/4.1.5

cd $\{SLURM_SUBMIT_DIR}

# first set of parallel runs
mpirun -n 4 python3 pi-digits.py 10 & 
mpirun -n 4 python3 pi-digits.py 15 &
mpirun -n 4 python3 pi-digits.py 20 &
mpirun -n 4 python3 pi-digits.py 25 &
mpirun -n 4 python3 pi-digits.py 1000 &

#Wait and continue once all commands are done
wait


mpirun -n 20 python3 sum-digit.py

exit 0`}
                    </Code>
                </List>

                <Text mt={20}>
                    The <Text component="span" td="underline">"wait"</Text> command is very important 
                    in the above example - the final run of “sum-digit.py” script will only be executed 
                    if all the commands ended with & have completed.
                </Text>
            </Card>
        </Container>
    );
};

export default JobSubmission;
