import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

type Store = { emails: string[] };

const STORE_PATH = resolve(process.cwd(), "data", "waitlist.json");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEED_COUNT = 247;

async function loadStore(): Promise<Store> {
  try {
    if (!existsSync(STORE_PATH)) return { emails: [] };
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed.emails)) return { emails: [] };
    return parsed;
  } catch {
    return { emails: [] };
  }
}

async function saveStore(store: Store) {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export type ApiResult = {
  status: number;
  body: { ok: boolean; message?: string; count?: number };
};

export async function getCount(): Promise<ApiResult> {
  const store = await loadStore();
  return { status: 200, body: { ok: true, count: SEED_COUNT + store.emails.length } };
}

export async function addEmail(rawEmail: unknown): Promise<ApiResult> {
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return { status: 400, body: { ok: false, message: "Please enter a valid email." } };
  }
  const store = await loadStore();
  if (store.emails.includes(email)) {
    return {
      status: 200,
      body: {
        ok: true,
        message: "You're already on the list. We'll be in touch.",
        count: SEED_COUNT + store.emails.length,
      },
    };
  }
  store.emails.push(email);
  await saveStore(store);
  return {
    status: 200,
    body: {
      ok: true,
      message: "You're on the list. Check your inbox.",
      count: SEED_COUNT + store.emails.length,
    },
  };
}
