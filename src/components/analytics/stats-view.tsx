"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981"];

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
                                        <BarChart
                                            data={data as any[]}
                                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis
                                                dataKey="name"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={{ stroke: "#e2e8f0" }}
                                                tick={{ fill: "#64748b" }}
                                                dy={10}
                                            />
                                            <YAxis
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                allowDecimals={false}
                                                tick={{ fill: "#64748b" }}
                                                domain={[0, 'auto']}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={45}>
                                                {(data as any[]).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
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
