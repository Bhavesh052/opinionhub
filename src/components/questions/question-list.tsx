"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteQuestion } from "@/actions/survey";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface QuestionListProps {
    surveyId: string;
    questions: any[];
}

export const QuestionList = ({ surveyId, questions }: QuestionListProps) => {
    return (
        <div className="space-y-4">
            {questions.map((q, index) => (
                <QuestionCard key={q.id} question={q} index={index} surveyId={surveyId} />
            ))}
            {questions.length === 0 && (
                <div className="text-center py-10 text-muted-foreground bg-white border rounded-lg">
                    No questions yet. Add one below!
                </div>
            )}
        </div>
    );
};

function QuestionCard({ question, index, surveyId }: { question: any, index: number, surveyId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onDelete = () => {
        if (!confirm("Are you sure?")) return;
        startTransition(async () => {
            await deleteQuestion(question.id, surveyId);
            // router.refresh(); // Action revalidates, but extra refresh ensures client state sync if needed
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-medium">
                    <span className="text-muted-foreground mr-2">{index + 1}.</span>
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </CardTitle>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={onDelete} disabled={isPending}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                {/* Preview of input type */}
                {question.type === "TEXT" && <div className="border-b border-dashed p-2 text-muted-foreground text-sm">Short text answer</div>}
                {question.type === "LONG_TEXT" && <div className="border-b border-dashed p-2 text-muted-foreground text-sm h-16">Long text answer</div>}
                {(question.type === "SINGLE_SELECT" || question.type === "MULTI_SELECT") && (
                    <div className="space-y-2">
                        {/* Ensure options is array */}
                        {Array.isArray(question.options) && question.options.map((opt: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-4 h-4 border ${question.type === 'SINGLE_SELECT' ? 'rounded-full' : 'rounded-sm'}`}></div>
                                <span className="text-sm">{opt}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
