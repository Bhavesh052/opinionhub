"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateSurvey } from "@/actions/survey";
import { useTransition } from "react";

interface SurveyHeaderProps {
    survey: any;
}

export const SurveyHeader = ({ survey }: SurveyHeaderProps) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onPublish = () => {
        startTransition(async () => {
            const result = await updateSurvey({ id: survey.id, status: "ACTIVE" });
            if (result.error) {
                alert(result.error);
            } else {
                router.refresh();
            }
        });
    };

    const copyLink = () => {
        const link = `${window.location.origin}/surveys/${survey.id}`;
        navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="bg-white border-b sticky top-0 z-10 px-4 py-3 shadow-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold truncate max-w-[200px] sm:max-w-md">{survey.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className={`inline-block w-2 h-2 rounded-full ${survey.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            {survey.status === 'ACTIVE' ? "Published" : "Draft"}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {survey.status === 'DRAFT' && (
                        <Button variant="outline" size="sm" onClick={onPublish} disabled={isPending}>
                            <Globe className="mr-2 h-3 w-3" />
                            Publish
                        </Button>
                    )}
                    <Button size="sm" onClick={copyLink}>
                        <Share2 className="mr-2 h-3 w-3" /> Share
                    </Button>
                </div>
            </div>
        </div>
    );
}
