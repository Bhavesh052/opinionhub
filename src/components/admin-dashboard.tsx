"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { getParticipantDemographics } from "@/actions/admin";
import { Loader2, Users, UserCheck, TrendingUp, DollarSign } from "lucide-react";

interface Participant {
    id: string;
    name: string | null;
    email: string;
    demographics: any;
    createdAt: Date;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#a4de6c", "#d0ed57", "#ffc658"];

export const AdminDashboard = () => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getParticipantDemographics();
            if (result.error) {
                setError(result.error);
            } else if (result.data) {
                setParticipants(result.data as Participant[]);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const stats = useMemo(() => {
        const genderData: Record<string, number> = {};
        const ageRanges: Record<string, number> = {
            "1-10": 0,
            "11-17": 0,
            "18-24": 0,
            "25-34": 0,
            "35-44": 0,
            "45-54": 0,
            "55+": 0,
        };
        const incomeRanges: Record<string, number> = {
            "< 30k": 0,
            "30k-60k": 0,
            "60k-100k": 0,
            "100k+": 0,
        };

        let totalIncome = 0;
        let incomeCount = 0;

        participants.forEach((p) => {
            const demo = (p.demographics as any) || {};

            // Gender
            const gender = demo.gender || "Unknown";
            genderData[gender] = (genderData[gender] || 0) + 1;

            // Age
            if (demo.dob) {
                const birthDate = new Date(demo.dob);
                const age = new Date().getFullYear() - birthDate.getFullYear();
                if (age <= 10) ageRanges["1-10"]++;
                else if (age <= 17) ageRanges["11-17"]++;
                else if (age < 25) ageRanges["18-24"]++;
                else if (age < 35) ageRanges["25-34"]++;
                else if (age < 45) ageRanges["35-44"]++;
                else if (age < 55) ageRanges["45-54"]++;
                else ageRanges["55+"]++;
            }

            // Income
            if (demo.annualIncome !== undefined) {
                const income = Number(demo.annualIncome);
                totalIncome += income;
                incomeCount++;
                if (income < 30000) incomeRanges["< 30k"]++;
                else if (income < 60000) incomeRanges["30k-60k"]++;
                else if (income < 100000) incomeRanges["60k-100k"]++;
                else incomeRanges["100k+"]++;
            }
        });

        const pieData = Object.entries(genderData).map(([name, value]) => ({ name, value }));
        const barData = Object.entries(ageRanges).map(([name, value]) => ({ name, value }));
        const incomeData = Object.entries(incomeRanges).map(([name, value]) => ({ name, value }));

        return {
            pieData,
            barData,
            incomeData,
            avgIncome: incomeCount > 0 ? Math.round(totalIncome / incomeCount) : 0,
            totalParticipants: participants.length
        };
    }, [participants]);

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[400px] items-center justify-center text-destructive">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalParticipants}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Annual Income</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.avgIncome.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Partition */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Gender Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Age Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {stats.barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Income Ranges</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.incomeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {stats.incomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Participants Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Participants Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>DOB</TableHead>
                                <TableHead className="text-right">Income</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participants.map((p) => {
                                const demo = (p.demographics as any) || {};
                                return (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name || "N/A"}</TableCell>
                                        <TableCell>{p.email}</TableCell>
                                        <TableCell>{demo.gender || "N/A"}</TableCell>
                                        <TableCell>{demo.dob || "N/A"}</TableCell>
                                        <TableCell className="text-right">
                                            {demo.annualIncome ? `$${Number(demo.annualIncome).toLocaleString()}` : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {participants.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No participants found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
