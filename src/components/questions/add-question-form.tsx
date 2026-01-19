"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addQuestion } from "@/actions/survey";
import { QuestionType } from "@prisma/client";

const QuestionSchema = z.object({
    text: z.string().min(1, "Question text is required"),
    type: z.nativeEnum(QuestionType),
    required: z.boolean(),
    optionsString: z.string().optional(),
});

export const AddQuestionForm = ({ surveyId }: { surveyId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();


    const form = useForm<z.infer<typeof QuestionSchema>>({
        resolver: zodResolver(QuestionSchema),
        defaultValues: {
            text: "",
            type: QuestionType.TEXT,
            required: true,
            optionsString: "",
        },
    });

    const type = form.watch("type");
    const isSelect = type === "SINGLE_SELECT" || type === "MULTI_SELECT";

    const onSubmit = (values: z.infer<typeof QuestionSchema>) => {
        const options = isSelect && values.optionsString
            ? values.optionsString.split(",").map(s => s.trim()).filter(Boolean)
            : undefined;

        startTransition(async () => {
            const result = await addQuestion({
                surveyId,
                text: values.text,
                type: values.type,
                required: values.required,
                options
            });

            if (result.success) {
                setIsOpen(false);
                form.reset();
                router.refresh(); // Ensure the new question appears
            } else {
                alert("Failed to add question");
            }
        });
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="w-full h-12 border-dashed" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
        );
    }

    return (
        <Card className="border-primary/20 bg-slate-50/50">
            <CardContent className="pt-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-primary">New Question</h3>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
                </div>

                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                            <Input
                                placeholder="What is your question?"
                                {...form.register("text")}
                                disabled={isPending}
                            />
                        </div>
                        <div>
                            <Select
                                onValueChange={(val) => form.setValue("type", val as QuestionType)}
                                defaultValue={type}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEXT">Short Text</SelectItem>
                                    <SelectItem value="LONG_TEXT">Long Text</SelectItem>
                                    <SelectItem value="SINGLE_SELECT">Single Select</SelectItem>
                                    <SelectItem value="MULTI_SELECT">Multi Select</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Options for select types */}
                    {isSelect && (
                        <div className="p-3 bg-white rounded border border-dashed">
                            <Label className="text-xs text-muted-foreground mb-1 block">Options (comma separated)</Label>
                            <Input
                                placeholder="Yes, No, Maybe"
                                {...form.register("optionsString")}
                                disabled={isPending}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="required"
                                checked={form.watch("required")}
                                onCheckedChange={(c) => form.setValue("required", c)}
                                disabled={isPending}
                            />
                            <Label htmlFor="required">Required</Label>
                        </div>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>Save Question</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
