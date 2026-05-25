import { AppError } from "@/utils/error";

const AUTH_RPC_ERRORS: Record<string, { statusCode: number; message: string }> = {
    USER_NOT_FOUND:          { statusCode: 404, message: "User not found"                  },
    USER_ALREADY_ACTIVATED:  { statusCode: 409, message: "User is already activated"       },
    EMAIL_ALREADY_TAKEN:     { statusCode: 409, message: "Email already taken"             },
    USERNAME_ALREADY_TAKEN:  { statusCode: 409, message: "Username already taken"          },
    TOKEN_NOT_FOUND:         { statusCode: 404, message: "Refresh token not found"         },
    TOKEN_REVOKED:           { statusCode: 401, message: "Refresh token has been revoked"  },
    TOKEN_REUSE_DETECTED:    { statusCode: 401, message: "Token reuse detected"            },
    TOKEN_EXPIRED:           { statusCode: 401, message: "Refresh token expired"           },
    NEW_TOKEN_NOT_FOUND:     { statusCode: 500, message: "Failed to update refresh token"  },
    IDENTIFIER_REQUIRED:     { statusCode: 400, message: "Username or email is required"   },
    AMBIGUOUS_IDENTIFIER:    { statusCode: 400, message: "Provide only one of username or email" },
    INTERNAL_ERROR:          { statusCode: 500, message: "Internal server error"           },
};

export function handleAuthRPCError(code: string | null): never {
    const error = code ? AUTH_RPC_ERRORS[code] : undefined;
    if(error) throw new AppError(error.message, error.statusCode);
    throw new AppError("Internal server error", 500);
}
