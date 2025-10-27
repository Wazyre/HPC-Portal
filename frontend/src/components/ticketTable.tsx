import { Checkbox, Menu, MenuDropdown, MenuItem, MenuTarget, Pill, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from "@mantine/core";
import type { TicketType } from "../utils/types";
import { useEffect, useState } from "react";
import React from "react";
import { IconDotsVertical, IconEye } from "@tabler/icons-react";
import { Link } from "react-router";

interface ticketTableProps {
    tickets: TicketType[],
    activeTab: string,
    filter: string
}

const TicketTable = ({tickets, activeTab, filter}: ticketTableProps) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [tableRows, setTableRows] = useState<(React.JSX.Element | undefined)[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const getDateString = (dateString: string) => {
        const date = new Date(dateString);
        return date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ', ' + date.getFullYear();
    }

    const constructTable = () => {
        const tempRows = tickets.map((ticket) => {
            // Search filter for name, email, or subject. Also matches to type of status
            if ((filter === '' || ticket.name.toLowerCase().includes(filter) || ticket.email.toLowerCase().includes(filter) || ticket.subject.toLowerCase().includes(filter)) && (activeTab === 'all' || activeTab === ticket.status.toLowerCase())) {
                let name = ticket.name; // Because ticket is read-only
                if (ticket.id === 3) {
                    name = 'Tester for Ticket Viewing'
                }
                return (
                    <TableTr key={ticket.id}>
                        <TableTd>
                            <Checkbox
                                aria-label="Select row"
                                checked={selectedRows.includes(ticket.id)}
                                onChange={(event) =>
                                    setSelectedRows(
                                    event.currentTarget.checked
                                        ? [...selectedRows, ticket.id]
                                        : selectedRows.filter((id: number) => id !== ticket.id)
                                    )
                                }
                            />
                        </TableTd>
                        <TableTd>{'#'+ticket.id}</TableTd>
                        <TableTd>
                            {name}
                            <Text fz={12} c="gray.7">{ticket.email}</Text>
                        </TableTd>
                        <TableTd>{ticket.subject}</TableTd>
                        <TableTd>{getDateString(ticket.createdAt)}</TableTd>
                        <TableTd>
                            <Pill 
                                tt="capitalize"
                                fw={700}
                                c={ticket.status === 'open' ? 'yellow.8' : 'green.8'}
                                bg={ticket.status === 'open' ? 'yellow.1' : 'green.1'}
                            >
                                {ticket.status}
                            </Pill>
                        </TableTd>
                        <TableTd>
                            <Menu width={100}>
                                <MenuTarget>
                                    <IconDotsVertical/>
                                </MenuTarget>
                                <MenuDropdown>
                                    <MenuItem 
                                        leftSection={<IconEye size={12}/>}
                                        component={Link}
                                        to={"/tickets/"+ticket.id}
                                    >
                                        View
                                    </MenuItem>
                                    {/* <MenuItem leftSection={<IconTrash size={12}/>}>Delete</MenuItem> */}
                                </MenuDropdown>
                            </Menu>
                        </TableTd>
                    </TableTr>
                )
            }
        })
        setTableRows(tempRows);
    };

    useEffect(() => {
        constructTable();
    }, [tickets, activeTab, filter, selectedRows])

    return (
        <Table highlightOnHover mt={20}>
            <TableThead>
                <TableTr>
                    <TableTh>
                        <Checkbox
                                aria-label="Select all rows"
                                checked={selectedRows.length === tableRows.length}
                                onChange={(event) => {
                                    setSelectedRows(event.currentTarget.checked ? tableRows.map(row => {return parseInt(row!.key!)}) : [])
                                    setSelectAll(!selectAll);
                                }}
                            />    
                    </TableTh> 
                    <TableTh>Ticket ID</TableTh>
                    <TableTh>Requested By</TableTh>
                    <TableTh>Subject</TableTh>
                    <TableTh>Create Date</TableTh>
                    <TableTh>Status</TableTh>
                    <TableTh></TableTh>
                </TableTr>
            </TableThead>
            <TableTbody>
                {tableRows}
            </TableTbody>
        </Table>
    )
};

export default TicketTable;