import { Button, Container, Group, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { setAuthorizedUser } from "../slices/authorizationSlice";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router";
import {  useLazyAuthorizeUserQuery } from "../apis/rtkApi";
import ikarusLogo from "../assets/images/ikarus_logo_full.png";
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
        <Container fluid mt={20}>
            <Stack align="center">
                <Image fit="contain" h={150} src={ikarusLogo}/>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput key={form.key('username')}  {...form.getInputProps('username')} mt="md" label="Username" placeholder="" />
                    <PasswordInput key={form.key('password')} type="password" {...form.getInputProps('password')} mt="md" label="Password" placeholder="****" error={error ?"Invalid Credentials" : ""}/>
                    <Group justify="flex-end">
                        <Button component="a" disabled={isLoading} size="xs" href="https://khpc.kisr.edu.kw/" mt="md">
                            Cancel
                        </Button>
                        <Button loading={isLoading} size="xs" type="submit" mt="md" >
                            Login
                        </Button>
                    </Group>
                </form>
            </Stack>
        </Container>
    );
};

export default Login;