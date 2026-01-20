import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getParticipantHistory } from "@/actions/response";
import { HistoryShell } from "@/components/history/history-shell";

export default async function HistoryPage() {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        redirect("/auth/login");
    }

    // Only participants should see history (surveyors have their own analytics)
    //@ts-ignore
    if (session.user.role === "SURVEYOR") {
        redirect("/dashboard");
    }

    const { history, error } = await getParticipantHistory();

    if (error || !history) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">Error</h2>
                    <p className="text-muted-foreground">{error || "Failed to load history"}</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
            <HistoryShell history={history} />
        </main>
    );
}
