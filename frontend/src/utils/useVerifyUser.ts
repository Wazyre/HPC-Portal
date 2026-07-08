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
        if (role !== '') return; // Already verified this session

        const tokenDate = tokenExpiryDate ? new Date(tokenExpiryDate) : null;

        if (tokenDate && tokenDate > new Date()) {
            verifyUser().unwrap()
            .then((user: AuthorizedUser) => {
                dispatch(setAuthorizedUser(user));

                if (!roles.includes('any') && !roles.includes(user.role)) {
                    navigate(-1);
                }
                if (location.pathname === '/portal/login') {
                    navigate('/portal/dashboard');
                }
            }).catch(err => {
                console.error(err);
                dispatch(clearLogInData());
                navigate('/portal/login');
            })
        } else {
            // No token, or it has expired — make sure stale storage is cleared
            // and kick the user back to login instead of leaving them on this page.
            dispatch(clearLogInData());
            if (location.pathname !== '/portal/login') {
                navigate('/portal/login');
            }
        }
    }, [tokenExpiryDate]);
}