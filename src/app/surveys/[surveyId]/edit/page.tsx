import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SurveyCreator from "@/components/survey-creator";
import { getSurvey } from "@/actions/survey";

export default async function SurveyEditPage({ params }: { params: { surveyId: string } }) {
    const session = await auth();
    if (!session?.user) redirect("/auth/login");
    const { surveyId } = await params;
    const survey = await getSurvey(surveyId);

    if (!survey || survey.creatorId !== session.user.id) {
        return <div className="p-8">Survey not found or unauthorized</div>;
    }

    return (
        <SurveyCreator initialData={survey} />
    );
}
