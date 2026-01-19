"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { submitResponse } from "@/actions/submit-survey";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SurveyFillFormProps {
    survey: any;
    userId: string;
}

export const SurveyFillForm = ({ survey, userId }: SurveyFillFormProps) => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleValueChange = (questionId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleMultiSelectChange = (questionId: string, option: string, checked: boolean) => {
        setAnswers(prev => {
            const current = prev[questionId] as string[] || [];
            if (checked) {
                return { ...prev, [questionId]: [...current, option] };
            } else {
                return { ...prev, [questionId]: current.filter(o => o !== option) };
            }
        });
    };

    const onSubmit = () => {
        // Basic Client Validation
        for (const q of survey.questions) {
            if (q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0))) {
                setError(`Question "${q.text}" is required.`);
                return;
            }
        }
        setError(null);

        startTransition(async () => {
            const result = await submitResponse(survey.id, answers);
            if (result.error) {
                setError(result.error);
            } else {
                setSubmitted(true);
            }
        });
    };

    if (submitted) {
        return (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
                <p className="text-muted-foreground text-lg">Your response has been recorded.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {survey.questions.map((q: any, index: number) => (
                <Card key={q.id} className="border-l-4 border-l-primary/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <Label className="text-lg font-medium mb-4 block">
                            <span className="text-muted-foreground mr-2">{index + 1}.</span>
                            {q.text}
                            {q.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>

                        {q.type === "TEXT" && (
                            <Input
                                placeholder="Your answer..."
                                onChange={(e) => handleValueChange(q.id, e.target.value)}
                                disabled={isPending}
                            />
                        )}

                        {q.type === "LONG_TEXT" && (
                            <Textarea
                                placeholder="Your answer..."
                                onChange={(e) => handleValueChange(q.id, e.target.value)}
                                disabled={isPending}
                            />
                        )}

                        {q.type === "SINGLE_SELECT" && q.options && (
                            <RadioGroup onValueChange={(val) => handleValueChange(q.id, val)} disabled={isPending}>
                                {q.options.map((opt: string, i: number) => (
                                    <div className="flex items-center space-x-2" key={i}>
                                        <RadioGroupItem value={opt} id={`${q.id}-${i}`} />
                                        <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {q.type === "MULTI_SELECT" && q.options && (
                            <div className="space-y-2">
                                {q.options.map((opt: string, i: number) => (
                                    <div className="flex items-center space-x-2" key={i}>
                                        <Checkbox
                                            id={`${q.id}-${i}`}
                                            onCheckedChange={(c) => handleMultiSelectChange(q.id, opt, c as boolean)}
                                            disabled={isPending}
                                        />
                                        <Label htmlFor={`${q.id}-${i}`} className="font-normal cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}

            {error && (
                <div className="p-4 bg-red-100/50 text-red-600 rounded-lg text-sm font-medium border border-red-200">
                    {error}
                </div>
            )}

            <Button size="lg" className="w-full md:w-auto px-8" onClick={onSubmit} disabled={isPending}>
                Submit Survey
            </Button>
        </div>
    );
};
