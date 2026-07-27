// For documentation on RTK Queries see:
// https://redux-toolkit.js.org/rtk-query/usage/queries

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type AuthorizedUser, type CommentType, type CommentWithStatusType, type LoginUser, type TicketType, type TicketUser } from '../utils/types';
import { type RootState } from '../app/store'

// import type { Authorization } from 

export const rtkApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: '/portal/api',
        prepareHeaders: (headers, {getState}) => {
            const token = (getState() as RootState).authorization.accessToken;

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `${token}`)
            }

            return headers
        } 
    }),
    // For endpoints, builder.query<Return type, Input type>
    endpoints: builder => ({
        // Authorize user trying to login
        authorizeUser: builder.query<AuthorizedUser, LoginUser>({
            query: user => ({
                url: '/users/login',
                params: user
            })
        }),
        // A continuous check that verifies user is logged in and not timed out
        verifyUser: builder.query<AuthorizedUser, void>({
            query: () => (`/users/verify`)
        }),
        // Mint a session from the identity Apache forwards via OIDC SSO (see the OOD admin button)
        ssoLogin: builder.query<AuthorizedUser, void>({
            query: () => (`/users/sso-login`)
        }),
        // Get user details using username
        getUserDetails: builder.query<AuthorizedUser, string>({
            query: username => `/users/user/${username}`
        }),
        // Edit a user's password
        editPassword: builder.mutation<AuthorizedUser, LoginUser>({
            query: pass => ({
                url: '/users/editPassword',
                method: 'POST',
                body: pass
            })
        }),
        // Get all support tickets
        getTickets: builder.query<TicketType[], TicketUser>({
            query: tUser => ({
                url: '/support/',
                method: 'GET',
                params: tUser
            })
        }),
        // Get a ticket by id
        getTicket: builder.query<TicketType, number>({
            query: id => `/support/ticket/${id}`
        }),
        // Get all of user's pending tickets using username
        getPendingTickets: builder.query<number, string>({
            query: username => ({
                url: `/support/pending/${username}`,
                method: 'GET'
            })
        }),
        // Submit a support ticket
        submitSupport: builder.mutation<string, TicketType>({
            query: ticket => ({
                url: '/support/submit',
                method: 'POST',
                body: ticket
            })
        }),
        // Get a support ticket's comment chain
        getComments: builder.query<CommentType[], number>({
            query: ticketId => `support/comments/${ticketId}`
        }),
        // Submit a new comment for a support ticket
        postComment: builder.mutation<CommentType, CommentWithStatusType>({
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
    useLazySsoLoginQuery,
    useGetUserDetailsQuery, 
    useEditPasswordMutation, 
    useGetTicketsQuery, 
    useGetTicketQuery, 
    useGetPendingTicketsQuery,
    useSubmitSupportMutation,
    useGetCommentsQuery,
    usePostCommentMutation, 
} = rtkApi;