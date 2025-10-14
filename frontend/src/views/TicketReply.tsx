import { Card, CardSection, Container, Group, Loader, Pill, Stack, Table, TableTbody, TableTd, TableTr, Text } from "@mantine/core";
import { useGetTicketQuery } from "../apis/authorizeApi";
import { useParams } from "react-router";
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from "react";

// interface TicketReplyProps {
//     id: number
// };

const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatAMPM = (date: Date) => {
    const day = dayNames[date.getDay()];
    let hours = date.getHours();
    const mins = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 ? hours % 12 : 12; // The hour '0' should be '12'
    const minutes = mins < 10 ? '0'+mins : mins; // Typescript type checking
    return day + ', ' + hours + ':' + minutes + ' ' + ampm;
} 

const TicketReply = () => {
    const [ticketDate, setTicketDate] = useState<string>('');
    const id = useParams().tid;
    const {data: ticket, isLoading, isSuccess} = useGetTicketQuery(parseInt(id!));
    
    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [StarterKit, Placeholder.configure({ placeholder: 'This is placeholder' })],
        content: '',
    });

    const getDateString = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ', ' + date.getFullYear();
    }

    useEffect(() => {
        if(isSuccess) {
            setTicketDate(formatAMPM(new Date(ticket!.createdAt)));
        }
    }, [ticket]);

    if (isLoading) {
        return (
            <Stack justify={"center"} align={"center"}>
                <Loader color="ikarus-blue" type="bars"/>
            </Stack>
        )
    }

    return (
        <Container fluid>
            <Group>
                <Card>
                <CardSection>
                    <Text fw={700}>{"Ticket #" + ticket!.id}</Text>
                    <Text fz={12}>{ticketDate}</Text>
                </CardSection>
                <Group justify="space-between">

                </Group>
                <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
            </Card>
            <Card>
                <CardSection>
                    <Text fw={700}>Ticket Details</Text>
                </CardSection>
                <Table>
                    <TableTbody>
                        <TableTr>
                            <TableTd>Customer</TableTd>
                            <TableTd>{ticket!.name}</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Email</TableTd>
                            <TableTd>{ticket!.email}</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Ticket ID</TableTd>
                            <TableTd>{'#'+ticket!.id}</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Category</TableTd>
                            <TableTd>{ticket!.subject}</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Created</TableTd>
                            <TableTd>{getDateString(ticket!.createdAt)}</TableTd>
                        </TableTr>
                        <TableTr>
                            <TableTd>Status</TableTd>
                            <TableTd><Pill>{ticket!.status.toUpperCase()}</Pill></TableTd>
                        </TableTr>
                    </TableTbody>
                </Table>
            </Card>
            </Group>
            
        </Container>
    );
};

export default TicketReply;