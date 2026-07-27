import { useEffect } from "react";
import { useLazyVerifyUserQuery } from "../apis/rtkApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearLogInData, selectTokenExpiryDate, setAuthorizedUser } from "../slices/authorizationSlice";
import { useLocation, useNavigate } from "react-router";
import type { AuthorizedUser } from "./types";

// How often to re-verify with the backend while a page sits open, so an
// expired token gets caught even if the user never navigates or refreshes.
const RECHECK_INTERVAL_MS = 60_000;

export const useVerifyUser = (roles: string[]) => {
    const tokenExpiryDate = useAppSelector(selectTokenExpiryDate);
    const [verifyUser] = useLazyVerifyUserQuery();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const logOut = () => {
            dispatch(clearLogInData());
            if (location.pathname !== '/portal/login') {
                navigate('/portal/login');
            }
        };

        const tokenDate = tokenExpiryDate ? new Date(tokenExpiryDate) : null;

        if (!tokenDate || tokenDate <= new Date()) {
            // No token, or it has expired — make sure stale storage is cleared
            // and kick the user back to login instead of leaving them on this page.
            logOut();
            return;
        }

        const check = () => {
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
                    logOut();
                });
        };

        check(); // Verify on mount/navigation...
        const interval = setInterval(check, RECHECK_INTERVAL_MS); // ...and keep polling while the page is left open
        return () => clearInterval(interval);
    }, [tokenExpiryDate]);
}