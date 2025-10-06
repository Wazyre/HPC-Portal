import { useAppSelector } from "../app/hooks";
import { selectEmail, selectName } from "../slices/authorizationSlice";
import { Accordion, AccordionControl, AccordionItem, AccordionPanel, Button, Card, CardSection, Checkbox, Container, Group, NativeSelect, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHelp } from "@tabler/icons-react";

import classes from "../sourceStyle.module.css";
import { useSubmitSupportMutation } from "../apis/authorizeApi";
import { notifications } from "@mantine/notifications";
import { useVerifyUser } from "../utils/useVerifyUser";

export interface SupportTicket {
    id: number,
    email: string,
    name: string,
    subject: string,
    description: string,
    status: string,
    createdAt: string
}

const selectData = [
    'Access', 
    'Account', 
    'Data', 
    'Modules', 
    'Libraries',
    'Job Submission',
    'File Management',
    'Software',
    'Other'
];

const Support = () => {
    const email = useAppSelector(selectEmail);
    const name = useAppSelector(selectName);
    const [submitTicket, { isLoading }] = useSubmitSupportMutation();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: email,
            subject: 'Access',
            description: '',
            agreement: false,
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            agreement: (value) => (value ? null : 'Agree to the terms')
        }
    });

    const handleSubmit = async(values: typeof form.values) => {
        const ticket: SupportTicket = {
            id: 0, // Dummy ID to satisfy type
            email: values.email,
            name: name,
            subject: values.subject,
            description: values.description,
            status: 'open',
            createdAt: new Date().toISOString()
        }
        try {
            await submitTicket(ticket).unwrap();
            notifications.show({
                message: 'Ticket submitted!',
                color: 'blue',
                position: 'top-center'
            });
        } catch (err) {
            console.error('Failed to submit: ', err)
            notifications.show({
                message: 'Ticket failed to send, please try again.',
                color: 'red',
                position: 'top-center'
            });
        }
    }

    useVerifyUser();

    return (
        <Container fluid>
            <Title order={2}>Frequently Asked Questions</Title>
            <Card >
                <Accordion variant="contained">
                    <AccordionItem value="subjobs">
                        <AccordionControl icon={<IconHelp className={classes.iconStatic}/>}>
                            How do i submit jobs to IKARUS?
                        </AccordionControl>
                        <AccordionPanel>
                            Jobs are submitted through a job scheduler SLURM, using BATCH scripts that specify resource requirements and execution commands. 
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value="whyhpc">
                        <AccordionControl icon={<IconHelp className={classes.iconStatic}/>}>
                            What is parallel computing, and why is it important in HPC?
                        </AccordionControl>
                        <AccordionPanel>
                            Parallel computing involves dividing a problem into smaller tasks that can be executed simultaneously across multiple processors, significantly speeding up computation.  
                        </AccordionPanel>
                    </AccordionItem>
                    <AccordionItem value="practices">
                        <AccordionControl icon={<IconHelp className={classes.iconStatic}/>}>
                            What are the best practices for resources efficiently?
                        </AccordionControl>
                        <AccordionPanel>
                            Best practices include optimizing code, requesting appropriate resources, minimizing job run times, and using job arrays for parameter sweeps.  
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Card>

            <Card radius="md" withBorder p={30}>
                <CardSection>
                    <Text fw={700}>Support Request</Text>
                </CardSection>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        withAsterisk
                        mt={20}
                        label="Email"
                        placeholder="your@email.com"
                        key={form.key('email')}
                        {...form.getInputProps('email')}
                    />
                    <NativeSelect
                        withAsterisk
                        mt={20}
                        label="Subject"
                        data={selectData}
                        onChange={(value) => form.setFieldValue('subject', value.target.value.toString())}
                        key={form.key('subject')}
                        value={form.getInputProps('subject').defaultValue}
                    />
                    <Textarea
                        withAsterisk
                        mt={20}
                        label="Description"
                        error="Please write a small description."
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                    />
                    <Checkbox
                        mt="md"
                        label="I agree to the terms & conditions of IKARUS"
                        key={form.key('agreement')}
                        {...form.getInputProps('agreement', { type: 'checkbox' })}
                    />
                    <Group justify="flex-start" mt="md">
                        <Button loading={isLoading} type="submit" color="ikarus-blue.9">Submit</Button>
                    </Group>
                </form>
            </Card>
        </Container>
    )
};

export default Support;