import { Box, Card, CardSection, Code, Container, Divider, Image, List, ListItem, Text, Title } from "@mantine/core";
import { cmdImgs } from "../assets/images/commands";

const UsefulCommands = () => {
    return (
        <Container fluid>
            <Title order={2}>Useful Commands</Title>
            <Card>
                <CardSection>Command Line</CardSection>
                <Text>The command line in Linux is referred to as a shell. The shell is a program that allows the user to interact with Linux at the command line. In true Linux style, there are a few different ones to choose from. However, the one used predominantly is BASH. The name BASH is an acronym for “Bourne Again Shell”, a reference to BASH is an enhanced replacement for “sh”, the original Unix shell program.</Text>
                <Text mt={10}>Below is an example of IKARUS's command-line interface using the terminal program MAC OS Terminal:</Text>
                <Image src={cmdImgs[0]}/>

                <Text>As with any operating systems, the filesystem is based around files and directories. Linux is no exception to this and uses several commands for the user to navigate around its filesystem. When you type a path starting with a slash (/), then the root of the file tree is assumed. If you don't start your path with a slash, then the current directory is the assumed starting point.</Text>
                <Text>Files on Linux are case-sensitive. This means that FILE1 is different from file1, and “/etc/hosts” are different from “/etc/Hosts”. Everything on Linux is a file. A directory is a special kind of file, but it is still a case-sensitive file. Each terminal window, any hard disk or partition, and any process are all represented somewhere in the file system as a file.</Text>
            </Card>

            <Card>
                <CardSection>Useful CLI Commands</CardSection>
                <Text mt={20} fw={700} td="underline">Command “pwd”</Text>
                <Text>On the command line “pwd” (or print working directory) displays the current directory you are in. This would appear as:</Text>
                <Image src={cmdImgs[1]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command “cd”</Text>
                <Text>On the command line cd (or change directory) change your current directory to the one specified, as shown below:</Text>
                <Image src={cmdImgs[2]}/>

                <Text mt={20}>There is also a shortcut back to your home directory by typing the character “~” (Tilda) which has the same effect as typing “cd /NFS/scratch/homes/hpcdemo”, as shown below</Text>
                <Image src={cmdImgs[3]}/>

                <Text mt={20}>To go to the directory above (or the parent directory), we use the characters “..”, as shown below</Text>
                <Image src={cmdImgs[4]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command “ls”</Text>
                <Text>This command lists the contents of a directory, as shown below</Text>
                <Image src={cmdImgs[5]}/>
                
                <Text mt={20}>The command “ls” has several options:</Text>
                <List>
                    <ListItem><Box component="strong" >ls -l</Box> shows a long listing with more information</ListItem>
                    <ListItem><Box component="strong" >ls -a</Box> shows all files including those that are hidden</ListItem>
                    <ListItem><Box component="strong" >ls -la</Box> shows a combination of the options above</ListItem>
                    <ListItem><Box component="strong" >ls *(file type)</Box> shows all files with that file type (e.g.: ls *.py will show all python files)</ListItem>
                </List>

                <Text mt={10} fw={700}>Example 1:</Text>
                <Image src={cmdImgs[6]}/>
                <Text mt={10} fw={700}>Example 2:</Text>
                <Image src={cmdImgs[7]}/>
                <Text mt={10} fw={700}>Example 3:</Text>
                <Image src={cmdImgs[8]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command “mkdir”</Text>
                <Text>This command makes a directory within the current directory or from the specified directory, as shown below:</Text>
                <Image src={cmdImgs[9]}/>
                <Image src={cmdImgs[10]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}
                
                <Text mt={20} fw={700} td="underline">Command "rmdir"</Text>
                <Text>This command removes the specified directory, note the directory must be empty and must not be the directory you are currently in, for example:</Text>
                <Text mt={10}>Remove empty directory:</Text>
                <Image src={cmdImgs[11]}/>

                <Text mt={10}>Remove not-empty directory using “rmdir”</Text>
                <Image src={cmdImgs[12]}/>

                <Text mt={10}>To remove non-empty directory, use command “rm -rf”, as shown below:</Text>
                <Image src={cmdImgs[13]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "touch"</Text>
                <Text>This command is used to create an empty file, which can be useful for various uses. Example of using this command is shown below:</Text>
                <Image src={cmdImgs[14]}/>

                <Text mt={20} fw={700} td="underline">Command "cp"</Text>
                <Text>This command is used to create a copy of the files or directories from a source to a destination, as shown below:</Text>

                <List>
                    <ListItem mt={10}>Copy file to new file name</ListItem>
                    <Image src={cmdImgs[15]}/>
                    <ListItem mt={10}>Copy file with the same name to another directory</ListItem>
                    <Image src={cmdImgs[16]}/>
                    <ListItem mt={10}>Copy all the files with “csv” extensions to another directory</ListItem>
                    <Image src={cmdImgs[17]}/>
                    <ListItem mt={10}>Copy one directory to another with option “-r” for recursive copying</ListItem>
                    <Image src={cmdImgs[18]}/>
                </List>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "mv"</Text>
                <Text>This command is used to move a file or director from a source to a destination. It is used to rename the file or directory too, as shown below:</Text>
                
                <List>
                    <ListItem>Move file from directory to another</ListItem>
                    <Image src={cmdImgs[19]}/>
                    <ListItem mt={10}>Change the file name</ListItem>
                    <Image src={cmdImgs[20]}/>
                    <ListItem mt={10}>Change the directory name</ListItem>
                    <Image src={cmdImgs[21]}/>
                </List>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "cat"</Text>
                <Text>This command is short for concatenate, and it is one of the most universal tools, it is used show the content of a file to the terminal screen of copy the content of a file to another file, as shown below:</Text>
                <Image src={cmdImgs[22]}/>
                <Image src={cmdImgs[23]}/>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "tac"</Text>
                <Text>Works the same as the command “cat” but will show you the file backwards:</Text>
                <Image src={cmdImgs[24]}/>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "rm"</Text>
                <Text>{'Remove a file, as always be very careful with this command and without a backup, this file or directory will be lost forever. To remove directories that are not empty use “rm -r <directory name>”, as shown below: '}</Text>
                <Text c="red" fw={700}>*Note: REMOVING A FILE OR DIRECTORY IS PERMANENT, there is no recycling bin - this file/directory will be gone forever.</Text>
                <Image src={cmdImgs[25]}/>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "file"</Text>
                <Text>This command determines the file type. Unlike other operating systems, Linux does not determine the file type from the extension but from examining the file header/contents itself.</Text>
                <Image src={cmdImgs[26]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "head"</Text>
                <Text>In general, this command is used to show the first ten lines of a file. The command “head” has several options:</Text>
                <List>
                    <ListItem><Box component="strong" >{"head -n <number>: "}</Box>{"display the first <number> lines"}</ListItem>
                    <ListItem><Box component="strong" >{"head -c <number>: "}</Box>{"display the first <number> bytes"}</ListItem>
                    <ListItem><Box component="strong" >head -q: </Box>display the headers for multiple files sequentially</ListItem>
                </List>
                <Image src={cmdImgs[27]}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "tail"</Text>
                <Text>Like the command <Box component="strong" >head</Box> but this time it will show the last ten lines of the file by default. They share the same option but in command <Box component="strong" >tail</Box> other options are available:</Text>
                <Image src={cmdImgs[28]}/>

                <List>
                    <ListItem><Box component="strong" >tail -f: </Box>continuously monitors a file for new data and displays any appended lines in real-time. This is highly useful for observing live log files.</ListItem>
                    <Code block>[hpcdemo@clavis2 ~]$ tail -f /var/log/syslog</Code>
                    <ListItem><Box component="strong" >tail -F: </Box>like -f but also handles file rotations (when a log file is renamed and a new one is created). It will attempt to reopen the file by name if it detects that the original file has been replaced.</ListItem>
                    <Code block>[hpcdemo@clavis2 ~]$ tail -F /var/log/apache2/access.log</Code>
                </List>

                <Text c="red" fw={700} mt={10}>*Note: To exit the tail -f/-F command, press Ctrl + C</Text>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "more"</Text>
                <Text>This command is useful for displaying files that take up more than one screen. It allow the user to display the contents of the file page by page. Use “Enter” to advance one line, “Space” bar is used go to the next screen page, “b” to move back one screen page, or “q” to quit.</Text>
                <Text mt={10}>To display certain number lines at a time instead of a full screen, for example 5 lines, see below:</Text>
                <Code block>[hpcdemo@clavis2 ~]$ more -5 file.log</Code>
                <Text mt={10}>To display the content of files after certain line number, for example the content after line 10, see below:</Text>
                <Code block>[hpcdemo@clavis2 ~]$ more +10 file.log</Code>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "less"</Text>
                <Text>Very similar to the command “more” but with some additional features</Text>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

            </Card>

        </Container>
    );  
};

export default UsefulCommands;