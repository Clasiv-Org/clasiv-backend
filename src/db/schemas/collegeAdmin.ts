import { boolean, pgTable, timestamp, uuid, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { colleges } from "./college";
import { users } from "./user";

export const collegeAdmins = pgTable("college_admins", {
	userId: uuid("user_id").notNull(),
	collegeId: uuid("college_id").notNull(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	deactivatedAt: timestamp("deactivated_at", { withTimezone: true, mode: 'string' }),
	deactivatedBy: uuid("deactivated_by"),
}, (table) => [
	foreignKey({
			columns: [table.collegeId],
			foreignColumns: [colleges.id],
			name: "college_admins_college_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "college_admins_created_by_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.deactivatedBy],
			foreignColumns: [users.id],
			name: "college_admins_deactivated_by_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "college_admins_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.userId, table.collegeId], name: "college_admins_pkey"}),
]);
