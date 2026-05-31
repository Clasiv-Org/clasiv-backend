import { pgTable, foreignKey, unique, uuid, check, text, timestamp, index, date, time } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { dayOfWeek } from "./dayOfWeek";
import { overrideType } from "./overrideType";
import { routineEntries } from "./routineEntry";
import { teachers } from "./teacher";
import { users } from "./user";

export const routineOverrides = pgTable("routine_overrides", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	routineEntryId: uuid("routine_entry_id").notNull(),
	effectiveDate: date("effective_date").notNull(),
	overrideType: overrideType("override_type").notNull(),
	teacherId: uuid("teacher_id"),
	startTime: time("start_time"),
	endTime: time("end_time"),
	rescheduledDate: date("rescheduled_date"),
	rescheduledDay: dayOfWeek("rescheduled_day"),
	roomNumber: text("room_number"),
	reason: text(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("routine_overrides_effective_date_idx").using("btree", table.effectiveDate.asc().nullsLast().op("date_ops")),
	index("routine_overrides_expires_at_idx").using("btree", table.expiresAt.asc().nullsLast().op("timestamptz_ops")).where(sql`(expires_at IS NOT NULL)`),
	index("routine_overrides_rescheduled_date_idx").using("btree", table.rescheduledDate.asc().nullsLast().op("date_ops")).where(sql`(rescheduled_date IS NOT NULL)`),
	index("routine_overrides_teacher_id_idx").using("btree", table.teacherId.asc().nullsLast().op("uuid_ops")).where(sql`(teacher_id IS NOT NULL)`),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "routine_overrides_created_by_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.routineEntryId],
			foreignColumns: [routineEntries.id],
			name: "routine_overrides_routine_entry_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.userId],
			name: "routine_overrides_teacher_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	unique("routine_overrides_entry_date_key").on(table.routineEntryId, table.effectiveDate),
	check("routine_overrides_reschedule_day_date_check", sql`((rescheduled_date IS NULL) AND (rescheduled_day IS NULL)) OR ((rescheduled_date IS NOT NULL) AND (rescheduled_day IS NOT NULL))`),
	check("routine_overrides_time_check", sql`((start_time IS NULL) AND (end_time IS NULL)) OR ((start_time IS NOT NULL) AND (end_time IS NOT NULL) AND (start_time < end_time))`),
]);

