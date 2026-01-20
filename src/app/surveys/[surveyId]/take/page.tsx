import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import SurveyTaker from "@/components/survey-taker";
import { submitResponse } from "@/actions/response";

interface TakeSurveyPageProps {
    params: {
        surveyId: string;
    };
}

export default async function TakeSurveyPage({ params }: TakeSurveyPageProps) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const { surveyId } = await params;

    const survey = await db.survey.findUnique({
        where: {
            id: surveyId,
            status: "ACTIVE" // Only allow taking active surveys
        },
        include: {
            questions: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });

    if (!survey) {
        notFound();
    }

    // Check if user already responded
    const existingResponse = await db.response.findUnique({
        where: {
            surveyId_participantId: {
                surveyId: surveyId,
                participantId: session.user.id
            }
        }
    });

    if (existingResponse) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Already Responded</h2>
                    <p className="text-muted-foreground">You have already submitted a response for this survey.</p>
                    <a href="/dashboard" className="text-primary hover:underline">Back to Dashboard</a>
                </div>
            </div>
        );
    }

    const onSubmit = async (answers: Record<string, any>) => {
        "use server";
        return submitResponse(surveyId, answers);
    };

    return (
        <SurveyTaker
            survey={survey as any}
            onSubmit={onSubmit}
            onBack={async () => {
                "use server";
                redirect("/dashboard");
            }}
        />
    );
}
