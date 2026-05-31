import { pgEnum } from "drizzle-orm/pg-core";

export const genderType = pgEnum(
	"gender_type", [
		'male', 
		'female', 
		'non_binary', 
		'prefer_not_to_say'
	]
);
