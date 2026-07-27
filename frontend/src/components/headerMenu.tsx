import { Button, Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Stack, Text } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearLogInData, selectName, selectUsername } from "../slices/authorizationSlice";
import { Link } from "react-router";

/* 
The menu dropdown at the top right of the header
*/

const HeaderMenu = () => {
    const name = useAppSelector(selectName);
    const username = useAppSelector(selectUsername);

    const dispatch = useAppDispatch();

    const handleClick = () => {
        dispatch(clearLogInData());

        // Also end the Authentik/mod_auth_openidc session (not just the local
        // HPC-Portal one) so an SSO'd-in admin can't silently get back in.
        // /ood/redirect_uri is mod_auth_openidc's configured OIDCRedirectURI;
        // hitting it with ?logout= clears the Apache session and, since the
        // OP supports end-session (discovered via OIDCProviderMetadataURL),
        // routes through Authentik's real logout before returning here.
        const returnTo = encodeURIComponent(`${window.location.origin}/portal/login`);
        window.location.href = `/ood/redirect_uri?logout=${returnTo}`;
    }

    return (
        <Menu>
            <MenuTarget>
                <Button 
                    rightSection={<IconChevronDown/>}
                    variant="transparent"
                >
                    {name.split(' ')[0]}
                </Button>
            </MenuTarget>
            <MenuDropdown>
                <MenuLabel>
                    <Stack>
                        <Text fz={"sm"}>{name}</Text>
                        {username}
                    </Stack>
                    
                </MenuLabel>
                <MenuItem 
                    leftSection={<IconUserCircle/>}
                    component={Link}
                    to="/portal/profile"
                >
                    Profile
                </MenuItem>
                <MenuItem 
                    leftSection={<IconLogout/>}
                    onClick={handleClick}
                >
                    Log Out
                </MenuItem>
            </MenuDropdown>
        </Menu>
    )
};

export default HeaderMenu;