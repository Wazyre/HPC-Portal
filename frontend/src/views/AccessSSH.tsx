import { Anchor, Card, CardSection, Code, Container, List, ListItem, Text, Title } from "@mantine/core";
import { useVerifyUser } from "../utils/useVerifyUser";

import classes from "../sourceStyle.module.css"

const AccessSSH = () => {

    useVerifyUser();

    return (
        <Container fluid>
            <Title order={2}>Access Using SSH</Title>
            <Card className={classes.card} radius="lg" m={20}>
                <CardSection className={classes.header} bg="blue" p={10} withBorder={true}>
                    <Text>Secure Shell (SSH)</Text>
                </CardSection>
                <Text fw={700}>
                    In this part, you will learn a common way to access high-performance computing systems (IKARUS) using SSH sessions.
                </Text>
                <Text>
                    If this is your first time connecting, please note that you may see an error message in .XAuthority. This is normal and you can ignore it.
                    Let (hpcdemo) be the user account name, kindly replace "hpcdemo" with your username. 
                </Text>
                <List>
                    <ListItem><Anchor href="#windows">Windows PC</Anchor></ListItem>
                    <ListItem><Anchor href="#mac">Mac/Linux</Anchor></ListItem>
                    {/* <ListItem><Anchor href="#linux">Windows PC</Anchor></ListItem> */}
                </List>
            </Card>

            <Card id="windows" className={classes.card} radius="lg" m={20}>
                <CardSection className={classes.header} bg="cyan.4" p={10} withBorder={true}>
                    <Text>Connecting on a Windows PC</Text>
                </CardSection>
                <Text>
                    To connect to IKARUS from a Windows PC, an application that allows SSH connections must be installed. We recommend MobaXterm.
                </Text>
                <Text fw={700}>
                    Installing MobaXterm
                </Text>
                <List type="ordered">
                    <ListItem>Visit <Anchor href="https://mobaxterm.mobatek.net/download-home-edition.html">MobaXterm Website</Anchor></ListItem>
                    <ListItem>Accept the license agreement and download the portable version</ListItem>
                    <ListItem>Unzip the file</ListItem>
                    <ListItem>Double-click MobaXterm_Personal_24.2 (or later)</ListItem>
                </List>
                <Text fw={700}>
                    Using MobaXterm To Connect
                </Text>
                <List type="ordered">
                    <ListItem>Launch MobaXterm</ListItem>
                    <ListItem>Click 'Session'</ListItem>
                    <ListItem>Select the 'SSH' type connection</ListItem>
                    <ListItem>Enter the Remote host: hpc.kisr.edu.kw (port 22 if required)</ListItem>
                    <ListItem>Enter the Username (hpcdemo)</ListItem>
                    <ListItem>Click OK</ListItem>
                    <ListItem>Enter your password followed by enter; this will not be echoed on the screen</ListItem>
                    <Code block color="gray.2">password: </Code>
                    <ListItem>If you have connected successfully, you will see something like the following:</ListItem>
                    <Code block color="gray.2">[hpcdemo@clavis1 ~]$ </Code>
                </List>
            </Card>

            <Card id="mac" className={classes.card} radius="lg" m={20}>
                <CardSection className={classes.header} bg="green.4" p={10} withBorder={true}>
                    <Text>Connecting on Mac/Linux</Text>
                </CardSection>
                <Text>
                    To connect to IKARUS from MAC/Linux OS, follow the steps below:
                </Text>
                <List type="ordered">
                    <ListItem>{"Go to Applications -> Utilities and open Terminal"}</ListItem>
                    <ListItem>Type ssh -Y yourusername@hpc.kisr.edu.kw</ListItem>
                    <Code block color="gray.2">$ ssh -Y hpcdemo@hpc.kisr.edu.kw</Code>
                    <ListItem>The first time you connect to IKARUS, a message asks if you want to continue connecting. This message appears because IKARUS has an RSA key that is not stored in your system registry/keychain, the identity of which cannot be verified. Type 'yes' and press enter.</ListItem>
                    <Code block color="gray.2">Are you sure you want to continue connecting (yes/no/[fingerprint])? yes </Code>
                    <ListItem>Enter your password followed by enter; this will not be echoed on the screen.</ListItem>
                    <Code block color="gray.2">password: </Code>
                    <ListItem>If you have connected successfully, you will see something like the following:</ListItem>
                    <Code block color="gray.2">[hpcdemo@clavis1 ~]$ </Code>
                </List>
            </Card>

            {/* <Card id="linux" className={classes.card} radius="md" m={20}>
                <CardSection className={classes.header} bg="yellow" p={10} withBorder={true}>
                    <Text>Connecting on Linux</Text>
                </CardSection>
                <Text>
                    To connect to IKARUS from a Linux OS, follow the steps below:
                </Text>
                <List type="ordered">
                    <ListItem>Open a Terminal application</ListItem>
                    <ListItem>Type ssh -Y yourusername@hpc.kisr.edu.kw</ListItem>
                    <ListItem>The first time you connect to IKARUS, a message asks if you want to continue connecting. This message appears because IKARUS has an RSA key that is not stored in your system registry/keychain, the identity of which cannot be verified. Type 'yes' and press enter.</ListItem>
                    <ListItem>Enter your password followed by enter; this will not be echoed on the screen.</ListItem>
                    <ListItem>If you have connected successfully, you will see something like the following:</ListItem>
                </List>
            </Card> */}
        </Container>
    )
};

export default AccessSSH;