import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../generated/prisma/client.ts';
import type { CommentModel, SupportModel } from '../generated/prisma/models.ts';

const prisma = new PrismaClient();

// Get all tickets from DB
export const getTickets = expressAsyncHandler(async (req, res) => {
    await prisma.support.findMany().then((tickets: SupportModel[] | null) => {
        res.json(tickets);
    }).catch((err: any) => {
        res.status(400).json({databaseEmpty: "No tickets exist", err});
    })
});

// Get a single ticket by ID
export const getTicket = expressAsyncHandler(async (req, res) => {
    await prisma.support.findUnique({
        where: {
            id: parseInt(req.params.id!),
        }
    }).then((ticket: SupportModel | null) => {
        res.json(ticket);
    }).catch((err: any) => {
        res.status(400).json({ticketNotFound: "Can't find ticket", err});
    });
});

// Used to get all pending tickets tied to a user
export const getPendingTickets = expressAsyncHandler(async (req, res) => {
    await prisma.support.findMany({
        where: {
            email: req.params.email!,
            status: 'open'
        }
    }).then((tickets: SupportModel[] | null) => {
        res.json(tickets?.length ? tickets.length : 0);
    }).catch((err: any) => {
        res.status(400).json({pendingTickets: "An error occured", err});
    });
});

// Submit a support ticket
export const submitTicket = expressAsyncHandler(async (req, res) => {
    await prisma.support.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            subject: req.body.subject,
            description: req.body.description,
            status: req.body.status,
            createdAt: req.body.createdAt
        }
    }).then((ticket: SupportModel | null) => {
        res.json(ticket);
    }).catch((err: any) => {
        res.status(400).json({ticketNotSubmitted: "Problem with submitting ticket", err});
    });
});

export const getComments = expressAsyncHandler(async (req, res) => {
    await prisma.comment.findMany({
        relationLoadStrategy: 'join',
        where: {
            ticketId: parseInt(req.params.ticketId!)
        },
        include: {
            author: true
        }
    }).then((comments: CommentModel[] | null) => {
        res.json(comments);
    }).catch((err: any) => {
        res.status(400).json({commentsNotFound: "Problem with finding comments", err});
    });
});

export const postComment = expressAsyncHandler(async (req, res) => {
    await prisma.comment.create({
        data: {
            comment: req.body.comment,
            createdAt: req.body.createdAt,
            ticketId: parseInt(req.body.ticketId!),
            authorId: parseInt(req.body.authorId!)
        }
    }).then((comment: CommentModel | null) => {
        res.json(comment);
    }).catch((err: any) => {
        res.status(400).json({commentsNotSubmitted: "Problem with submitting new comment", err});
    });
});