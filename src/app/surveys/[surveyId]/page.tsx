import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SurveyFillForm } from "@/components/survey/survey-fill-form";
import { Navbar } from "@/components/layout/navbar";
import { getSurvey } from "@/actions/survey";
import { checkResponse } from "@/actions/response";

export default async function SurveyPage({ params }: { params: { surveyId: string } }) {
    const session = await auth();
    if (!session?.user) {
        redirect(`/auth/login?callbackUrl=/surveys/${params.surveyId}`);
    }
    const { surveyId } = await params;
    const survey = await getSurvey(surveyId);

    if (!survey || survey.status !== "ACTIVE") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <Navbar />
                <h1 className="text-2xl font-bold text-muted-foreground">Survey Not Found or Inactive</h1>
                <p className="mt-2 text-gray-500">This survey does not exist or has been closed by the owner.</p>
            </div>
        );
    }

    // Check if already submitted
    const existingResponse = await checkResponse(surveyId, session.user.id!);

    if (existingResponse) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-24 max-w-2xl mx-auto px-4 text-center">
                    <div className="bg-white p-8 rounded-xl shadow-sm border">
                        <h2 className="text-2xl font-bold mb-4">You&apos;ve already completed this survey</h2>
                        <p className="text-muted-foreground">Thank you for your response.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-20 max-w-2xl mx-auto px-4">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{survey.title}</h1>
                    {survey.description && <p className="text-lg text-muted-foreground">{survey.description}</p>}
                </div>

                <SurveyFillForm survey={survey} userId={session.user.id!} />
            </div>
        </div>
    );
}
