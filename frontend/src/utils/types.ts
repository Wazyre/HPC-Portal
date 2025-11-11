export interface LoginUser {
    email: string,
    password: string
}

export interface AuthorizedUser {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    company: string,
    role: string,
    accessToken: string
}

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

export interface TicketUser {
    email: string,
    role: string
}

export interface CommentType {
    id: number,
    comment: string,
    createdAt: string,
    ticketId: number,
    authorId: number,
    author: AuthorizedUser | undefined
}

export type CommentWithStatusType = CommentType & {status: string};