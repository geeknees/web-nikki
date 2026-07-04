import type { APIContext } from "astro";
import { createFeed } from "~/utils/feed";

export async function GET(_context: APIContext) {
  return createFeed();
}
