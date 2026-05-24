// REFERENCE: @/types/users.ts [UserSafe]
/**
 * @swagger
 * components:
 *   schemas:
 *     UserSafe:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: John Doe
 *         userName:
 *           type: string
 *           nullable: true
 *           example: johndoe
 *         emailId:
 *           type: string
 *           nullable: true
 *           example: john@example.com
 *         phoneNo:
 *           type: string
 *           nullable: true
 *           example: "+919903645570"
 *         baseRole:
 *           type: number
 *           example: 1
 *         createdAt:
 *           type: string
 *           nullable: true
 *           example: "2026-05-23T15:18:40.298Z"
 *         modifiedAt:
 *           type: string
 *           nullable: true
 *           example: "2026-05-23T15:18:40.298Z"
 *         activatedAt:
 *           type: string
 *           nullable: true
 *           example: null
 *         lastLoginAt:
 *           type: string
 *           nullable: true
 *           example: null
 */

// REFERENCE: @/types/users.ts [UserProfileSafe]
/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileSafe:
 *       type: object
 *       properties:
 *         userName:
 *           type: string
 *           nullable: true
 *           example: user_1234
 *         fullName:
 *           type: string
 *           example: John Doe
 *         emailId:
 *           type: string
 *           nullable: true
 *           example: john@example.com
 *         phoneNo:
 *           type: string
 *           nullable: true
 *           example: "1234567890"
 *         baseRole:
 *           type: string
 *           example: student
 *         extentionRoles:
 *           type: array
 *           items:
 *             type: string
 *           example: [class_rep]
 *         createdAt:
 *           type: string
 *           nullable: true
 *           example: "2024-01-01T00:00:00.000Z"
 *         modifiedAt:
 *           type: string
 *           nullable: true
 *           example: "2024-01-01T00:00:00.000Z"
 *         activatedAt:
 *           type: string
 *           nullable: true
 *           example: "2024-01-01T00:00:00.000Z"
 *         lastLoginAt:
 *           type: string
 *           nullable: true
 *           example: "2024-01-01T00:00:00.000Z"
 *         profile:
 *           oneOf:
 *             - $ref: '#/components/schemas/StudentProfile'
 *             - $ref: '#/components/schemas/TeacherProfile'
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: [read:profile, update:profile]
 */

// REFERENCE: @/types/users.ts [StudentProfile]
/**
 * @swagger
 * components:
 *   schemas:
 *     StudentProfile:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [student]
 *         data:
 *           type: object
 *           properties:
 *             dob:
 *               type: string
 *               nullable: true
 *               example: "2000-01-01"
 *             enrollments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   university:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   college:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   department:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   course:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   hod:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   admissionYear:
 *                     type: number
 *                     example: 2021
 *                   graduationYear:
 *                     type: number
 *                     nullable: true
 *                     example: 2025
 *                   currentSemester:
 *                     type: number
 *                     example: 4
 *                   rollNo:
 *                     type: string
 *                     example: "21CS001"
 *                   regNo:
 *                     type: string
 *                     example: "2021CS001XXXX"
 */

// REFERENCE: @/types/users.ts [TeacherProfile]
/**
 * @swagger
 * components:
 *   schemas:
 *     TeacherProfile:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [teacher]
 *         data:
 *           type: object
 *           properties:
 *             abbrv:
 *               type: string
 *               example: DR.JD
 *             employments:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   university:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   college:
 *                     $ref: '#/components/schemas/AbbrEntity'
 *                   departments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Computer Science
 *                         abbrv:
 *                           type: string
 *                           example: CS
 *                         isHod:
 *                           type: boolean
 *                           example: false
 */

// REFERENCE: @/types/users.ts [AbbrEntity]
/**
 * @swagger
 * components:
 *   schemas:
 *     AbbrEntity:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Example University
 *         abbrv:
 *           type: string
 *           example: EU
 */
