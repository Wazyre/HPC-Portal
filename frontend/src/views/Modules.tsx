import { Anchor, Card, CardSection, Code, Container, Divider, Image, List, ListItem, Space, Text, Title } from "@mantine/core";
import { moduleImgs } from "../assets/images/documents";
import { useVerifyUser } from "../utils/useVerifyUser";

// Search by module command to goto

const Modules = () => {

    useVerifyUser();

    return (
        <Container fluid>
            <Title order={2}>Modules Documentaion</Title>
            <Card>
                <CardSection bg="blue">
                    <Text>Modules</Text>
                </CardSection>
                <Text>
                    IKARUS uses a module environment to provide access to applications, tools and libraries. Modules are used to provide multiple versions of applications and libraries without causing conflicts. By loading a module, your environment is configured to allow you to use your chosen application by setting required paths and environment variables. Modules can be loaded and unloaded dynamically, giving you full control over your working environment. 
                </Text>
                <Text fw={700}>
                    In this part, you will learn how to find out what modules are available on IKARUS, find out more information about them and control which modules you load.
                </Text>
                <List>
                    <ListItem><Anchor href="#cmds">Module Commands</Anchor></ListItem>
                    <ListItem><Anchor href="#tios">Module Tips and Tricks</Anchor></ListItem>
                </List>
            </Card>

            <Card>
                <CardSection bg="cyan.4">
                    <Text>Module Commands</Text>
                </CardSection>
                <Text>
                    The following commands are the most common ones that you will need to use the modules that are available on IKARUS:
                </Text>
                <Text fz="xl">
                    module avail
                </Text>
                <Text>
                    To see the full list of the applications and libraries that are available for your account to use on IKARUS, you should use the command "module avail" as shown below (showing only a few of the tens of modules that are available):
                </Text>
                <Code block color="gray.2">
                    [hpcdemo@clavis1 ~]$ module avail 
                </Code>
                <Space h="md"/>
                <Text>
                    You should see something like this:
                </Text>
                <Image
                    radius="xs"
                    src={moduleImgs[0]}
                />
                <Divider my="md"/>

                <Text fz="xl">
                    module avail <Text inherit span fs="italic">modulename</Text>
                </Text>
                <Text>
                    If you want to use a specific application, you can find which versions are available by using the command "module avail modulename" as shown below:
                </Text>
                <Code block color="gray.2">
                    [hpcdemo@clavis1 ~]$ module avail jasper 
                </Code>
                <Space h="md"/>
                <Text>
                    You should see something like this:
                </Text>
                <Image
                    radius="xs"
                    src={moduleImgs[1]}
                />
                <Space h="md"/>
                <Text>In this case, the (default) indicates that jasper/2.0.14 is the default jasper module.</Text>
                <Divider my="md"/>

                <Text fz="xl">
                    module show
                </Text>
                <Text>
                    To find out what a module file does, use the command "module show modulename". This will show you brief information about what the module does along with how the module will update your environment as shown below:
                </Text>
                <Code block color="gray.2">
                    [hpcdemo@clavis1 ~]$ module show jasper 
                </Code>
                <Space h="md"/>
                <Text>
                    You should see something like this:
                </Text>
                <Image
                    radius="xs"
                    src={moduleImgs[2]}
                />
                <Divider my="md"/>

                <Text fz="xl">
                    module add
                </Text>
                <Text>
                    To add a module to your session, use the command "module add modulename". In most cases, running this command will not display anything and will just return you back to the Linux command prompt. For example to add the jasper module, use the command line shown below:
                </Text>
                <Code block color="gray.2">
                    [hpcdemo@clavis1 ~]$ module add jasper 
                </Code>
                <Space h="md"/>
                <Text>
                    If you want to add a specific version of a module then you should include the version number, for example:
                </Text>
                <Code block color="gray.2">
                    [hpcdemo@clavis1 ~]$ module add jasper/2.0.14 
                </Code>
                <Space h="md"/>
                <Text>
                    Without putting a version in, you will either load the highest alphanumeric version or the default if one is set.
                </Text>
                <Text c="red.6">* Note: "module load" and "module add" are the same.</Text>
                <Space h="md"/>
                <Text>To confirm that the module has been added/loaded to your session, you should see L near the module name, something like this:</Text>
                <Image
                    radius="xs"
                    src={moduleImgs[2]}
                />
                <Divider my="md"/>
            </Card>
        </Container>
    );
};

export default Modules;