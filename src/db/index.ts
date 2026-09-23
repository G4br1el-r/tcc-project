import "server-only";
import { createDatabase } from "./client";

export const db = createDatabase(process.env);
