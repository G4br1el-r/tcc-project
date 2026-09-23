import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { and, count, eq } from "drizzle-orm";
import { createDatabase } from "../src/db/client";
import { account, faqItem, user } from "../src/db/schema";
import { readToken, requireEnv } from "../src/lib/env";
import { FAQ_SEED } from "./faq-seed";
import { loadLocalEnv } from "./load-local-env";

const DEFAULT_ADMIN_NAME = "Administrador";
const CREDENTIAL_PROVIDER_ID = "credential";
const EMPTY_TABLE = 0;
const FAILURE_EXIT_CODE = 1;
const INTERNAL_EMAIL_DOMAIN = "admin.local.invalid";

loadLocalEnv();
const db = createDatabase(process.env);

async function seedFaq(): Promise<void> {
  const [{ total }] = await db.select({ total: count() }).from(faqItem);
  if (total > EMPTY_TABLE) {
    console.info(`FAQ: tabela já tem ${total} itens, nada inserido.`);
    return;
  }

  await db
    .insert(faqItem)
    .values(FAQ_SEED.map((item, position) => ({ ...item, position })));
  console.info(`FAQ: ${FAQ_SEED.length} itens inseridos.`);
}

async function seedAdmin(): Promise<void> {
  const username = requireEnv(process.env, "ADMIN_USERNAME").toLowerCase();
  const password = requireEnv(process.env, "ADMIN_PASSWORD");
  const name = readToken(process.env.ADMIN_NAME) ?? DEFAULT_ADMIN_NAME;
  const email = `${username}@${INTERNAL_EMAIL_DOMAIN}`;

  const passwordHash = await hashPassword(password);
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, username))
    .get();

  if (existing) {
    await db
      .update(account)
      .set({ password: passwordHash })
      .where(
        and(
          eq(account.userId, existing.id),
          eq(account.providerId, CREDENTIAL_PROVIDER_ID),
        ),
      );
    console.info(`Admin ${username}: já existia, senha atualizada.`);
    return;
  }

  const userId = randomUUID();
  await db.batch([
    db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      username,
      displayUsername: username,
    }),
    db.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: CREDENTIAL_PROVIDER_ID,
      userId,
      password: passwordHash,
    }),
  ]);
  console.info(`Admin ${username}: criado.`);
}

async function main(): Promise<void> {
  await seedFaq();
  await seedAdmin();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = FAILURE_EXIT_CODE;
});
