import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SurveyHeader } from "@/components/questions/survey-header";
import SurveyCreator from "@/components/survey-creator";

export default async function SurveyEditPage({ params }: { params: { surveyId: string } }) {
    const session = await auth();
    if (!session?.user) redirect("/auth/login");
    const { surveyId } = await params;
    const survey = await db.survey.findUnique({
        where: { id: surveyId },
        include: { questions: true }
    });

    if (!survey || survey.creatorId !== session.user.id) {
        return <div className="p-8">Survey not found or unauthorized</div>;
    }

    return (
        <SurveyCreator initialData={survey} />
    );
}
