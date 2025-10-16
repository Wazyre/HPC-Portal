// For documentation on RTK Queries see:
// https://redux-toolkit.js.org/rtk-query/usage/queries

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthorizedUser, LoginUser } from '../slices/authorizationSlice';
import { type CommentType, type TicketType } from '../utils/types';
import { type RootState } from '../app/store'

// import type { Authorization } from 

export const loginApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: '/api',
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).authorization.accessToken;

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `${token}`)
            }

            return headers
        } 
    }),
    endpoints: builder => ({
        // Accepts a LoginUser and returns an AuthorizedUser
        authorizeUser: builder.query<AuthorizedUser, LoginUser>({
            query: user => ({
                url: '/users/login',
                params: user
            })
        }),
        verifyUser: builder.query<AuthorizedUser, void>({
            query: () => (`/users/verify`)
        }),
        getUserDetails: builder.query<AuthorizedUser, string>({
            query: email => `/users/user/${email}`
        }),
        editPassword: builder.mutation<AuthorizedUser, LoginUser>({
            query: pass => ({
                url: '/users/editPassword',
                method: 'POST',
                body: pass
            })
        }),
        getTickets: builder.query<TicketType[], void>({
            query: () => '/support/'
        }),
        getTicket: builder.query<TicketType, number>({
            query: id => `/support/ticket/${id}`
        }),
        getPendingTickets: builder.query<number, string>({
            query: email => ({
                url: `/support/pending/${email}`,
                method: 'GET'
            })
        }),
        submitSupport: builder.mutation<string, TicketType>({
            query: ticket => ({
                url: '/support/submit',
                method: 'POST',
                body: ticket
            })
        }),
        getComments: builder.query<CommentType[], number>({
            query: ticketId => `support/comments/${ticketId}`
        }),
        postComment: builder.mutation<CommentType, CommentType>({
            query: comment => ({
                url: `/support/comment`,
                method: 'POST',
                body: comment
            })
        })
    })
})

export const { 
    useLazyAuthorizeUserQuery, 
    useLazyVerifyUserQuery, 
    useGetUserDetailsQuery, 
    useEditPasswordMutation, 
    useGetTicketsQuery, 
    useGetTicketQuery, 
    useGetPendingTicketsQuery,
    useSubmitSupportMutation,
    useGetCommentsQuery,
    usePostCommentMutation, 
} = loginApi;