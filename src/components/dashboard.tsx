'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, MoreVertical, Users, BarChart3, TrendingUp, Clock, Plus, Edit, FileText, Trash } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { deleteSurvey } from '@/actions/survey'

interface Survey {
    id: string
    title: string
    status: string
    createdAt: Date
    _count: {
        responses: number
    }
}

interface DashboardStats {
    totalSurveys: number
    totalResponses: number
    activeSurveys: number
}

interface DashboardProps {
    surveys: Survey[]
    stats: DashboardStats
    isSurveyor: boolean
}

export default function Dashboard({ surveys, stats, isSurveyor }: DashboardProps) {
    const activeSurveysList = surveys.filter(s => s.status === 'ACTIVE');
    const completedSurveysList = surveys.filter(s => s.status === 'COMPLETED'); // Assuming 'COMPLETED' is a status
    const draftSurveysList = surveys.filter(s => s.status === 'DRAFT');

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        </div>
                        {isSurveyor && (
                            <Button asChild>
                                <Link href="/dashboard/create">
                                    <Plus className="mr-2 h-4 w-4" /> Create New Survey
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Overview */}
                <div className="grid gap-6 mb-8 md:grid-cols-3">
                    {[
                        { label: 'Total Surveys', value: stats.totalSurveys.toString(), icon: BarChart3 },
                        { label: 'Total Responses', value: stats.totalResponses.toString(), icon: Users },
                        { label: 'Active Surveys', value: stats.activeSurveys.toString(), icon: Clock },
                    ].map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <Card key={i} className="p-6 bg-card">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                            </Card>
                        )
                    })}
                </div>

                {/* Surveys Table */}
                <Card className="bg-card">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="border-b border-border p-6">
                            <TabsList className="bg-muted">
                                <TabsTrigger value="all">All Surveys</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="draft">Drafts</TabsTrigger>
                                {/* Add more tabs if needed */}
                            </TabsList>
                        </div>

                        <TabsContent value="all" className="p-0">
                            <SurveyTable surveys={surveys} />
                        </TabsContent>

                        <TabsContent value="active" className="p-0">
                            <SurveyTable surveys={activeSurveysList} />
                        </TabsContent>

                        <TabsContent value="draft" className="p-0">
                            <SurveyTable surveys={draftSurveysList} />
                        </TabsContent>
                    </Tabs>
                </Card>
            </main>
        </div>
    )
}

function SurveyTable({ surveys }: { surveys: Survey[] }) {
    if (surveys.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">No surveys found.</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-border bg-muted/30">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Survey Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Responses
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Created
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {surveys.map((survey) => (
                        <tr
                            key={survey.id}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                            <td className="px-6 py-4">
                                <p className="font-medium text-foreground">{survey.title}</p>
                            </td>
                            <td className="px-6 py-4">
                                <Badge
                                    className={`${survey.status === 'ACTIVE'
                                        ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none'
                                        : survey.status === 'COMPLETED'
                                            ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 shadow-none'
                                            : 'bg-muted text-muted-foreground shadow-none'
                                        }`}
                                >
                                    {survey.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                {survey._count?.responses || 0}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true })}
                            </td>
                            <td className="px-6 py-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/surveys/${survey.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/surveys/${survey.id}/stats`}>
                                                <BarChart3 className="mr-2 h-4 w-4" /> Results
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={`/surveys/${survey.id}`} target="_blank">
                                                <FileText className="mr-2 h-4 w-4" /> View Live
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive" onClick={() => deleteSurvey(survey.id)}>
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
