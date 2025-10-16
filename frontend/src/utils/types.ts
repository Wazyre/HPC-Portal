import type { AuthorizedUser } from "../slices/authorizationSlice"

export interface TicketType {
    id: number,
    email: string,
    name: string,
    subject: string,
    description: string,
    status: string,
    createdAt: string,
    updatedAt: string
}

export interface CommentType {
    id: number,
    comment: string,
    createdAt: string,
    ticketId: number,
    authorId: number,
    author: AuthorizedUser | undefined
}