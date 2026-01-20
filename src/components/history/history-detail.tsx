'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'

interface HistoryDetailProps {
    response: any
    onBack: () => void
}

export function HistoryDetail({ response, onBack }: HistoryDetailProps) {
    const { survey, data: answers } = response

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to History
                </Button>
            </div>

            <div className="space-y-4">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{survey.title}</h1>
                    {survey.description && (
                        <p className="text-muted-foreground">{survey.description}</p>
                    )}
                </div>

                <div className="space-y-6">
                    {survey.questions.map((question: any, index: number) => {
                        const answer = answers[question.id]
                        return (
                            <Card key={question.id} className="p-6 bg-card border-border/50">
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 space-y-4">
                                        <p className="text-lg font-semibold text-foreground">{question.text}</p>

                                        <div className="bg-secondary/30 rounded-lg p-4">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Your Answer</p>

                                            {question.type === 'SINGLE_SELECT' || question.type === 'MULTI_SELECT' ? (
                                                <div className="space-y-2">
                                                    {question.options?.map((option: string, i: number) => {
                                                        const isSelected = Array.isArray(answer)
                                                            ? answer.includes(option)
                                                            : answer === option

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`flex items-center gap-3 p-3 rounded-md border ${isSelected
                                                                        ? 'bg-primary/10 border-primary/20 text-primary font-medium'
                                                                        : 'bg-background border-border/50 text-muted-foreground'
                                                                    }`}
                                                            >
                                                                {isSelected ? (
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                ) : (
                                                                    <Circle className="w-4 h-4" />
                                                                )}
                                                                <span className="text-sm">{option}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                                                    {answer || <span className="italic text-muted-foreground">No answer provided</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
