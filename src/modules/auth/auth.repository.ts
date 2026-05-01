import type { 
	CreateOtpSession, 
	UpdateOtpSession, 
} from "@/types/otp";
import db from "@/config/db";
import { eq, getTableColumns, sql } from "drizzle-orm";
import type { 
	ActivationCompleteRPCPayload, 
	LoginRPCPayload, 
    UpdateActivationSession
} from "@/types/auth";
import { UserProfileSchema, type UserProfile } from "@/types/users";
import { 
	activationSessions, 
	otpSessions, 
	refreshTokens, 
	users 
} from "@/db/schemas";

export { getUserById } from "@/db/queries/getUserById";
export { getUserByUserName } from "@/db/queries/getUserByUserName";
export { getUserByEmail } from "@/db/queries/getUserByEmail";
export { getUserByFullName } from "@/db/queries/getUserByFullName";
export { getUserProfile } from "@/db/queries/getUserProfile";

export const createActivationSession = async (userId: string) => {
	const result = await db
        .insert(activationSessions)
        .values({
            userId: userId
        })
        .returning();

    return result[0] ?? null;
}

export const getActivationSession = async (sessionId: string) => {
    const result = await db
        .select({
			...getTableColumns(activationSessions),
			userFullName: users.fullName
		})
        .from(activationSessions)
		.innerJoin(users, eq(activationSessions.userId, users.id))
        .where(eq(activationSessions.id, sessionId));

    return result[0] ?? null;
}

export const updateActivationSession = async (sessionId: string, updates: UpdateActivationSession) => {
	const result = await db
        .update(activationSessions)
        .set({
			...updates,
			updatedAt: new Date().toISOString()
		})
        .where(eq(activationSessions.id, sessionId))
        .returning();

    return result[0] ?? null;
}

export const createOtpSession = async (otp: CreateOtpSession) => {
    const result = await db
        .insert(otpSessions)
        .values({
			...otp
		})
        .returning();

    return result[0] ?? null;
}

export const updateOtpSession = async (sessionId: string, updates: UpdateOtpSession) => {
	const result = await db
		.update(otpSessions)
		.set({
			...updates,
			updatedAt: new Date().toISOString()
		})
		.where(eq(otpSessions.id, sessionId))
		.returning();

    return result[0] ?? null;
}

export const getOtpSession = async (sessionId: string) => {
    const result = await db
		.select()
        .from(otpSessions)
        .innerJoin(users, eq(otpSessions.userId, users.id))
		.where(eq(otpSessions.id, sessionId));

    return result[0] ?? null;
}

export const deleteOtpSession = async (sessionId: string) => {
	const result = await db
		.delete(otpSessions)
		.where(eq(otpSessions.id, sessionId))
		.returning();

    return result[0] ?? null;
};

export const setupUser = async (data: ActivationCompleteRPCPayload): Promise<UserProfile> => {
	const result = await db.execute(sql`
		select activate_user_and_get_user_profile(
			${data.userId}, 
			${data.emailId}, 
			${data.passwordHash}, 
            ${data.refreshTokenHash},
			${data.userName ?? null}, 
			${data.phoneNo ?? null}
		);
	`);
	const raw = result.rows[0]?.activate_user_and_get_user_profile;
	return UserProfileSchema.parse(raw);
}

export const loginUser = async (data: LoginRPCPayload): Promise<UserProfile> => {
	const result = await db.execute(sql`
		select login_user_and_get_user_profile(
            ${data.refreshTokenHash},
			${data.userName ?? null}, 
			${data.emailId ?? null}
		);
	`);
	const raw = result.rows[0]?.login_user_and_get_user_profile;
	return UserProfileSchema.parse(raw);
}

export const getRefreshToken = async (userId: string) => {
    const result = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.userId, userId));

    return result[0] ?? null;
}

export const updateRefreshToken = async (userId: string, refreshTokenHash: string) => {
    const result = await db.execute(sql`
        select update_refresh_token_and_get_user_profile(
            ${userId}, 
			${refreshTokenHash}
        );
    `);
    const raw = result.rows[0]?.update_refresh_token_and_get_user_profile;
    return raw;
}
