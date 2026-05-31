import { pgEnum } from "drizzle-orm/pg-core";

export const overrideType = pgEnum(
	"override_type", [
		'rescheduled', 
		'teacher_swapped', 
		'relocated', 
		'cancelled', 
		'amended'
	]
);
