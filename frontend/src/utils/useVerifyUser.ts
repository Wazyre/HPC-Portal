import { useEffect } from "react";
import { useLazyVerifyUserQuery } from "../apis/authorizeApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectRole, selectTokenExpiryDate, setAuthorizedUser, type AuthorizedUser } from "../slices/authorizationSlice";
import { useLocation, useNavigate } from "react-router";


export const useVerifyUser = () => {
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
                    if(location.pathname === '/') {
                        navigate('/dashboard');
                    }
                }).catch(err => {
                    console.error(err);
                    navigate('/');
                })
            }
        }
    }, [tokenExpiryDate]);
}