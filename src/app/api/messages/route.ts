import { NextResponse } from "next/server";
import { ensureMessagesTable, insertMessage, listMessages } from "@/lib/db";

export async function GET() {
  await ensureMessagesTable();
  const rows = await listMessages();
  return NextResponse.json({ items: rows });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { body?: string } | null;
  const body = payload?.body?.trim();

  if (!body) {
    return NextResponse.json({ error: "Message body is required." }, { status: 400 });
  }

  await ensureMessagesTable();
  const inserted = await insertMessage(body);

  return NextResponse.json({ item: inserted[0] }, { status: 201 });
}
