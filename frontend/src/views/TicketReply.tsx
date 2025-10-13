import { Card, CardSection, Container, Group, Loader, Stack, Text } from "@mantine/core";
import { useGetTicketQuery } from "../apis/authorizeApi";
import { useParams } from "react-router";

// import classes from "../sourceStyle.module.css";
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
            <Card>
                <CardSection p={10}>
                    <Text fw={700}>{"Ticket #" + ticket!.id}</Text>
                    <Text fz={12}>{ticketDate}</Text>
                </CardSection>
                <Group justify="space-between">

                </Group>
            </Card>
            <Card>

            </Card>
        </Container>
    );
};

export default TicketReply;