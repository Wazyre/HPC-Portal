import {Card, CardSection, Code, Container, Divider, Image, List, ListItem, Text, Title } from "@mantine/core";
import { useVerifyUser } from "../../utils/useVerifyUser";
import { fileMngImgs } from "../../assets/images/filemng";

const FileManagement = () => {

    useVerifyUser();
    
    return (
        <Container fluid>
            <Title order={2}>File Management</Title>
            <Card>
                <CardSection>
                    <Text>File Permissions in Linux</Text>
                </CardSection>
                <Text>
                    Like many other operating systems Linux uses a method of access rights on files and 
                    directories. Each file and directory has access rights that are associated with each 
                    one. The file permission normally shown on the left-hand side of each file/directory 
                    with 10-digit symbol (e.g. <Text component="span" fw={700} >drwxr-xr-x</Text>):
                </Text>
                <List>
                    <ListItem>
                        The first letter presents whether the file is a directory or not 
                        “d: directory”. 
                    </ListItem>
                    <ListItem>The next three represent the file owner permission</ListItem>
                    <ListItem>The next three represent the file group permission</ListItem>
                    <ListItem>The last three represent the file permissions for everyone else.</ListItem>
                </List>

                <Text mt={20}>
                    For each of the permission parts the letters mean the following in their groups:
                </Text>
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>r:</Text> Read permission to read and copy 
                        the file, its absence indicates this is not available.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>w:</Text> Write permission to write the file, its 
                        absence indicates this is not available.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>x:</Text> Execution permission to allow the file 
                        to be executed, its absence indicates this is not available.
                    </ListItem>
                </List>
                
                <Text fw={700} mt={20}>Example 1</Text>
                <Image radius="xs" src={fileMngImgs[0]}/>
                <Text mt={20}>
                    Using the example above would mean:
                </Text>
                <List listStyleType="square">
                    <ListItem>“job1” and “job4” are directories, user “hpcdemo” is the owner and have full 
                        access (read/write/execute), users in “research” group have full access too and 
                        everyone else have read and execute permission only.
                    </ListItem>
                    <ListItem>
                        “job2” and “job3” are directories, user “hpcdemo” is the owner and have full 
                        access (read/write/execute), users in “hpcdemo” group have full access too and 
                        everyone else have read and execute permission only.
                    </ListItem>
                </List>
                
                <Text fw={700} mt={20}>Example 2</Text>
                <Image radius="xs" src={fileMngImgs[1]} />
                <Text mt={20}>
                    Using the example above would mean:
                </Text>
                <List listStyleType="square">
                    <ListItem>
                        “error” is a directory, user “hpcdemo” is the owner and have full access 
                        (read/write/execute), users in “research” group have full access too and everyone 
                        else have read and execute permission only.
                    </ListItem>
                    <ListItem>
                        Files “data.csv”, “job_1.sh” and “output.txt” are owned by the user “hpcdemo”, 
                        the users in “research” read and write permission only and everyone else have read 
                        permission only.
                    </ListItem>
                    <ListItem>
                        “script.py” is a file, user “hpcdemo” is the owner and have full access 
                        (read/write/execute), users in “research” group and everyone else have read and 
                        execute permission only.
                    </ListItem>
                </List>
            </Card>

            {/* -------------------------------------------------------- */}

            <Card mt={20}>
                <CardSection>Changing File Permissions</CardSection>
                
                <Text>
                    To change the file (and directory) permissions use the command line “chmod” 
                    considering the following:
                </Text>
                <Text mt={20}>Linux file permissions are managed using four categories:</Text>    
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>User (u):</Text> The owner of the file or 
                        directory.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>Group (g):</Text> The group associated with 
                        the file or directory.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>Others (o):</Text> All other users on the 
                        system.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>All (a):</Text> All the users on the system
                    </ListItem>
                </List> 

                <Text mt={20}>Each category can have three types of permissions:</Text> 
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>Read (r):</Text> Allows viewing the contents of a 
                        file or listing the contents of a directory.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>Write (w):</Text> Allows modifying the contents of 
                        a file or creating/deleting files within a directory.
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>Execute (x):</Text> Allows running a file (if it's 
                        an executable) or entering a directory.
                    </ListItem>
                </List>   

                <Text mt={20}>With the permission action:</Text>
                <List>
                    <ListItem><Text component="span" fw={700}>(+):</Text> Add permission</ListItem>
                    <ListItem><Text component="span" fw={700}>(-):</Text> Remove permission</ListItem>
                </List>

                <Text fw={700} mt={20}>Example 1</Text>
                <Text>
                    Allow the owner and the users within the “research” group to have full access of a 
                    file
                </Text>
                <Image radius="xs" src={fileMngImgs[2]} />

                <Text fw={700} mt={20}>Example 2</Text>
                <Text>Remove the execute permission of everyone else from all the files</Text>
                <Image radius="xs" src={fileMngImgs[3]} />

                <Text fw={700} mt={20}>Example 3</Text>
                <Text>Allow all the users to have execute permission of “job_1.sh” file</Text>
                <Image radius="xs" src={fileMngImgs[4]} />
                <Text mt={10} c="red">
                    *Note: File permission issues commonly arise when attempting to access a file or 
                    directory without the write permissions. These issues can manifest as "Permission 
                    Denied" errors and typically involve incorrect ownership or permission settings.
                </Text>
            </Card>

                {/* -------------------------------------------------------- */}
            
            <Card>
                <CardSection>File Compression</CardSection>
                <Text fw={700} td="underline">Command "gzip"</Text>
                <Text mt={10}>
                    The command is used to compress the files to take up less space and fast in 
                    transferring them.
                </Text>
                <Code block>[hpcdemo@clavis1 ~]$ gzip filname.c</Code>
                <Divider mt={10}/>
                
                {/* -------------------------------------------------------- */}

                <Text mt={20} fw={700} td="underline">Command "gunzip"</Text>

                <Text mt={10}>The command is used to unzip the compressed file.</Text>
                <Code block>[hpcdemo@clavis1 ~]$ gunzip filname.cgz</Code>
                <Divider mt={10}/>
                
                {/* -------------------------------------------------------- */}
                
                <Text mt={20} fw={700} td="underline">Command "tar"</Text>
                <Text mt={10}>The command is used to create archives, which are single files that contain a collection of other files and directories. It has several options:</Text>
                <List>
                    <ListItem><Text component="span" fw={700}>-c:</Text> Create a new archive</ListItem>
                    <ListItem><Text component="span" fw={700}>-z:</Text> Use gzip compression</ListItem>
                    <ListItem><Text component="span" fw={700}>-v:</Text> Verbose mode (shows files being processed)</ListItem>
                    <ListItem><Text component="span" fw={700}>-f:</Text> Specify the archive filename</ListItem>
                    <ListItem><Text component="span" fw={700}>-x:</Text> Extract files from an archive</ListItem>
                    <ListItem><Text component="span" fw={700}>-t:</Text> List the contents of an archive</ListItem>
                </List>
                
                <Text mt={20}>To create a compressed archive:</Text>
                <Code block>[hpcdemo@clavis1 ~]$ tar -czvf job_archive.tar.gz job1/</Code>

                <Text mt={20}>To extract files from an archive:</Text>
                <Code block>[hpcdemo@clavis1 ~]$ tar -xzvf job_archive.tar.gz</Code>

                <Text mt={20}>To list the contents of a compressed archive:</Text>
                <Code block>[hpcdemo@clavis1 ~]$ tar -tzvf job_archive.tar.gz</Code>
            
            </Card>
        </Container>
    );

};

export default FileManagement;