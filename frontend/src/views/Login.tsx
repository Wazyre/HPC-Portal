import { Button, Center, Image, PasswordInput, Stack, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
// import { useDispatch, useSelector } from "react-redux";
import { setAuthorizedUser, type LoginUser } from "../slices/authorizationSlice";
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
            .then(user => {
                dispatch(setAuthorizedUser(user));
                navigate('/dashboard');
            }); // Unwrap to catch any errors
            
        } catch (err) {
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
            <Center w="100vw" h="100vh">
                <Stack>
                    <Image fit="contain" h={300} w={900} src={ikarusLogo}/>
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <TextInput type="email" {...form.getInputProps('email')} mt="md" label="Email" placeholder="Email" />
                        <PasswordInput type="password" {...form.getInputProps('password')} mt="md" label="Password" placeholder="****" error={error ?"Invalid Credentials" : ""}/>
                        <Button loading={isLoading} type="submit" mt="md">
                            Submit
                        </Button>
                    </form>
                </Stack>
            </Center>
        );
    // }
};

export default Login;