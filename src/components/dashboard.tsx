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
import { MoreVertical, Users, BarChart3, Clock, Plus, Edit, FileText, Trash, ClipboardList, ArrowRight } from 'lucide-react'
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
                {isSurveyor && (<div className="grid gap-6 mb-8 md:grid-cols-3">
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
                </div>)}

                {/* Surveys Content */}
                {isSurveyor ? (
                    <Card className="bg-card">
                        <Tabs defaultValue="all" className="w-full">
                            <div className="border-b border-border p-6 w-fit">
                                <TabsList className="bg-muted">
                                    <TabsTrigger value="all">All Surveys</TabsTrigger>
                                    <TabsTrigger value="active">Active</TabsTrigger>
                                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="all" className="p-6">
                                <SurveyGrid surveys={surveys} isSurveyor={true} />
                            </TabsContent>

                            <TabsContent value="active" className="p-6">
                                <SurveyGrid surveys={activeSurveysList} isSurveyor={true} />
                            </TabsContent>

                            <TabsContent value="draft" className="p-6">
                                <SurveyGrid surveys={draftSurveysList} isSurveyor={true} />
                            </TabsContent>
                        </Tabs>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">Available Surveys</h2>
                            <Badge variant="secondary" className="px-3 py-1">
                                {activeSurveysList.length} Active
                            </Badge>
                        </div>
                        {activeSurveysList.length === 0 ? (
                            <Card className="p-12 text-center bg-card/50 border-dashed">
                                <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-muted-foreground">No surveys available at the moment.</p>
                            </Card>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {activeSurveysList.map((survey) => (
                                    <SurveyCard key={survey.id} survey={survey} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

function SurveyCard({ survey, isSurveyor }: { survey: Survey, isSurveyor?: boolean }) {
    const mainActionHref = isSurveyor
        ? `/surveys/${survey.id}/stats`
        : `/surveys/${survey.id}/take`;

    return (
        <Card className="group flex flex-col h-full bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-border/50 overflow-hidden relative">
            {isSurveyor && (
                <div className="absolute top-4 right-4 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {survey.status==="DRAFT"&&(<DropdownMenuItem asChild>
                                <Link href={`/surveys/${survey.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                            </DropdownMenuItem>)}
                            <DropdownMenuItem asChild>
                                <Link href={`/surveys/${survey.id}/stats`}>
                                    <BarChart3 className="mr-2 h-4 w-4" /> Results
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    deleteSurvey(survey.id);
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <Link href={mainActionHref} className="flex-1 flex flex-col">
                <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                {formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true })}
                            </Badge>
                            {isSurveyor && (
                                <Badge
                                    className={`${survey.status === 'ACTIVE'
                                        ? 'bg-green-500/10 text-green-600 border-green-500/20 shadow-none'
                                        : survey.status === 'COMPLETED'
                                            ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-none'
                                            : 'bg-muted text-muted-foreground border-border shadow-none'
                                        }`}
                                >
                                    {survey.status}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {survey.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {isSurveyor
                            ? "Manage this survey, view responses, and analyze feedback from your participants."
                            : "Participate in this survey and share your valuable feedback with us."}
                    </p>
                    <div className="flex items-center gap-4 py-4 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span>{survey._count.responses} responses</span>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="p-4 bg-muted/30 border-t border-border/50">
                <Button asChild className="w-full group/btn" variant={isSurveyor ? "outline" : "default"}>
                    <Link href={mainActionHref}>
                        {isSurveyor ? "View Results" : "Take Survey"}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </Button>
            </div>
        </Card>
    )
}

function SurveyGrid({ surveys, isSurveyor }: { surveys: Survey[], isSurveyor?: boolean }) {
    if (surveys.length === 0) {
        return (
            <Card className="p-12 text-center bg-card/50 border-dashed">
                <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No surveys found.</p>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
                <SurveyCard key={survey.id} survey={survey} isSurveyor={isSurveyor} />
            ))}
        </div>
    )
}

