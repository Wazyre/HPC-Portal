import { Avatar, Group, Stack, Text } from "@mantine/core";

interface CommentProps {
    avatarLink: string,
    name: string,
    email: string, 
    date: string,
    comment: string
}

const Comment = ({avatarLink, name, email, date, comment}: CommentProps) => {
    return (
        <>
            <Group justify="space-between" mt={20}>
                <Group>
                    <Avatar src={avatarLink}/>
                    <Stack gap="xs">
                        <Text>{name}</Text>
                        <Text size="xs" c="gray">{email}</Text>
                    </Stack>
                </Group>
                <Text size="xs" c="gray">{date}</Text>
            </Group>
            <Text mt={20} mb={20} size="sm">{comment}</Text>
        </>
    );
};

export default Comment;