import { useState, useEffect, useRef } from 'react'; // Added useRef for the hidden file input in the attachment edit feature
import {
    Container, Title, Table, Paper, Badge, Text,
    Group, TextInput, Loader, Stack, Button, rem,
    ActionIcon, Textarea, Pagination, Select
} from '@mantine/core';
import { IconSearch, IconSearchOff, IconCheck, IconTrash, IconX, IconEdit, IconDeviceFloppy, IconPaperclip, IconUpload } from '@tabler/icons-react'; // Added IconUpload for the attachment upload button
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const ModificationHistory = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // State to track which log's attachment is currently being updated
    const [attachmentLoadingId, setAttachmentLoadingId] = useState<string | null>(null);

    // Ref for the hidden file input used to trigger file selection for attachment updates
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    // Tracks which log id the attachment file input is currently targeting
    const [attachmentTargetId, setAttachmentTargetId] = useState<string | null>(null);

    const [activePage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<string | null>('10');

    const fetchLogs = () => {
        //  Always set loading to true before fetching so the spinner shows
        // instead of flashing "No logs found" when navigating to this page
        setLoading(true);
        axios.get('/api/change-requests/all')
            .then(res => {
                setLogs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching logs:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search, pageSize]);

    const handleEditSave = async (id: string) => {
        try {
            await axios.patch(`/api/change-requests/update/${id}`, { changeDescription: editValue });
            setLogs((prev: any) =>
                (prev || []).map((log: any) => log.id === id ? { ...log, changeDescription: editValue } : log)
            );
            setEditingId(null);
            notifications.show({ title: 'Success', message: 'Description updated successfully', color: 'blue' });
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleStatusUpdate = async (id: string) => {
        try {
            const response = await axios.patch(`/api/change-requests/update/${id}`, { status: 'COMPLETED' });
            setLogs((prev: any) =>
                (prev || []).map((log: any) => log.id === id ? response.data : log)
            );
            notifications.show({
                title: 'Status Updated',
                message: 'The change request has been marked as completed.',
                color: 'green',
                icon: <IconCheck size={18} />,
            });
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/change-requests/delete/${id}`);
            setLogs((prev: any) => (prev || []).filter((log: any) => log.id !== id));
            setConfirmDeleteId(null);
            notifications.show({
                title: 'Log Deleted',
                message: 'The record has been permanently removed.',
                color: 'red',
                icon: <IconTrash size={18} />,
            });
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // Removes the attachment from a PENDING log without replacing it
    // Calls the update-attachment endpoint with no file so the database sets attachedFile to null
    const handleRemoveAttachment = async (id: string) => {
        setAttachmentLoadingId(id);
        try {
            const response = await axios.patch(`/api/change-requests/update-attachment/${id}`, new FormData());
            setLogs((prev: any) =>
                (prev || []).map((log: any) => log.id === id ? { ...log, attachedFile: response.data.attachedFile } : log)
            );
            notifications.show({ title: 'Attachment Removed', message: 'The file has been removed successfully.', color: 'orange' });
        } catch (error) {
            console.error("Remove attachment failed:", error);
            notifications.show({ title: 'Error', message: 'Failed to remove the attachment.', color: 'red' });
        } finally {
            setAttachmentLoadingId(null);
        }
    };

    // Uploads a new file as the attachment for a PENDING log
    // Triggered when the admin selects a file from the hidden file input
    const handleUploadAttachment = async (id: string, file: File) => {
        setAttachmentLoadingId(id);
        try {
            const formData = new FormData();
            formData.append('attachedFile', file); // Append the selected file to the form data
            const response = await axios.patch(`/api/change-requests/update-attachment/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Required header for file upload requests
            });
            setLogs((prev: any) =>
                (prev || []).map((log: any) => log.id === id ? { ...log, attachedFile: response.data.attachedFile } : log)
            );
            notifications.show({ title: 'Attachment Updated', message: 'The file has been uploaded successfully.', color: 'green' });
        } catch (error) {
            console.error("Upload attachment failed:", error);
            notifications.show({ title: 'Error', message: 'Failed to upload the attachment.', color: 'red' });
        } finally {
            setAttachmentLoadingId(null);
            setAttachmentTargetId(null);
        }
    };

    const filteredLogs = (logs || []).filter((log: any) => {
        const name = log.adminName || "";
        const scope = log.scopeOfChange || "";
        const desc = log.changeDescription || "";
        const searchTerm = search.toLowerCase();
        return name.toLowerCase().includes(searchTerm) ||
               scope.toLowerCase().includes(searchTerm) ||
               desc.toLowerCase().includes(searchTerm);
    });

    const numericPageSize = parseInt(pageSize || '10');
    const totalPages = Math.ceil(filteredLogs.length / numericPageSize);
    const paginatedLogs = filteredLogs.slice(
        (activePage - 1) * numericPageSize,
        activePage * numericPageSize
    );

    const formatDateTime = (dateString: string) => {
        if (!dateString) return <Text size="xs" c="dimmed">-</Text>;
        const date = new Date(dateString);
        return (
            <>
                <Text size="sm" fw={500}>{date.toLocaleDateString('en-GB')}</Text>
                <Text size="xs" c="dimmed">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </>
        );
    };

    return (
        //  Used fluid Container so the table uses the full screen width without horizontal scrolling
        <Container fluid mt="xl" px="xl">
            <Group justify="space-between" mb="lg">
                <div>
                    <Title order={2}>Logging History</Title>
                    <Text c="dimmed" size="sm">Review and track all submitted logs</Text>
                </div>
                
                <Group gap="sm">
                    <Select
                        label="Rows per page"
                        data={['5', '10', '15', '20']}
                        value={pageSize}
                        onChange={setPageSize}
                        allowDeselect={false}
                        style={{ width: rem(100) }}
                        size="xs"
                    />
                    <TextInput
                        label="Search"
                        placeholder="Search logs..."
                        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        style={{ width: '250px' }}
                        size="xs"
                    />
                </Group>
            </Group>

            {/* Hidden file input used for attachment updates in the history table */}
            {/* Triggered programmatically when admin clicks the upload button on a PENDING log */}
            <input
                ref={attachmentInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.zip"
                style={{ display: 'none' }}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && attachmentTargetId) {
                        handleUploadAttachment(attachmentTargetId, file); // Upload the selected file for the targeted log
                    }
                    e.target.value = ''; // Reset input so the same file can be reselected if needed
                }}
            />

            <Paper withBorder shadow="sm" radius="md">
                {loading ? (
                    //  Spinner shows while fetching so the empty state never flashes prematurely
                    <Group justify="center" p="xl"><Loader /></Group>
                ) : (
                    <>
                        {/*  Removed large minWidth so table fits the full screen naturally */}
                        <Table.ScrollContainer minWidth={1100}>
                            {/*  tableLayout fixed + width 100% so columns share the full available width evenly */}
                            <Table
                                verticalSpacing="md"
                                horizontalSpacing="sm"
                                highlightOnHover
                                style={{ tableLayout: 'fixed', width: '100%' }}
                            >
                                <Table.Thead bg="gray.1">
                                    <Table.Tr>
                                        {/*  Each column given a percentage width so they all fit on screen without scrolling */}
                                        <Table.Th style={{ width: '9%' }}><Text fw={700} c="black">Created At</Text></Table.Th>
                                        <Table.Th style={{ width: '9%' }}><Text fw={700} c="black">Completed At</Text></Table.Th>
                                        <Table.Th style={{ width: '11%' }}><Text fw={700} c="black">Admin Name</Text></Table.Th>
                                        <Table.Th style={{ width: '7%' }}><Text fw={700} c="black">Scope</Text></Table.Th>
                                        <Table.Th style={{ width: '17%' }}><Text fw={700} c="black">Description</Text></Table.Th>
                                        <Table.Th style={{ width: '22%' }}><Text fw={700} c="black">Attachment</Text></Table.Th> {/*  New column for file attachments */}
                                        <Table.Th style={{ width: '10%' }}><Text fw={700} c="black">Status</Text></Table.Th>
                                        <Table.Th style={{ width: '17%' }}><Text fw={700} c="black">Action</Text></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {paginatedLogs.length > 0 ? (
                                        paginatedLogs.map((log: any) => {
                                            const isDone = log.status?.toUpperCase() === 'COMPLETED';
                                            const isEditing = editingId === log.id;
                                            const isAttachmentLoading = attachmentLoadingId === log.id;

                                            return (
                                                <Table.Tr key={log.id}>
                                                    <Table.Td>{formatDateTime(log.createdAt)}</Table.Td>
                                                    <Table.Td>
                                                        {/*  Replace dash with Created At if COMPLETED */}
                                                        {isDone 
                                                            ? formatDateTime(log.completedAt || log.createdAt) 
                                                            : <Text size="xs" c="orange" fs="italic">Waiting...</Text>
                                                        }
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm" style={{ wordBreak: 'break-word' }}>
                                                            {log.adminName || <Text c="dimmed" fs="italic">N/A</Text>}
                                                        </Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm" style={{ wordBreak: 'break-word' }}>
                                                            {log.scopeOfChange}
                                                        </Text>
                                                    </Table.Td>

                                                    {/*  Added minWidth so the edit textarea has enough space to display horizontally */}
                                                    <Table.Td>
                                                        {isEditing ? (
                                                            <Group gap="xs" align="flex-start" wrap="wrap">
                                                                <Textarea
                                                                    autosize minRows={1}
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(e.currentTarget.value)}
                                                                    style={{ flex: 1, minWidth: '100px' }}
                                                                />
                                                                <Group gap={4} wrap="nowrap">
                                                                    <ActionIcon color="blue" variant="light" onClick={() => handleEditSave(log.id)}>
                                                                        <IconDeviceFloppy size={16} />
                                                                    </ActionIcon>
                                                                    <ActionIcon color="gray" variant="subtle" onClick={() => setEditingId(null)}>
                                                                        <IconX size={16} />
                                                                    </ActionIcon>
                                                                </Group>
                                                            </Group>
                                                        ) : (
                                                            <Text size="sm" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                                {log.changeDescription}
                                                            </Text>
                                                        )}
                                                    </Table.Td>

                                                    {/*  Attachment column — shows a clickable download link if a file was uploaded, otherwise shows a dash */}
                                                    {/* If PENDING: shows Remove button if file exists, or Upload button if no file exists */}
                                                    {/* If COMPLETED: shows the file link only, no editing allowed */}
                                                    <Table.Td>
                                                        <Stack gap={4}>
                                                            {/* Show the file download link if an attachment exists */}
                                                            {log.attachedFile ? (
                                                                <Text
                                                                    size="sm"
                                                                    c="blue"
                                                                    style={{ cursor: 'pointer', textDecoration: 'underline', wordBreak: 'break-word' }}
                                                                    component="a"
                                                                    href={`/api/change-requests/download/${log.attachedFile}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Group gap={4} wrap="nowrap" align="flex-start">
                                                                        <IconPaperclip size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                                                        {log.attachedFile.replace(/^\d+-/, '')}
                                                                    </Group>
                                                                </Text>
                                                            ) : (
                                                                <Text size="xs" c="dimmed">-</Text>
                                                            )}

                                                            {/* Show remove or upload button only when status is PENDING */}
                                                            {/* If a file exists show Remove only — if no file exists show Upload only */}
                                                            {!isDone && (
                                                                <Group gap={4} wrap="nowrap">
                                                                    {log.attachedFile ? (
                                                                        // Remove button — shown only when a file currently exists
                                                                        <Button
                                                                            size="compact-xs"
                                                                            color="red"
                                                                            variant="subtle"
                                                                            loading={isAttachmentLoading}
                                                                            onClick={() => handleRemoveAttachment(log.id)}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    ) : (
                                                                        // Upload button — shown only when no file is currently attached
                                                                        <Button
                                                                            size="compact-xs"
                                                                            color="blue"
                                                                            variant="subtle"
                                                                            leftSection={<IconUpload size={12} />}
                                                                            loading={isAttachmentLoading}
                                                                            onClick={() => {
                                                                                setAttachmentTargetId(log.id); // Set which log this upload belongs to
                                                                                attachmentInputRef.current?.click(); // Open the file picker
                                                                            }}
                                                                        >
                                                                            Upload
                                                                        </Button>
                                                                    )}
                                                                </Group>
                                                            )}
                                                        </Stack>
                                                    </Table.Td>

                                                    <Table.Td>
                                                        {/* Added minWidth so the full status text is never cut off */}
                                                        <Badge
                                                            color={isDone ? 'green' : 'orange'}
                                                            variant="filled"
                                                            style={{ minWidth: rem(90), textAlign: 'center' }}
                                                        >
                                                            {log.status}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Group gap="xs" wrap="nowrap">
                                                            {!isDone && !isEditing && (
                                                                <ActionIcon variant="subtle" color="blue" onClick={() => {
                                                                    setEditingId(log.id);
                                                                    setEditValue(log.changeDescription);
                                                                }}>
                                                                    <IconEdit size={16} />
                                                                </ActionIcon>
                                                            )}
                                                            {!isDone && !isEditing && (
                                                                <Button size="compact-xs" color="green" variant="light" leftSection={<IconCheck size={14} />} onClick={() => handleStatusUpdate(log.id)}>
                                                                    Done
                                                                </Button>
                                                            )}
                                                            {!isDone && (
                                                                <>
                                                                    {confirmDeleteId === log.id ? (
                                                                        <Group gap={5} wrap="nowrap">
                                                                            <Button size="compact-xs" color="red" variant="filled" onClick={() => handleDelete(log.id)}>Confirm</Button>
                                                                            <ActionIcon variant="subtle" color="gray" onClick={() => setConfirmDeleteId(null)}><IconX size={14} /></ActionIcon>
                                                                        </Group>
                                                                    ) : (
                                                                        !isEditing && (
                                                                            <ActionIcon variant="subtle" color="red" onClick={() => setConfirmDeleteId(log.id)}>
                                                                                <IconTrash size={16} />
                                                                            </ActionIcon>
                                                                        )
                                                                    )}
                                                                </>
                                                            )}
                                                        </Group>
                                                    </Table.Td>
                                                </Table.Tr>
                                            );
                                        })
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={8} align="center"> {/*  Updated from 7 to 8 to match the new Attachment column */}
                                                <Stack align="center" py="xl">
                                                    <IconSearchOff color="gray" size={40} />
                                                    <Text c="dimmed">No modification logs found</Text>
                                                </Stack>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>

                        <Group justify="center" p="md" bg="gray.0" style={{ borderTop: '1px solid #eee' }}>
                            <Pagination total={totalPages} value={activePage} onChange={setPage} color="blue" radius="md" withEdges />
                        </Group>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ModificationHistory;