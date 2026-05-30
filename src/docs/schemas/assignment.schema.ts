/**
 * @swagger
 * components:
 *   schemas:
 *     AssignedBy:
 *       type: object
 *       nullable: true
 *       properties:
 *         userName:
 *           type: string
 *           nullable: true
 *         fullName:
 *           type: string
 *         baseRole:
 *           type: string
 *         extentionRoles:
 *           type: array
 *           items:
 *             type: string
 *
 *     Subject:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *
 *     College:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         abbrv:
 *           type: string
 *
 *     Course:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         abbrv:
 *           type: string
 *
 *     Assignment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         assignedBy:
 *           $ref: '#/components/schemas/AssignedBy'
 *         college:
 *           $ref: '#/components/schemas/College'
 *         subject:
 *           $ref: '#/components/schemas/Subject'
 *         course:
 *           $ref: '#/components/schemas/Course'
 *         maxMarks:
 *           type: number
 *           nullable: true
 *         attachmentUrl:
 *           type: string
 *           nullable: true
 *         filePattern:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         dueAt:
 *           type: string
 *           format: date-time
 *         expiresAt:
 *           type: string
 *           format: date-time
 *
 *     FilePattern:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *
 *     UploadCredentials:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Presigned S3 URL for file upload
 */
