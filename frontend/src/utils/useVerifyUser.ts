import { useEffect } from "react";
import { useLazyVerifyUserQuery } from "../apis/rtkApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearLogInData, selectRole, selectTokenExpiryDate, setAuthorizedUser } from "../slices/authorizationSlice";
import { useLocation, useNavigate } from "react-router";
import type { AuthorizedUser } from "./types";

export const useVerifyUser = (roles: string[]) => {
    const tokenExpiryDate = useAppSelector(selectTokenExpiryDate);
    const role = useAppSelector(selectRole);
    const [verifyUser] = useLazyVerifyUserQuery();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        if (tokenExpiryDate !== '' && role === '') {
            const date = new Date();
            const tokenDate = new Date(tokenExpiryDate);

            if (tokenDate > date) {
                verifyUser().unwrap()
                .then((user: AuthorizedUser) => {
                    dispatch(setAuthorizedUser(user));
                    
                    if ('any' !in roles && user.role !in roles) {
                        navigate(-1);
                    }
                    if (location.pathname === '/') {
                        navigate('/portal/dashboard');
                    }
                }).catch(err => {
                    console.error(err);
                    navigate('/login');
                })
            } else {
                dispatch(clearLogInData());
                navigate('/login');
            }
        }
    }, [tokenExpiryDate]);
}