"use client";

import { FormEvent, useEffect, useState } from "react";

type Message = {
  id: number;
  body: string;
  created_at: string;
};

export default function Home() {
  const [items, setItems] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadMessages() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/messages", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load messages");
      const data = (await response.json()) as { items: Message[] };
      setItems(data.items ?? []);
    } catch {
      setError("Could not load messages from the database.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body) return;

    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      if (!response.ok) {
        throw new Error("Failed to create message");
      }

      setText("");
      await loadMessages();
    } catch {
      setError("Could not write message to the database.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 p-8 text-zinc-900">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Next.js + Neon End-to-End Demo</h1>
          <p className="mt-2 text-sm text-zinc-600">
            This page calls a Next.js API route that reads and writes a Neon Postgres table.
          </p>
        </header>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <form className="flex gap-3" onSubmit={onSubmit}>
            <input
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
              placeholder="Write a message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-white disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </form>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Latest Messages</h2>
            <button
              type="button"
              onClick={loadMessages}
              className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-50"
            >
              Refresh
            </button>
          </div>

          {loading ? <p className="text-sm text-zinc-600">Loading...</p> : null}

          {!loading && items.length === 0 ? (
            <p className="text-sm text-zinc-600">No rows yet. Add your first message.</p>
          ) : null}

          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg border border-zinc-200 p-3">
                <p>{item.body}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  #{item.id} · {new Date(item.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
