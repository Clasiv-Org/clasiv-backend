import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = process.env.SUPABASE_URL as string;
const SUPABASE_KEY  = process.env.SUPABASE_KEY as string;

if(!SUPABASE_URL)	throw new Error("Missing Supabase API URL!");
if(!SUPABASE_KEY)	throw new Error("Missing Supabase API Key!");

export const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_KEY
);
