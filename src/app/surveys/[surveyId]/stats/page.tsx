import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AnalyticsView } from "@/components/analytics/stats-view";
import { SurveyHeader } from "@/components/questions/survey-header";

export default async function StatsPage({ params }: { params: { surveyId: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }
    const { surveyId } = await params;

    const survey = await db.survey.findUnique({
        where: { id: surveyId },
        include: { questions:true } 
    });

    if (!survey || survey.creatorId !== session.user.id) {
        return <div className="p-8">Unauthorized or not found</div>;
    }

    // Fetch all answers for this survey (from all responses)
    // We can join Response -> Answer
    const answers = await db.response.findMany({
        where: {
            surveyId
        },
        select:{
            data:true
        }
    });
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <SurveyHeader survey={survey} />
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                <h2 className="text-2xl font-bold">Results & Analytics</h2>
                <AnalyticsView questions={survey.questions} answers={answers.map(a => a.data)} />
            </div>
        </div>
    );
}
