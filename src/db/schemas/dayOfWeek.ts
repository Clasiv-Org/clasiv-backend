import { pgEnum } from "drizzle-orm/pg-core";

export const dayOfWeek = pgEnum(
	"day_of_week", [
		'monday', 
		'tuesday', 
		'wednesday', 
		'thursday', 
		'friday', 
		'saturday', 
		'sunday'
	]
);
