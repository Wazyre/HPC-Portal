import { useState, useEffect, useRef, useMemo } from 'react'; // Added useRef for the hidden file input in the attachment edit feature
import {
    Container, Title, Table, Paper, Badge, Text,
    Group, TextInput, Loader, Stack, Button, rem,
    ActionIcon, Pagination, Select, Modal, Typography, Spoiler
} from '@mantine/core';
import { IconSearch, IconSearchOff, IconCheck, IconTrash, IconX, IconEdit, IconDeviceFloppy, IconPaperclip, IconUpload } from '@tabler/icons-react'; // Added IconUpload for the attachment upload button
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import DOMPurify from 'dompurify'; // Sanitizes stored HTML before rendering
import { RichTextEditor } from '@mantine/tiptap'; // Rich text editor UI (toolbar and content area)
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'; // Core formatting: bold, italic, underline, strikethrough, lists
import { TextStyle, FontSize } from '@tiptap/extension-text-style'; // Font size support
import { useVerifyUser } from '../utils/useVerifyUser';
import classes from './ModificationHistory.module.css'; // Spacing for formatted descriptions in the table

// Tags and attributes permitted in rendered descriptions; everything else is stripped
const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 's', 'span', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'hr'];
const ALLOWED_ATTR = ['style', 'href', 'target', 'rel'];

// Restrict inline styles to a font size only (e.g. "font-size: 16px")
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
    if (data.attrName === 'style') {
        const match = /font-size:\s*(\d{1,2})px/i.exec(data.attrValue);
        if (match) {
            data.attrValue = `font-size: ${match[1]}px`;
        } else {
            data.keepAttr = false;
        }
    }
});

// Force links to open in a new tab without access to this page
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
    }
});

const sanitizeDescription = (html: string) => DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });

// Descriptions saved from the rich text editor start with a block-level tag; older entries are plain text
const isHtmlDescription = (desc: string) => /^\s*<(p|ul|ol|h[1-6]|blockquote|pre|hr)[\s>/]/i.test(desc);

// Visible text of a description, used for searching
const getSearchText = (desc: string) => {
    if (!isHtmlDescription(desc)) return desc;
    const doc = new DOMParser().parseFromString(desc, 'text/html');
    return doc.body.textContent || '';
};

// Converts a stored description into editor content; plain text is escaped and wrapped in a paragraph
const toEditorContent = (desc: string) => {
    if (isHtmlDescription(desc)) return sanitizeDescription(desc);
    const escaped = desc.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<p>${escaped.replace(/\n/g, '<br>')}</p>`;
};

// Font sizes available in the description editor (in px)
const fontSizeOptions = ['12', '14', '16', '18', '20', '24'];

// Line height used in the description cell; the collapsed height below is exactly 6 lines
const DESCRIPTION_LINE_HEIGHT = 22;
const DESCRIPTION_COLLAPSED_HEIGHT = DESCRIPTION_LINE_HEIGHT * 6;

type DescriptionEditFormProps = {
    initialContent: string;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
};

// Rich text editor shown in the edit modal for updating a log description
const DescriptionEditForm = ({ initialContent, onChange, onSave, onCancel }: DescriptionEditFormProps) => {
    const editor = useEditor({
        extensions: [StarterKit, TextStyle, FontSize],
        content: initialContent,
        shouldRerenderOnTransaction: true, // Keeps toolbar state in sync with the cursor position
        editorProps: {
            // Taller writing area; text size matches the other form inputs
            attributes: { style: 'min-height: 200px; font-size: var(--mantine-font-size-sm);' },
        },
        onUpdate: ({ editor }) => {
            // Treat an editor with no visible text as empty
            onChange(editor.getText().trim() === '' ? '' : editor.getHTML());
        },
    });

    // Currently applied font size at the cursor, without the "px" unit
    const currentFontSize: string | null = editor?.getAttributes('textStyle').fontSize?.replace('px', '') ?? null;

    return (
        <>
            <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <Select
                            size="xs"
                            w={90}
                            placeholder="Size"
                            data={fontSizeOptions}
                            value={currentFontSize}
                            onChange={(value) => {
                                if (!editor) return;
                                if (value) {
                                    editor.chain().focus().setFontSize(`${value}px`).run();
                                } else {
                                    editor.chain().focus().unsetFontSize().run();
                                }
                            }}
                            clearable
                            aria-label="Font size"
                        />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>

            <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={onCancel}>Cancel</Button>
                <Button color="blue" leftSection={<IconDeviceFloppy size={16} />} onClick={onSave}>Save</Button>
            </Group>
        </>
    );
};

const ModificationHistory = () => {
    useVerifyUser(['any']);

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Tracks which log is waiting for confirmation before being marked as done
    const [confirmDoneId, setConfirmDoneId] = useState<string | null>(null);

    // State to track which log's attachment is currently being updated
    const [attachmentLoadingId, setAttachmentLoadingId] = useState<string | null>(null);

    // Ref for the hidden file input used to trigger file selection for attachment updates
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    // Tracks which log id the attachment file input is currently targeting
    const [attachmentTargetId, setAttachmentTargetId] = useState<string | null>(null);

    const [activePage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<string | null>('10');

    // Status filter for the table: All, Pending or Completed
    const [statusFilter, setStatusFilter] = useState<string | null>('All');

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
    }, [search, pageSize, statusFilter]);

    const handleEditSave = async (id: string) => {
        // Prevent saving an empty description
        if (!editValue) {
            notifications.show({ title: 'Missing Information', message: 'Description cannot be empty.', color: 'orange' });
            return;
        }
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
            setConfirmDoneId(null); // Close the done confirmation after a successful update
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

    // Recalculated only when logs, the search term or the status filter change
    const filteredLogs = useMemo(() => (logs || []).filter((log: any) => {
        const name = log.adminName || "";
        const scope = log.scopeOfChange || "";
        const desc = getSearchText(log.changeDescription || ""); // Search visible text only, not HTML tags
        const searchTerm = search.toLowerCase();
        const matchesSearch = name.toLowerCase().includes(searchTerm) ||
               scope.toLowerCase().includes(searchTerm) ||
               desc.toLowerCase().includes(searchTerm);
        // Case-insensitive status match; "All" shows every log
        const matchesStatus = !statusFilter || statusFilter === 'All' ||
               (log.status || "").toUpperCase() === statusFilter.toUpperCase();
        return matchesSearch && matchesStatus;
    }), [logs, search, statusFilter]);

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
                    {/* Filter logs by status */}
                    <Select
                        label="Status"
                        data={['All', 'Pending', 'Completed']}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowDeselect={false}
                        style={{ width: rem(120) }}
                        size="xs"
                    />
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

            {/* Edit description modal with rich text editor */}
            <Modal
                opened={editingId !== null}
                onClose={() => setEditingId(null)}
                title="Edit Description"
                size="lg"
                centered
            >
                <DescriptionEditForm
                    key={editingId ?? 'none'}
                    initialContent={editValue}
                    onChange={setEditValue}
                    onSave={() => { if (editingId) handleEditSave(editingId); }}
                    onCancel={() => setEditingId(null)}
                />
            </Modal>

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
                        {/*  Minimum table width; only screens narrower than this scroll horizontally */}
                        <Table.ScrollContainer minWidth={1200}>
                            {/*  tableLayout fixed + width 100% so column widths follow the header settings and stay the same on every page */}
                            <Table
                                verticalSpacing="md"
                                horizontalSpacing="sm"
                                highlightOnHover
                                style={{ tableLayout: 'fixed', width: '100%' }}
                            >
                                <Table.Thead bg="gray.1">
                                    <Table.Tr>
                                        {/*  Fixed pixel widths for dates, scope, status and actions; Description takes 30%; Admin Name and Attachment share the remaining width equally */}
                                        <Table.Th style={{ width: '110px' }}><Text fw={700} c="black">Created At</Text></Table.Th>
                                        <Table.Th style={{ width: '110px' }}><Text fw={700} c="black">Completed At</Text></Table.Th>
                                        <Table.Th><Text fw={700} c="black">Admin Name</Text></Table.Th>
                                        <Table.Th style={{ width: '140px' }}><Text fw={700} c="black">Scope</Text></Table.Th>
                                        <Table.Th style={{ width: '30%' }}><Text fw={700} c="black">Description</Text></Table.Th>
                                        <Table.Th><Text fw={700} c="black">Attachment</Text></Table.Th> {/*  New column for file attachments */}
                                        <Table.Th style={{ width: '130px' }}><Text fw={700} c="black">Status</Text></Table.Th>
                                        <Table.Th style={{ width: '170px' }}><Text fw={700} c="black">Action</Text></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {paginatedLogs.length > 0 ? (
                                        paginatedLogs.map((log: any) => {
                                            const isDone = log.status?.toUpperCase() === 'COMPLETED';
                                            const isEditing = editingId === log.id;
                                            const isAttachmentLoading = attachmentLoadingId === log.id;
                                            const isConfirmingDelete = confirmDeleteId === log.id; // Row is waiting for delete confirmation
                                            const isConfirmingDone = confirmDoneId === log.id; // Row is waiting for done confirmation

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

                                                    {/*  Description cell — formatted descriptions are sanitized before rendering; older plain-text entries are shown as text */}
                                                    {/* Long descriptions are collapsed to about 6 lines with a Show more / Show less toggle */}
                                                    <Table.Td>
                                                        <Spoiler
                                                            maxHeight={DESCRIPTION_COLLAPSED_HEIGHT}
                                                            showLabel="Show more"
                                                            hideLabel="Show less"
                                                            styles={{ control: { fontSize: 'var(--mantine-font-size-xs)' } }}
                                                        >
                                                            {isHtmlDescription(log.changeDescription || '') ? (
                                                                <Typography className={classes.description} style={{ fontSize: 'var(--mantine-font-size-sm)', lineHeight: `${DESCRIPTION_LINE_HEIGHT}px`, wordBreak: 'break-word' }}>
                                                                    <div dangerouslySetInnerHTML={{ __html: sanitizeDescription(log.changeDescription) }} />
                                                                </Typography>
                                                            ) : (
                                                                <Text size="sm" style={{ whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: `${DESCRIPTION_LINE_HEIGHT}px` }}>
                                                                    {log.changeDescription}
                                                                </Text>
                                                            )}
                                                        </Spoiler>
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
                                                            {/* Edit and Done are hidden while a delete is being confirmed; Edit is also hidden while Done is being confirmed */}
                                                            {!isDone && !isEditing && !isConfirmingDelete && !isConfirmingDone && (
                                                                <ActionIcon variant="subtle" color="blue" onClick={() => {
                                                                    setEditingId(log.id);
                                                                    setEditValue(toEditorContent(log.changeDescription || '')); // Load the description into the edit modal
                                                                }}>
                                                                    <IconEdit size={16} />
                                                                </ActionIcon>
                                                            )}
                                                            {!isDone && !isEditing && !isConfirmingDelete && (
                                                                isConfirmingDone ? (
                                                                    // Confirm or cancel marking the log as done
                                                                    <Group gap={5} wrap="nowrap">
                                                                        <Button size="compact-xs" color="green" variant="filled" onClick={() => handleStatusUpdate(log.id)}>Confirm</Button>
                                                                        <ActionIcon variant="subtle" color="gray" onClick={() => setConfirmDoneId(null)}><IconX size={14} /></ActionIcon>
                                                                    </Group>
                                                                ) : (
                                                                    <Button size="compact-xs" color="green" variant="light" leftSection={<IconCheck size={14} />} onClick={() => {
                                                                        setConfirmDeleteId(null); // Only one confirmation open per row
                                                                        setConfirmDoneId(log.id);
                                                                    }}>
                                                                        Done
                                                                    </Button>
                                                                )
                                                            )}
                                                            {!isDone && !isConfirmingDone && (
                                                                <>
                                                                    {confirmDeleteId === log.id ? (
                                                                        <Group gap={5} wrap="nowrap">
                                                                            <Button size="compact-xs" color="red" variant="filled" onClick={() => handleDelete(log.id)}>Confirm</Button>
                                                                            <ActionIcon variant="subtle" color="gray" onClick={() => setConfirmDeleteId(null)}><IconX size={14} /></ActionIcon>
                                                                        </Group>
                                                                    ) : (
                                                                        !isEditing && (
                                                                            <ActionIcon variant="subtle" color="red" onClick={() => {
                                                                                setConfirmDoneId(null); // Only one confirmation open per row
                                                                                setConfirmDeleteId(log.id);
                                                                            }}>
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