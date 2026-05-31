import { pgTable, foreignKey, primaryKey, text, uuid, smallint, time, index, unique, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { dayOfWeek } from "./dayOfWeek";
import { teachers } from "./teacher";
import { collegeCourseSubjects } from "./collegeCourseSubject";
import { routines } from "./routine";

export const routineEntries = pgTable("routine_entries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	routineId: uuid("routine_id").notNull(),
	collegeCourseSubjectId: uuid("college_course_subject_id").notNull(),
	teacherId: uuid("teacher_id"),
	day: dayOfWeek().notNull(),
	periodNumber: smallint("period_number").notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	roomNumber: text("room_number"),
}, (table) => [
	index("routine_entries_college_course_subject_id_idx").using("btree", table.collegeCourseSubjectId.asc().nullsLast().op("uuid_ops")),
	index("routine_entries_routine_id_day_idx").using("btree", table.routineId.asc().nullsLast().op("uuid_ops"), table.day.asc().nullsLast().op("uuid_ops")),
	index("routine_entries_routine_id_idx").using("btree", table.routineId.asc().nullsLast().op("uuid_ops")),
	index("routine_entries_teacher_id_idx").using("btree", table.teacherId.asc().nullsLast().op("uuid_ops")).where(sql`(teacher_id IS NOT NULL)`),
	foreignKey({
			columns: [table.collegeCourseSubjectId],
			foreignColumns: [collegeCourseSubjects.id],
			name: "routine_entries_college_course_subject_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.routineId],
			foreignColumns: [routines.id],
			name: "routine_entries_routine_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.userId],
			name: "routine_entries_teacher_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	unique("routine_entries_routine_day_period_key").on(table.routineId, table.day, table.periodNumber),
	check("routine_entries_period_check", sql`period_number > 0`),
	check("routine_entries_time_check", sql`start_time < end_time`),
]);
