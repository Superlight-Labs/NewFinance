import { PrismaClient as Client } from "@prisma/client";

export const client: Client = new Client({});

export type PrismaClient = typeof client;
