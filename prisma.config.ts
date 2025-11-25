// import dotenv from'dotenv';
import type { PrismaConfig } from "prisma";
// import { env } from "prisma/config";

// dotenv.config();

export default {
  schema: "schema.prisma",
  migrations: {
    path: "migrations",
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { 
    url: process.env.DIRECT_URL!
  }
} satisfies PrismaConfig;