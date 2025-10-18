import { Button, Container, Group, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
// import { useDispatch, useSelector } from "react-redux";
import { setAuthorizedUser, type AuthorizedUser, type LoginUser } from "../slices/authorizationSlice";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router";
import {  useLazyAuthorizeUserQuery } from "../apis/authorizeApi";
import ikarusLogo from "../assets/images/ikarus_logo_full.png";
import { useVerifyUser } from "../utils/useVerifyUser";
// // TS types for the input fields
// interface LoginFormFields extends HTMLFormControlsCollection {
//   email: HTMLInputElement
//   password: HTMLInputElement
// }
// interface LoginFormElements extends HTMLFormElement {
//   readonly elements: LoginFormFields
// }

const Login = () => {
    const [authorizeUser, {isLoading, error}] = useLazyAuthorizeUserQuery();
    // const loginStatus = useAppSelector(selectLoginStatus);
    // const loginError = useAppSelector(selectLoginError);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {email: '', password: ''},
        validate: {
            email: isEmail('Invalid email')
        },
    });

    const handleSubmit = async(values: typeof form.values) => {
        const user: LoginUser = {
            email: values.email,
            password: values.password
        }
        try {
            await authorizeUser(user).unwrap()
            .then((user: AuthorizedUser) => {
                dispatch(setAuthorizedUser(user));
                navigate('/dashboard');
            }); // Unwrap to catch any errors
            
        } catch (err) {
            form.resetField('password');
            console.error("Failed Login: ", err, error?.toString());
        }
    };

    useVerifyUser();

    // Handle loading spinner during login
    // if (false) {
    //     return (
    //         <Loader color="blue" size="lg" type="bars"/>
    //     );
    // } else {
        return (
            <Container fluid mt={20}>
                <Stack align="center">
                    <Image fit="contain" h={150} src={ikarusLogo}/>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput key={form.key('email')} type="email" {...form.getInputProps('email')} mt="md" label="Email" placeholder="Email" />
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
    // }
};

export default Login;