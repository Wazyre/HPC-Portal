import { useForm } from "@mantine/form";
import { useEditPasswordMutation } from "../apis/rtkApi";
import { Button, PasswordInput } from "@mantine/core";
import { selectUsername } from "../slices/authorizationSlice";
import { useAppSelector } from "../app/hooks";
import { notifications } from "@mantine/notifications";
import type { LoginUser } from "../utils/types";

/* 
The password modal that handles editing a user's password
*/

interface PassModalProps {
    close: () => void
}

const PasswordModal = ({close}: PassModalProps) => {
    const [editPassword, {isLoading, error}] = useEditPasswordMutation();
    const username = useAppSelector(selectUsername);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {password: '', confirmPassword: ''},
        validate: {
            password: (value) => (value.length < 8 ? 'Password must be at least 8 characters': null),
            confirmPassword: (value, values) => (value !== values.password ? 'Passwords do not match' : null)
        }
    });

    const handleSubmit = async(values: typeof form.values) => {
        const user: LoginUser = {
            username: username,
            password: values.password
        }
        try {
            await editPassword(user).unwrap() // Unwrap to catch any errors
            .then(() => {
                close();
                notifications.show({
                    message: 'Password changed!',
                    color: 'blue',
                    position: 'top-center'
                });
            }); 
            
        } catch (err) {
            console.error("Failed to change password: ", err, error?.toString());
        }
    };

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <PasswordInput data-autofocus type="password" {...form.getInputProps('password')} mt="md" label="Password" placeholder="****" />
                <PasswordInput type="password" {...form.getInputProps('confirmPassword')} mt="md" label="Confirm Password" placeholder="****" />
                <Button loading={isLoading} type="submit" mt="md">
                    Submit
                </Button>
            </form>
        </>
    )
};

export default PasswordModal;