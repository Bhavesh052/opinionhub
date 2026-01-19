"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsViewProps {
    questions: any[];
    answers: any[];
}

export const AnalyticsView = ({ questions, answers }: AnalyticsViewProps) => {
    const getAggregatedData = (questionId: string, type: string) => {
        const values = answers.map(a => a[questionId]).filter(v => v !== undefined && v !== null && v !== "");

        if (type === "TEXT" || type === "LONG_TEXT") {
            return {
                type: "text",
                data: values
            };
        }

        const counts: Record<string, number> = {};
        values.forEach(val => {
            if (Array.isArray(val)) {
                val.forEach(v => {
                    counts[v] = (counts[v] || 0) + 1;
                });
            } else {
                const s = String(val);
                counts[s] = (counts[s] || 0) + 1;
            }
        });

        const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
        return { type: "chart", data: chartData };
    };

    return (
        <div className="space-y-8">
            {questions.map((q) => {
                const { type, data } = getAggregatedData(q.id, q.type);
                const totalResponses = answers.filter(a => a[q.id] !== undefined).length;

                return (
                    <Card key={q.id}>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">
                                {q.text}
                                <span className="ml-2 text-sm font-normal text-muted-foreground">({totalResponses} responses)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {type === "chart" && (data as any[]).length > 0 ? (
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data as any[]}>
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : type === "chart" ? (
                                <p className="text-muted-foreground text-sm">No data yet.</p>
                            ) : (
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {(data as string[]).length > 0 ? (data as string[]).map((txt, i) => (
                                        <div key={i} className="p-3 bg-slate-50 rounded border text-sm">
                                            {txt}
                                        </div>
                                    )) : (
                                        <p className="text-muted-foreground text-sm">No text responses yet.</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
