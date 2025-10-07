import expressAsyncHandler from 'express-async-handler';
import { PrismaClient } from '../generated/prisma/client.ts';
import type { SupportModel } from '../generated/prisma/models.ts';

const prisma = new PrismaClient();

export const getTickets = expressAsyncHandler(async (req, res) => {
    await prisma.support.findMany().then(async(tickets: SupportModel[] | null) => {
        res.json(tickets);
    }).catch((err: any) => {
        res.status(400).json({databaseEmpty: "No tickets exist", err});
    })
});

export const getTicket = expressAsyncHandler(async (req, res) => {
    await prisma.support.findUnique({
        where: {
            id: parseInt(req.params.id!),
        }
    }).then(async(ticket: SupportModel | null) => {
        res.json(ticket);
    }).catch((err: any) => {
        res.status(400).json({ticketNotFound: "Can't find ticket", err});
    });
});

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
    }).then(async(ticket: SupportModel | null) => {
        res.json(ticket);
    }).catch((err: any) => {
        res.status(400).json({ticketNotSubmitted: "Problem with submitting ticket", err});
    });
});