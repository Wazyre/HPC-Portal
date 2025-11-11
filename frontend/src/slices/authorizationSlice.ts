import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../app/store'
import type { AuthorizedUser } from '../utils/types';

interface AuthorizationState {
    loggedIn: boolean,
    id: number,
    accessToken: string,
    tokenExpiryDate: string,
    name: string,
    email: string,
    company: string,
    role: string,
};

const initialState: AuthorizationState = {
    loggedIn: false,
    id: -1,
    accessToken: localStorage.getItem('authToken') || '',
    tokenExpiryDate: localStorage.getItem('tokenExpiryDate') || '',
    name: '',
    email: '',
    company: '',
    role: '',
}

// Only mutate state inside createSlice, it uses Immer
export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setTokenExpiryDate: (state, action: PayloadAction<number>) => {
            const date = new Date()
            date.setSeconds(date.getSeconds() + action.payload);
            state.tokenExpiryDate = date.toISOString();
        },
        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload;
        },
        setAuthorizedUser: (state, action: PayloadAction<AuthorizedUser>) => {
            state.loggedIn = true;
            state.id = action.payload.id;
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('authToken', action.payload.accessToken);

            const date = new Date();
            date.setSeconds(date.getSeconds() + 86400); // 24 Hours
            state.tokenExpiryDate = date.toISOString();

            localStorage.setItem('tokenExpiryDate', date.toISOString());

            state.name = action.payload.firstName + ' ' + action.payload.lastName;
            state.email = action.payload.email;
            state.company = action.payload.company;
            state.role = action.payload.role;
        },
        clearLogInData: (state) => {
            localStorage.clear();
            state.loggedIn = false;
            state.accessToken = '';
            state.tokenExpiryDate = '';
            state.name = '';
            state.email = '';
            state.company = '';
            state.role = '';
        }
    }
})

export const {setLoggedIn, setAccessToken, setTokenExpiryDate, setRole, setAuthorizedUser, clearLogInData} = authorizationSlice.actions;

export const selectIsLoggedIn = (state: RootState) => state.authorization.loggedIn;
export const selectUserId = (state: RootState) => state.authorization.id;
export const selectAccessToken = (state: RootState) => state.authorization.accessToken;
export const selectTokenExpiryDate = (state: RootState) => state.authorization.tokenExpiryDate;
export const selectName = (state: RootState) => state.authorization.name;
export const selectEmail = (state: RootState) => state.authorization.email;
export const selectCompany = (state: RootState) => state.authorization.company;
export const selectRole = (state: RootState) => state.authorization.role;

export default authorizationSlice.reducer;