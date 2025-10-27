import { Breadcrumbs, Card, Container, Grid, GridCol, Group, Loader, Pagination, Space, Stack, Tabs, TabsList, TabsTab, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconCircleCheck, IconHourglassEmpty, IconSearch, IconTicket } from "@tabler/icons-react";
import { useGetTicketsQuery } from "../apis/authorizeApi";
import { useEffect, useState } from "react";
import TicketTable from "../components/ticketTable";
import { useAppSelector } from "../app/hooks";
import { selectEmail, selectRole } from "../slices/authorizationSlice";
// import { useNavigate } from "react-router";
import { useVerifyUser } from "../utils/useVerifyUser";
import type { TicketType } from "../utils/types";

// const breadItems = [
//     {title: <IconHome/>, href: '/dashboard'},
//     {title: 'Ticket Portal', href: ''}
// ]

const TicketPortal = () => {
    const userEmail = useAppSelector(selectEmail);
    const userRole = useAppSelector(selectRole);
    const {data: tickets, isLoading, isSuccess} = useGetTicketsQuery({email: userEmail, role: userRole});
    const [allTickets, setAllTickets] = useState<TicketType[]>([]);
    const [openTickets, setOpenTickets] = useState<number>(0);
    const [closedTickets, setClosedTickets] = useState<number>(0);
    const [searchValue, setSearchValue] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [activePage, setActivePage] = useState(1)

    // const navigate = useNavigate();

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
            setOpenTickets(tickets.filter((ticket: TicketType) => ticket.status === 'open').length);
            setClosedTickets(tickets.filter((ticket: TicketType) => ticket.status === 'solved').length);
        }
    }, [tickets])

    useVerifyUser();

    if (isLoading) {
        return (
            <Container fluid>
                <Stack justify={"center"} align={"center"}>
                    <Loader color="ikarus-blue" type="bars"/>
                </Stack>
            </Container>
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
                                <IconHourglassEmpty color="#f38c00"/>
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
                                <IconCircleCheck color="#31a368"/>
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
                    <GridCol offset={3} span="auto">
                        <Tabs value={activeTab} onChange={(value) => setActiveTab(value!)} color="ikarus-blue" variant="pills">
                            <TabsList>
                                <TabsTab value="all">All</TabsTab>
                                <TabsTab value="solved">Solved</TabsTab>
                                <TabsTab value="open">Open</TabsTab>
                            </TabsList>
                        </Tabs>
                    </GridCol>
                    <GridCol span="auto">
                        <TextInput 
                            placeholder="Search..."
                            leftSection={<IconSearch/>}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.currentTarget.value)}
                        />
                    </GridCol>
                </Grid>
                <TicketTable tickets={allTickets.slice((activePage*15)-15, activePage*15)} activeTab={activeTab} filter={searchValue.toLowerCase()}/>
                <Group justify="center" mt={20}>
                    <Pagination value={activePage} onChange={setActivePage} total={Math.ceil(allTickets.length/15)}/>
                </Group>
            </Card>
        </Container>
    );
}

export default TicketPortal;