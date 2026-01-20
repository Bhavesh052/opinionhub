'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, Calendar, ClipboardCheck } from 'lucide-react'
import { format } from 'date-fns'

interface HistoryListProps {
    history: any[]
    onSelect: (item: any) => void
}

export function HistoryList({ history, onSelect }: HistoryListProps) {
    if (history.length === 0) {
        return (
            <Card className="p-12 text-center bg-card/50 border-dashed">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ClipboardCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No History Yet</h3>
                <p className="text-muted-foreground mb-6">You haven't completed any surveys yet.</p>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {history.map((item) => (
                <Card
                    key={item.id}
                    className="p-4 hover:shadow-md transition-all cursor-pointer group bg-card"
                    onClick={() => onSelect(item)}
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {item.survey.title}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(item.createdAt), 'PPP')}
                                </span>
                                <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                                    {item.survey.questions.length} Questions
                                </Badge>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}
