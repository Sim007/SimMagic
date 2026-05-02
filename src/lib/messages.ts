import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultLocale, type Locale } from "@/lib/i18n";

export type MessageValue = string | MessageMap;

export type MessageMap = {
  [key: string]: MessageValue;
};

const messagesDir = path.join(process.cwd(), "messages");

async function readMessagesFile(locale: Locale): Promise<MessageMap> {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const file = await fs.readFile(filePath, "utf8");
  return JSON.parse(file) as MessageMap;
}

export async function getMessages(locale: Locale): Promise<MessageMap> {
  if (locale === defaultLocale) {
    return readMessagesFile(defaultLocale);
  }

  const [fallback, active] = await Promise.all([
    readMessagesFile(defaultLocale),
    readMessagesFile(locale)
  ]);

  return mergeMessages(fallback, active);
}

export function t(messages: MessageMap, key: string): string {
  const value = key.split(".").reduce<MessageValue | undefined>((acc, part) => {
    if (!acc || typeof acc === "string") {
      return undefined;
    }

    return acc[part];
  }, messages);

  return typeof value === "string" ? value : key;
}

function mergeMessages(base: MessageMap, incoming: MessageMap): MessageMap {
  const out: MessageMap = { ...base };

  for (const [key, value] of Object.entries(incoming)) {
    const previous = out[key];

    if (
      previous &&
      typeof previous !== "string" &&
      typeof value !== "string"
    ) {
      out[key] = mergeMessages(previous, value);
      continue;
    }

    out[key] = value;
  }

  return out;
}
