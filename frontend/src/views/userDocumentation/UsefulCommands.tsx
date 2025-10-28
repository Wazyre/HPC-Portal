import { Card, CardSection, Code, Container, Divider, Image, List, ListItem, Text, Title } from "@mantine/core";
import { cmdImgs } from "../../assets/images/commands";
import { useVerifyUser } from "../../utils/useVerifyUser";

const UsefulCommands = () => {
    useVerifyUser();

    return (
        <Container fluid>
            <Title order={2}>Useful Commands</Title>
            <Card>
                <CardSection>Command Line</CardSection>
                <Text>
                    The command line in Linux is referred to as a shell. The shell is a program that allows
                    the user to interact with Linux at the command line. In true Linux style, there are 
                    a few different ones to choose from. However, the one used predominantly is BASH. 
                    The name BASH is an acronym for “Bourne Again Shell”, a reference to BASH is an 
                    enhanced replacement for “sh”, the original Unix shell program.
                </Text>
                <Text mt={10}>
                    Below is an example of IKARUS's command-line interface using the terminal program 
                    MAC OS Terminal:
                </Text>
                <Image src={cmdImgs[0]} mt={10}/>

                <Text mt={10}>
                    As with any operating systems, the filesystem is based around files and directories. 
                    Linux is no exception to this and uses several commands for the user to navigate 
                    around its filesystem. When you type a path starting with a slash (/), then the root 
                    of the file tree is assumed. If you don't start your path with a slash, then the 
                    current directory is the assumed starting point.
                </Text>
                <Text mt={10}>
                    Files on Linux are case-sensitive. This means that FILE1 is different from file1, 
                    and “/etc/hosts” are different from “/etc/Hosts”. Everything on Linux is a file. 
                    A directory is a special kind of file, but it is still a case-sensitive file. Each 
                    terminal window, any hard disk or partition, and any process are all represented 
                    somewhere in the file system as a file.
                </Text>
            </Card>

            <Card>
                <CardSection>Useful CLI Commands</CardSection>
                <Text fw={700} td="underline">Command “pwd”</Text>
                <Text mt={10}>
                    On the command line <Text component="span" fw={700}>"pwd"</Text> (or print working 
                    directory) displays the current directory you are in. This would appear as:
                </Text>
                <Image src={cmdImgs[1]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command “cd”</Text>
                <Text mt={10}>
                    On the command line cd (or change directory) change your current directory to the 
                    one specified, as shown below:
                </Text>
                <Image src={cmdImgs[2]} mt={10}/>

                <Text mt={20}>
                    There is also a shortcut back to your home directory by typing the character 
                    “~” (Tilda) which has the same effect as typing “cd /NFS/scratch/homes/hpcdemo”, as 
                    shown below:
                </Text>
                <Image src={cmdImgs[3]} mt={10}/>

                <Text mt={20}>
                    To go to the directory above (or the parent directory), we use the characters
                    “..”, as shown below:
                </Text>
                <Image src={cmdImgs[4]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command “ls”</Text>
                <Text mt={10}>This command lists the contents of a directory, as shown below</Text>
                <Image src={cmdImgs[5]} mt={10}/>
                
                <Text mt={20}>
                    The command <Text component="span" fw={700}>"ls"</Text> has several options:
                </Text>
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>ls -l: </Text>Shows a long listing with more 
                        information
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>ls -a: </Text>Shows all files including those 
                        that are hidden
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>ls -la: </Text>Shows a combination of the options 
                        above
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>ls *(file type): </Text>Shows all files with that 
                        file type (e.g.: ls *.py will show all python files)
                    </ListItem>
                </List>

                <Text mt={10} fw={700}>Example 1:</Text>
                <Image src={cmdImgs[6]} mt={10}/>
                <Text mt={10} fw={700}>Example 2:</Text>
                <Image src={cmdImgs[7]} mt={10}/>
                <Text mt={10} fw={700}>Example 3:</Text>
                <Image src={cmdImgs[8]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command “mkdir”</Text>
                <Text mt={10}>
                    This command makes a directory within the current directory or from the specified 
                    directory, as shown below:
                </Text>
                <Image src={cmdImgs[9]} mt={10}/>
                <Image src={cmdImgs[10]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}
                
                <Text mt={20} fw={700} td="underline">Command "rmdir"</Text>
                <Text mt={10}>
                    This command removes the specified directory, note the directory must be empty and 
                    must not be the directory you are currently in, for example:
                </Text>
                <Text mt={10}>Remove empty directory:</Text>
                <Image src={cmdImgs[11]} mt={10}/>

                <Text mt={10}>Remove not-empty directory using “rmdir”</Text>
                <Image src={cmdImgs[12]} mt={10}/>

                <Text mt={10}>To remove non-empty directory, use command “rm -rf”, as shown below:</Text>
                <Image src={cmdImgs[13]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "touch"</Text>
                <Text mt={10}>
                    This command is used to create an empty file, which can be useful for various uses. 
                    Example of using this command is shown below:
                </Text>
                <Image src={cmdImgs[14]} mt={10}/>

                <Text mt={20} fw={700} td="underline">Command "cp"</Text>
                <Text>
                    This command is used to create a copy of the files or directories from a source to 
                    a destination, as shown below:
                </Text>

                <List>
                    <ListItem mt={10}>Copy file to new file name</ListItem>
                    <Image src={cmdImgs[15]} mt={10}/>
                    <ListItem mt={10}>Copy file with the same name to another directory</ListItem>
                    <Image src={cmdImgs[16]} mt={10}/>
                    <ListItem mt={10}>Copy all the files with “csv” extensions to another directory</ListItem>
                    <Image src={cmdImgs[17]} mt={10}/>
                    <ListItem mt={10}>Copy one directory to another with option “-r” for recursive copying</ListItem>
                    <Image src={cmdImgs[18]} mt={10}/>
                </List>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "mv"</Text>
                <Text mt={10}>
                    This command is used to move a file or director from a source to a destination. 
                    It is used to rename the file or directory too, as shown below:
                </Text>
                
                <List>
                    <ListItem>Move file from directory to another</ListItem>
                    <Image src={cmdImgs[19]} mt={10}/>
                    <ListItem mt={10}>Change the file name</ListItem>
                    <Image src={cmdImgs[20]} mt={10}/>
                    <ListItem mt={10}>Change the directory name</ListItem>
                    <Image src={cmdImgs[21]} mt={10}/>
                </List>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "cat"</Text>
                <Text mt={10}>
                    This command is short for concatenate, and it is one of the most universal tools, 
                    it is used show the content of a file to the terminal screen of copy the content 
                    of a file to another file, as shown below:
                </Text>
                <Image src={cmdImgs[22]} mt={10}/>
                <Image src={cmdImgs[23]} mt={10}/>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "tac"</Text>
                <Text mt={10}>
                    Works the same as the command <Text component="span" fw={700}>"cat"</Text> but 
                    will show you the file backwards:
                </Text>
                <Image src={cmdImgs[24]} mt={10}/>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "rm"</Text>
                <Text mt={10}>{'Remove a file, as always be very careful with this command and without a backup, this file or directory will be lost forever. To remove directories that are not empty use “rm -r <directory name>”, as shown below: '}</Text>
                <Text c="red" fw={700}>
                    *Note: REMOVING A FILE OR DIRECTORY IS PERMANENT, there is no recycling bin - 
                    this file/directory will be gone forever.
                </Text>
                <Image src={cmdImgs[25]} mt={10}/>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "file"</Text>
                <Text mt={10}>
                    This command determines the file type. Unlike other operating systems, Linux does 
                    not determine the file type from the extension but from examining the file
                    header/contents itself.
                </Text>
                <Image src={cmdImgs[26]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "head"</Text>
                <Text mt={10}>
                    In general, this command is used to show the first ten lines of a file. The 
                    command <Text component="span" fw={700}>"head"</Text> has several options:
                </Text>
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>{"head -n <number>: "}</Text>
                        {"Display the first <number> lines"}
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>{"head -c <number>: "}</Text>
                        {"Display the first <number> bytes"}
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>head -q: </Text>Display the headers for 
                        multiple files sequentially
                    </ListItem>
                </List>
                <Image src={cmdImgs[27]} mt={10}/>
                <Divider mt={10}/>

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "tail"</Text>
                <Text mt={10}>
                    Like the command <Text component="span" fw={700}>"head"</Text> but this time it 
                    will show the last ten lines of the file by default. They share the same option but 
                    in command <Text component="span" fw={700}>tail</Text> other options are available:
                </Text>
                <Image src={cmdImgs[28]} mt={10}/>

                <List mt={20} spacing={10}>
                    <ListItem>
                        <Text component="span" fw={700}>tail -f: </Text>Continuously monitors a file for 
                        new data and displays any appended lines in real-time. This is highly useful for 
                        observing live log files
                    </ListItem>
                    <Code block>[hpcdemo@clavis2 ~]$ tail -f /var/log/syslog</Code>
                    <ListItem>
                        <Text component="span" fw={700}>tail -F: </Text>Like -f but also handles file 
                        rotations (when a log file is renamed and a new one is created). It will attempt 
                        to reopen the file by name if it detects that the original file has been replaced
                    </ListItem>
                    <Code block>[hpcdemo@clavis2 ~]$ tail -F /var/log/apache2/access.log</Code>
                </List>

                <Text c="red" fw={700} mt={10}>*Note: To exit the tail -f/-F command, press Ctrl + C</Text>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "more"</Text>
                <Text mt={10}>
                    This command is useful for displaying files that take up more than one screen. It 
                    allow the user to display the contents of the file page by page. Use “Enter” to 
                    advance one line, “Space” bar is used go to the next screen page, “b” to move back 
                    one screen page, or “q” to quit.
                </Text>
                <Text mt={10}>
                    To display certain number lines at a time instead of a full screen, for example 5 
                    lines, see below:
                </Text>
                <Code block>[hpcdemo@clavis2 ~]$ more -5 file.log</Code>
                <Text mt={10}>
                    To display the content of files after certain line number, for example the content 
                    after line 10, see below:
                </Text>
                <Code block>[hpcdemo@clavis2 ~]$ more +10 file.log</Code>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "less"</Text>
                <Text mt={10}>Very similar to the command “more” but with some additional features</Text>
                <Divider mt={10}/>
                
                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "find"</Text>
                <Text mt={10}>
                    This command is very useful to find files, more options are provided on the 
                    command line by typing <Text component="span" fw={700}>"man find"</Text>, next 
                    are some examples of these options that are commenly used:
                </Text>

                <List>
                    <ListItem mt={10}>Find a directory and its contents</ListItem>
                    <Image src={cmdImgs[29]} />
                    <ListItem mt={10}>Find all files with “.py” extension</ListItem>
                    <Image src={cmdImgs[30]} />
                </List>
                <Divider mt={10} />

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "grep"</Text>
                <Text mt={10}>
                    The <Text component="span" fw={700}>"grep"</Text> filter is famous among Linux users. 
                    The most common use of <Text component="span" fw={700}>"grep"</Text> is to filter 
                    lines of text containing (or not containing) a certain string.
                </Text>
                <Image src={cmdImgs[31]} />
                <Text mt={10}>
                    As with most Linux commands, there are also many useful options that will go 
                    with each command and <Text component="span" fw={700}>"grep"</Text> is certainly 
                    no exception here
                </Text>
                
                <List>
                    <ListItem>
                        <Text component="span" fw={700}>-i: </Text>Search in a case insensitive way
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>-r: </Text>Search recursively down any directories 
                        too
                    </ListItem>
                    <ListItem>
                        <Text component="span" fw={700}>-v: </Text>Search for everything excluding “text”
                    </ListItem>
                </List>
                <Code block>[hpcdemo@clavis2 ~]$ grep -i “text” /directory_name/file_name</Code>
                <Divider mt={10} />

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "wc"</Text>
                <Text mt={10}>
                    Counting words, lines, and characters are easily done with this command, as shown 
                    below:
                </Text>
                <Image src={cmdImgs[32]} />
            </Card>

            <Card>
                <CardSection>Other Commands</CardSection>
                <Text fw={700} td="underline">Command "date"</Text>
                <Text mt={10}>Display the date, time, time zone, and more.</Text>
                <Image src={cmdImgs[33]} />
                <Divider mt={10} />

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "cal"</Text>
                <Text mt={10}>Displays the current month, with the current day highlighted.</Text>
                <Image src={cmdImgs[34]} />
                <Divider mt={10} />

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "time"</Text>
                <Text mt={10}>
                    Displays how long it takes to execute a command. 
                    The <Text component="span" fw={700}>"ls"</Text> command takes only a little time.
                </Text>
                <Image src={cmdImgs[35]} />
                <Divider mt={10} />

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "sleep"</Text>
                <Text mt={10}>
                    This command is sometimes used within the SHELL scripts to wait number of seconds. 
                    This example shows a five-second sleep.
                </Text>
                <Code block>[hpcdemo@clavis2 ~]$ sleep 5</Code>
                <Divider mt={10} />

                {/* ------------------------------------ */}

                <Text mt={20} fw={700} td="underline">Command "sort"</Text>
                <Text mt={10}>
                    Sorts lines of the text files. By default, the output will be shown in screen page 
                    screen but this can be piped to another file.
                </Text>
                <Code block>[hpcdemo@clavis2 ~]$ sort myfile.txt</Code>
                <Code block>{"[hpcdemo@clavis2 ~]$ sort file.txt >> sorted_file.txt"}</Code>
            </Card>

        </Container>
    );  
};

export default UsefulCommands;