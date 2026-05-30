import { Router } from "express";
import * as assignmentController from "@/modules/assignments/assignments.controller";
import authentication from "@/middleware/global.authentication";
import validator from "@/middleware/global.validator";
import { 
    CreateAssignmentSchema,
    UploadSubmissionSchema
} from "@/types/assignments";

const router = Router();

router.use(authentication);

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     tags: [Assignments]
 *     summary: Create a new assignment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, collegeCourseSubjectId, dueAt, expiresAt]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: Assignment 1
 *               description:
 *                 type: string
 *                 example: Assignment description
 *               collegeCourseSubjectId:
 *                 type: string
 *                 format: uuid
 *               maxMarks:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               attachmentUrl:
 *                 type: string
 *                 format: uri
 *               dueAt:
 *                 type: string
 *                 format: date-time
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Must be after dueAt
 *               filePattern:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 example: [1, 2]
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignment created successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 assignment:
 *                   $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       403:
 *         description: Forbidden - insufficient role or permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 */
router.post("/", 
    validator(CreateAssignmentSchema),
    assignmentController.createAssignment
);

/**
 * @swagger
 * /assignments:
 *   get:
 *     tags: [Assignments]
 *     summary: Get all assignments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignments found successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 assignments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 */
router.get("/", 
    assignmentController.getAssignments
);

/**
 * @swagger
 * /assignments/file-patterns:
 *   get:
 *     tags: [Assignments]
 *     summary: Get available file patterns
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of file patterns
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File patterns found successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 filePatterns:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FilePattern'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       500:
 *         description: Failed to get file patterns
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 */
router.get("/file-patterns", 
	assignmentController.getFilePatterns
);

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     tags: [Assignments]
 *     summary: Get a single assignment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assignment UUID
 *     responses:
 *       200:
 *         description: Assignment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignment found successfully!
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 assignment:
 *                   $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 */
router.get("/:id", 
    assignmentController.getAssignment
);

/**
 * @swagger
 * /assignments/{id}/submissions:
 *   post:
 *     tags: [Assignments]
 *     summary: Initiate an assignment submission and get a presigned S3 upload URL
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assignment UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fileSize]
 *             properties:
 *               fileSize:
 *                 type: integer
 *                 minimum: 1
 *                 description: File size in bytes
 *                 example: 204800
 *     responses:
 *       201:
 *         description: Submission initiated, presigned URL returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Submission initiated successfully
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 upload:
 *                   $ref: '#/components/schemas/UploadCredentials'
 *                 submissionLogId:
 *                   type: string
 *                   format: uuid
 *                   description: Use this to confirm upload completion
 *                 expiresIn:
 *                   type: number
 *                   example: 180
 *                   description: Presigned URL expiry in seconds
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       403:
 *         description: User is not a student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 *       500:
 *         description: Failed to generate submission key or upload log
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppError'
 */
router.post("/:id/submissions",
    validator(UploadSubmissionSchema),
	assignmentController.createSubmission
);

export default router;
