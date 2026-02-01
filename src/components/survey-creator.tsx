'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Trash2, Eye, Save, Loader2, Send } from 'lucide-react'
import { createSurvey } from '@/actions/create-survey'
import { updateSurveyFull } from '@/actions/survey'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Question {
    id: string
    type: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'TEXT' | 'LONG_TEXT'
    text: string
    options?: string[]
    required: boolean
    order: number
}
interface SurveyCreatorProps {
    onBack?: () => void
    initialData?: {
        id: string
        title: string
        description?: string | null
        limit?: number
        questions: any[]
        status: string
    }
}

export default function SurveyCreator({ onBack, initialData }: SurveyCreatorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [title, setTitle] = useState(initialData?.title || 'My Survey')
    const [limit, setLimit] = useState(initialData?.limit || 10)
    const [description, setDescription] = useState(initialData?.description || '')
    const [questions, setQuestions] = useState<Question[]>(
        initialData?.questions
            ? initialData.questions.map((q: any, i: number) => ({
                id: q.id,
                type: q.type,
                text: q.text,
                options: Array.isArray(q.options) ? q.options : [],
                required: q.required,
                order: q.order ?? i,
            }))
            : [{
                id: '1',
                type: 'SINGLE_SELECT',
                text: 'Example question?',
                options: ['Option A', 'Option B', 'Option C'],
                required: true,
                order: 0,
            }]
    )
    const [previewMode, setPreviewMode] = useState(false)
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>('1')

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    }

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            type: 'TEXT',
            text: 'New question',
            required: true,
            order: questions.length,
        }
        setQuestions([...questions, newQuestion])
        setSelectedQuestionId(newQuestion.id)
    }

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter((q) => q.id !== id))
        setSelectedQuestionId(null)
    }

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(
            questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
        )
    }

    const validateSurvey = () => {
        if (!title.trim()) {
            toast.error("Survey title is required");
            return false;
        }

        if (questions.length === 0) {
            toast.error("At least one question is required");
            return false;
        }

        for (const [index, question] of questions.entries()) {
            if (!question.text.trim()) {
                toast.error(`Question ${index + 1} text is required`);
                setSelectedQuestionId(question.id);
                return false;
            }

            if (['SINGLE_SELECT', 'MULTI_SELECT'].includes(question.type)) {
                if (!question.options || question.options.length === 0) {
                    toast.error(`Question ${index + 1} must have at least one option`);
                    setSelectedQuestionId(question.id);
                    return false;
                }

                for (const [optIndex, option] of question.options.entries()) {
                    if (!option.trim()) {
                        toast.error(`Option ${optIndex + 1} in question ${index + 1} cannot be empty`);
                        setSelectedQuestionId(question.id);
                        return false;
                    }
                }
            }
        }

        return true;
    }

    const handleSave = () => {
        if (!validateSurvey()) return;
        startTransition(async () => {
            const payloadQuestions = questions.map((q, index) => ({
                id: initialData?.questions.some((iq: any) => iq.id === q.id) ? q.id : undefined,
                text: q.text,
                type: q.type,
                required: q.required,
                options: (q.type === 'SINGLE_SELECT' || q.type === 'MULTI_SELECT') ? q.options : undefined,
                order: index,
            }));

            if (initialData) {
                const result = await updateSurveyFull({
                    id: initialData.id,
                    title,
                    description,
                    limit,
                    status: "DRAFT",
                    questions: payloadQuestions,
                });
                if (result.error) {
                    toast.error(result.error);
                    return;
                }
                toast.success("Survey updated as draft!");
            } else {
                const result = await createSurvey({
                    title,
                    surveyStatus: "DRAFT",
                    description,
                    limit,
                    questions: payloadQuestions,
                });
                if (result.error) {
                    toast.error(result.error);
                    return;
                }
                toast.success("Survey saved as draft!");
            }
            router.push('/dashboard');
        });
    };

    const handlePublish = () => {
        if (!validateSurvey()) return;
        startTransition(async () => {
            const payloadQuestions = questions.map((q, index) => ({
                id: initialData?.questions.some((iq: any) => iq.id === q.id) ? q.id : undefined,
                text: q.text,
                type: q.type,
                required: q.required,
                options: (q.type === 'SINGLE_SELECT' || q.type === 'MULTI_SELECT') ? q.options : undefined,
                order: index,
            }));

            if (initialData) {
                const result = await updateSurveyFull({
                    id: initialData.id,
                    title,
                    description,
                    limit,
                    status: "ACTIVE",
                    questions: payloadQuestions,
                });
                if (result.error) {
                    toast.error(result.error);
                    return;
                }
                toast.success("Survey updated and published!");
            } else {
                const result = await createSurvey({
                    title,
                    surveyStatus: "ACTIVE",
                    description,
                    limit,
                    questions: payloadQuestions,
                });
                if (result.error) {
                    toast.error(result.error);
                    return;
                }
                toast.success("Survey published successfully!");
            }
            router.push('/dashboard');
        });
    };

    const selectedQuestion = questions.find((q) => q.id === selectedQuestionId)

    if (previewMode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
                <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                            <Button variant="outline" onClick={() => setPreviewMode(false)}>
                                Edit
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                    <Card className="p-8 bg-card">
                        {description && (
                            <p className="text-muted-foreground mb-8">{description}</p>
                        )}

                        <form className="space-y-8">
                            {questions.map((question, index) => (
                                <div key={question.id} className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <span className="text-sm font-semibold text-muted-foreground mt-2">
                                            {index + 1}.
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-foreground">
                                                {question.text}
                                                {question.required && (
                                                    <span className="text-destructive ml-1">*</span>
                                                )}
                                            </p>

                                            {question.type === 'SINGLE_SELECT' && (
                                                <div className="mt-3 space-y-2">
                                                    {question.options?.map((option, i) => (
                                                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`q${question.id}`}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm text-foreground">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {question.type === 'MULTI_SELECT' && (
                                                <div className="mt-3 space-y-2">
                                                    {question.options?.map((option, i) => (
                                                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                name={`q${question.id}`}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm text-foreground">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}

                                            {question.type === 'TEXT' && (
                                                <input
                                                    type="text"
                                                    placeholder="Your answer"
                                                    className="mt-3 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
                                                    disabled
                                                />
                                            )}

                                            {question.type === 'LONG_TEXT' && (
                                                <textarea
                                                    placeholder="Your answer"
                                                    className="mt-3 w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground"
                                                    rows={3}
                                                    disabled
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </form>
                    </Card>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <h1 className="text-2xl font-bold text-foreground">Create Survey</h1>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPreviewMode(true)}
                                className="gap-2"
                                disabled={isPending}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </Button>
                            {initialData?.status === "DRAFT" && (
                                <Button
                                    variant="outline"
                                    onClick={handleSave}
                                    className="gap-2"
                                    disabled={isPending}
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Draft
                            </Button>)}
                            <Button onClick={handlePublish} className="gap-2" disabled={isPending}>
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Publish
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left - Survey Details */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 bg-card sticky top-24">
                            <h2 className="font-semibold text-foreground mb-4">Survey Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1"
                                        disabled={isPending}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground">Limit</label>
                                    <Input
                                        value={limit}
                                        onChange={(e) => setLimit(Number(e.target.value))}
                                        className="mt-1"
                                        disabled={isPending}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground">Description</label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your survey..."
                                        className="mt-1"
                                        rows={3}
                                        disabled={isPending}
                                    />
                                </div>

                                <div className="pt-4 border-t border-border">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Questions: <span className="font-semibold text-foreground">{questions.length}</span>
                                    </p>
                                </div>

                                <Button onClick={addQuestion} className="w-full gap-2" disabled={isPending}>
                                    <Plus className="w-4 h-4" />
                                    Add Question
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right - Question Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedQuestion && (
                            <Card className="p-6 bg-card">
                                <h2 className="font-semibold text-foreground mb-6">Edit Question</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-foreground">Question Text</label>
                                        <Input
                                            value={selectedQuestion.text}
                                            onChange={(e) =>
                                                updateQuestion(selectedQuestion.id, {
                                                    text: e.target.value,
                                                })
                                            }
                                            className="mt-1"
                                            disabled={isPending}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground">Question Type</label>
                                        <Select
                                            value={selectedQuestion.type}
                                            onValueChange={(value: any) =>
                                                updateQuestion(selectedQuestion.id, {
                                                    type: value,
                                                    options: ['SINGLE_SELECT', 'MULTI_SELECT'].includes(value)
                                                        ? (selectedQuestion.options || ['Option 1', 'Option 2'])
                                                        : undefined,
                                                })
                                            }
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SINGLE_SELECT">Single Choice</SelectItem>
                                                <SelectItem value="MULTI_SELECT">Multiple Choice</SelectItem>
                                                <SelectItem value="TEXT">Short Text</SelectItem>
                                                <SelectItem value="LONG_TEXT">Long Text</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {['SINGLE_SELECT', 'MULTI_SELECT'].includes(selectedQuestion.type) && (
                                        <div>
                                            <label className="text-sm font-medium text-foreground mb-3 block">
                                                Options
                                            </label>
                                            <div className="space-y-2">
                                                {selectedQuestion.options?.map((option, i) => (
                                                    <div key={i} className="flex gap-2">
                                                        <Input
                                                            value={option}
                                                            onChange={(e) => {
                                                                const newOptions = [...(selectedQuestion.options || [])]
                                                                newOptions[i] = e.target.value
                                                                updateQuestion(selectedQuestion.id, {
                                                                    options: newOptions,
                                                                })
                                                            }}
                                                            disabled={isPending}
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                const newOptions = selectedQuestion.options?.filter((_, index) => index !== i)
                                                                updateQuestion(selectedQuestion.id, {
                                                                    options: newOptions,
                                                                })
                                                            }}
                                                            disabled={isPending || selectedQuestion.options?.length === 1}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full bg-transparent"
                                                    onClick={() => {
                                                        updateQuestion(selectedQuestion.id, {
                                                            options: [
                                                                ...(selectedQuestion.options || []),
                                                                'New Option',
                                                            ],
                                                        })
                                                    }}
                                                    disabled={isPending}
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Option
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestion.required}
                                            onChange={(e) =>
                                                updateQuestion(selectedQuestion.id, {
                                                    required: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4"
                                            disabled={isPending}
                                        />
                                        <label className="text-sm font-medium text-foreground">
                                            Make this question required
                                        </label>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Questions List */}
                        <Card className="p-6 bg-card">
                            <h2 className="font-semibold text-foreground mb-4">Questions</h2>
                            <div className="space-y-2">
                                {questions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        onClick={() => setSelectedQuestionId(question.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedQuestionId === question.id
                                            ? 'bg-primary/10 border-primary'
                                            : 'border-border hover:bg-secondary'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">
                                                    {index + 1}. {question.text}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {question.type.replace('_', ' ')}
                                                    {question.required && (
                                                        <>
                                                            {' '}
                                                            • <Badge variant="outline" className="ml-1">
                                                                Required
                                                            </Badge>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteQuestion(question.id)
                                                }}
                                                disabled={isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
