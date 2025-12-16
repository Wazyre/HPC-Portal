import { Button, Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Stack, Text } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearLogInData, selectName, selectUsername } from "../slices/authorizationSlice";
import { Link, useNavigate } from "react-router";

/* 
The menu dropdown at the top right of the header
*/

const HeaderMenu = () => {
    const name = useAppSelector(selectName);
    const username = useAppSelector(selectUsername);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClick = () => {
        dispatch(clearLogInData());
        navigate('/login');
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
                    to="/profile"
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