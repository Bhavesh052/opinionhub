"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { SurveyStatus } from "@prisma/client";
import { updateSurveyStatus } from "./survey";
export const getResponseCount = async (surveyId: string) => {
    try {
        const responseCount = await db.survey.findUnique({
            where: { id: surveyId },
            select: {
                limit: true,
                _count: {
                    select: { responses: true },
                },
            }
        });
        return responseCount;
    } catch (error) {
        logger.error(`Error occured while fetching response count ${error}`);
        return null;
    }
}

export const submitResponse = async (surveyId: string, answers: Record<string, any>) => {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "You must be logged in to submit." };
    }

    // Check if already submitted
    const existing = await db.response.findUnique({
        where: {
            surveyId_participantId: {
                surveyId,
                participantId: session.user.id
            }
        }
    });

    if (existing) {
        return { error: "You have already filled this survey." };
    }

    const responseCount = await getResponseCount(surveyId);
    if (responseCount?._count.responses == responseCount?.limit) {
        return { error: "Survey limit reached." };
    }


    try {
        await db.response.create({
            data: {
                surveyId,
                participantId: session.user.id!,
                data: answers,
            }
        })
        if ((responseCount?._count.responses as number) + 1 === responseCount?.limit) {
            await updateSurveyStatus(surveyId, SurveyStatus.COMPLETED);
        }
        revalidatePath(`/surveys/${surveyId}`);
        return { success: "Survey submitted successfully!" };

    } catch (e) {
        logger.error(e);
        return { error: "Failed to submit survey." };
    }
};


export const getSurveyResponses = async (surveyId: string) => {
    try {
        const responses = await db.response.findMany({
            where: {
                surveyId
            },
            select: {
                data: true
            }
        });
        return responses;
    } catch (error) {
        logger.error("Get Survey Responses Error", error);
        return [{ data: {} }]
    }
}

export const checkResponse = async (surveyId: string, participantId: string) => {
    try {
        const response = await db.response.findUnique({
            where: {
                surveyId_participantId: {
                    surveyId,
                    participantId
                }
            }
        });
        return response;
    } catch (error) {
        logger.error("Check response error", error);
        return null;
    }
}

export const getParticipantHistory = async () => {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const history = await db.response.findMany({
            where: {
                participantId: session.user.id
            },
            include: {
                survey: {
                    include: {
                        questions: {
                            orderBy: {
                                order: 'asc'
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { history };
    } catch (error) {
        logger.error("Get Participant History Error", error);
        return { error: "Failed to fetch history" };
    }
};