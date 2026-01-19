"use server";

import * as z from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { QuestionType, SurveyStatus } from "@prisma/client";
import { logger } from "@/lib/logger";

const UpdateSurveySchema = z.object({
    id: z.string(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
    status: z.nativeEnum(SurveyStatus).optional(),
});

export const updateSurvey = async (values: z.infer<typeof UpdateSurveySchema>) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        // If trying to publish (set to ACTIVE), verify questions exist
        if (values.status === SurveyStatus.ACTIVE) {
            const questionCount = await db.question.count({
                where: { surveyId: values.id }
            });

            if (questionCount === 0) {
                return { error: "Cannot publish a survey with no questions" };
            }
        }

        await db.survey.update({
            where: { id: values.id, creatorId: session.user.id },
            data: { ...values }
        });
        revalidatePath(`/surveys/${values.id}/edit`);
        revalidatePath(`/surveys/${values.id}`);
        revalidatePath("/dashboard");
        return { success: "Survey updated" };
    } catch (e) {
        return { error: "Failed to update survey" };
    }
};

const QuestionSchema = z.object({
    surveyId: z.string(),
    type: z.nativeEnum(QuestionType),
    text: z.string().min(1, "Question text required"),
    options: z.array(z.string()).optional(), // For selects
    required: z.boolean().default(true),
});

export const addQuestion = async (values: z.infer<typeof QuestionSchema>) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const survey = await db.survey.findUnique({
        where: { id: values.surveyId, creatorId: session.user.id }
    });

    if (!survey) return { error: "Survey not found" };

    try {
        await db.question.create({
            data: {
                surveyId: values.surveyId,
                type: values.type,
                text: values.text,
                options: values.options ? values.options : undefined,
                required: values.required,
            }
        });
        revalidatePath(`/surveys/${values.surveyId}/edit`);
        return { success: "Question added" };
    } catch (e) {
        return { error: "Failed to add question" };
    }
};

export const deleteQuestion = async (questionId: string, surveyId: string) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const question = await db.question.findUnique({
        where: { id: questionId },
        include: { survey: true }
    });

    if (!question || question.survey.creatorId !== session.user.id) {
        return { error: "Unauthorized" };
    }

    await db.question.delete({ where: { id: questionId } });
    revalidatePath(`/surveys/${surveyId}/edit`);
    return { success: "Question deleted" };
}


export const deleteSurvey = async (surveyId: string) => {
    try {
        await db.survey.delete({ where: { id: surveyId } });
        revalidatePath(`/surveys/${surveyId}/edit`);
        return { success: "Survey deleted" };
    } catch (error) {

    }
}

const QuestionUpdateSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1, "Question text is required"),
    type: z.nativeEnum(QuestionType),
    required: z.boolean().default(true),
    options: z.array(z.string()).optional(),
    order: z.number().int(),
});

const UpdateSurveyFullSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    limit: z.number().int().optional(),
    status: z.nativeEnum(SurveyStatus).optional(),
    questions: z.array(QuestionUpdateSchema),
});

export const updateSurveyFull = async (values: z.infer<typeof UpdateSurveyFullSchema>) => {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const { id, questions, ...surveyData } = values;

    const existingSurvey = await db.survey.findUnique({
        where: { id, creatorId: session.user.id },
        include: { questions: true }
    });

    if (!existingSurvey) return { error: "Survey not found or unauthorized" };

    try {
        await db.$transaction(async (tx) => {
            // 1. Update Survey Details
            await tx.survey.update({
                where: { id },
                data: { ...surveyData }
            });

            // 2. Handle Questions
            // Identify IDs to keep
            const incomingIds = questions
                .map(q => q.id)
                .filter((id): id is string => !!id);

            // Delete questions that are no longer present
            const toDelete = existingSurvey.questions
                .filter(q => !incomingIds.includes(q.id))
                .map(q => q.id);

            if (toDelete.length > 0) {
                await tx.question.deleteMany({
                    where: { id: { in: toDelete } }
                });
            }

            // Upsert questions
            for (const q of questions) {
                if (q.id && existingSurvey.questions.find(eq => eq.id === q.id)) {
                    // Update
                    await tx.question.update({
                        where: { id: q.id },
                        data: {
                            text: q.text,
                            type: q.type,
                            required: q.required,
                            options: q.options ?? undefined,
                            order: q.order,
                        }
                    });
                } else {
                    await tx.question.create({
                        data: {
                            surveyId: id,
                            text: q.text,
                            type: q.type,
                            required: q.required,
                            options: q.options ?? undefined,
                            order: q.order,
                        }
                    });
                }
            }
        });

        revalidatePath(`/surveys/${id}/edit`);
        revalidatePath(`/surveys/${id}`);
        revalidatePath("/dashboard");
        return { success: "Survey updated successfully!" };

    } catch (e) {
        logger.error("Update Full Error", e);
        return { error: "Failed to update survey" };
    }
};

export const getSurvey = async (surveyId: string) => {
    try {
         const survey = await db.survey.findUnique({
        where: { id: surveyId },
        include: { questions:true } 
    });
    return survey;
    } catch (error) {
        logger.error("Get Survey Error", error);
        return null;
    }
}
 