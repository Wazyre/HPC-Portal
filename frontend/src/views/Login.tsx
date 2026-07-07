import { Button, Box, Image, PasswordInput, Stack, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { setAuthorizedUser } from "../slices/authorizationSlice";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router";
import { useLazyAuthorizeUserQuery } from "../apis/rtkApi";
import ikarusLogo from "../assets/images/ikarus_logo_full.png";
import kisrIcon from "../assets/images/icon.svg";
import { useVerifyUser } from "../utils/useVerifyUser";
import type { AuthorizedUser, LoginUser } from "../utils/types";

const Login = () => {
    const [authorizeUser, {isLoading, error}] = useLazyAuthorizeUserQuery();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {username: '', password: ''},
        // validate: {
        //     email: isEmail('Invalid email')
        // },
    });

    const handleSubmit = async(values: typeof form.values) => {
        const user: LoginUser = {
            username: values.username,
            password: values.password
        }
        try {
            await authorizeUser(user).unwrap()
            .then((user: AuthorizedUser) => {
                dispatch(setAuthorizedUser(user));
                navigate('/portal/dashboard');
            }); // Unwrap to catch any errors
            
        } catch (err) {
            form.resetField('password');
            console.error("Failed Login: ", err, error?.toString());
        }
    };

    useVerifyUser(['any']);

    return (
        // Full page dark blue gradient background — fixed to cover entire viewport
        <Box
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #0a2540 0%, #1f6dbf 60%, #055ca4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            {/* White login card */}
            <Box
                style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    position: 'relative',
                }}
            >
                {/* IKARUS full logo at the top of the card */}
                <Stack align="center" mb="xl">
                    <Image src={ikarusLogo} w={220} fit="contain"/>
                </Stack>

                {/* Login form */}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            key={form.key('username')}
                            {...form.getInputProps('username')}
                            label="Username"
                            placeholder="Enter your username"
                            size="md"
                            radius="md"
                        />
                        <PasswordInput
                            key={form.key('password')}
                            type="password"
                            {...form.getInputProps('password')}
                            label="Password"
                            placeholder="••••••••"
                            error={error ? "Invalid Credentials" : ""}
                            size="md"
                            radius="md"
                        />

                        {/* Full width Login button */}
                        <Button
                            loading={isLoading}
                            type="submit"
                            size="md"
                            radius="md"
                            fullWidth
                            mt="xs"
                            color="ikarus-blue.8"
                        >
                            Login
                        </Button>
                    </Stack>
                </form>

                {/* Copyright text at the bottom center */}
                <Text size="xs" c="dimmed" ta="center" mt="xl">
                    © 2025 KISR/IKARUS
                </Text>

                {/* KISR small icon at the bottom right corner of the card */}
                <Box style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                    <Image src={kisrIcon} w={28} fit="contain"/>
                </Box>

            </Box>
        </Box>
    );
};

export default Login;