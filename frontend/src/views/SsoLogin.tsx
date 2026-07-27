import { useEffect } from "react";
import { Box, Loader, Stack, Text, Anchor } from "@mantine/core";
import { Link, useNavigate } from "react-router";
import { setAuthorizedUser } from "../slices/authorizationSlice";
import { useAppDispatch } from "../app/hooks";
import { useLazySsoLoginQuery } from "../apis/rtkApi";
import type { AuthorizedUser } from "../utils/types";

// Landing page for the OOD admin button — mints a session from the
// Authentik identity Apache forwards to /portal/api/users/sso-login.
const SsoLogin = () => {
    const [ssoLogin, { isError }] = useLazySsoLoginQuery();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        ssoLogin().unwrap()
            .then((user: AuthorizedUser) => {
                dispatch(setAuthorizedUser(user));
                navigate('/portal/dashboard');
            })
            .catch((err) => {
                console.error("SSO login failed: ", err);
            });
    }, []);

    return (
        <Box
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Stack align="center" gap="md">
                {isError ? (
                    <>
                        <Text>Couldn't sign you in via single sign-on.</Text>
                        <Anchor component={Link} to="/portal/login">Go to login</Anchor>
                    </>
                ) : (
                    <>
                        <Loader/>
                        <Text c="dimmed">Signing you in...</Text>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default SsoLogin;
