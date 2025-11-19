import { Button, Card, CardSection, Container, Divider, Grid, GridCol, Group, Loader, Pill, Radio, RadioGroup, Stack, Table, TableTbody, TableTd, TableTr, Text, Textarea } from "@mantine/core";
import { useGetCommentsQuery, useGetTicketQuery, usePostCommentMutation } from "../apis/rtkApi";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import Comment from "../components/comment";
import { useVerifyUser } from "../utils/useVerifyUser";
import { useForm } from "@mantine/form";
import type { CommentWithStatusType } from "../utils/types";
import { useAppSelector } from "../app/hooks";
import { selectRole, selectUserId } from "../slices/authorizationSlice";

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
    const [status, setStatus] = useState<string>('open');
    const [commentRows, setCommentRows] = useState<(React.JSX.Element | undefined)[]>([]);
    const authorId = useAppSelector(selectUserId);
    const userRole = useAppSelector(selectRole);
    const ticketId = useParams().tid;

    const {data: ticket, isLoading, isSuccess} = useGetTicketQuery(parseInt(ticketId!));
    const {data: comments, isLoading: isLoadingComments, isSuccess: isSuccessComments} = useGetCommentsQuery(parseInt(ticketId!));
    const [postComment, {isLoading: isLoadingPosting} ] = usePostCommentMutation();

    const form = useForm({
            mode: 'uncontrolled',
            initialValues: {comment: '', status: ''},
            validate: {
                comment: (value) => (/^(?!\s*$).+/.test(value) ? null : 'Please enter a comment first.')
            },
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
                        username={comment.author?.username || ''}
                        date={formatAMPM(new Date(comment.createdAt))}
                        comment={comment.comment}
                    />
                    <Divider/>
                </>
            );
        });
        return tempComments;
        
    };

    const handleSubmit = async(values: typeof form.values) => {
        const newComment: CommentWithStatusType = {
            id: -1,
            comment: values.comment,
            createdAt: new Date().toISOString(),
            ticketId: parseInt(ticketId!),
            authorId: authorId,
            author: undefined,
            status: values.status || ticket!.status
        }
        try {
            await postComment(newComment)
            .then(() => {
                window.location.reload();
                
            })
            // form.reset();
        } catch (err) {
            console.error('Failed to submit: ', err)
            // notifications.show({
            //     message: 'Ticket failed to send, please try again.',
            //     color: 'red',
            //     position: 'top-center'
            // });
        }
    }

    useVerifyUser(['any']);

    useEffect(() => {
        if(isSuccess) {
            setTicketDate(formatAMPM(new Date(ticket!.createdAt)));
            setStatus(ticket.status);
            form.setFieldValue('status', ticket.status);
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
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Textarea
                                mt={20}
                                styles={{input: {height: 200}}}
                                key={form.key('comment')}
                                placeholder="Type your reply here..."
                                {...form.getInputProps('comment')}
                            />
                            
                            <Group justify="space-between" mt="md">
                                {userRole === 'admin' ?
                                    <Group>
                                        <Text>Status:</Text>
                                        <RadioGroup
                                            key={form.key('status')}
                                            value={status}
                                            onChange={setStatus}
                                            name="ticketStatus"
                                        >
                                            <Group>
                                                <Radio key='radio1' value="open" label="Open" {...form.getInputProps('status', {type: 'checkbox'})}/>
                                                <Radio key='radio2' value="pending" label="Pending" {...form.getInputProps('status', {type: 'checkbox'})}/>
                                                <Radio key='radio3' value="solved" label="Solved" {...form.getInputProps('status', {type: 'checkbox'})}/>
                                            </Group>
                                        </RadioGroup>
                                    </Group>
                                    : <></>
                                }
                                
                                <Button loading={isLoadingPosting} type="submit" color="ikarus-blue.9">Reply</Button>
                            </Group>
                        </form>
                        
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
                                    <TableTd>Username</TableTd>
                                    <TableTd>{ticket!.username}</TableTd>
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
                                    <TableTd><Pill
                                        tt="capitalize"
                                        fw={700}
                                        c={ticket!.status === 'open' ? 'yellow.8' : 'green.8'}
                                        bg={ticket!.status === 'open' ? 'yellow.1' : 'green.1'}
                                    >
                                        {ticket!.status}
                                    </Pill></TableTd>
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