import { pgTable, timestamp, text, uuid, date, unique, index, check, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { routines } from "./routine";
import { users } from "./user";

export const routineHolidays = pgTable("routine_holidays", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	routineId: uuid("routine_id").notNull(),
	fromDate: date("from_date").notNull(),
	toDate: date("to_date").notNull(),
	reason: text(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("routine_holidays_routine_date_range_idx").using("gist", sql`routine_id`, sql`daterange(from_date, to_date, '[]'::text)`),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "routine_holidays_created_by_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.routineId],
			foreignColumns: [routines.id],
			name: "routine_holidays_routine_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	unique("routine_holidays_no_overlap_key").on(table.routineId, table.fromDate, table.toDate),
	check("routine_holidays_date_range_check", sql`from_date <= to_date`),
]);
