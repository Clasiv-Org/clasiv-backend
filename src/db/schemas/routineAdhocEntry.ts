import { pgTable, foreignKey, index, primaryKey, timestamp, text, uuid, date, smallint, time, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { dayOfWeek } from "./dayOfWeek";
import { routines } from "./routine";
import { routineEntries } from "./routineEntry";
import { teachers } from "./teacher";

export const routineAdhocEntries = pgTable("routine_adhoc_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	routineId: uuid("routine_id").notNull(),
	collegeCourseSubjectId: uuid("college_course_subject_id"),
	teacherId: uuid("teacher_id"),
	date: date().notNull(),
	day: dayOfWeek().notNull(),
	periodNumber: smallint("period_number"),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	roomNumber: text("room_number"),
	reason: text(),
	replacesEntryId: uuid("replaces_entry_id"),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("routine_adhoc_entries_replaces_entry_id_idx").using("btree", table.replacesEntryId.asc().nullsLast().op("uuid_ops")).where(sql`(replaces_entry_id IS NOT NULL)`),
	index("routine_adhoc_entries_routine_id_date_idx").using("btree", table.routineId.asc().nullsLast().op("date_ops"), table.date.asc().nullsLast().op("date_ops")),
	index("routine_adhoc_entries_teacher_id_idx").using("btree", table.teacherId.asc().nullsLast().op("uuid_ops")).where(sql`(teacher_id IS NOT NULL)`),
	index("routine_adhoc_entries_time_range_idx").using("gist", sql`routine_id`, sql`tsrange((date + start_time), (date + end_time), '[)'::text)`),
	foreignKey({
			columns: [table.replacesEntryId],
			foreignColumns: [routineEntries.id],
			name: "routine_adhoc_entries_replaces_entry_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.routineId],
			foreignColumns: [routines.id],
			name: "routine_adhoc_entries_routine_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.userId],
			name: "routine_adhoc_entries_teacher_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	check("routine_adhoc_entries_time_check", sql`start_time < end_time`),
]);
