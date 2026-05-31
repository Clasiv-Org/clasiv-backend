import { 
	pgTable, 
	foreignKey, 
	uuid, 
	text, 
	boolean, 
	timestamp 
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	isRevoked: boolean("is_revoked").default(false).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	previousTokenId: uuid("previous_token_id"),
}, (table) => [
	foreignKey({
			columns: [table.previousTokenId],
			foreignColumns: [table.id],
			name: "refresh_tokens_previous_token_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);
