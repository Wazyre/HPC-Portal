import { useAppSelector } from "../app/hooks";
import { useDisclosure } from "@mantine/hooks";
import PasswordModal from "../components/passwordModal";
import { selectCompany, selectEmail, selectName, selectRole } from "../slices/authorizationSlice";
import { Button, Card, Container, Flex, Image, Modal, Stack, Text, Title } from "@mantine/core";
import profImg from "../assets/images/icon.png";
import { IconEdit } from "@tabler/icons-react";
import { useVerifyUser } from "../utils/useVerifyUser";

// import classes from "../sourceStyle.module.css";

const Profile  = () => {
    const [opened, {open, close}] = useDisclosure(false);

    const name = useAppSelector(selectName);
    const email = useAppSelector(selectEmail);
    const company = useAppSelector(selectCompany);
    const role = useAppSelector(selectRole);

    useVerifyUser();
    
    return (
        <Container fluid>
            <Title order={2}>Profile</Title>
            <Card radius="md" withBorder m={20}>
                    <Text fw={700}>Bio Details</Text>
                <Flex
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    gap="lg"
                >
                    <Image src={profImg} radius={150} w={150} h={150}/>
                    <Stack>
                        <Text>{'Name: '+ name}</Text>
                        <Text>{'Company: ' + company}</Text>
                    </Stack>
                </Flex>
            </Card>
            <Card radius="md" withBorder m={20}>   
                <Text fw={700}>Login Information</Text>
                <Stack mt={20}>
                    <Text>{'Email: ' + email}</Text>
                    {/* <Text>Password:</Text> */}
                    <Text>{'Role: ' + role.toUpperCase()}</Text>
                    <Button leftSection={<IconEdit/>} onClick={open}>
                        Change Password
                    </Button>
                </Stack>
            </Card>

            <Modal opened={opened} onClose={close} title="Change Password" centered>{<PasswordModal close={close}/>}</Modal>
        </Container>
    );
};

export default Profile;