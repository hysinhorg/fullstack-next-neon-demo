import postgres from "postgres";

let client: postgres.Sql | null = null;

function getSqlClient() {
  if (client) return client;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  client = postgres(connectionString, { ssl: "require" });
  return client;
}

export async function ensureMessagesTable() {
  const sql = getSqlClient();
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function listMessages() {
  const sql = getSqlClient();
  return sql`
    SELECT id, body, created_at
    FROM messages
    ORDER BY created_at DESC
    LIMIT 20
  `;
}

export async function insertMessage(body: string) {
  const sql = getSqlClient();
  return sql`
    INSERT INTO messages (body)
    VALUES (${body})
    RETURNING id, body, created_at
  `;
}
