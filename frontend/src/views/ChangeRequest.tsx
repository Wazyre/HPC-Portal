import { useState } from 'react';
import { Title, Container, Text, Select, Button, Paper, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications'; 
import { IconCheck, IconX, IconPaperclip } from '@tabler/icons-react'; //  Added IconPaperclip for the file upload button icon
import axios from 'axios';
import { RichTextEditor } from '@mantine/tiptap'; // Rich text editor UI (toolbar and content area)
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'; // Core formatting: bold, italic, underline, strikethrough, lists
import { Placeholder } from '@tiptap/extensions';
import { TextStyle, FontSize } from '@tiptap/extension-text-style'; // Font size support
import { useAppSelector } from "../app/hooks";
import { selectName } from "../slices/authorizationSlice";
import { useVerifyUser } from "../utils/useVerifyUser";

const ChangeRequest = () => {
    const loggedInName = useAppSelector(selectName);

    useVerifyUser(['any']);

    const scopeOptions = [
        'Firewall', 'Network', 'Nodes', 'Cores', 'Headnode', 
        'Website', 'Admin Scripts', 'Policies', 'Account', 'Troubleshooting', 'Documentation', 'Modules', 'Other'
    ];

    const statusOptions = ['Pending', 'Completed'];

    // Font sizes available in the description editor (in px)
    const fontSizeOptions = ['12', '14', '16', '18', '20', '24'];

    const [scope, setScope] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null); //  State to hold the selected file

    // Rich text editor for the change description; content is stored as HTML
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            FontSize,
            Placeholder.configure({ placeholder: 'Describe exactly what was modified...' }),
        ],
        content: '',
        shouldRerenderOnTransaction: true, // Keeps toolbar state in sync with the cursor position
        editorProps: {
            // Taller writing area; text size matches the other form inputs
            attributes: { style: 'min-height: 150px; font-size: var(--mantine-font-size-sm);' },
        },
        onUpdate: ({ editor }) => {
            // Treat an editor with no visible text as empty so required-field validation still applies
            setDescription(editor.getText().trim() === '' ? '' : editor.getHTML());
        },
    });

    // Currently applied font size at the cursor, without the "px" unit
    const currentFontSize: string | null = editor?.getAttributes('textStyle').fontSize?.replace('px', '') ?? null;

    const handleSubmit = async () => {
        if (!scope || !status || !description) {
            notifications.show({
                title: 'Missing Information',
                message: 'Please fill in all required fields.',
                color: 'orange',
                autoClose: 5000, 
            });
            return;
        }

        setLoading(true);
        try {
            //  Use FormData instead of a plain JSON object so we can send
            // both text fields and the optional file attachment in the same request
            const formData = new FormData();
            formData.append('adminName', loggedInName || 'Admin User'); // Ensures adminName is never empty in the database
            formData.append('scopeOfChange', scope);
            formData.append('status', status);
            formData.append('changeDescription', description);

            //  Only append the file if the admin actually selected one
            if (attachedFile) {
                formData.append('attachedFile', attachedFile);
            }

            const response = await axios.post('/api/change-requests/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' } //  Required header so the server knows this is a file upload request
            });

            if (response.status === 201) {
                notifications.show({
                    title: 'Success!',
                    message: `Log recorded successfully`,
                    color: 'green',
                    icon: <IconCheck size={18} />,
                    autoClose: 6000, 
                });
                
                // Reset all fields including the file after successful submission
                setScope(null);
                setStatus(null);
                setDescription('');
                editor?.commands.clearContent(); // Clear the description editor
                setAttachedFile(null); //  Clear the file after successful submission
            }
        } catch (error) {
            console.error("Database Error:", error);
            notifications.show({
                title: 'Submission Failed',
                message: 'Failed to record the change request.',
                color: 'red',
                icon: <IconX size={18} />,
                autoClose: 6000, 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="lg">
            <Title order={2} mt="md">Add Log</Title>
            <Text mt="xs" c="dimmed">
                Log modifications made to the IKARUS HPC System
            </Text>

            <Paper withBorder shadow="md" p="xl" mt="xl" radius="md">
                <Title order={4} mb="lg">Add New Log</Title>
                
                <Group grow>
                    <Select 
                        label="Scope of Change" 
                        placeholder="Pick one" 
                        data={scopeOptions} 
                        value={scope}
                        onChange={setScope}
                        required
                    />
                    <Select 
                        label="Status" 
                        placeholder="Select status" 
                        data={statusOptions} 
                        value={status}
                        onChange={setStatus}
                        required
                    />
                </Group>

                {/* Change description with formatting toolbar */}
                <Text size="sm" fw={500} mt="md" mb={4}>
                    Change Description <Text span c="var(--mantine-color-error)" aria-hidden>*</Text>
                </Text>
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

                {/*  File upload box added below the Change Description field */}
                {/* Admins can optionally upload a Word, PDF, or Excel file as an attachment */}
                <Text size="sm" fw={500} mt="md" mb={4}>Attach File <Text span c="dimmed" size="xs">(Optional — e.g., .pdf, .docx, .xlsx)</Text></Text>
                <Group gap="sm" align="center">
                    <Button
                        variant="default"
                        size="sm"
                        leftSection={<IconPaperclip size={16} />}
                        onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                        {attachedFile ? attachedFile.name : 'Choose File'}
                    </Button>
                    {/*  Show a remove button only when a file has been selected */}
                    {attachedFile && (
                        <Button
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => setAttachedFile(null)}
                        >
                            Remove
                        </Button>
                    )}
                </Group>
                {/* Hidden native file input — triggered by the button above */}
                <input
                    id="file-upload-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.zip"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setAttachedFile(file); //  Store the selected file in state
                        e.target.value = ''; // Reset input so the same file can be reselected if removed
                    }}
                />

                <Group justify="flex-end" mt="xl">
                    <Button 
                        color="blue" 
                        size="md" 
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Add
                    </Button>
                </Group>
            </Paper>
        </Container>
    );
};

export default ChangeRequest;