import { Button, Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Stack, Text } from "@mantine/core";
import { IconChevronDown, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearLogInData, selectEmail, selectName } from "../slices/authorizationSlice";
import { Link, useNavigate } from "react-router";

const HeaderMenu = () => {
    const name = useAppSelector(selectName);
    const email = useAppSelector(selectEmail);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleClick = () => {
        dispatch(clearLogInData());
        navigate('/');
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
                        {email}
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