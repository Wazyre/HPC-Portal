import { Breadcrumbs, Card, Container, Grid, GridCol, Group, Loader, Space, Stack, Tabs, TabsList, TabsTab, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconCircleCheck, IconHourglassEmpty, IconSearch, IconTicket } from "@tabler/icons-react";
import { useGetTicketsQuery } from "../apis/authorizeApi";
import { useEffect, useState } from "react";
import TicketTable from "../components/ticketTable";
import { useAppSelector } from "../app/hooks";
import { selectRole } from "../slices/authorizationSlice";
import { useNavigate } from "react-router";
import { useVerifyUser } from "../utils/useVerifyUser";
import type { SupportTicket } from "./Support";

// const breadItems = [
//     {title: <IconHome/>, href: '/dashboard'},
//     {title: 'Ticket Portal', href: ''}
// ]

const TicketPortal = () => {
    const {data: tickets, isLoading, isSuccess} = useGetTicketsQuery();
    const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
    const [openTickets, setOpenTickets] = useState<number>(0);
    const [closedTickets, setClosedTickets] = useState<number>(0);
    const [searchValue, setSearchValue] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const userRole = useAppSelector(selectRole);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchData = async() => {
    //         await getTickets().unwrap()
    //         .then((tickets: SupportTicket[]) => {
    //             setAllTickets(tickets);
    //             setOpenTickets(tickets.filter((ticket) => ticket.status === 'open').length);
    //             setClosedTickets(tickets.filter((ticket) => ticket.status === 'closed').length);
    //         });
    //     }
    //     fetchData();
    // }, [])

    useEffect(() => {
        if(isSuccess) {
            setAllTickets(tickets);
            setOpenTickets(tickets.filter((ticket) => ticket.status === 'open').length);
            setClosedTickets(tickets.filter((ticket) => ticket.status === 'closed').length);
            
        }
    }, [tickets])

    useVerifyUser();

    useEffect(() => {
        if (userRole !== "admin") {
            navigate(-1);
        }
    }, []);

    if (isLoading) {
        return (
            <Stack justify={"center"} align={"center"}>
                <Loader color="ikarus-blue" type="bars"/>
            </Stack>
        )
    }
    
    return (
        <Container fluid>
            <Group justify="space-between">
                <Title order={2}>Ticket Portal</Title>
                <Breadcrumbs children={['Home', 'Ticket Portal']}></Breadcrumbs>
            </Group>
            <Space h="xl"/>
            <Grid grow justify="center">
                <GridCol span={4}>
                    <Card>
                        <Group>
                            <ThemeIcon size="xl" color="violet.1">
                                <IconTicket color="#465fff"/>
                            </ThemeIcon>
                            <Text fw={700}>{openTickets + closedTickets}</Text>
                            <Text>Total Tickets</Text>
                        </Group>
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <Card>
                        <Group>
                            <ThemeIcon size="xl" color="yellow.1">
                                <IconHourglassEmpty color="#f9a83f"/>
                            </ThemeIcon>
                            <Text fw={700}>{openTickets}</Text>
                            <Text>Open Tickets</Text>
                        </Group>
                    </Card>
                </GridCol>
                <GridCol span={4}>
                    <Card>
                        <Group>
                            <ThemeIcon size="xl" color="green.1">
                                <IconCircleCheck color="#4ec990"/>
                            </ThemeIcon>
                            <Text fw={700}>{closedTickets}</Text>
                            <Text>Solved Tickets</Text>
                        </Group>
                    </Card>
                </GridCol>
            </Grid>

            <Card>
                <Grid>
                    <GridCol span={3}>
                        <Text>Support Tickets</Text>
                    </GridCol>
                    <GridCol offset={3} span={2}>
                        <Tabs value={activeTab} onChange={(value) => setActiveTab(value!)} color="ikarus-blue" variant="pills">
                            <TabsList>
                                <TabsTab value="all">All</TabsTab>
                                <TabsTab value="solved">Solved</TabsTab>
                                <TabsTab value="open">Open</TabsTab>
                            </TabsList>
                        </Tabs>
                    </GridCol>
                    <GridCol span={2}>
                        <TextInput 
                            placeholder="Search..."
                            leftSection={<IconSearch/>}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.currentTarget.value)}
                        />
                    </GridCol>
                    <GridCol>
                        
                    </GridCol>
                </Grid>
                <TicketTable tickets={allTickets} activeTab={activeTab} filter={searchValue.toLowerCase()}/>
            </Card>
        </Container>
    );
}

export default TicketPortal;