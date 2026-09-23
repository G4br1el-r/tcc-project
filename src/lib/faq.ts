import "server-only";
import { asc, eq, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import type { FaqItem } from "@/content/landing";
import { db } from "@/db";
import { type FaqItemRow, faqItem } from "@/db/schema";
import { createUniqueFaqId, type FaqInput } from "./faq-validation";
import { isSameIdSet } from "./reorder";

export const FAQ_CACHE_TAG = "faq";
const NEXT_POSITION_STEP = 1;
const FIRST_POSITION = 0;

export async function getPublishedFaq(): Promise<FaqItem[]> {
  "use cache";
  cacheTag(FAQ_CACHE_TAG);
  cacheLife("max");

  return db
    .select({
      id: faqItem.id,
      question: faqItem.question,
      answer: faqItem.answer,
    })
    .from(faqItem)
    .where(eq(faqItem.published, true))
    .orderBy(asc(faqItem.position));
}

export async function listAllFaq(): Promise<FaqItemRow[]> {
  "use cache";
  cacheTag(FAQ_CACHE_TAG);
  cacheLife("max");

  return db.select().from(faqItem).orderBy(asc(faqItem.position));
}

export async function createFaq(input: FaqInput): Promise<void> {
  const existing = await db.select({ id: faqItem.id }).from(faqItem);
  const [{ lastPosition }] = await db
    .select({ lastPosition: max(faqItem.position) })
    .from(faqItem);

  await db.insert(faqItem).values({
    ...input,
    id: createUniqueFaqId(
      input.question,
      new Set(existing.map((row) => row.id)),
    ),
    position:
      lastPosition === null
        ? FIRST_POSITION
        : lastPosition + NEXT_POSITION_STEP,
  });
}

export async function updateFaq(id: string, input: FaqInput): Promise<void> {
  await db.update(faqItem).set(input).where(eq(faqItem.id, id));
}

export async function deleteFaq(id: string): Promise<void> {
  await db.delete(faqItem).where(eq(faqItem.id, id));
}

export async function reorderFaq(ids: ReadonlyArray<string>): Promise<boolean> {
  const current = await db.select({ id: faqItem.id }).from(faqItem);
  if (
    !isSameIdSet(
      current.map((row) => row.id),
      ids,
    )
  ) {
    return false;
  }

  const [first, ...rest] = ids.map((itemId, position) =>
    db.update(faqItem).set({ position }).where(eq(faqItem.id, itemId)),
  );
  if (!first) return true;
  await db.batch([first, ...rest]);
  return true;
}
