import { User } from "@/types/users";
import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

if(!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase credentials");
}

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

export const getUserById = async (id: string): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("get_user_by_id", {
        _user_id: id
    }).single();
};

export const getUsers = async (limit: number, offset: number): Promise<PostgrestSingleResponse<User[]>> => {
    return await supabase.rpc("get_users_paginated", {
		_limit: limit,
		_offset: offset
	});
}
