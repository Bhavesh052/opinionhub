import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Dashboard from "@/components/dashboard";
import { getUserRole } from "@/actions/user";

export default async function DashboardPage() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        redirect("/auth/login");
    }

    const user = await getUserRole(session.user.id);

    if (!user) redirect("/auth/login");

    const isSurveyor = user.role === "SURVEYOR";

    let surveys = [];

    if (isSurveyor) {
        surveys = await db.survey.findMany({
            where: { creatorId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { responses: true } } }
        });
    } else {
        surveys = await db.survey.findMany({
            where: { status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { responses: true } } }
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
