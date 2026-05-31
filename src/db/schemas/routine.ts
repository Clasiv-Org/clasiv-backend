import { boolean, index, pgTable, smallint, text, timestamp, unique, uuid, foreignKey, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { collegeCourses } from "./collegeCourse";

export const routines = pgTable("routines", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	collegeId: uuid("college_id").notNull(),
	courseId: uuid("course_id").notNull(),
	semester: smallint().notNull(),
	academicYear: smallint("academic_year").notNull(),
	label: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("routines_college_course_semester_year_idx").using("btree", table.collegeId.asc().nullsLast().op("int2_ops"), table.courseId.asc().nullsLast().op("int2_ops"), table.semester.asc().nullsLast().op("int2_ops"), table.academicYear.asc().nullsLast().op("int2_ops")).where(sql`(is_active = true)`),
	index("routines_college_id_idx").using("btree", table.collegeId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.collegeId, table.courseId],
			foreignColumns: [collegeCourses.collegeId, collegeCourses.courseId],
			name: "routines_college_id_course_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("routines_college_course_semester_year_key").on(table.collegeId, table.courseId, table.semester, table.academicYear),
	check("routines_academic_year_check", sql`academic_year > 2000`),
	check("routines_semester_check", sql`semester > 0`),
]);
