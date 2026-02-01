'use client'

import { useState } from 'react'
import { HistoryList } from './history-list'
import { HistoryDetail } from './history-detail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface HistoryShellProps {
    history: any[]
}

export function HistoryShell({ history }: HistoryShellProps) {
    const [selectedResponse, setSelectedResponse] = useState<any | null>(null)

    if (selectedResponse) {
        return (
            <HistoryDetail
                response={selectedResponse}
                onBack={() => setSelectedResponse(null)}
            />
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-4 mb-8">
                <Button variant="ghost" size="icon" asChild className="rounded-full mt-1">
                    <Link href="/dashboard">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                        Your History
                    </h1>
                    <p className="text-xl text-muted-foreground mt-2">
                        Review your previous survey responses and feedback.
                    </p>
                </div>
            </div>
            <HistoryList history={history} onSelect={setSelectedResponse} />
        </div >
    )
}
