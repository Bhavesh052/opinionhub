'use client'

import { useState } from 'react'
import { HistoryList } from './history-list'
import { HistoryDetail } from './history-detail'

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
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
                    Your History
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                    Review your previous survey responses and feedback.
                </p>
            </div>
            <HistoryList history={history} onSelect={setSelectedResponse} />
        </div>
    )
}
