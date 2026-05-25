import { AppError } from "@/utils/error";

const ASSIGNMENT_RPC_ERRORS: Record<string, { statusCode: number; message: string }> = {
    COLLEGE_COURSE_SUBJECT_NOT_FOUND: { statusCode: 404, message: "Subject not found"			 },
    SUBJECT_NOT_ACTIVE:               { statusCode: 422, message: "Subject is not active"        },
    USER_NOT_FOUND:                   { statusCode: 404, message: "User not found"               },
    COLLEGE_SCOPE_MISMATCH:           { statusCode: 403, message: "College scope mismatch"       },
    SUBJECT_ACCESS_DENIED:            { statusCode: 403, message: "Subject access denied"        },
    UNAUTHORIZED:                     { statusCode: 403, message: "Unauthorized"                 },
    ASSIGNMENT_ALREADY_EXISTS:        { statusCode: 409, message: "Assignment already exists"    },
    INVALID_EXPIRY_DATE:              { statusCode: 422, message: "expiresAt must be after dueAt"},
    ASSIGNMENT_NOT_FOUND:             { statusCode: 404, message: "Assignment not found"         },
    INTERNAL_ERROR:                   { statusCode: 500, message: "Internal server error"        },
};

export function handleAssignmentRPCError(code: string | null): never {
    const error = code ? ASSIGNMENT_RPC_ERRORS[code] : undefined;
    if(error) {
        throw new AppError(error.message, error.statusCode);
    }
    throw new AppError("Internal server error", 500);
}
