import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getUserRole } from "@/actions/user";

export default async function DashboardPage() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        redirect("/auth/login");
    }

    const userWithDemographics = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, demographics: true }
    });

    if (!userWithDemographics) redirect("/auth/login");

    const isSurveyor = userWithDemographics.role === "SURVEYOR";
    const isAdmin = userWithDemographics.role === "ADMIN";
    const userDemographics = (userWithDemographics.demographics as any) || {};

    if (isAdmin) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>
                <AdminDashboard />
            </div>
        );
    }

    const calculateAge = (dob: string) => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const userAge = calculateAge(userDemographics.dob);

    let surveys = [];

    if (isSurveyor) {
        surveys = await db.survey.findMany({
            where: { creatorId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { responses: true } } }
        });
    } else {
        const answeredSurveyIds = await db.response.findMany({
            where: { participantId: session.user.id },
            select: { surveyId: true }
        }).then(responses => responses.map(r => r.surveyId));

        const allSurveys = await db.survey.findMany({
            where: {
                status: "ACTIVE",
                id: { notIn: answeredSurveyIds }
            },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { responses: true } } }
        });

        surveys = allSurveys.filter(survey => {
            const targeting = (survey.targeting as any) || {};

            // Check gender
            if (targeting.gender && targeting.gender !== 'ALL') {
                if (userDemographics.gender !== targeting.gender) return false;
            }

            // Check age
            if (targeting.minAge) {
                if (userAge < targeting.minAge) return false;
            }

            if (targeting.minAnnualIncome) {
                if (userDemographics.annualIncome < targeting.minAnnualIncome) return false;
            }

            return true;
        });
    }

    const totalSurveys = surveys.length;
    const totalResponses = surveys.reduce((acc, survey) => acc + (survey._count?.responses || 0), 0);
    const activeSurveys = surveys.filter(s => s.status === 'ACTIVE').length;

    const stats = {
        totalSurveys,
        totalResponses,
        activeSurveys
    };

    return (
        <Dashboard
            surveys={surveys}
            stats={stats}
            isSurveyor={isSurveyor}
        />
    );
}
