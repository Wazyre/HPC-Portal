import { Button, Card, CardSection, Container, Divider, Grid, GridCol, Group, Loader, Pill, Stack, Table, TableTbody, TableTd, TableTr, Text } from "@mantine/core";
import { useGetCommentsQuery, useGetTicketQuery } from "../apis/authorizeApi";
import { useParams } from "react-router";
import { RichTextEditor, RichTextEditorContent } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Placeholder} from '@tiptap/extensions';
import { useEffect, useState } from "react";
import Comment from "../components/comment";
import { useVerifyUser } from "../utils/useVerifyUser";

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
    const [commentRows, setCommentRows] = useState<(React.JSX.Element | undefined)[]>([]);
    const id = useParams().tid;
    const {data: ticket, isLoading, isSuccess} = useGetTicketQuery(parseInt(id!));
    const {data: comments, isLoading: isLoadingComments, isSuccess: isSuccessComments} = useGetCommentsQuery(parseInt(id!));

    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({ placeholder: 'Type your reply here...' })],
        
    });

    const getDateString = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ', ' + date.getFullYear();
    }

    const buildComments = () => {
        const tempComments = comments!.map(comment => {
            return (
                <>
                    <Comment
                        avatarLink='../assets/icon.png'
                        name={comment.author?.firstName + ' ' + comment.author?.lastName}
                        email={comment.author?.email || ''}
                        date={formatAMPM(new Date(comment.createdAt))}
                        comment={comment.comment}
                    />
                    <Divider/>
                </>
            );
        });
        return tempComments;
        
    };

    useVerifyUser();

    useEffect(() => {
        if(isSuccess) {
            setTicketDate(formatAMPM(new Date(ticket!.createdAt)));
        }
    }, [ticket]);

    useEffect(() => {
        if(isSuccessComments) {
            setCommentRows(buildComments());
        }
    }, [comments]);

    if (isLoading || isLoadingComments) {
        return (
            <Stack justify={"center"} align={"center"}>
                <Loader color="ikarus-blue" type="bars"/>
            </Stack>
        )
    }

    return (
        <Container fluid>
            <Grid align="flex-start">
                <GridCol span={9}>
                    <Card>
                        <CardSection>
                            <Text fw={700}>{"Ticket #" + ticket!.id}</Text>
                            <Text size="xs" c="gray">{ticketDate}</Text>
                        </CardSection>
                        {commentRows}
                        <Card>
                            <RichTextEditor editor={editor}>
                            <RichTextEditorContent/>
                        </RichTextEditor>
                        </Card>
                        
                        <Group justify="flex-start" mt="md">
                            <Button type="submit" color="ikarus-blue.9">Reply</Button>
                        </Group>
                    </Card>
                </GridCol>
                <GridCol span="content">
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
                                    <TableTd>Updated</TableTd>
                                    <TableTd>{getDateString(ticket!.updatedAt)}</TableTd>
                                </TableTr>
                                <TableTr>
                                    <TableTd>Status</TableTd>
                                    <TableTd><Pill>{ticket!.status.toUpperCase()}</Pill></TableTd>
                                </TableTr>
                            </TableTbody>
                        </Table>
                    </Card>
                </GridCol>
            </Grid>
        </Container>
    );
};

export default TicketReply;