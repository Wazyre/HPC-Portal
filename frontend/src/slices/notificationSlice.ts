import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from '../app/store'

interface Notification {
    id: string,
    dateTitle: string,
    message: string,
    color: string,
    withCloseButton: true,
    withBorder: true,
    position: 'top-right',
};

const initialState: Notification[] = [
    {id: 'wow', dateTitle: 'check-it', message: 'nice', color: 'blue', 
        withCloseButton: true, withBorder: true, position: 'top-right'}
]

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: {
            reducer(state, action: PayloadAction<Notification>) {
                state.push(action.payload);
            },
            prepare(id: string, dateTitle: string, message: string, color: string, 
                withCloseButton: true, withBorder: true, position: 'top-right') {
                return {
                    payload: {
                        id,
                        dateTitle: new Date().toISOString(),
                        message,
                        color,
                        withCloseButton,
                        withBorder,
                        position
                    }
                }
            }
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.filter((notification) => notification.id !== action.payload)
        }
    },
});

export const {addNotification, removeNotification} = notificationsSlice.actions;
export const selectAllNotifications = (state: RootState) => state.notifications
export const selectNotificationById = (state: RootState, notifId: string) => state.notifications.find(notification => notification.id === notifId);

export default notificationsSlice.reducer;