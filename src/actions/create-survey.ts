"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { QuestionType } from "@prisma/client";
import { logger } from "@/lib/logger";

const QuestionSchema = z.object({
    text: z.string().min(1, "Question text is required"),
    type: z.nativeEnum(QuestionType),
    required: z.boolean().default(true),
    options: z.array(z.string()).optional(),
    order: z.number().int(),
});

const surveyStatus = z.enum(["DRAFT", "ACTIVE", "COMPLETED"]);

const CreateSurveySchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    questions: z.array(QuestionSchema),
    surveyStatus: surveyStatus.optional(),
    limit: z.number().int().optional(),
});

export const createSurvey = async (values: z.infer<typeof CreateSurveySchema>) => {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { error: "Unauthorized" };
    }

    const validatedFields = CreateSurveySchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { title, description, questions, surveyStatus, limit } = validatedFields.data;

    try {
        const survey = await db.survey.create({
            data: {
                title,
                description,
                creatorId: session.user.id,
                status: surveyStatus ?? "DRAFT",
                limit: limit ?? 0,
                questions: {
                    create: questions.map((q) => ({
                        text: q.text,
                        type: q.type,
                        required: q.required,
                        order: q.order,
                        options: q.options ?? undefined,
                    })),
                },
            },
        });

        return { success: "Survey created!", surveyId: survey.id };
    } catch (error) {
        logger.error("Failed to create survey:", error);
        return { error: "Something went wrong!" };
    }
};
