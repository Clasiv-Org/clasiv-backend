import { pgTable, foreignKey, uuid, timestamp, text, smallint, unique, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { roles } from "./role";
import { userStatus } from "./userStatus";
import { genderType } from "./genderType";

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	fullName: text("full_name").notNull(),
	emailId: text("email_id"),
	phoneNo: text("phone_no"),
	activatedAt: timestamp("activated_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	baseRole: smallint("base_role").notNull(),
	userName: text("user_name").notNull(),
	passwordHash: text("password_hash"),
	gender: genderType().default('prefer_not_to_say').notNull(),
	status: userStatus().default('unactivated').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.baseRole],
			foreignColumns: [roles.id],
			name: "users_base_role_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("users_email_id_key").on(table.emailId),
	unique("users_user_name_key").on(table.userName),
	check("users_user_name_check", sql`length(user_name) <= 32`),
]);
