import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL is not defined");

const pool = new Pool({ 
	connectionString: DATABASE_URL,
	idleTimeoutMillis: 30000
});

const db = drizzle({ client: pool });
export default db;
